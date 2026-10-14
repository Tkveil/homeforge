import { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const DEMO_USERS = [
    { email: 'admin@homeforge.com', password: 'demo', id: '1', name: 'Tommy Kunkel', role: 'admin', avatar: 'TK', brokerage: 'HomeForge Realty' },
    { email: 'agent@homeforge.com', password: 'demo', id: '2', name: 'Sarah Mills', role: 'agent', avatar: 'SM', brokerage: 'HomeForge Realty' },
    { email: 'tc@homeforge.com', password: 'demo', id: '3', name: 'Jordan Lee', role: 'tc', avatar: 'JL', brokerage: 'HomeForge Realty' },
    { email: 'mlo@homeforge.com', password: 'demo', id: '4', name: 'Chris Vega', role: 'mlo', avatar: 'CV', brokerage: 'HomeForge Realty' },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 600));
    const found = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...user } = found;
      onLogin(user);
    } else {
      setError('Invalid credentials. Try demo accounts below.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080808',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '8px',
          }}>
            <div style={{
              width: '40px', height: '40px',
              background: 'linear-gradient(135deg, #c9a84c, #8a6e2a)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px',
            }}>⌂</div>
            <span style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: '28px', fontWeight: '500',
              color: '#f0ede8', letterSpacing: '0.02em',
            }}>HomeForge</span>
          </div>
          <p style={{ color: '#4a4845', fontSize: '13px', fontFamily: 'DM Mono, monospace' }}>
            Real Estate Operations Platform
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#0f0f0f',
          border: '1px solid #1a1a1a',
          borderRadius: '16px',
          padding: '40px',
        }}>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: '22px', fontWeight: '400',
            color: '#f0ede8', marginBottom: '32px',
          }}>Sign in to your workspace</h2>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#8a8580', marginBottom: '8px', fontFamily: 'DM Mono, monospace', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@brokerage.com"
                required
                style={{
                  width: '100%', padding: '12px 16px',
                  background: '#141414', border: '1px solid #242424',
                  borderRadius: '8px', color: '#f0ede8',
                  fontSize: '14px', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#c9a84c'}
                onBlur={e => e.target.style.borderColor = '#242424'}
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#8a8580', marginBottom: '8px', fontFamily: 'DM Mono, monospace', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%', padding: '12px 16px',
                  background: '#141414', border: '1px solid #242424',
                  borderRadius: '8px', color: '#f0ede8', fontSize: '14px',
                }}
                onFocus={e => e.target.style.borderColor = '#c9a84c'}
                onBlur={e => e.target.style.borderColor = '#242424'}
              />
            </div>

            {error && (
              <div style={{
                background: 'rgba(229,62,62,0.1)', border: '1px solid rgba(229,62,62,0.3)',
                borderRadius: '8px', padding: '12px 16px',
                color: '#fc8181', fontSize: '13px', marginBottom: '16px',
              }}>{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading ? '#1a1a1a' : 'linear-gradient(135deg, #c9a84c, #8a6e2a)',
                border: 'none', borderRadius: '8px',
                color: loading ? '#4a4845' : '#080808',
                fontSize: '14px', fontWeight: '600',
                letterSpacing: '0.05em', transition: 'opacity 0.2s',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Demo accounts */}
        <div style={{
          marginTop: '24px', padding: '20px',
          background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '12px',
        }}>
          <p style={{ fontSize: '11px', color: '#4a4845', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
            Demo Accounts (password: demo)
          </p>
          {[
            { email: 'admin@homeforge.com', role: 'Admin', color: '#c9a84c' },
            { email: 'agent@homeforge.com', role: 'Agent', color: '#4a90d9' },
            { email: 'tc@homeforge.com', role: 'TC', color: '#805ad5' },
            { email: 'mlo@homeforge.com', role: 'MLO', color: '#38a169' },
          ].map(a => (
            <button
              key={a.email}
              onClick={() => { setEmail(a.email); setPassword('demo'); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                width: '100%', padding: '8px 0',
                background: 'none', border: 'none',
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              <span style={{
                fontSize: '10px', fontFamily: 'DM Mono, monospace',
                color: a.color, border: `1px solid ${a.color}`,
                borderRadius: '4px', padding: '2px 6px',
                letterSpacing: '0.08em',
              }}>{a.role}</span>
              <span style={{ color: '#8a8580', fontSize: '12px' }}>{a.email}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
