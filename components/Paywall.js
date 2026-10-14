import { useState } from 'react';
import { startCheckout } from '../lib/billing';

const INCLUDED = [
  'Contacts, transactions, tasks and messages in one place',
  'Loan pipeline for you and your MLO',
  'AI assistant that knows your files',
  'Up to 5 seats — your agents and TC included',
  'Works on desktop and phone, same login',
];

export default function Paywall({ user, onSubscribed }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subscribe = async () => {
    setLoading(true);
    setError('');
    try {
      await startCheckout(user.id);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#080808',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '520px', textAlign: 'center' }}>
        <div
          style={{
            width: '48px', height: '48px',
            background: 'linear-gradient(135deg, #c9a84c, #8a6e2a)',
            borderRadius: '12px',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', marginBottom: '24px',
          }}
        >
          ⌂
        </div>

        <h1
          style={{
            fontFamily: 'Cormorant Garamond, Georgia, serif',
            fontSize: '36px', fontWeight: '400',
            color: '#f0ede8', marginBottom: '8px',
          }}
        >
          Welcome to HomeForge, {user.name.split(' ')[0]}.
        </h1>
        <p style={{ color: '#8a8580', fontSize: '15px', marginBottom: '32px', lineHeight: '1.6' }}>
          One plan. Your whole team. No per-seat nonsense.
        </p>

        <div
          style={{
            background: '#0f0f0f',
            border: '1px solid #c9a84c44',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '24px',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '4px' }}>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '48px', color: '#f0ede8' }}>
              $49
            </span>
            <span style={{ color: '#8a8580', fontSize: '14px' }}>/month</span>
            <span
              style={{
                marginLeft: 'auto',
                fontSize: '10px', fontFamily: 'DM Mono, monospace',
                color: '#c9a84c', border: '1px solid #c9a84c44',
                borderRadius: '4px', padding: '3px 8px',
                textTransform: 'uppercase', letterSpacing: '0.08em',
              }}
            >
              Early adopter
            </span>
          </div>
          <p style={{ color: '#4a4845', fontSize: '12px', fontFamily: 'DM Mono, monospace', marginBottom: '20px' }}>
            Locked in forever. This price only goes up for everyone else.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
            {INCLUDED.map((item) => (
              <div key={item} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ color: '#38a169', fontSize: '14px' }}>✓</span>
                <span style={{ color: '#f0ede8', fontSize: '14px' }}>{item}</span>
              </div>
            ))}
          </div>

          {error && (
            <div
              style={{
                background: 'rgba(229,62,62,0.1)', border: '1px solid rgba(229,62,62,0.3)',
                borderRadius: '8px', padding: '12px 16px',
                color: '#fc8181', fontSize: '13px', marginBottom: '16px',
              }}
            >
              {error}
            </div>
          )}

          <button
            onClick={subscribe}
            disabled={loading}
            style={{
              width: '100%', padding: '16px',
              background: loading ? '#1a1a1a' : 'linear-gradient(135deg, #c9a84c, #8a6e2a)',
              border: 'none', borderRadius: '10px',
              color: loading ? '#4a4845' : '#080808',
              fontSize: '15px', fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Starting checkout…' : 'Subscribe — $49/mo'}
          </button>
          <p style={{ color: '#4a4845', fontSize: '11px', textAlign: 'center', marginTop: '12px' }}>
            Cancel anytime. Your data stays yours.
          </p>
        </div>

        <button
          onClick={onSubscribed}
          style={{
            background: 'none', border: 'none',
            color: '#4a4845', fontSize: '12px', cursor: 'pointer',
            fontFamily: 'DM Mono, monospace',
          }}
        >
          Already subscribed? Refresh status →
        </button>
      </div>
    </div>
  );
}
