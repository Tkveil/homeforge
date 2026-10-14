import { can, getRoleBadgeColor } from '../lib/roles';

const NAV_ITEMS = [
  { id: 'home', icon: '⌂', label: 'Dashboard' },
  { id: 'transactions', icon: '◈', label: 'Transactions' },
  { id: 'contacts', icon: '◎', label: 'Contacts' },
  { id: 'tasks', icon: '✓', label: 'Tasks', badge: true },
  { id: 'messages', icon: '◷', label: 'Messages' },
  { id: 'pipeline', icon: '▦', label: 'Loan Pipeline', roles: ['mlo', 'tc', 'admin', 'broker'] },
  { id: 'idx', icon: '⊞', label: 'IDX Listings' },
  { id: 'team', icon: '◉', label: 'Team', roles: ['admin', 'broker', 'tc'] },
];

export default function Sidebar({ user, activeView, setActiveView, taskCount, open, onLogout, isMobile, onClose }) {
  const roleColor = getRoleBadgeColor(user.role);

  const visibleNav = NAV_ITEMS.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(user.role);
  });

  return (
    <div style={{
      width: '240px',
      minWidth: '240px',
      overflow: 'hidden',
      height: '100vh',
      background: '#0a0a0a',
      borderRight: '1px solid #141414',
      display: 'flex', flexDirection: 'column',
      transition: 'transform 0.3s ease, min-width 0.3s, width 0.3s',
      // Mobile: fixed drawer that slides in/out above content
      ...(isMobile ? {
        position: 'fixed', left: 0, top: 0, zIndex: 1000,
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        boxShadow: open ? '8px 0 32px rgba(0,0,0,0.6)' : 'none',
      } : {
        minWidth: open ? '240px' : '0',
        width: open ? '240px' : '0',
      }),
    }}>
      {/* Logo */}
      <div style={{
        padding: '24px 20px 20px',
        borderBottom: '1px solid #141414',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px',
            background: 'linear-gradient(135deg, #c9a84c, #8a6e2a)',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', flexShrink: 0,
          }}>⌂</div>
          <div>
            <div style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: '20px', fontWeight: '500',
              color: '#f0ede8', whiteSpace: 'nowrap',
            }}>HomeForge</div>
          </div>
        </div>
      </div>

      {/* User info */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #141414',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '50%',
            background: `linear-gradient(135deg, ${roleColor}33, ${roleColor}11)`,
            border: `1px solid ${roleColor}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: '600', color: roleColor,
            flexShrink: 0,
          }}>
            {user.avatar}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{
              fontSize: '13px', fontWeight: '500', color: '#f0ede8',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{user.name}</div>
            <span style={{
              fontSize: '10px', fontFamily: 'DM Mono, monospace',
              color: roleColor, letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>{user.role}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 12px', overflow: 'auto' }}>
        {visibleNav.map(item => {
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                width: '100%', padding: '10px 12px',
                background: active ? '#1a1a1a' : 'transparent',
                border: active ? '1px solid #242424' : '1px solid transparent',
                borderRadius: '8px', marginBottom: '2px',
                color: active ? '#f0ede8' : '#8a8580',
                fontSize: '13px', fontWeight: active ? '500' : '400',
                cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.15s',
                position: 'relative',
              }}
              onMouseEnter={e => {
                if (!active) {
                  e.currentTarget.style.background = '#141414';
                  e.currentTarget.style.color = '#f0ede8';
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#8a8580';
                }
              }}
            >
              {active && (
                <div style={{
                  position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                  width: '3px', height: '20px',
                  background: 'linear-gradient(to bottom, #c9a84c, #8a6e2a)',
                  borderRadius: '0 2px 2px 0',
                }} />
              )}
              <span style={{ fontSize: '15px', opacity: active ? 1 : 0.7 }}>{item.icon}</span>
              <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
              {item.badge && taskCount > 0 && (
                <span style={{ marginLeft: 'auto' }} className="badge-red">
                  {taskCount > 99 ? '99+' : taskCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom: brokerage + logout */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid #141414',
        flexShrink: 0,
      }}>
        <div style={{
          fontSize: '11px', color: '#4a4845',
          fontFamily: 'DM Mono, monospace',
          marginBottom: '12px', whiteSpace: 'nowrap',
          overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {user.brokerage}
        </div>
        <button
          onClick={onLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'none', border: 'none',
            color: '#4a4845', fontSize: '12px', cursor: 'pointer',
            padding: 0, transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#f0ede8'}
          onMouseLeave={e => e.currentTarget.style.color = '#4a4845'}
        >
          ↩ Sign out
        </button>
      </div>
    </div>
  );
}
