# HomeForge — Setup Guide

## Vercel Environment Variables

Add these in Vercel → Settings → Environment Variables:

| Variable | Value |
|---|---|
| ANTHROPIC_API_KEY | your-anthropic-key |
| NEXT_PUBLIC_SUPABASE_URL | your-supabase-project-url |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | your-supabase-anon-key |
| SUPABASE_SERVICE_ROLE_KEY | your-supabase-service-role-key |

## Deploy Steps

1. Push this folder to a new GitHub repo called `homeforge`
2. Connect to Vercel → New Project → Import repo
3. Framework Preset: **Next.js**
4. Add environment variables above
5. Deploy
6. Add domain homeforge.com in Vercel → Domains
7. Set DNS in Namecheap:
   - A Record: @ → 76.76.21.21
   - CNAME: www → cname.vercel-dns.com

## Supabase Setup (Production)

Run this SQL in your Supabase dashboard to enable row-level security:

```sql
-- Enable RLS on all tables
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Agents see only their own transactions
CREATE POLICY "agents_own_transactions" ON transactions
  FOR ALL USING (
    auth.uid() = agent_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('tc', 'admin', 'broker'))
  );

-- PII fields encrypted at rest via Supabase Vault
-- Sensitive fields: SSN, DOB, income — stored encrypted, decrypted only for TC/Admin/Broker roles
```

## Role Permissions

| Feature | Agent | TC | MLO | Admin/Broker |
|---|---|---|---|---|
| View own transactions | ✓ | ✓ | ✓ | ✓ |
| View all transactions | — | ✓ | — | ✓ |
| Create/edit transactions | ✓ | ✓ | — | ✓ |
| View PII (phone/email) | — | ✓ | — | ✓ |
| Upload/send docs | ✓ | ✓ | — | ✓ |
| Loan pipeline | — | ✓ | ✓ | ✓ |
| Team management | — | — | — | ✓ |
| Reports | — | — | — | ✓ |
