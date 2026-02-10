import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

// GET all RSVPs (returns array of individual RSVPs)
export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('mixer01_rsvps')
      .select('*')
      .order('created_at');

    // If table doesn't exist yet (migration not run), return empty array
    if (error) {
      // Check if it's a "relation does not exist" error
      if (error.message?.includes('does not exist') || error.code === '42P01') {
        console.warn('mixer01_rsvps table does not exist yet. Run the migration first.');
        return NextResponse.json([]);
      }
      console.error('Error fetching RSVPs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch RSVPs' },
        { status: 500 }
      );
    }

    // Convert to frontend format
    const rsvps = data?.map((rsvp) => ({
      id: rsvp.id,
      chapterInviteCode: rsvp.chapter_invite_code,
      name: rsvp.name,
      email: rsvp.email,
      favoriteColor: rsvp.favorite_color,
      status: rsvp.status,
      createdAt: rsvp.created_at,
    })) || [];

    return NextResponse.json(rsvps);
  } catch (error) {
    console.error('Error in GET /api/mixer01/rsvp:', error);
    // Return empty array instead of error if table doesn't exist
    return NextResponse.json([]);
  }
}

// POST/PUT RSVP (simplified - email only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, inviteCode, name, favoriteColor, status } = body;

    // Validate required field
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Insert RSVP with email only, other fields optional/null
    const { data, error } = await supabaseServer
      .from('mixer01_rsvps')
      .insert({
        chapter_invite_code: inviteCode || 'EVENT',
        name: name || '',
        email: email,
        favorite_color: favoriteColor || null,
        status: status || 'attending',
      })
      .select()
      .single();

    if (error) {
      // Check for duplicate email
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This email has already been registered' },
          { status: 400 }
        );
      }
      console.error('Error inserting RSVP:', error);
      return NextResponse.json(
        { error: 'Failed to save RSVP' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      rsvp: {
        id: data.id,
        email: data.email,
        createdAt: data.created_at,
      },
    });
  } catch (error) {
    console.error('Error in POST /api/mixer01/rsvp:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

