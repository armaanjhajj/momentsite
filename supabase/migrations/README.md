# Database Migrations

## Migration Order

Run migrations in this order:

1. `20251020_org_claims.sql` - Initial organization request system (DEPRECATED - superseded by refactor)
2. `20251020_refactor_to_org_members.sql` - **NEW: Proper relational tables for organizations**

## 20251020_refactor_to_org_members.sql

This migration refactors the organization system from using JSONB fields in the profiles table to proper relational tables.

### What Changed

#### Before (JSONB approach):
- Organizations were stored as profiles with `is_org = true`
- Members had an `organizations` JSONB array field containing org UUIDs
- Membership management required mutating JSONB arrays

#### After (Relational approach):
- **`organizations` table**: Separate table for organization entities with their own fields
- **`org_members` table**: Join table tracking membership with roles (owner/admin/member)
- Clean relational queries with proper foreign keys

### Tables Created

#### `organizations`
```sql
id uuid PRIMARY KEY
name text NOT NULL
bio text
avatar_url text
is_verified boolean DEFAULT false
created_at timestamptz
updated_at timestamptz
```

#### `org_members`
```sql
org_id uuid REFERENCES organizations(id)
member_id uuid REFERENCES profiles(user_id)
role text (member | admin | owner)
created_at timestamptz
PRIMARY KEY (org_id, member_id)
```

### Updated Functions

All RPC functions have been updated to use the new tables:

- `approve_org_request(req_id)` - Now inserts into `org_members` table
- `reject_org_request(req_id)` - Updated authorization to check `org_members`
- `revoke_org_membership(req_id)` - Deletes from `org_members` table

### New Helper Functions

- `is_org_admin(org_id, user_id?)` - Check if user is admin/owner of org
- `get_user_orgs(user_id?)` - Get all organizations user belongs to

### Data Migration

The migration automatically:
1. Creates organizations from profiles where `is_org = true`
2. Migrates JSONB `organizations` arrays to `org_members` rows
3. Preserves all existing relationships

### Frontend Updates

All portal pages updated to query new tables:
- `/portal/organizations` - Dashboard uses `organizations` table
- `/portal/organizations/members` - Lists from `org_members` table
- `/portal/organizations/events` - Queries org via `org_members`
- `/portal/organizations/profile` - Updates `organizations` table

### Deprecated Fields

The following fields are marked as deprecated but NOT dropped (for safety):
- `profiles.is_org` - Use `organizations` table instead
- `profiles.organizations` - Use `org_members` table instead

To drop these fields after verifying everything works:
```sql
ALTER TABLE public.profiles DROP COLUMN IF EXISTS is_org;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS organizations;
```

### Running the Migration

```bash
# If using Supabase CLI:
supabase db push

# Or run directly via SQL editor in Supabase dashboard
```

### Rollback (if needed)

If you need to rollback, you would need to:
1. Restore the old RPC functions
2. Drop the new tables
3. Restore the old column definitions

However, the migration is designed to be safe - old columns are NOT dropped automatically.



