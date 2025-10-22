# Simple Organization Portal

## Overview

The portal is now **dead simple** - exactly what you asked for:

1. Sign in with an org profile (`is_org = true`)
2. See membership requests for your org
3. Approve/deny requests (adds user ID to your `organizations` JSONB array)
4. Edit your org profile

That's it. No roles, no org_members table, no complexity.

## How It Works

### Access Control
```typescript
// Check if logged-in user is an org
const { data: profile } = await supabase
  .from("profiles")
  .select("is_org")
  .eq("user_id", userId)
  .single();

if (profile?.is_org === true) {
  // Show portal
}
```

### Approve Request
Uses existing RPC from `20251020_org_claims.sql`:
```sql
-- Adds org ID to requester's profiles.organizations JSONB array
SELECT approve_org_request('request-uuid');
```

### Database Schema Used

**Profiles table:**
- `is_org` boolean - marks organization profiles
- `organizations` jsonb - array of org UUIDs user belongs to

**Organization_requests table:**
- `user_id` - person requesting membership
- `organization_id` - org they want to join
- `status` - pending/approved/rejected

**Events table:**
- `user_id` - org that created event
- Anyone can create events and link to any org

## Portal Pages

### 1. Dashboard (`/portal/organizations`)
- Shows membership requests (pending/approved/rejected)
- Approve/deny buttons
- Shows org metrics (events, RSVPs, attendees, feedback)
- Lists upcoming events
- Shows recent feedback

### 2. Profile (`/portal/organizations/profile`)
- Edit org name (stored in first_name + last_name)
- Edit bio
- Upload avatar
- That's it!

## Removed Complexity

❌ No `organizations` table  
❌ No `org_members` table  
❌ No roles (owner/admin/member)  
❌ No admin delegation  
❌ No members management page  
❌ No event creation in portal  

## What We Kept

✅ `is_org` boolean in profiles  
✅ `organizations` JSONB array for memberships  
✅ Existing RPC functions from `20251020_org_claims.sql`  
✅ Organization requests system  
✅ Profile editing  
✅ Metrics dashboard  

## Event Creation

Anyone in the app can create an event and set `user_id` to any org. The portal doesn't handle event creation - that's done in the main app.

## Migration

**No migration needed!** 

The complex `20251020_refactor_to_org_members.sql` has been disabled. We're using the existing schema with `is_org` and `organizations` JSONB.

## Testing

1. Sign in with a profile where `is_org = true`
2. You'll see the portal
3. Users can request to join your org (via the app)
4. You see requests and can approve/deny them
5. Edit your profile info

That's literally it. Simple. 🎉

## Files

**Frontend:**
- `src/app/portal/organizations/layout.tsx` - Access control (checks `is_org`)
- `src/app/portal/organizations/page.tsx` - Dashboard & requests
- `src/app/portal/organizations/profile/page.tsx` - Profile editing

**Backend:**
- `supabase/migrations/20251020_org_claims.sql` - RPC functions (already exists)
- No new tables needed!

Everything works with your existing database schema.



