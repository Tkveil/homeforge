// Auth endpoint — in production connects to Supabase Auth
// This is a demo stub; real implementation uses Supabase server-side client
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { action, email, password } = req.body;

  if (action === 'login') {
    // In production: supabase.auth.signInWithPassword({ email, password })
    // + verify role from profiles table
    // + set httpOnly session cookie with JWT
    // + enforce session timeout (30 min inactivity)
    return res.status(200).json({
      message: 'Auth handled via Supabase in production',
      note: 'Connect NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable',
    });
  }

  return res.status(400).json({ error: 'Invalid action' });
}
