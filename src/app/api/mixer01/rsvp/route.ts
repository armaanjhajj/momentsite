import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

// GET all RSVPs
export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('mixer01_rsvps')
      .select('*')
      .order('chapter_invite_code');

    // If table doesn't exist yet (migration not run), return empty object
    if (error) {
      // Check if it's a "relation does not exist" error
      if (error.message?.includes('does not exist') || error.code === '42P01') {
        console.warn('mixer01_rsvps table does not exist yet. Run the migration first.');
        return NextResponse.json({});
      }
      console.error('Error fetching RSVPs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch RSVPs' },
        { status: 500 }
      );
    }

    // Convert to the format expected by the frontend
    interface RSVPResponse {
      status: string;
      guestCount: number | null;
      updatedBy: string | null;
      updatedAt: string;
    }
    const rsvps: Record<string, RSVPResponse> = {};
    data?.forEach((rsvp) => {
      rsvps[rsvp.chapter_invite_code] = {
        status: rsvp.status,
        guestCount: rsvp.guest_count,
        updatedBy: rsvp.updated_by,
        updatedAt: rsvp.updated_at,
      };
    });

    return NextResponse.json(rsvps);
  } catch (error) {
    console.error('Error in GET /api/mixer01/rsvp:', error);
    // Return empty object instead of error if table doesn't exist
    return NextResponse.json({});
  }
}

// POST/PUT RSVP (upsert)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { inviteCode, status, guestCount, updatedBy } = body;

    // Validate required fields
    if (!inviteCode || !status) {
      return NextResponse.json(
        { error: 'Missing required fields: inviteCode and status' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['pending', 'attending', 'maybe', 'declined'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate guestCount if attending
    if (status === 'attending' && guestCount && ![1, 2].includes(guestCount)) {
      return NextResponse.json(
        { error: 'guestCount must be 1 or 2 when attending' },
        { status: 400 }
      );
    }

    // Upsert RSVP
    const { data, error } = await supabaseServer
      .from('mixer01_rsvps')
      .upsert(
        {
          chapter_invite_code: inviteCode,
          status: status,
          guest_count: status === 'attending' ? guestCount : null,
          updated_by: updatedBy || 'Chapter President',
        },
        {
          onConflict: 'chapter_invite_code',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Error upserting RSVP:', error);
      return NextResponse.json(
        { error: 'Failed to save RSVP' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      rsvp: {
        status: data.status,
        guestCount: data.guest_count,
        updatedBy: data.updated_by,
        updatedAt: data.updated_at,
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

