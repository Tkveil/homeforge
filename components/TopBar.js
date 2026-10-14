import { useState } from 'react';

const VIEW_LABELS = {
  home: 'Dashboard',
  transactions: 'Transactions',
  contacts: 'Contacts',
  tasks: 'Tasks',
  messages: 'Messages',
  pipeline: 'Loan Pipeline',
  idx: 'IDX Listings',
  team: 'Team',
};

export default function TopBar({ user, activeView, taskCount, onMenuToggle, setActiveView }) {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div style={{
      height: '60px',
      background: '#0a0a0a',
      borderBottom: '1px solid #141414',
      display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: '16px',
      flexShrink: 0,
    }}>
      {/* Menu toggle */}
      <button
        onClick={onMenuToggle}
        style={{
          background: 'none', border: 'none',
          color: '#4a4845', fontSize: '18px', cursor: 'pointer',
          padding: '4px', lineHeight: 1,
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#f0ede8'}
        onMouseLeave={e => e.currentTarget.style.color = '#4a4845'}
      >≡</button>

      {/* Breadcrumb */}
      <div style={{
        fontFamily: 'DM Mono, monospace',
        fontSize: '12px', color: '#4a4845',
        letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>
        {VIEW_LABELS[activeView] || 'Dashboard'}
      </div>

      {/* Search */}
      <div style={{ flex: 1, maxWidth: '400px', marginLeft: 'auto' }}>
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
            color: '#4a4845', fontSize: '14px', pointerEvents: 'none',
          }}>⌕</span>
          <input
            type="text"
            placeholder="Search contacts, transactions, addresses..."
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            style={{
              width: '100%', padding: '8px 12px 8px 34px',
              background: '#141414', border: '1px solid #1a1a1a',
              borderRadius: '8px', color: '#f0ede8', fontSize: '13px',
            }}
            onFocus={e => e.target.style.borderColor = '#c9a84c'}
            onBlur={e => e.target.style.borderColor = '#1a1a1a'}
          />
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Tasks button with red badge */}
        <button
          onClick={() => setActiveView('tasks')}
          style={{
            position: 'relative',
            background: activeView === 'tasks' ? '#1a1a1a' : 'none',
            border: '1px solid',
            borderColor: activeView === 'tasks' ? '#242424' : 'transparent',
            borderRadius: '8px', padding: '7px 10px',
            color: '#8a8580', fontSize: '16px', cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#f0ede8'}
          onMouseLeave={e => e.currentTarget.style.color = '#8a8580'}
          title="My Tasks"
        >
          ✓
          {taskCount > 0 && (
            <span style={{
              position: 'absolute', top: '-4px', right: '-4px',
              background: '#e53e3e', color: 'white',
              borderRadius: '50%', width: '16px', height: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '9px', fontWeight: '700',
              boxShadow: '0 0 8px rgba(229,62,62,0.6)',
              animation: 'pulse-red 2s ease-in-out infinite',
            }}>
              {taskCount}
            </span>
          )}
        </button>

        {/* Messages */}
        <button
          onClick={() => setActiveView('messages')}
          style={{
            background: activeView === 'messages' ? '#1a1a1a' : 'none',
            border: '1px solid',
            borderColor: activeView === 'messages' ? '#242424' : 'transparent',
            borderRadius: '8px', padding: '7px 10px',
            color: '#8a8580', fontSize: '16px', cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#f0ede8'}
          onMouseLeave={e => e.currentTarget.style.color = '#8a8580'}
          title="Messages"
        >
          ◷
        </button>

        {/* Avatar */}
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #c9a84c33, #c9a84c11)',
          border: '1px solid #c9a84c44',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '11px', fontWeight: '600', color: '#c9a84c',
          cursor: 'pointer',
        }}>
          {user.avatar}
        </div>
      </div>
    </div>
  );
}
