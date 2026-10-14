import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { can, getRoleBadgeColor, getRoleLabel } from '../../lib/roles';
import { useBilling, openPortal } from '../../lib/billing';

export default function TeamView({ user }) {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const { billing } = useBilling(user?.id);
  const [portalLoading, setPortalLoading] = useState(false);

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
        {billing?.isOwner && (
          <button
            onClick={async () => {
              setPortalLoading(true);
              try {
                await openPortal(user.id);
              } catch (e) {
                setPortalLoading(false);
              }
            }}
            disabled={portalLoading}
            style={{
              padding: '10px 20px',
              background: '#1a1a1a',
              border: '1px solid #242424',
              borderRadius: '8px',
              color: '#f0ede8', fontSize: '13px', fontWeight: '600',
              cursor: portalLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {portalLoading ? 'Opening…' : 'Manage subscription'}
          </button>
        )}
      </div>

      {/* Team plan card */}
      {billing?.team && (
        <div style={{
          background: '#0f0f0f', border: '1px solid #c9a84c44',
          borderRadius: '12px', padding: '20px 24px', marginBottom: '20px',
          display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#4a4845', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
              Team
            </div>
            <div style={{ fontSize: '16px', color: '#f0ede8', fontWeight: '500' }}>{billing.team.name}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#4a4845', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
              Seats
            </div>
            <div style={{ fontSize: '16px', color: '#f0ede8', fontFamily: 'DM Mono, monospace' }}>
              {billing.team.seatsUsed} / {billing.team.seatLimit}
            </div>
          </div>
          {billing.isOwner && (
            <div>
              <div style={{ fontSize: '11px', color: '#4a4845', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
                Invite code
              </div>
              <div style={{
                fontSize: '16px', color: '#c9a84c', fontFamily: 'DM Mono, monospace',
                border: '1px dashed #c9a84c44', borderRadius: '8px', padding: '4px 12px',
                cursor: 'pointer',
              }}
              onClick={() => navigator.clipboard?.writeText(billing.team.joinCode)}
              title="Click to copy"
              >
                {billing.team.joinCode}
              </div>
            </div>
          )}
          <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#4a4845', fontFamily: 'DM Mono, monospace' }}>
            {billing.isOwner
              ? 'Share the invite code — new members join free under your plan.'
              : 'You\u2019re covered by your team\u2019s plan.'}
          </div>
        </div>
      )}

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
