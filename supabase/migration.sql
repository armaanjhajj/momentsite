-- ===== ORDERS TABLE =====
-- Standalone table for drop 0 submissions
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school TEXT,
    message TEXT,
    full_name TEXT,
    address TEXT,
    contact TEXT,
    agreed_terms BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (anyone can submit an order)
CREATE POLICY "Allow anonymous inserts" ON orders
    FOR INSERT
    WITH CHECK (true);

-- Block anonymous reads (orders are private)
CREATE POLICY "Block anonymous reads" ON orders
    FOR SELECT
    USING (false);


-- ===== SITE CONFIG TABLE (for admin password) =====
CREATE TABLE IF NOT EXISTS site_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- Enable RLS
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Block all direct access (only accessible via RPC)
CREATE POLICY "Block all direct access" ON site_config
    FOR ALL
    USING (false);

-- Insert the admin password MANUALLY via Supabase SQL Editor:
-- INSERT INTO site_config (key, value) VALUES ('admin_password', 'YOUR_PASSWORD_HERE');


-- ===== RPC FUNCTION: verify admin password =====
CREATE OR REPLACE FUNCTION verify_admin_password(pw TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM site_config
        WHERE key = 'admin_password' AND value = pw
    );
END;
$$;
