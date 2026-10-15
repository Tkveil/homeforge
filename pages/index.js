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
        <meta name="description" content="The all-in-one CRM for real estate teams. Agent, lender, and TC in one workflow. $49/mo for the whole team." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="HomeForge" />
        <meta property="og:title" content="HomeForge — Everything a team uses. Nothing it doesn't." />
        <meta property="og:description" content="The all-in-one CRM for real estate teams. Agent, lender, and TC in one workflow. $49/mo for the whole team." />
        <meta property="og:url" content="https://homeforge.live/" />
        <meta property="og:image" content="https://homeforge.live/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HomeForge — Everything a team uses. Nothing it doesn't." />
        <meta name="twitter:description" content="The all-in-one CRM for real estate teams. Agent, lender, and TC in one workflow. $49/mo for the whole team." />
        <meta name="twitter:image" content="https://homeforge.live/og-image.png" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>
      <AuthProvider>
        <Shell />
      </AuthProvider>
    </>
  );
}
