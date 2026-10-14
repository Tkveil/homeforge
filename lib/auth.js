import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from './supabase';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

// Ensure a profiles row exists for the signed-in user.
// Called after sign-in / on session restore.
async function ensureProfile(authUser, chosenRole) {
  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .maybeSingle();

  if (existing) return existing;

  const row = {
    id: authUser.id,
    email: authUser.email,
    name: authUser.user_metadata?.name || authUser.email.split('@')[0],
    brokerage: authUser.user_metadata?.brokerage || 'HomeForge Realty',
    role: chosenRole || 'agent',
  };
  const { data, error } = await supabase.from('profiles').insert(row).select().single();
  if (error) throw error;
  return data;
}

function toAppUser(profile, authUser) {
  const name = profile.name || authUser.email;
  return {
    id: profile.id,
    name,
    role: profile.role,
    email: authUser.email,
    brokerage: profile.brokerage || 'HomeForge Realty',
    avatar: name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase(),
  };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingRole, setPendingRole] = useState(null); // role picked at signup

  const syncSession = useCallback(
    async (sess) => {
      setSession(sess);
      if (!sess) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const profile = await ensureProfile(sess.user, pendingRole);
        setUser(toAppUser(profile, sess.user));
        setPendingRole(null);
      } catch (e) {
        // Profile table may be unreachable; still let them in with a basic user
        console.error('Profile sync failed:', e.message);
        setUser({
          id: sess.user.id,
          name: sess.user.email,
          role: 'agent',
          email: sess.user.email,
          brokerage: 'HomeForge Realty',
          avatar: sess.user.email.slice(0, 2).toUpperCase(),
        });
      }
      setLoading(false);
    },
    [pendingRole]
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => syncSession(session));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, sess) => syncSession(sess));
    return () => subscription.unsubscribe();
  }, [syncSession]);

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async ({ email, password, name, brokerage, role }) => {
    setPendingRole(role || 'agent');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, brokerage } },
    });
    if (error) {
      setPendingRole(null);
      throw error;
    }
    // If email confirmation is on, there is no session yet — the user
    // confirms via email, then signs in and the profile is created then.
    return { needsConfirmation: !data.session };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthCtx.Provider value={{ session, user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthCtx.Provider>
  );
}
