import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS waitlist (
      id SERIAL PRIMARY KEY,
      phone_number VARCHAR(20) NOT NULL,
      name VARCHAR(100),
      message TEXT,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export default async function handler(req, res) {
  try {
    await ensureTable();

    if (req.method === 'POST') {
      const { phoneNumber, name, message } = req.body || {};
      if (!phoneNumber) return res.status(400).json({ error: 'Phone number is required' });

      const rows = await sql`
        INSERT INTO waitlist (phone_number, name, message)
        VALUES (${phoneNumber}, ${name ?? null}, ${message ?? null})
        RETURNING id, phone_number, name, message, timestamp
      `;
      return res.status(201).json({ success: true, data: rows[0] });
    }

    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM waitlist ORDER BY timestamp DESC`;
      return res.status(200).json({ success: true, data: rows });
    }

    if (req.method === 'DELETE') {
      await sql`DELETE FROM waitlist`;
      return res.status(200).json({ success: true, message: 'All waitlist entries cleared' });
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    return res.status(405).end('Method Not Allowed');
  } catch (err) {
    console.error('waitlist api error', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
