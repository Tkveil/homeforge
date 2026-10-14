import Head from 'next/head';
import Dashboard from '../components/Dashboard';
import Login from '../components/Login';
import { AuthProvider, useAuth } from '../lib/auth';

function Shell() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#080808',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #c9a84c, #8a6e2a)',
              borderRadius: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              marginBottom: '16px',
            }}
          >
            ⌂
          </div>
          <div style={{ color: '#4a4845', fontSize: '13px', fontFamily: 'DM Mono, monospace' }}>
            Loading workspace…
          </div>
        </div>
      </div>
    );
  }

  if (!user) return <Login />;

  return <Dashboard user={user} onLogout={signOut} />;
}

export default function Home() {
  return (
    <>
      <Head>
        <title>HomeForge — Real Estate Operations Platform</title>
      </Head>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </>
  );
}
