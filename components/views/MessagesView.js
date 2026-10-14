import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

const ROLE_COLORS = {
  agent: '#4a90d9', tc: '#805ad5', mlo: '#38a169',
  admin: '#c9a84c', broker: '#c9a84c',
};

const inputStyle = {
  width: '100%', padding: '10px 14px',
  background: '#141414', border: '1px solid #242424',
  borderRadius: '8px', color: '#f0ede8', fontSize: '14px',
};

export default function MessagesView({ user, isMobile }) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);

  const fetchThreads = async () => {
    const { data: msgs } = await supabase
      .from('messages')
      .select('*, transactions(id, address)')
      .order('created_at', { ascending: true });

    // Group by transaction
    const map = {};
    (msgs || []).forEach(m => {
      const key = m.transaction_id || 'general';
      if (!map[key]) {
        map[key] = {
          id: key,
          transaction_id: m.transaction_id,
          title: m.transactions?.address || 'Team — General',
          messages: [],
        };
      }
      map[key].messages.push(m);
    });
    const list = Object.values(map).sort((a, b) => {
      const at = a.messages[a.messages.length - 1]?.created_at || '';
      const bt = b.messages[b.messages.length - 1]?.created_at || '';
      return bt.localeCompare(at);
    });
    setThreads(list);
    setLoading(false);
  };

  useEffect(() => { fetchThreads(); }, []);

  const sendMessage = async () => {
    if (!draft.trim() || !selected) return;
    setSending(true);
    const thread = threads.find(t => t.id === selected);
    const { error } = await supabase.from('messages').insert({
      transaction_id: thread?.transaction_id || null,
      from_name: user.name,
      role: user.role,
      text: draft.trim(),
    });
    setSending(false);
    if (!error) {
      setDraft('');
      fetchThreads();
    }
  };

  const thread = selected ? threads.find(t => t.id === selected) : null;

  const fmtTime = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    return sameDay
      ? d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: '400', color: '#f0ede8' }}>
          Messages
        </h1>
      </div>

      {loading ? (
        <div style={{ color: '#4a4845', fontFamily: 'DM Mono, monospace', fontSize: '13px', padding: '40px 0', textAlign: 'center' }}>
          Loading messages…
        </div>
      ) : threads.length === 0 ? (
        <div style={{
          background: '#0f0f0f', border: '1px solid #1a1a1a',
          borderRadius: '12px', padding: '40px', textAlign: 'center',
        }}>
          <div style={{ color: '#8a8580', fontSize: '14px', marginBottom: '8px' }}>No message threads yet.</div>
          <div style={{ color: '#4a4845', fontSize: '13px' }}>
            Threads appear here once your team starts messaging on a transaction.
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : (thread ? '340px 1fr' : '1fr'), gap: '20px' }}>
          {/* Thread list */}
          {(!isMobile || !thread) && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {threads.map(t => {
                const last = t.messages[t.messages.length - 1];
                return (
                  <div key={t.id}
                    onClick={() => setSelected(t.id)}
                    style={{
                      background: selected === t.id ? '#141414' : '#0f0f0f',
                      border: `1px solid ${selected === t.id ? '#c9a84c44' : '#1a1a1a'}`,
                      borderRadius: '12px', padding: '16px 18px',
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (selected !== t.id) e.currentTarget.style.borderColor = '#242424'; }}
                    onMouseLeave={e => { if (selected !== t.id) e.currentTarget.style.borderColor = '#1a1a1a'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#f0ede8' }}>{t.title}</div>
                      <div style={{ fontSize: '11px', color: '#4a4845', fontFamily: 'DM Mono, monospace' }}>
                        {last ? fmtTime(last.created_at) : ''}
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#8a8580', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {last ? `${last.from_name}: ${last.text}` : 'No messages'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#4a4845', marginTop: '6px' }}>
                      {t.messages.length} message{t.messages.length === 1 ? '' : 's'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Thread detail */}
          {thread && (
            <div style={{
              background: '#0f0f0f', border: '1px solid #1a1a1a',
              borderRadius: '12px', display: 'flex', flexDirection: 'column',
              height: isMobile ? 'calc(100vh - 220px)' : 'calc(100vh - 200px)',
              minHeight: '400px',
            }}>
              <div style={{
                padding: '16px 20px', borderBottom: '1px solid #1a1a1a',
                display: 'flex', alignItems: 'center', gap: '12px',
              }}>
                {isMobile && (
                  <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#c9a84c', cursor: 'pointer', fontSize: '16px' }}>←</button>
                )}
                <div style={{ fontSize: '15px', fontWeight: '500', color: '#f0ede8' }}>{thread.title}</div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {thread.messages.map(m => {
                  const mine = m.from_name === user.name;
                  const color = ROLE_COLORS[m.role] || '#8a8580';
                  return (
                    <div key={m.id} style={{ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '500', color: '#f0ede8' }}>{m.from_name}</span>
                        <span style={{
                          fontSize: '9px', fontFamily: 'DM Mono, monospace',
                          color, border: `1px solid ${color}55`,
                          borderRadius: '4px', padding: '1px 5px', textTransform: 'uppercase',
                        }}>{m.role}</span>
                        <span style={{ fontSize: '10px', color: '#4a4845' }}>{fmtTime(m.created_at)}</span>
                      </div>
                      <div style={{
                        background: mine ? '#1a1a1a' : '#141414',
                        border: `1px solid ${mine ? '#c9a84c33' : '#1a1a1a'}`,
                        borderRadius: '12px',
                        borderTopRightRadius: mine ? '4px' : '12px',
                        borderTopLeftRadius: mine ? '12px' : '4px',
                        padding: '12px 16px',
                        fontSize: '14px', color: '#f0ede8', lineHeight: '1.5',
                      }}>{m.text}</div>
                    </div>
                  );
                })}
              </div>

              <div style={{ padding: '16px 20px', borderTop: '1px solid #1a1a1a', display: 'flex', gap: '10px' }}>
                <input
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
                  placeholder="Type a message…"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  onClick={sendMessage}
                  disabled={sending || !draft.trim()}
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #c9a84c, #8a6e2a)',
                    border: 'none', borderRadius: '8px',
                    color: '#080808', fontSize: '13px', fontWeight: '600',
                    cursor: sending ? 'not-allowed' : 'pointer', opacity: sending ? 0.6 : 1,
                  }}
                >Send</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
