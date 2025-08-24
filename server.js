import express from 'express';
import cors from 'cors';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database connection
const sql = neon(process.env.DATABASE_URL);

// Create the waitlist table if it doesn't exist
async function initializeDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS waitlist (
        id SERIAL PRIMARY KEY,
        phone_number VARCHAR(20) NOT NULL,
        name VARCHAR(100),
        message TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Initialize database on server start
initializeDatabase();

// API endpoint to submit phone number
app.post('/api/waitlist', async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error submitting to waitlist:', error);
    res.status(500).json({ error: 'Failed to submit to waitlist' });
  }
});

// API endpoint to get all waitlist entries (for admin purposes)
app.get('/api/waitlist', async (req, res) => {
  try {
    const result = await sql`
      SELECT * FROM waitlist 
      ORDER BY timestamp DESC
    `;
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error fetching waitlist:', error);
    res.status(500).json({ error: 'Failed to fetch waitlist' });
  }
});

// API endpoint to clear all waitlist entries
app.delete('/api/waitlist', async (req, res) => {
  try {
    await sql`DELETE FROM waitlist`;
    
    res.json({
      success: true,
      message: 'All waitlist entries cleared'
    });
  } catch (error) {
    console.error('Error clearing waitlist:', error);
    res.status(500).json({ error: 'Failed to clear waitlist' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database URL: ${process.env.DATABASE_URL ? 'Configured' : 'Not configured'}`);
});
