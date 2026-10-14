import { createServerClient } from '../../../lib/supabase';

// Source of truth for "does this user have access?"
// Access = belongs to a team (or owns one) with an active subscription.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'Missing userId.' });

  try {
    const supabase = createServerClient();

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, team_id')
      .eq('id', userId)
      .single();

    if (!profile) {
      return res.status(200).json({ hasAccess: false, team: null, isOwner: false });
    }

    // Team they belong to, or team they own (owner may not have team_id edge cases)
    let team = null;
    if (profile.team_id) {
      const { data } = await supabase
        .from('teams')
        .select('id, name, join_code, seat_limit, status, owner_id')
        .eq('id', profile.team_id)
        .single();
      team = data;
    }
    if (!team) {
      const { data } = await supabase
        .from('teams')
        .select('id, name, join_code, seat_limit, status, owner_id')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      team = data;
    }

    if (!team) {
      return res.status(200).json({ hasAccess: false, team: null, isOwner: false });
    }

    const { count: seatsUsed } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('team_id', team.id);

    const hasAccess = team.status === 'active';

    return res.status(200).json({
      hasAccess,
      isOwner: team.owner_id === userId,
      team: {
        id: team.id,
        name: team.name,
        joinCode: team.join_code,
        seatLimit: team.seat_limit,
        seatsUsed: seatsUsed || 0,
        status: team.status,
      },
    });
  } catch (err) {
    console.error('Billing status error:', err.message);
    return res.status(500).json({ hasAccess: false, error: true });
  }
}
