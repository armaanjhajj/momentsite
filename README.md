# Moments - Waitlist App

A React-based waitlist application with Neon database integration for storing phone number submissions.

## Features

- Phone number collection with consent management
- Neon PostgreSQL database integration
- Admin dashboard for viewing submissions
- Responsive design with modern UI
- Fallback to localStorage if database is unavailable

## Setup

### 1. Environment Variables

Create a `.env` file in the root directory with your Neon database credentials:

```env
# Neon Database Configuration
DATABASE_URL=postgresql://neondb_owner:npg_XsqV1vHEx3mD@ep-still-fire-adehg5d7-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require

# Server Configuration
PORT=3001
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Application

#### Option 1: Run both frontend and backend simultaneously
```bash
npm run dev:full
```

#### Option 2: Run separately
```bash
# Terminal 1 - Backend server
npm run server

# Terminal 2 - Frontend
npm run dev
```

## Database Schema

The application automatically creates a `waitlist` table with the following structure:

```sql
CREATE TABLE waitlist (
  id SERIAL PRIMARY KEY,
  phone_number VARCHAR(20) NOT NULL,
  name VARCHAR(100),
  message TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

- `POST /api/waitlist` - Submit a new waitlist entry
- `GET /api/waitlist` - Get all waitlist entries (admin)
- `DELETE /api/waitlist` - Clear all waitlist entries (admin)
- `GET /api/health` - Health check

## Development

- Frontend runs on `http://localhost:5173` (Vite default)
- Backend runs on `http://localhost:3001`
- Database: Neon PostgreSQL (cloud-hosted)

## Deployment

### Vercel Production Deployment

The app is configured to work with Vercel's serverless functions:

1. **Environment Variables** in Vercel Dashboard:
   - `DATABASE_URL`: Your Neon database connection string

2. **API Structure**:
   - `/api/waitlist` - Handles GET, POST, DELETE for waitlist data
   - `/api/health` - Health check endpoint

3. **CORS Configuration**:
   - Production domain: `https://makemoments.app`
   - Development: `http://localhost:3000`

4. **Build Process**:
   - Frontend: Vite build to `dist/` folder
   - Backend: Vercel serverless functions in `api/` folder

### Local Development

For local development, you can still run the Express server:
```bash
npm run server    # Backend on port 3001
npm run dev       # Frontend on port 3000
npm run dev:full  # Both simultaneously
```

## Admin Access

- URL: `/admin`
- Password: `Moments2025!!`
- Features: View submissions, export to CSV, clear data
