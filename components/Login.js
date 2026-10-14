import { useState } from 'react';
import { useAuth } from '../lib/auth';

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  background: '#141414',
  border: '1px solid #242424',
  borderRadius: '8px',
  color: '#f0ede8',
  fontSize: '14px',
};

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  color: '#8a8580',
  marginBottom: '8px',
  fontFamily: 'DM Mono, monospace',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
};

export default function Login() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('signin'); // signin | signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [brokerage, setBrokerage] = useState('');
  const [role, setRole] = useState('agent');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNotice('');
    try {
      if (mode === 'signin') {
        await signIn(email.trim(), password);
      } else {
        const { needsConfirmation } = await signUp({
          email: email.trim(),
          password,
          name: name.trim(),
          brokerage: brokerage.trim(),
          role,
        });
        if (needsConfirmation) {
          setNotice(
            'Account created. Check your email to confirm, then sign in.'
          );
          setMode('signin');
        }
        // Otherwise the auth state change signs them straight in.
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    }
    setLoading(false);
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
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '8px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #c9a84c, #8a6e2a)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
              }}
            >
              ⌂
            </div>
            <span
              style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: '28px',
                fontWeight: '500',
                color: '#f0ede8',
                letterSpacing: '0.02em',
              }}
            >
              HomeForge
            </span>
          </div>
          <p style={{ color: '#4a4845', fontSize: '13px', fontFamily: 'DM Mono, monospace' }}>
            Real Estate Operations Platform
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: '#0f0f0f',
            border: '1px solid #1a1a1a',
            borderRadius: '16px',
            padding: '40px',
          }}
        >
          {/* Mode tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
            {[
              { key: 'signin', label: 'Sign In' },
              { key: 'signup', label: 'Create Account' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  setMode(t.key);
                  setError('');
                  setNotice('');
                }}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: mode === t.key ? '#1a1a1a' : 'none',
                  border: `1px solid ${mode === t.key ? '#242424' : '#1a1a1a'}`,
                  borderRadius: '8px',
                  color: mode === t.key ? '#f0ede8' : '#8a8580',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Full name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Agent"
                    required
                    style={inputStyle}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Brokerage</label>
                    <input
                      type="text"
                      value={brokerage}
                      onChange={(e) => setBrokerage(e.target.value)}
                      placeholder="HomeForge Realty"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      style={{ ...inputStyle, width: 'auto' }}
                    >
                      <option value="agent">Agent</option>
                      <option value="tc">TC</option>
                      <option value="mlo">MLO</option>
                      <option value="admin">Admin</option>
                      <option value="broker">Broker</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@brokerage.com"
                required
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                style={inputStyle}
              />
            </div>

            {error && (
              <div
                style={{
                  background: 'rgba(229,62,62,0.1)',
                  border: '1px solid rgba(229,62,62,0.3)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: '#fc8181',
                  fontSize: '13px',
                  marginBottom: '16px',
                }}
              >
                {error}
              </div>
            )}
            {notice && (
              <div
                style={{
                  background: 'rgba(56,161,105,0.1)',
                  border: '1px solid rgba(56,161,105,0.3)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: '#68d391',
                  fontSize: '13px',
                  marginBottom: '16px',
                }}
              >
                {notice}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading
                  ? '#1a1a1a'
                  : 'linear-gradient(135deg, #c9a84c, #8a6e2a)',
                border: 'none',
                borderRadius: '8px',
                color: loading ? '#4a4845' : '#080808',
                fontSize: '14px',
                fontWeight: '600',
                letterSpacing: '0.05em',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading
                ? 'Please wait…'
                : mode === 'signin'
                  ? 'Sign In'
                  : 'Create Account'}
            </button>
          </form>
        </div>

        <p
          style={{
            marginTop: '24px',
            textAlign: 'center',
            color: '#4a4845',
            fontSize: '12px',
            fontFamily: 'DM Mono, monospace',
          }}
        >
          Same login works on desktop and phone — your data follows you.
        </p>
      </div>
    </div>
  );
}
