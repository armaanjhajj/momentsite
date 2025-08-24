import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  // Set CORS headers for production
  res.setHeader('Access-Control-Allow-Origin', 'https://makemoments.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'POST') {
      const { phoneNumber, name, message } = req.body;
      
      if (!phoneNumber) {
        return res.status(400).json({ error: 'Phone number is required' });
      }

      // Insert into database
      const result = await sql`
        INSERT INTO waitlist (phone_number, name, message)
        VALUES (${phoneNumber}, ${name || null}, ${message || null})
        RETURNING id, phone_number, name, message, timestamp
      `;

      res.status(201).json({
        success: true,
        data: result[0]
      });
    } else if (req.method === 'GET') {
      // Get all waitlist entries
      const result = await sql`
        SELECT * FROM waitlist 
        ORDER BY timestamp DESC
      `;
      
      res.json({
        success: true,
        data: result
      });
    } else if (req.method === 'DELETE') {
      // Clear all waitlist entries
      await sql`DELETE FROM waitlist`;
      
      res.json({
        success: true,
        message: 'All waitlist entries cleared'
      });
    } else {
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in waitlist API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
