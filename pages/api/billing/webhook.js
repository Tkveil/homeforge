import Stripe from 'stripe';
import { createServerClient } from '../../../lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export const config = {
  api: { bodyParser: false },
};

async function readBuffer(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

function makeJoinCode() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `FORGE-${code}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await readBuffer(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  const supabase = createServerClient();

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata?.user_id;
      if (!userId) return res.status(200).json({ received: true });

      const subscription = await stripe.subscriptions.retrieve(session.subscription);

      // Create the team
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, name, brokerage')
        .eq('id', userId)
        .single();

      const teamName = profile?.brokerage && profile.brokerage !== 'HomeForge Realty'
        ? profile.brokerage
        : `${profile?.name || 'My'}'s Team`;

      // Unique join code (retry on collision)
      let joinCode = makeJoinCode();
      for (let i = 0; i < 5; i++) {
        const { data: clash } = await supabase
          .from('teams')
          .select('id')
          .eq('join_code', joinCode)
          .maybeSingle();
        if (!clash) break;
        joinCode = makeJoinCode();
      }

      const { data: team, error: teamErr } = await supabase
        .from('teams')
        .insert({
          name: teamName,
          owner_id: userId,
          join_code: joinCode,
          seat_limit: 5,
          stripe_customer_id: session.customer,
          stripe_subscription_id: subscription.id,
          status: subscription.status === 'active' || subscription.status === 'trialing' ? 'active' : 'incomplete',
        })
        .select()
        .single();

      if (teamErr) throw teamErr;

      // Put the owner on their team
      await supabase.from('profiles').update({ team_id: team.id }).eq('id', userId);
    }

    if (event.type === 'customer.subscription.updated') {
      const sub = event.data.object;
      const status =
        sub.status === 'active' || sub.status === 'trialing'
          ? 'active'
          : sub.status === 'past_due'
            ? 'past_due'
            : 'canceled';
      await supabase
        .from('teams')
        .update({ status })
        .eq('stripe_subscription_id', sub.id);
    }

    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object;
      await supabase
        .from('teams')
        .update({ status: 'canceled' })
        .eq('stripe_subscription_id', sub.id);
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err.message);
    return res.status(500).json({ error: 'Handler failed.' });
  }
}
