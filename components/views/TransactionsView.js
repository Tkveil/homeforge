import { useState } from 'react';
import { can } from '../../lib/roles';

const TRANSACTIONS = [
  {
    id: 1, address: '142 Maple Street, Austin TX 78701', client: 'Robert Thompson',
    clientEmail: '••••••@gmail.com', clientPhone: '(512) ••• ••••',
    stage: 'Under Contract', close: '2026-11-14', price: 485000,
    agent: 'Sarah Mills', mlo: 'Chris Vega', tc: 'Jordan Lee',
    progress: 30, status: 'active',
    timeline: [
      { date: 'Oct 1', event: 'Offer Accepted', done: true },
      { date: 'Oct 8', event: 'Inspection', done: true },
      { date: 'Oct 15', event: 'Appraisal', done: false },
      { date: 'Oct 28', event: 'Loan Approval', done: false },
      { date: 'Nov 14', event: 'Closing', done: false },
    ],
    tasks: 3, docs: 8,
  },
  {
    id: 2, address: '89 Oak Avenue, Austin TX 78704', client: 'Michael Johnson',
    clientEmail: '••••••@gmail.com', clientPhone: '(512) ••• ••••',
    stage: 'Inspection', close: '2026-11-21', price: 672000,
    agent: 'Sarah Mills', mlo: 'Chris Vega', tc: 'Jordan Lee',
    progress: 45, status: 'active',
    timeline: [
      { date: 'Sep 28', event: 'Offer Accepted', done: true },
      { date: 'Oct 10', event: 'Inspection', done: false },
      { date: 'Oct 20', event: 'Appraisal', done: false },
      { date: 'Nov 4', event: 'Loan Approval', done: false },
      { date: 'Nov 21', event: 'Closing', done: false },
    ],
    tasks: 4, docs: 5,
  },
  {
    id: 3, address: '310 Cedar Lane, Round Rock TX 78681', client: 'Patricia Martinez',
    clientEmail: '••••••@gmail.com', clientPhone: '(512) ••• ••••',
    stage: 'Loan Approval', close: '2026-11-30', price: 398000,
    agent: 'Sarah Mills', mlo: 'Chris Vega', tc: 'Jordan Lee',
    progress: 60, status: 'pending',
    timeline: [
      { date: 'Sep 20', event: 'Offer Accepted', done: true },
      { date: 'Sep 27', event: 'Inspection', done: true },
      { date: 'Oct 5', event: 'Appraisal', done: true },
      { date: 'Oct 18', event: 'Loan Approval', done: false },
      { date: 'Nov 30', event: 'Closing', done: false },
    ],
    tasks: 2, docs: 11,
  },
];

export default function TransactionsView({ user }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);

  const filtered = TRANSACTIONS.filter(t =>
    filter === 'all' ? true : t.status === filter
  );

  const tx = selected ? TRANSACTIONS.find(t => t.id === selected) : null;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: '400', color: '#f0ede8' }}>
          Transactions
        </h1>
        {can(user.role, 'CREATE_TRANSACTION') && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #c9a84c, #8a6e2a)',
              border: 'none', borderRadius: '8px',
              color: '#080808', fontSize: '13px', fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            + New Transaction
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {['all', 'active', 'pending', 'closed'].map(f => (
          <button key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 16px',
              background: filter === f ? '#1a1a1a' : 'none',
              border: `1px solid ${filter === f ? '#242424' : '#1a1a1a'}`,
              borderRadius: '20px',
              color: filter === f ? '#f0ede8' : '#8a8580',
              fontSize: '12px', fontFamily: 'DM Mono, monospace',
              cursor: 'pointer', letterSpacing: '0.05em',
              textTransform: 'capitalize',
            }}
          >{f}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: tx ? '1fr 400px' : '1fr', gap: '20px' }}>
        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(t => (
            <div key={t.id}
              onClick={() => setSelected(selected === t.id ? null : t.id)}
              style={{
                background: selected === t.id ? '#141414' : '#0f0f0f',
                border: `1px solid ${selected === t.id ? '#c9a84c44' : '#1a1a1a'}`,
                borderRadius: '12px', padding: '20px',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (selected !== t.id) { e.currentTarget.style.borderColor = '#242424'; e.currentTarget.style.background = '#141414'; } }}
              onMouseLeave={e => { if (selected !== t.id) { e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.background = '#0f0f0f'; } }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '500', color: '#f0ede8', marginBottom: '3px' }}>{t.address}</div>
                  <div style={{ fontSize: '12px', color: '#8a8580' }}>
                    {t.client} · {t.agent} · TC: {t.tc}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '16px', color: '#c9a84c', textAlign: 'right' }}>
                    ${t.price.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '11px', color: '#4a4845', textAlign: 'right' }}>
                    Close {new Date(t.close).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  padding: '3px 10px',
                  background: t.status === 'active' ? 'rgba(56,161,105,0.1)' : 'rgba(201,168,76,0.1)',
                  border: `1px solid ${t.status === 'active' ? 'rgba(56,161,105,0.3)' : 'rgba(201,168,76,0.3)'}`,
                  borderRadius: '20px', fontSize: '11px',
                  color: t.status === 'active' ? '#38a169' : '#c9a84c',
                  fontFamily: 'DM Mono, monospace',
                }}>{t.stage}</span>

                <span style={{ fontSize: '11px', color: '#4a4845' }}>
                  {t.tasks} tasks · {t.docs} docs
                </span>

                <div style={{ flex: 1, height: '3px', background: '#1a1a1a', borderRadius: '2px' }}>
                  <div style={{
                    height: '100%', borderRadius: '2px',
                    background: 'linear-gradient(to right, #c9a84c, #8a6e2a)',
                    width: `${t.progress}%`,
                  }} />
                </div>
                <span style={{ fontSize: '11px', color: '#4a4845', fontFamily: 'DM Mono, monospace' }}>{t.progress}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {tx && (
          <div style={{
            background: '#0f0f0f', border: '1px solid #1a1a1a',
            borderRadius: '12px', padding: '24px',
            position: 'sticky', top: 0, alignSelf: 'flex-start',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', color: '#f0ede8' }}>
                Transaction Detail
              </h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#4a4845', cursor: 'pointer', fontSize: '18px' }}>×</button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#f0ede8', marginBottom: '4px' }}>{tx.address}</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '18px', color: '#c9a84c' }}>${tx.price.toLocaleString()}</div>
            </div>

            {/* Client info (PII protected) */}
            <div style={{
              background: '#141414', border: '1px solid #1a1a1a',
              borderRadius: '8px', padding: '16px', marginBottom: '16px',
            }}>
              <div style={{ fontSize: '11px', color: '#4a4845', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                Client
              </div>
              <div style={{ fontSize: '14px', color: '#f0ede8', marginBottom: '6px' }}>{tx.client}</div>
              {can(user.role, 'VIEW_PII') ? (
                <>
                  <div style={{ fontSize: '12px', color: '#8a8580' }}>{tx.clientEmail.replace('••••••', 'robert.t')}</div>
                  <div style={{ fontSize: '12px', color: '#8a8580' }}>{tx.clientPhone.replace('(512) ••• ••••', '(512) 555-8204')}</div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '12px', color: '#4a4845' }}>{tx.clientEmail} <span style={{ color: '#242424', fontSize: '10px' }}>· PII protected</span></div>
                  <div style={{ fontSize: '12px', color: '#4a4845' }}>{tx.clientPhone} <span style={{ color: '#242424', fontSize: '10px' }}>· PII protected</span></div>
                </>
              )}
            </div>

            {/* Timeline */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: '#4a4845', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                Timeline
              </div>
              {tx.timeline.map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                    background: step.done ? 'linear-gradient(135deg, #c9a84c, #8a6e2a)' : '#1a1a1a',
                    border: step.done ? 'none' : '1px solid #242424',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px', color: step.done ? '#080808' : '#4a4845',
                  }}>
                    {step.done ? '✓' : '○'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '13px', color: step.done ? '#f0ede8' : '#8a8580' }}>{step.event}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#4a4845', fontFamily: 'DM Mono, monospace' }}>{step.date}</span>
                </div>
              ))}
            </div>

            {/* Team */}
            <div>
              <div style={{ fontSize: '11px', color: '#4a4845', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                Team
              </div>
              {[
                { label: 'Agent', name: tx.agent, color: '#4a90d9' },
                { label: 'TC', name: tx.tc, color: '#805ad5' },
                { label: 'MLO', name: tx.mlo, color: '#38a169' },
              ].map(m => (
                <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '10px', color: m.color, fontFamily: 'DM Mono, monospace', width: '36px' }}>{m.label}</span>
                  <span style={{ fontSize: '13px', color: '#f0ede8' }}>{m.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
