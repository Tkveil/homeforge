import Stripe from 'stripe';
import { createServerClient } from '../../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const PRICE_ID = process.env.STRIPE_PRICE_ID;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://homeforge.live';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'Missing userId.' });

  try {
    const supabase = createServerClient();

    // Load the user + profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email, name, team_id')
      .eq('id', userId)
      .single();

    if (!profile) return res.status(404).json({ error: 'Profile not found.' });

    // If they already own/have an active team, don't sell them another one
    if (profile.team_id) {
      const { data: team } = await supabase
        .from('teams')
        .select('status')
        .eq('id', profile.team_id)
        .single();
      if (team && team.status === 'active') {
        return res.status(400).json({ error: 'You already have an active team subscription.' });
      }
    }

    // Reuse or create the Stripe customer
    let customerId = null;
    const existing = await stripe.customers.list({ email: profile.email, limit: 1 });
    if (existing.data.length > 0) {
      customerId = existing.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: profile.email,
        name: profile.name || undefined,
        metadata: { supabase_user_id: userId },
      });
      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      success_url: `${APP_URL}/?billing=success`,
      cancel_url: `${APP_URL}/?billing=cancelled`,
      metadata: { user_id: userId },
      subscription_data: { metadata: { user_id: userId } },
      allow_promotion_codes: true,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Checkout error:', err.message);
    return res.status(500).json({ error: 'Could not start checkout.' });
  }
}
