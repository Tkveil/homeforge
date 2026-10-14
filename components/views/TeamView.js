import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { can, getRoleBadgeColor, getRoleLabel } from '../../lib/roles';

export default function TeamView({ user }) {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: true });
      setTeam(data || []);
      setLoading(false);
    })();
  }, []);

  if (!can(user.role, 'VIEW_TEAM')) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
        <div style={{ textAlign: 'center', color: '#4a4845' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⊘</div>
          <div>Team view not available for your role.</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: '400', color: '#f0ede8' }}>
          Team
        </h1>
        {can(user.role, 'MANAGE_TEAM') && (
          <div style={{ fontSize: '12px', color: '#4a4845', fontFamily: 'DM Mono, monospace' }}>
            New members join by creating an account on the sign-in page
          </div>
        )}
      </div>

      {loading ? (
        <div style={{ color: '#4a4845', fontFamily: 'DM Mono, monospace', fontSize: '13px', padding: '40px 0', textAlign: 'center' }}>
          Loading team…
        </div>
      ) : team.length === 0 ? (
        <div style={{ color: '#4a4845', fontSize: '14px', padding: '40px 0', textAlign: 'center' }}>
          No team members yet.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {team.map(member => {
            const color = getRoleBadgeColor(member.role);
            const initials = (member.name || member.email || '?')
              .split(' ')
              .map(w => w[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();
            return (
              <div key={member.id} style={{
                background: '#0f0f0f', border: '1px solid #1a1a1a',
                borderRadius: '14px', padding: '24px',
                transition: 'border-color 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#242424'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#1a1a1a'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: `${color}22`, border: `1px solid ${color}55`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px', fontWeight: '600', color,
                  }}>
                    {initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: '500', color: '#f0ede8' }}>
                      {member.name || '—'}
                      {member.id === user.id && (
                        <span style={{ fontSize: '10px', color: '#4a4845', marginLeft: '8px' }}>(you)</span>
                      )}
                    </div>
                    <span style={{
                      fontSize: '10px', fontFamily: 'DM Mono, monospace',
                      color, border: `1px solid ${color}55`,
                      borderRadius: '4px', padding: '2px 8px',
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                    }}>{getRoleLabel(member.role)}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: '#4a4845', fontFamily: 'DM Mono, monospace' }}>Email</span>
                    <span style={{ fontSize: '13px', color: '#f0ede8' }}>{member.email || '—'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: '#4a4845', fontFamily: 'DM Mono, monospace' }}>Brokerage</span>
                    <span style={{ fontSize: '13px', color: '#f0ede8' }}>{member.brokerage || '—'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: '#4a4845', fontFamily: 'DM Mono, monospace' }}>Joined</span>
                    <span style={{ fontSize: '13px', color: '#8a8580' }}>
                      {member.created_at
                        ? new Date(member.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : '—'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
