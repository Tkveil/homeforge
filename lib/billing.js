import { useState, useEffect, useCallback } from 'react';

// Billing state for the signed-in user.
// Server is the source of truth (reads teams table via service_role).
export function useBilling(userId) {
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) {
      setBilling(null);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/billing/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      setBilling(data);
    } catch (e) {
      setBilling({ hasAccess: false, error: true });
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { billing, loading, refresh };
}

export async function startCheckout(userId) {
  const res = await fetch('/api/billing/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not start checkout.');
  window.location.href = data.url;
}

export async function openPortal(userId) {
  const res = await fetch('/api/billing/portal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not open billing portal.');
  window.location.href = data.url;
}
