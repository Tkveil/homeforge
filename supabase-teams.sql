-- HomeForge teams: $49/mo early-adopter plan, 5 seats per team
-- Run in Supabase Dashboard → SQL Editor (after supabase-schema.sql)

CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  join_code TEXT UNIQUE NOT NULL,
  seat_limit INT NOT NULL DEFAULT 5,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'incomplete'
    CHECK (status IN ('incomplete','active','past_due','canceled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS team_id UUID REFERENCES teams(id) ON DELETE SET NULL;

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Team members and owners can read their team
CREATE POLICY "teams_member_read" ON teams FOR SELECT USING (
  auth.uid() = owner_id
  OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.team_id = teams.id)
);

-- Owners can create their team row (webhook uses service_role and bypasses RLS)
CREATE POLICY "teams_owner_insert" ON teams FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Owners can update their team
CREATE POLICY "teams_owner_update" ON teams FOR UPDATE USING (auth.uid() = owner_id);

-- Join a team with a code. Enforces active subscription + seat cap.
-- SECURITY DEFINER so new members can validate a code before belonging to the team.
CREATE OR REPLACE FUNCTION join_team(p_code TEXT)
RETURNS UUID AS $$
DECLARE
  v_team_id UUID;
  v_seat_limit INT;
  v_count INT;
BEGIN
  SELECT id, seat_limit INTO v_team_id, v_seat_limit
  FROM teams
  WHERE join_code = p_code AND status = 'active';

  IF v_team_id IS NULL THEN
    RAISE EXCEPTION 'Invalid code or team subscription is not active';
  END IF;

  SELECT COUNT(*) INTO v_count FROM profiles WHERE team_id = v_team_id;

  IF v_count >= v_seat_limit THEN
    RAISE EXCEPTION 'This team is full (% seats)', v_seat_limit;
  END IF;

  UPDATE profiles SET team_id = v_team_id WHERE id = auth.uid();

  RETURN v_team_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
