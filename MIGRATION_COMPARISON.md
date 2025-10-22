# Before vs After: Organization System Comparison

## Database Schema Changes

### BEFORE (JSONB Approach)

```sql
-- Organizations were just profiles with a flag
profiles:
  user_id uuid
  is_org boolean  -- TRUE for orgs, FALSE for users
  organizations jsonb  -- Array of org UUIDs like ["uuid1", "uuid2"]
  first_name text  -- Org name stored here
  last_name text
  ...

-- Membership approval
UPDATE profiles 
SET organizations = organizations || '["new-org-uuid"]'
WHERE user_id = member_id;

-- Check if user is member
SELECT * FROM profiles 
WHERE user_id = ? 
  AND organizations @> '["org-uuid"]';
```

**Problems:**
- ❌ Organizations mixed with user profiles
- ❌ JSONB arrays hard to query efficiently
- ❌ No role information (owner vs member vs admin)
- ❌ No way to tell if profile is org without `is_org` flag
- ❌ Array operations complex and error-prone

### AFTER (Relational Approach)

```sql
-- Separate organizations table
organizations:
  id uuid PRIMARY KEY
  name text NOT NULL
  bio text
  avatar_url text
  is_verified boolean
  created_at timestamptz
  updated_at timestamptz

-- Membership join table with roles
org_members:
  org_id uuid REFERENCES organizations(id)
  member_id uuid REFERENCES profiles(user_id)
  role text  -- 'owner' | 'admin' | 'member'
  created_at timestamptz
  PRIMARY KEY (org_id, member_id)

-- Membership approval
INSERT INTO org_members (org_id, member_id, role)
VALUES (org_uuid, member_uuid, 'member');

-- Check if user is member
SELECT * FROM org_members
WHERE org_id = ? AND member_id = ?;

-- Get user's orgs with roles
SELECT o.*, om.role
FROM org_members om
JOIN organizations o ON o.id = om.org_id
WHERE om.member_id = ?;
```

**Benefits:**
- ✅ Clean separation: organizations are distinct entities
- ✅ Fast indexed queries with standard JOINs
- ✅ Built-in role support (owner/admin/member)
- ✅ Easy to add org-specific fields
- ✅ Referential integrity with foreign keys

## Code Changes

### Frontend: Getting User's Organizations

#### BEFORE
```typescript
// Check user's profile for organizations array
const { data: profile } = await supabase
  .from("profiles")
  .select("user_id, is_org, organizations")
  .eq("user_id", userId)
  .single();

// User's orgs are in a JSONB array
const userOrgIds = profile?.organizations ?? [];

// Check if user is org itself
const isOrgSelf = profile?.is_org && userId === orgId;
```

#### AFTER
```typescript
// Query org_members table
const { data: userOrgs } = await supabase
  .from("org_members")
  .select("org_id, role")
  .eq("member_id", userId)
  .in("role", ["admin", "owner"]);

// Get org details with a JOIN or separate query
const { data: org } = await supabase
  .from("organizations")
  .select("id, name, avatar_url, bio, is_verified")
  .eq("id", orgId)
  .single();
```

### Frontend: Listing Members

#### BEFORE
```typescript
// Fetch ALL profiles, filter in JS for JSONB contains
const { data: allProfiles } = await supabase
  .from("profiles")
  .select("user_id, first_name, last_name, email, organizations")
  .not("organizations", "is", null);

// Filter in JavaScript
const members = allProfiles.filter(p => 
  Array.isArray(p.organizations) && 
  p.organizations.includes(orgId)
);
```

#### AFTER
```typescript
// Direct query with JOIN
const { data: members } = await supabase
  .from("org_members")
  .select(`
    member_id,
    role,
    created_at,
    profiles:member_id (
      user_id,
      first_name,
      last_name,
      email
    )
  `)
  .eq("org_id", orgId)
  .order("created_at");
```

### RPC Functions: Approve Request

#### BEFORE
```sql
CREATE FUNCTION approve_org_request(req_id uuid) AS $$
DECLARE
  v_orgs jsonb;
BEGIN
  -- Get existing JSONB array
  SELECT organizations INTO v_orgs
  FROM profiles
  WHERE user_id = member_id;
  
  -- Append to array
  UPDATE profiles
  SET organizations = v_orgs || to_jsonb(org_id::text)
  WHERE user_id = member_id;
END;
$$;
```

#### AFTER
```sql
CREATE FUNCTION approve_org_request(req_id uuid) AS $$
BEGIN
  -- Check authorization via org_members
  IF NOT EXISTS (
    SELECT 1 FROM org_members
    WHERE org_id = v_org 
      AND member_id = auth.uid()
      AND role IN ('admin', 'owner')
  ) THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  
  -- Simple insert into join table
  INSERT INTO org_members (org_id, member_id, role)
  VALUES (org_uuid, member_uuid, 'member')
  ON CONFLICT DO NOTHING;
END;
$$;
```

## Access Control Changes

### BEFORE
```typescript
// Complex logic to check access
const isOrgSelf = !!(
  profile?.is_org && 
  sessionUserId && 
  effectiveOrgId && 
  sessionUserId === effectiveOrgId
);

const isMember = !!(
  effectiveOrgId && 
  Array.isArray(profile?.organizations) && 
  profile.organizations.includes(effectiveOrgId)
);

const canManage = isOrgSelf || isMember;
```

### AFTER
```typescript
// Simple role check
const { data: membership } = await supabase
  .from("org_members")
  .select("role")
  .eq("org_id", orgId)
  .eq("member_id", userId)
  .in("role", ["admin", "owner"])
  .maybeSingle();

const canManage = !!membership;
```

## Query Performance

### BEFORE: Check Membership
```sql
-- JSONB containment check (slower)
SELECT * FROM profiles
WHERE user_id = $1 
  AND organizations @> $2::jsonb;

-- Requires GIN index on JSONB column
-- Still slower than B-tree lookups
```

### AFTER: Check Membership
```sql
-- Direct indexed lookup (faster)
SELECT * FROM org_members
WHERE member_id = $1 
  AND org_id = $2;

-- Uses standard B-tree index
-- Composite primary key provides perfect index
```

## Data Integrity

### BEFORE
```json
// Could have invalid references
{
  "organizations": ["uuid-that-doesnt-exist", "another-invalid-uuid"]
}
// No way to enforce referential integrity with JSONB
```

### AFTER
```sql
-- Foreign keys enforce integrity
org_members:
  org_id uuid REFERENCES organizations(id) ON DELETE CASCADE
  member_id uuid REFERENCES profiles(user_id) ON DELETE CASCADE

-- Database prevents orphaned references
-- Cascading deletes keep data clean
```

## Summary

| Feature | Before (JSONB) | After (Relational) |
|---------|---------------|-------------------|
| **Query Speed** | Slower (JSONB scans) | Faster (indexed joins) |
| **Data Integrity** | Manual | Enforced by FK |
| **Roles Support** | ❌ No | ✅ Yes (owner/admin/member) |
| **Scalability** | Limited | Excellent |
| **Code Complexity** | High (array manipulation) | Low (standard SQL) |
| **Type Safety** | Weak (JSONB) | Strong (typed columns) |
| **Maintenance** | Difficult | Easy |

The refactor transforms a makeshift JSONB solution into a proper, scalable, maintainable relational database design. 🎉



