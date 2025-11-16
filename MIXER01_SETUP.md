# Mixer01 RSVP Setup Guide

## Overview
The mixer01 page now uses Supabase to store RSVP data persistently. This guide will help you set up the database and environment variables.

## Step 1: Create .env.local file

Create a `.env.local` file in the root of your project with the following content:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://vxanflojecjgnyptezhn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ4YW5mbG9qZWNqZ255cHRlemhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNzE3MDIsImV4cCI6MjA3ODg0NzcwMn0.TIi56KDTn2Ij3ZnFmM7qyDfzXtpx4nkuXyn-yrpFAcQ
```

## Step 2: Run the Database Migration

You have two options to run the migration:

### Option A: Via Supabase Dashboard (Recommended)

1. Go to your Supabase project: https://vxanflojecjgnyptezhn.supabase.co
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `supabase/migrations/20250120_mixer01_rsvps.sql`
5. Click **Run** to execute the migration

### Option B: Via Supabase CLI

If you have Supabase CLI linked to your project:

```bash
supabase db push
```

Or manually:

```bash
supabase migration up
```

## Step 3: Verify the Migration

After running the migration, verify the table was created:

1. Go to **Table Editor** in Supabase Dashboard
2. You should see a new table called `mixer01_rsvps`
3. The table should have columns:
   - `id` (uuid)
   - `chapter_invite_code` (text, unique)
   - `status` (text)
   - `guest_count` (integer, nullable)
   - `updated_by` (text, nullable)
   - `updated_at` (timestamptz)
   - `created_at` (timestamptz)

## Step 4: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/mixer01`
3. Enter an invite code (e.g., `ZPSI2024`)
4. Submit an RSVP
5. Refresh the page - the RSVP should persist!

## How It Works

- **GET `/api/mixer01/rsvp`**: Fetches all RSVPs from the database
- **POST `/api/mixer01/rsvp`**: Creates or updates an RSVP for a chapter
- Data is stored in Supabase and persists across page reloads
- The RSVP board updates in real-time for all users viewing the page

## Troubleshooting

### "Failed to fetch RSVPs"
- Check that `.env.local` exists and has the correct Supabase credentials
- Verify the migration was run successfully
- Check browser console for detailed error messages

### "Failed to save RSVP"
- Ensure the migration created the table correctly
- Check that RLS policies allow inserts/updates
- Verify the API route is accessible at `/api/mixer01/rsvp`

### Migration errors
- Make sure you're connected to the correct Supabase project
- Check that you have the necessary permissions
- Review the SQL migration file for syntax errors

