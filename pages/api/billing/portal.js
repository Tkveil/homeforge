import Stripe from 'stripe';
import { createServerClient } from '../../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://homeforge.live';

// Stripe customer portal: let owners update card / cancel themselves.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'Missing userId.' });

  try {
    const supabase = createServerClient();

    const { data: team } = await supabase
      .from('teams')
      .select('stripe_customer_id, owner_id')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!team?.stripe_customer_id) {
      return res.status(404).json({ error: 'No subscription found.' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: team.stripe_customer_id,
      return_url: `${APP_URL}/`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Portal error:', err.message);
    return res.status(500).json({ error: 'Could not open billing portal.' });
  }
}
