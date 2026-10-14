import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { can } from '../../lib/roles';

const inputStyle = {
  width: '100%', padding: '10px 14px',
  background: '#141414', border: '1px solid #242424',
  borderRadius: '8px', color: '#f0ede8', fontSize: '14px',
};

const labelStyle = {
  display: 'block', fontSize: '11px', color: '#4a4845',
  fontFamily: 'DM Mono, monospace', textTransform: 'uppercase',
  letterSpacing: '0.08em', marginBottom: '6px',
};

const STAGE_ORDER = ['New', 'Under Contract', 'Inspection', 'Appraisal', 'Loan Approval', 'In Escrow', 'Closed'];

export default function TransactionsView({ user, isMobile }) {
  const [transactions, setTransactions] = useState([]);
  const [taskCounts, setTaskCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ address: '', client: '', stage: 'New', close_date: '', price: '', agent_name: '', mlo: '' });

  const fetchAll = async () => {
    const [{ data: txData }, { data: taskData }] = await Promise.all([
      supabase.from('transactions').select('*').order('created_at', { ascending: false }),
      supabase.from('tasks').select('id, transaction_id').eq('completed', false),
    ]);
    setTransactions(txData || []);
    const counts = {};
    (taskData || []).forEach(t => {
      if (t.transaction_id) counts[t.transaction_id] = (counts[t.transaction_id] || 0) + 1;
    });
    setTaskCounts(counts);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const addTransaction = async () => {
    if (!form.address.trim()) return;
    setSaving(true);
    const { error } = await supabase.from('transactions').insert({
      agent_id: user.id,
      address: form.address.trim(),
      client: form.client.trim() || null,
      stage: form.stage,
      close_date: form.close_date || null,
      price: form.price ? Number(form.price) : null,
      agent_name: form.agent_name.trim() || user.name,
      mlo: form.mlo.trim() || null,
      status: 'active',
    });
    setSaving(false);
    if (!error) {
      setForm({ address: '', client: '', stage: 'New', close_date: '', price: '', agent_name: '', mlo: '' });
      setShowForm(false);
      fetchAll();
    }
  };

  const filtered = transactions.filter(t =>
    filter === 'all' ? true : t.status === filter
  );

  const tx = selected ? transactions.find(t => t.id === selected) : null;
  const showPII = can(user.role, 'VIEW_PII');

  const stageIndex = (stage) => {
    const i = STAGE_ORDER.indexOf(stage);
    return i === -1 ? 0 : i;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: '400', color: '#f0ede8' }}>
          Transactions
        </h1>
        {can(user.role, 'CREATE_TRANSACTION') && (
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: '10px 20px',
              background: showForm ? '#1a1a1a' : 'linear-gradient(135deg, #c9a84c, #8a6e2a)',
              border: showForm ? '1px solid #242424' : 'none',
              borderRadius: '8px',
              color: showForm ? '#f0ede8' : '#080808',
              fontSize: '13px', fontWeight: '600', cursor: 'pointer',
            }}
          >
            {showForm ? 'Cancel' : '+ New Transaction'}
          </button>
        )}
      </div>

      {showForm && (
        <div style={{ background: '#0f0f0f', border: '1px solid #242424', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', color: '#f0ede8', marginBottom: '16px' }}>New Transaction</h3>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div style={{ gridColumn: isMobile ? 'auto' : '1 / -1' }}>
              <label style={labelStyle}>Property address *</label>
              <input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="142 Maple Street, Austin TX 78701" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Client name</label>
              <input value={form.client} onChange={e => setForm(p => ({ ...p, client: e.target.value }))} placeholder="Robert Thompson" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Stage</label>
              <select value={form.stage} onChange={e => setForm(p => ({ ...p, stage: e.target.value }))} style={inputStyle}>
                {STAGE_ORDER.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Close date</label>
              <input type="date" value={form.close_date} onChange={e => setForm(p => ({ ...p, close_date: e.target.value }))} style={{ ...inputStyle, colorScheme: 'dark' }} />
            </div>
            <div>
              <label style={labelStyle}>Price</label>
              <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="485000" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Agent</label>
              <input value={form.agent_name} onChange={e => setForm(p => ({ ...p, agent_name: e.target.value }))} placeholder={user.name} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>MLO</label>
              <input value={form.mlo} onChange={e => setForm(p => ({ ...p, mlo: e.target.value }))} placeholder="Lender name" style={inputStyle} />
            </div>
          </div>
          <button
            onClick={addTransaction}
            disabled={saving || !form.address.trim()}
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #c9a84c, #8a6e2a)',
              border: 'none', borderRadius: '8px',
              color: '#080808', fontSize: '13px', fontWeight: '600',
              cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1,
            }}
          >{saving ? 'Saving…' : 'Save Transaction'}</button>
        </div>
      )}

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

      {loading ? (
        <div style={{ color: '#4a4845', fontFamily: 'DM Mono, monospace', fontSize: '13px', padding: '40px 0', textAlign: 'center' }}>
          Loading transactions…
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ color: '#4a4845', fontSize: '14px', padding: '40px 0', textAlign: 'center' }}>
          No transactions yet. Add your first one above.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : (tx ? '1fr 400px' : '1fr'), gap: '20px' }}>
          {/* List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map(t => {
              const progress = Math.round(((stageIndex(t.stage) + 1) / STAGE_ORDER.length) * 100);
              return (
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
                        {t.client || 'No client'} · {t.agent_name || '—'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '16px', color: '#c9a84c', textAlign: 'right' }}>
                        {t.price ? `$${Number(t.price).toLocaleString()}` : '—'}
                      </div>
                      <div style={{ fontSize: '11px', color: '#4a4845', textAlign: 'right' }}>
                        {t.close_date ? `Close ${new Date(t.close_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'No close date'}
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
                      {taskCounts[t.id] || 0} open tasks
                    </span>

                    <div style={{ flex: 1, height: '3px', background: '#1a1a1a', borderRadius: '2px' }}>
                      <div style={{
                        height: '100%', borderRadius: '2px',
                        background: 'linear-gradient(to right, #c9a84c, #8a6e2a)',
                        width: `${progress}%`,
                      }} />
                    </div>
                    <span style={{ fontSize: '11px', color: '#4a4845', fontFamily: 'DM Mono, monospace' }}>{progress}%</span>
                  </div>
                </div>
              );
            })}
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
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '18px', color: '#c9a84c' }}>
                  {tx.price ? `$${Number(tx.price).toLocaleString()}` : '—'}
                </div>
              </div>

              {/* Client info (PII protected) */}
              <div style={{
                background: '#141414', border: '1px solid #1a1a1a',
                borderRadius: '8px', padding: '16px', marginBottom: '16px',
              }}>
                <div style={{ fontSize: '11px', color: '#4a4845', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                  Client
                </div>
                <div style={{ fontSize: '14px', color: '#f0ede8', marginBottom: '6px' }}>
                  {showPII ? (tx.client || '—') : (tx.client ? tx.client[0] + '. ' + (tx.client.split(' ')[1] || '') : '—')}
                </div>
                {!showPII && (
                  <div style={{ fontSize: '11px', color: '#242424' }}>· PII protected</div>
                )}
              </div>

              {/* Stage timeline */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: '#4a4845', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                  Progress
                </div>
                {STAGE_ORDER.map((s, i) => {
                  const done = i <= stageIndex(tx.stage);
                  const current = s === tx.stage;
                  return (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <div style={{
                        width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                        background: done ? 'linear-gradient(135deg, #c9a84c, #8a6e2a)' : '#1a1a1a',
                        border: done ? 'none' : '1px solid #242424',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '10px', color: done ? '#080808' : '#4a4845',
                      }}>
                        {done ? '✓' : '○'}
                      </div>
                      <span style={{
                        fontSize: '13px',
                        color: current ? '#c9a84c' : done ? '#f0ede8' : '#8a8580',
                        fontWeight: current ? '600' : '400',
                      }}>{s}</span>
                    </div>
                  );
                })}
              </div>

              {/* Team */}
              <div>
                <div style={{ fontSize: '11px', color: '#4a4845', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                  Team
                </div>
                {[
                  { label: 'Agent', name: tx.agent_name, color: '#4a90d9' },
                  { label: 'MLO', name: tx.mlo, color: '#38a169' },
                ].map(m => (
                  <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '10px', color: m.color, fontFamily: 'DM Mono, monospace', width: '36px' }}>{m.label}</span>
                    <span style={{ fontSize: '13px', color: '#f0ede8' }}>{m.name || '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
