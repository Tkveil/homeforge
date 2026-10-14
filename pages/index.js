import { useState } from 'react';
import Head from 'next/head';
import Dashboard from '../components/Dashboard';
import Login from '../components/Login';

export default function Home() {
  // Demo: default to logged-in as admin to show full dashboard
  // In production, this comes from Supabase auth session
  const [user, setUser] = useState({
    id: 'demo-001',
    name: 'Tommy Kunkel',
    role: 'admin',
    avatar: 'TK',
    brokerage: 'HomeForge Realty',
  });

  const [loggedIn, setLoggedIn] = useState(true);

  if (!loggedIn) {
    return <Login onLogin={(u) => { setUser(u); setLoggedIn(true); }} />;
  }

  return <Dashboard user={user} onLogout={() => setLoggedIn(false)} />;
}
