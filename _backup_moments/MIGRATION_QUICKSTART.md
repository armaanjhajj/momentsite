# Quick Start: Running the Migration

## Step 1: Backup Your Data (Recommended)

Before running any migration, backup your database:

```bash
# Using Supabase CLI
supabase db dump -f backup_before_org_refactor.sql

# Or via Supabase Dashboard:
# Settings > Database > Backups > Create backup
```

## Step 2: Run the Migration

### Option A: Using Supabase CLI (Recommended)

```bash
# Navigate to your project
cd /Users/armaanjhajj/momentsite-2

# Push migrations to Supabase
supabase db push

# Or apply specific migration
supabase db push supabase/migrations/20251020_refactor_to_org_members.sql
```

### Option B: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open `supabase/migrations/20251020_refactor_to_org_members.sql`
4. Copy the entire contents
5. Paste into SQL Editor
6. Click **Run**

## Step 3: Verify Migration

### Check Tables Created

```sql
-- Verify organizations table exists
SELECT * FROM organizations LIMIT 5;

-- Verify org_members table exists
SELECT * FROM org_members LIMIT 5;

-- Count migrated data
SELECT 
  (SELECT COUNT(*) FROM organizations) as total_orgs,
  (SELECT COUNT(*) FROM org_members) as total_memberships;
```

### Check Data Migration

```sql
-- Verify orgs were created from profiles
SELECT o.id, o.name, o.is_verified
FROM organizations o
ORDER BY o.created_at DESC
LIMIT 10;

-- Verify memberships were migrated
SELECT 
  om.org_id,
  om.member_id,
  om.role,
  o.name as org_name
FROM org_members om
JOIN organizations o ON o.id = om.org_id
LIMIT 10;
```

### Check Functions Work

```sql
-- Test the helper function
SELECT * FROM get_user_orgs('user-uuid-here');

-- Test authorization check
SELECT is_org_admin('org-uuid-here', 'user-uuid-here');
```

## Step 4: Test the Frontend

### 4.1 Start Your Dev Server

```bash
npm run dev
```

### 4.2 Test Each Portal Page

Visit and test:

- ✅ `http://localhost:3000/portal/organizations` - Dashboard loads
- ✅ `http://localhost:3000/portal/organizations/members` - Members list shows
- ✅ `http://localhost:3000/portal/organizations/events` - Events list works
- ✅ `http://localhost:3000/portal/organizations/profile` - Profile updates
- ✅ `http://localhost:3000/portal/organizations/events/new` - Create event works

### 4.3 Test Key Workflows

1. **Membership Requests**
   - Have a user request to join an org
   - Admin should see request in dashboard
   - Approve the request
   - Verify member appears in members list

2. **Event Creation**
   - Create a new event as org admin
   - Verify it appears in events list
   - Check it's linked to correct org

3. **Member Management**
   - View members list
   - Check roles display correctly
   - Test revoking a member
   - Verify member is removed

4. **Profile Updates**
   - Update org avatar
   - Verify change persists
   - Check avatar displays on dashboard

## Step 5: Monitor for Issues

### Check Browser Console

Look for any errors related to:
- Supabase queries failing
- Missing tables or columns
- RLS policy violations

### Check Supabase Logs

In Supabase Dashboard:
1. Go to **Logs** > **Database**
2. Look for errors related to:
   - Missing tables
   - RLS policy failures
   - Failed queries

## Step 6: Clean Up (After Verification)

**Only after** you've verified everything works for at least 24-48 hours:

```sql
-- Drop deprecated columns
ALTER TABLE public.profiles DROP COLUMN IF EXISTS is_org;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS organizations;

-- Verify nothing broke
-- Test all portal pages again after this!
```

## Common Issues & Solutions

### Issue: "organizations table does not exist"

**Solution:** Migration didn't run successfully. Check:
```sql
-- See what migrations have run
SELECT * FROM supabase_migrations.schema_migrations;
```

Run the migration again via SQL editor.

### Issue: "permission denied for table org_members"

**Solution:** RLS policies need to be enabled. Run:
```sql
ALTER TABLE public.org_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
```

### Issue: "No organization found" error in portal

**Solution:** User doesn't have admin/owner role. Check:
```sql
SELECT * FROM org_members 
WHERE member_id = 'user-uuid-here';
```

If they should be an owner, insert:
```sql
INSERT INTO org_members (org_id, member_id, role)
VALUES ('org-uuid', 'user-uuid', 'owner');
```

### Issue: Old approvals still reference JSONB

**Solution:** Re-run the data migration section:
```sql
-- See the DO $$ blocks in the migration file
-- They can be run multiple times safely
```

## Rollback Procedure (If Needed)

If you need to rollback:

```sql
-- 1. Revert RPC functions to old versions (copy from 20251020_org_claims.sql)
-- 2. Drop new tables
DROP TABLE IF EXISTS public.org_members;
DROP TABLE IF EXISTS public.organizations;

-- 3. Old columns still exist, so data is intact
-- 4. Revert frontend changes by checking out from git
git checkout HEAD~1 -- src/app/portal/
```

## Success Checklist

Before considering migration complete:

- [ ] All tables created successfully
- [ ] Data migrated (organizations & members)
- [ ] RPC functions work (test approve/reject/revoke)
- [ ] Portal dashboard loads and shows correct data
- [ ] Members list displays all members with roles
- [ ] Event creation works for org admins
- [ ] Profile updates persist correctly
- [ ] No console errors in browser
- [ ] No database errors in Supabase logs
- [ ] Tested with multiple organizations
- [ ] Tested with different user roles

## Need Help?

If you encounter issues:

1. Check the detailed comparison: `MIGRATION_COMPARISON.md`
2. Review the migration SQL: `supabase/migrations/20251020_refactor_to_org_members.sql`
3. See full documentation: `supabase/migrations/README.md`

## Next Steps After Migration

1. **Update Mobile App** (if applicable)
   - Update queries to use new tables
   - Test membership flows
   - Update event creation

2. **Add New Features**
   - Role-based permissions (only owners can delete org)
   - Member invitations via email
   - Org transfer (change ownership)
   - Bulk member management

3. **Performance Optimization**
   - Add more indexes if needed
   - Optimize N+1 queries with proper JOINs
   - Consider materialized views for analytics

Enjoy your new relational organization system! 🎉



