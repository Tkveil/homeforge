-- HomeForge database schema + row-level security
-- Run in Supabase Dashboard → SQL Editor

-- ── Tables ──

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'agent' CHECK (role IN ('agent','tc','mlo','admin','broker')),
  name TEXT,
  email TEXT,
  brokerage TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('buyer','seller','lead')),
  phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  client TEXT,
  stage TEXT DEFAULT 'New',
  close_date DATE,
  price NUMERIC,
  agent_name TEXT,
  mlo TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  due TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('urgent','high','medium','low')),
  type TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  from_name TEXT NOT NULL,
  role TEXT,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
  borrower TEXT NOT NULL,
  address TEXT,
  amount NUMERIC,
  type TEXT,
  rate TEXT,
  stage TEXT DEFAULT 'Processing',
  ltv TEXT,
  fico TEXT,
  close_date DATE,
  officer TEXT,
  agent_name TEXT,
  progress INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row-level security ──

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

-- Helper: is the current user staff (tc/admin/broker)?
CREATE OR REPLACE FUNCTION is_staff()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('tc','admin','broker')
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Profiles: users read own, staff read all
CREATE POLICY "profiles_own" ON profiles FOR SELECT USING (auth.uid() = id OR is_staff());
CREATE POLICY "profiles_insert_own" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id OR is_staff());

-- Contacts: agents see own, staff see all
CREATE POLICY "contacts_access" ON contacts FOR ALL USING (auth.uid() = agent_id OR is_staff());

-- Transactions: agents see own, staff see all (from SETUP.md)
CREATE POLICY "agents_own_transactions" ON transactions FOR ALL USING (
  auth.uid() = agent_id OR is_staff()
);

-- Tasks: agents see own, staff see all
CREATE POLICY "tasks_access" ON tasks FOR ALL USING (auth.uid() = agent_id OR is_staff());

-- Messages: via parent transaction, or staff
CREATE POLICY "messages_access" ON messages FOR ALL USING (
  is_staff() OR EXISTS (
    SELECT 1 FROM transactions t WHERE t.id = messages.transaction_id AND t.agent_id = auth.uid()
  )
);

-- Loans: MLOs + staff see all, agents see loans tied to their transactions
CREATE POLICY "loans_access" ON loans FOR ALL USING (
  is_staff()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'mlo')
  OR EXISTS (
    SELECT 1 FROM transactions t WHERE t.id = loans.transaction_id AND t.agent_id = auth.uid()
  )
);
