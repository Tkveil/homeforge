import { can, getRoleBadgeColor, getRoleLabel } from '../../lib/roles';

const TEAM = [
  { id: 1, name: 'Tommy Kunkel', role: 'admin', avatar: 'TK', email: 'tommy@homeforge.com', phone: '(512) 555-0001', transactions: 12, closedMTD: 4, status: 'active' },
  { id: 2, name: 'Sarah Mills', role: 'agent', avatar: 'SM', email: 'sarah@homeforge.com', phone: '(512) 555-0002', transactions: 8, closedMTD: 2, status: 'active' },
  { id: 3, name: 'Jordan Lee', role: 'tc', avatar: 'JL', email: 'jordan@homeforge.com', phone: '(512) 555-0003', transactions: 15, closedMTD: 6, status: 'active' },
  { id: 4, name: 'Chris Vega', role: 'mlo', avatar: 'CV', email: 'chris@firstnational.com', phone: '(512) 555-0004', transactions: 10, closedMTD: 3, status: 'active' },
];

export default function TeamView({ user }) {
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
          <button style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #c9a84c, #8a6e2a)',
            border: 'none', borderRadius: '8px',
            color: '#080808', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
          }}>+ Invite Member</button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {TEAM.map(member => {
          const color = getRoleBadgeColor(member.role);
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
                  background: `linear-gradient(135deg, ${color}33, ${color}11)`,
                  border: `1px solid ${color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', fontWeight: '600', color,
                }}>{member.avatar}</div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '500', color: '#f0ede8' }}>{member.name}</div>
                  <span style={{
                    fontSize: '10px', fontFamily: 'DM Mono, monospace',
                    color, letterSpacing: '0.08em', textTransform: 'uppercase',
                  }}>{getRoleLabel(member.role)}</span>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: '#38a169',
                    boxShadow: '0 0 6px rgba(56,161,105,0.6)',
                  }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div style={{ background: '#141414', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontSize: '10px', color: '#4a4845', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Active</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', color: '#f0ede8' }}>{member.transactions}</div>
                </div>
                <div style={{ background: '#141414', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontSize: '10px', color: '#4a4845', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Closed MTD</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '24px', color: '#38a169' }}>{member.closedMTD}</div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #141414', paddingTop: '16px' }}>
                <div style={{ fontSize: '12px', color: '#4a4845', marginBottom: '4px' }}>{member.email}</div>
                <div style={{ fontSize: '12px', color: '#4a4845' }}>{member.phone}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
