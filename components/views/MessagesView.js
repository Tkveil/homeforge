import { useState } from 'react';

const THREADS = [
  {
    id: 1,
    title: '142 Maple St — Lender Thread',
    participants: ['Sarah Mills', 'Chris Vega', 'Jordan Lee'],
    lastMessage: 'Chris: Appraisal came in at $490k — we\'re good to proceed.',
    lastTime: '10:32 AM',
    unread: 2,
    type: 'transaction',
    messages: [
      { id: 1, from: 'Sarah Mills', role: 'agent', time: '9:15 AM', text: 'Morning team. Thompson file — do we have the appraisal back yet?' },
      { id: 2, from: 'Jordan Lee', role: 'tc', time: '9:22 AM', text: 'Still waiting on First American. I\'ll follow up this morning.' },
      { id: 3, from: 'Chris Vega', role: 'mlo', time: '10:32 AM', text: 'Just got it. Appraisal came in at $490k — we\'re good to proceed. Sending loan commitment letter today.' },
    ],
  },
  {
    id: 2,
    title: '89 Oak Ave — Inspection Results',
    participants: ['Sarah Mills', 'Jordan Lee'],
    lastMessage: 'Jordan: Buyer requested $8,200 in repairs or credit.',
    lastTime: 'Yesterday',
    unread: 1,
    type: 'transaction',
    messages: [
      { id: 1, from: 'Jordan Lee', role: 'tc', time: 'Yesterday 3:44 PM', text: 'Inspection report is in. 3 major items flagged — roof, HVAC, and electrical panel.' },
      { id: 2, from: 'Sarah Mills', role: 'agent', time: 'Yesterday 4:02 PM', text: 'How bad? What\'s the estimated cost?' },
      { id: 3, from: 'Jordan Lee', role: 'tc', time: 'Yesterday 4:18 PM', text: 'Buyer requested $8,200 in repairs or credit. I\'ll draft the repair addendum.' },
    ],
  },
  {
    id: 3,
    title: 'Team — Brokerage Updates',
    participants: ['Tommy Kunkel', 'Sarah Mills', 'Jordan Lee', 'Chris Vega'],
    lastMessage: 'Tommy: Q4 volume goals — we\'re tracking at 94%.',
    lastTime: 'Mon',
    unread: 0,
    type: 'team',
    messages: [
      { id: 1, from: 'Tommy Kunkel', role: 'admin', time: 'Mon 11:00 AM', text: 'Team — great month. Q4 volume goals tracking at 94%. Keep pushing. 4 closes this month!' },
    ],
  },
];

const ROLE_COLORS = {
  agent: '#4a90d9', tc: '#805ad5', mlo: '#38a169',
  admin: '#c9a84c', broker: '#c9a84c',
};

export default function MessagesView({ user }) {
  const [threads, setThreads] = useState(THREADS);
  const [selected, setSelected] = useState(1);
  const [newMsg, setNewMsg] = useState('');

  const activeThread = threads.find(t => t.id === selected);

  const sendMessage = () => {
    if (!newMsg.trim()) return;
    setThreads(prev => prev.map(t => {
      if (t.id === selected) {
        return {
          ...t,
          messages: [...t.messages, {
            id: Date.now(), from: user.name,
            role: user.role, time: 'Just now', text: newMsg,
          }],
          lastMessage: `You: ${newMsg}`, lastTime: 'Just now',
        };
      }
      return t;
    }));
    setNewMsg('');
  };

  return (
    <div style={{ height: 'calc(100vh - 116px)', display: 'flex', gap: '0' }}>
      {/* Thread list */}
      <div style={{
        width: '300px', flexShrink: 0,
        background: '#0a0a0a', borderRight: '1px solid #141414',
        display: 'flex', flexDirection: 'column',
        borderRadius: '12px 0 0 12px', overflow: 'hidden',
      }}>
        <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid #141414' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', color: '#f0ede8' }}>Messages</h2>
        </div>
        <div style={{ flex: 1, overflow: 'auto' }}>
          {threads.map(t => (
            <div key={t.id}
              onClick={() => setSelected(t.id)}
              style={{
                padding: '16px',
                background: selected === t.id ? '#141414' : 'transparent',
                borderBottom: '1px solid #0f0f0f',
                cursor: 'pointer', transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (selected !== t.id) e.currentTarget.style.background = '#0f0f0f'; }}
              onMouseLeave={e => { if (selected !== t.id) e.currentTarget.style.background = 'transparent'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{
                  fontSize: '13px', fontWeight: '500',
                  color: selected === t.id ? '#f0ede8' : '#8a8580',
                  flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{t.title}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  {t.unread > 0 && (
                    <span style={{
                      background: '#c9a84c', color: '#080808',
                      borderRadius: '50%', width: '16px', height: '16px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '9px', fontWeight: '700',
                    }}>{t.unread}</span>
                  )}
                  <span style={{ fontSize: '10px', color: '#4a4845', fontFamily: 'DM Mono, monospace' }}>{t.lastTime}</span>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#4a4845', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {t.lastMessage}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      {activeThread && (
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          background: '#0f0f0f', borderRadius: '0 12px 12px 0',
          border: '1px solid #1a1a1a', borderLeft: 'none',
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 24px', borderBottom: '1px solid #1a1a1a',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '500', color: '#f0ede8' }}>{activeThread.title}</div>
              <div style={{ fontSize: '12px', color: '#4a4845' }}>
                {activeThread.participants.join(' · ')}
              </div>
            </div>
            <span style={{
              fontSize: '10px', fontFamily: 'DM Mono, monospace',
              color: activeThread.type === 'transaction' ? '#4a90d9' : '#c9a84c',
              border: `1px solid ${activeThread.type === 'transaction' ? '#4a90d944' : '#c9a84c44'}`,
              borderRadius: '4px', padding: '3px 8px',
            }}>{activeThread.type}</span>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}>
            {activeThread.messages.map((msg) => {
              const isMe = msg.from === user.name;
              const color = ROLE_COLORS[msg.role] || '#8a8580';
              return (
                <div key={msg.id} style={{
                  display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row',
                  gap: '12px', marginBottom: '16px',
                }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                    background: `${color}22`, border: `1px solid ${color}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', fontWeight: '600', color,
                  }}>
                    {msg.from.split(' ').map(n => n[0]).join('').slice(0,2)}
                  </div>
                  <div style={{ maxWidth: '70%' }}>
                    <div style={{
                      display: 'flex', gap: '8px', alignItems: 'baseline',
                      flexDirection: isMe ? 'row-reverse' : 'row',
                      marginBottom: '4px',
                    }}>
                      <span style={{ fontSize: '12px', fontWeight: '500', color }}>{msg.from}</span>
                      <span style={{ fontSize: '11px', color: '#4a4845', fontFamily: 'DM Mono, monospace' }}>{msg.time}</span>
                    </div>
                    <div style={{
                      padding: '12px 16px',
                      background: isMe ? 'linear-gradient(135deg, #c9a84c22, #8a6e2a22)' : '#1a1a1a',
                      border: `1px solid ${isMe ? '#c9a84c33' : '#242424'}`,
                      borderRadius: isMe ? '12px 2px 12px 12px' : '2px 12px 12px 12px',
                      fontSize: '14px', color: '#f0ede8', lineHeight: '1.5',
                    }}>{msg.text}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Compose */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid #1a1a1a' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
              <textarea
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Send a message... (Enter to send)"
                rows={2}
                style={{
                  flex: 1, padding: '12px 16px',
                  background: '#141414', border: '1px solid #242424',
                  borderRadius: '10px', color: '#f0ede8', fontSize: '14px',
                  resize: 'none', lineHeight: '1.5',
                }}
                onFocus={e => e.target.style.borderColor = '#c9a84c'}
                onBlur={e => e.target.style.borderColor = '#242424'}
              />
              <button
                onClick={sendMessage}
                disabled={!newMsg.trim()}
                style={{
                  padding: '10px 20px',
                  background: newMsg.trim() ? 'linear-gradient(135deg, #c9a84c, #8a6e2a)' : '#1a1a1a',
                  border: 'none', borderRadius: '8px',
                  color: newMsg.trim() ? '#080808' : '#4a4845',
                  fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
