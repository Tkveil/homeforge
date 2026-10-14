import { useState } from 'react';

const MOCK_TASKS = [
  { id: 1, title: 'Request HOA docs — 142 Maple St', due: 'Today', priority: 'urgent', type: 'doc' },
  { id: 2, title: 'Send disclosures — Johnson file', due: 'Today', priority: 'urgent', type: 'doc' },
  { id: 3, title: 'Follow up: lender approval — Martinez', due: 'Tomorrow', priority: 'high', type: 'call' },
  { id: 4, title: 'Schedule inspection — 89 Oak Ave', due: 'Tomorrow', priority: 'high', type: 'schedule' },
  { id: 5, title: 'Review counter offer — Williams', due: 'Thu', priority: 'medium', type: 'review' },
  { id: 6, title: 'Upload executed contract — Chen file', due: 'Fri', priority: 'medium', type: 'doc' },
  { id: 7, title: 'Commission disbursement form — 3 closes', due: 'Fri', priority: 'low', type: 'form' },
];

const MOCK_TRANSACTIONS = [
  { id: 1, address: '142 Maple Street', client: 'R. Thompson', stage: 'Under Contract', close: 'Nov 14', price: '$485,000', agent: 'S. Mills', mlo: 'C. Vega', status: 'active' },
  { id: 2, address: '89 Oak Avenue', client: 'M. Johnson', stage: 'Inspection', close: 'Nov 21', price: '$672,000', agent: 'S. Mills', mlo: 'C. Vega', status: 'active' },
  { id: 3, address: '310 Cedar Lane', client: 'P. Martinez', stage: 'Loan Approval', close: 'Nov 30', price: '$398,000', agent: 'S. Mills', mlo: 'C. Vega', status: 'pending' },
  { id: 4, address: '55 Birch Court', client: 'L. Williams', stage: 'In Escrow', close: 'Dec 7', price: '$891,000', agent: 'S. Mills', mlo: 'C. Vega', status: 'active' },
];

const STATS = [
  { label: 'Active Transactions', value: '12', delta: '+3', up: true },
  { label: 'Closing This Month', value: '4', delta: '$1.8M', up: true },
  { label: 'Pending Tasks', value: '7', delta: '3 urgent', up: false },
  { label: 'New Leads (7d)', value: '18', delta: '+6', up: true },
];

export default function DashboardHome({ user, setActiveView, taskCount }) {
  const [completedTasks, setCompletedTasks] = useState([]);

  const completeTask = (id) => {
    setCompletedTasks(prev => [...prev, id]);
  };

  const activeTasks = MOCK_TASKS.filter(t => !completedTasks.includes(t.id));

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontFamily: 'Cormorant Garamond, Georgia, serif',
          fontSize: '32px', fontWeight: '400',
          color: '#f0ede8', marginBottom: '4px',
        }}>
          Good morning, {user.name.split(' ')[0]}.
        </h1>
        <p style={{ color: '#4a4845', fontSize: '14px', fontFamily: 'DM Mono, monospace' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          {activeTasks.length > 0 && ` · ${activeTasks.filter(t => t.priority === 'urgent').length} urgent tasks need your attention`}
        </p>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px',
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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>

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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {MOCK_TRANSACTIONS.map(tx => (
              <div key={tx.id} style={{
                background: '#0f0f0f',
                border: '1px solid #1a1a1a',
                borderRadius: '12px', padding: '20px',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
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
                      {tx.client} · Agent: {tx.agent} · MLO: {tx.mlo}
                    </div>
                  </div>
                  <div style={{
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '14px', color: '#c9a84c', fontWeight: '500',
                  }}>{tx.price}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    padding: '4px 10px',
                    background: tx.status === 'active' ? 'rgba(56,161,105,0.1)' : 'rgba(201,168,76,0.1)',
                    border: `1px solid ${tx.status === 'active' ? 'rgba(56,161,105,0.3)' : 'rgba(201,168,76,0.3)'}`,
                    borderRadius: '20px',
                    color: tx.status === 'active' ? '#38a169' : '#c9a84c',
                    fontSize: '11px', fontFamily: 'DM Mono, monospace',
                    letterSpacing: '0.05em',
                  }}>{tx.stage}</div>
                  <div style={{ color: '#4a4845', fontSize: '12px' }}>
                    Closing {tx.close}
                  </div>

                  {/* Progress bar */}
                  <div style={{ flex: 1, height: '3px', background: '#1a1a1a', borderRadius: '2px', marginLeft: 'auto' }}>
                    <div style={{
                      height: '100%', borderRadius: '2px',
                      background: 'linear-gradient(to right, #c9a84c, #8a6e2a)',
                      width: tx.stage === 'Under Contract' ? '30%' :
                             tx.stage === 'Inspection' ? '45%' :
                             tx.stage === 'Loan Approval' ? '60%' :
                             tx.stage === 'In Escrow' ? '80%' : '20%',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
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
              {activeTasks.length > 0 && (
                <span style={{
                  background: '#e53e3e', color: 'white',
                  borderRadius: '50%', width: '22px', height: '22px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '11px', fontWeight: '700',
                  boxShadow: '0 0 12px rgba(229,62,62,0.5)',
                  animation: 'pulse-red 2s ease-in-out infinite',
                }}>
                  {activeTasks.length}
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
            {activeTasks.slice(0, 7).map((task, i) => {
              const priorityColor = task.priority === 'urgent' ? '#e53e3e' :
                                    task.priority === 'high' ? '#c9a84c' :
                                    task.priority === 'medium' ? '#4a90d9' : '#4a4845';
              return (
                <div key={task.id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '14px 18px',
                  borderBottom: i < activeTasks.slice(0,7).length - 1 ? '1px solid #141414' : 'none',
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
                        Due {task.due}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {activeTasks.length === 0 && (
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
