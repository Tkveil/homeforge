import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function DashboardHome({ user, setActiveView, isMobile }) {
  const [tasks, setTasks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const [{ data: taskData }, { data: txData }] = await Promise.all([
      supabase.from('tasks').select('*').eq('completed', false).order('due', { ascending: true, nullsFirst: false }),
      supabase.from('transactions').select('*').eq('status', 'active').order('close_date', { ascending: true, nullsFirst: false }).limit(5),
    ]);
    setTasks(taskData || []);
    setTransactions(txData || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const completeTask = async (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    await supabase.from('tasks').update({ completed: true }).eq('id', id);
  };

  const urgentCount = tasks.filter(t => t.priority === 'urgent').length;
  const closingThisMonth = transactions.filter(t => {
    if (!t.close_date) return false;
    const d = new Date(t.close_date + 'T12:00:00');
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const monthVolume = closingThisMonth.reduce((a, t) => a + (Number(t.price) || 0), 0);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = (user.name || '').split(' ')[0];

  const STATS = [
    { label: 'Active Transactions', value: String(transactions.length), delta: `${closingThisMonth.length} closing this month`, up: true },
    { label: 'Pipeline Volume', value: monthVolume >= 1000000 ? `$${(monthVolume / 1000000).toFixed(1)}M` : `$${Math.round(monthVolume / 1000)}k`, delta: 'closing this month', up: true },
    { label: 'Open Tasks', value: String(tasks.length), delta: urgentCount > 0 ? `${urgentCount} urgent` : 'all clear', up: urgentCount === 0 },
    { label: 'Urgent Tasks', value: String(urgentCount), delta: urgentCount > 0 ? 'need attention' : 'none', up: urgentCount === 0 },
  ];

  const dueLabel = (due) => {
    if (!due) return 'No due date';
    const d = new Date(due + 'T12:00:00');
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diff = Math.round((d - today) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    if (diff < 0) return `${Math.abs(diff)}d overdue`;
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontFamily: 'Cormorant Garamond, Georgia, serif',
          fontSize: '32px', fontWeight: '400',
          color: '#f0ede8', marginBottom: '4px',
        }}>
          {greeting}, {firstName}.
        </h1>
        <p style={{ color: '#4a4845', fontSize: '14px', fontFamily: 'DM Mono, monospace' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          {urgentCount > 0 && ` · ${urgentCount} urgent task${urgentCount === 1 ? '' : 's'} need${urgentCount === 1 ? 's' : ''} your attention`}
        </p>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '16px',
        marginBottom: '32px',
      }}>
        {STATS.map((stat, i) => (
          <div key={i} style={{
            background: '#0f0f0f',
            border: '1px solid #1a1a1a',
            borderRadius: '12px', padding: '20px 24px',
            transition: 'border-color 0.2s',
            cursor: 'default',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#242424'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#1a1a1a'}
          >
            <div style={{ fontSize: '11px', color: '#4a4845', fontFamily: 'DM Mono, monospace', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
              {stat.label}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '36px', fontWeight: '300',
                color: '#f0ede8', lineHeight: 1,
              }}>{stat.value}</span>
              <span style={{
                fontSize: '12px',
                color: stat.up ? '#38a169' : '#e53e3e',
                fontFamily: 'DM Mono, monospace',
              }}>{stat.delta}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 380px', gap: '24px' }}>

        {/* Transactions */}
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '16px',
          }}>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '20px', fontWeight: '400', color: '#f0ede8',
            }}>Active Transactions</h2>
            <button
              onClick={() => setActiveView('transactions')}
              style={{
                background: 'none', border: 'none',
                color: '#c9a84c', fontSize: '12px', cursor: 'pointer',
                fontFamily: 'DM Mono, monospace',
              }}
            >View all →</button>
          </div>

          {loading ? (
            <div style={{ color: '#4a4845', fontSize: '13px', fontFamily: 'DM Mono, monospace', padding: '20px 0' }}>
              Loading…
            </div>
          ) : transactions.length === 0 ? (
            <div style={{
              background: '#0f0f0f', border: '1px solid #1a1a1a',
              borderRadius: '12px', padding: '32px', textAlign: 'center',
              color: '#4a4845', fontSize: '13px',
            }}>
              No active transactions yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {transactions.map(tx => (
                <div key={tx.id} style={{
                  background: '#0f0f0f',
                  border: '1px solid #1a1a1a',
                  borderRadius: '12px', padding: '20px',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                onClick={() => setActiveView('transactions')}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#242424';
                  e.currentTarget.style.background = '#141414';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#1a1a1a';
                  e.currentTarget.style.background = '#0f0f0f';
                }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '500', color: '#f0ede8', marginBottom: '2px' }}>
                        {tx.address}
                      </div>
                      <div style={{ fontSize: '12px', color: '#8a8580' }}>
                        {tx.client || 'No client'} · {tx.agent_name || '—'}
                      </div>
                    </div>
                    <div style={{
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '14px', color: '#c9a84c', fontWeight: '500',
                    }}>{tx.price ? `$${Number(tx.price).toLocaleString()}` : '—'}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      padding: '4px 10px',
                      background: 'rgba(56,161,105,0.1)',
                      border: '1px solid rgba(56,161,105,0.3)',
                      borderRadius: '20px',
                      color: '#38a169',
                      fontSize: '11px', fontFamily: 'DM Mono, monospace',
                      letterSpacing: '0.05em',
                    }}>{tx.stage}</div>
                    <div style={{ color: '#4a4845', fontSize: '12px' }}>
                      {tx.close_date ? `Closing ${new Date(tx.close_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'No close date'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tasks sidebar */}
        <div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: '20px', fontWeight: '400', color: '#f0ede8',
              }}>My Tasks</h2>
              {tasks.length > 0 && (
                <span style={{
                  background: '#e53e3e', color: 'white',
                  borderRadius: '50%', width: '22px', height: '22px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: '700',
                  boxShadow: '0 0 12px rgba(229,62,62,0.5)',
                  animation: 'pulse-red 2s ease-in-out infinite',
                }}>
                  {tasks.length}
                </span>
              )}
            </div>
            <button
              onClick={() => setActiveView('tasks')}
              style={{
                background: 'none', border: 'none',
                color: '#c9a84c', fontSize: '12px', cursor: 'pointer',
                fontFamily: 'DM Mono, monospace',
              }}
            >View all →</button>
          </div>

          <div style={{
            background: '#0f0f0f',
            border: '1px solid #1a1a1a',
            borderRadius: '12px', overflow: 'hidden',
          }}>
            {tasks.slice(0, 7).map((task, i) => {
              const priorityColor = task.priority === 'urgent' ? '#e53e3e' :
                                    task.priority === 'high' ? '#c9a84c' :
                                    task.priority === 'medium' ? '#4a90d9' : '#4a4845';
              return (
                <div key={task.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '14px 18px',
                  borderBottom: i < tasks.slice(0, 7).length - 1 ? '1px solid #141414' : 'none',
                  transition: 'background 0.15s',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#141414'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Checkbox */}
                  <button
                    onClick={(e) => { e.stopPropagation(); completeTask(task.id); }}
                    style={{
                      width: '18px', height: '18px',
                      border: `1.5px solid ${priorityColor}`,
                      borderRadius: '4px',
                      background: 'transparent',
                      cursor: 'pointer', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = `${priorityColor}22`}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  />

                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{
                      fontSize: '13px', color: '#f0ede8',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      marginBottom: '2px',
                    }}>{task.title}</div>
                    <div style={{
                      display: 'flex', gap: '8px', alignItems: 'center',
                    }}>
                      <span style={{
                        fontSize: '10px', fontFamily: 'DM Mono, monospace',
                        color: priorityColor, textTransform: 'uppercase', letterSpacing: '0.05em',
                      }}>{task.priority}</span>
                      <span style={{ color: '#4a4845', fontSize: '11px' }}>
                        Due {dueLabel(task.due)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {tasks.length === 0 && (
              <div style={{
                padding: '32px', textAlign: 'center',
                color: '#4a4845', fontSize: '13px',
              }}>
                ✓ All tasks complete
              </div>
            )}
          </div>

          {/* Quick add task */}
          <button
            onClick={() => setActiveView('tasks')}
            style={{
              width: '100%', marginTop: '12px',
              padding: '12px',
              background: 'none',
              border: '1px dashed #242424',
              borderRadius: '10px',
              color: '#4a4845', fontSize: '13px',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#c9a84c';
              e.currentTarget.style.color = '#c9a84c';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#242424';
              e.currentTarget.style.color = '#4a4845';
            }}
          >
            + Add task
          </button>
        </div>
      </div>
    </div>
  );
}
