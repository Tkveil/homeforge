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

const STAGES = ['Application', 'Processing', 'Underwriting', 'Conditional Approval', 'Clear to Close', 'Closed'];

export default function PipelineView({ user, isMobile }) {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    borrower: '', address: '', amount: '', type: 'Conventional',
    rate: '', stage: 'Application', ltv: '', fico: '', close_date: '', officer: '',
  });

  const fetchLoans = async () => {
    const { data } = await supabase.from('loans').select('*').order('created_at', { ascending: false });
    setLoans(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchLoans(); }, []);

  const addLoan = async () => {
    if (!form.borrower.trim()) return;
    setSaving(true);
    const { error } = await supabase.from('loans').insert({
      borrower: form.borrower.trim(),
      address: form.address.trim() || null,
      amount: form.amount ? Number(form.amount) : null,
      type: form.type,
      rate: form.rate.trim() || null,
      stage: form.stage,
      ltv: form.ltv.trim() || null,
      fico: form.fico.trim() || null,
      close_date: form.close_date || null,
      officer: form.officer.trim() || user.name,
      agent_name: user.name,
      progress: Math.round(((STAGES.indexOf(form.stage) + 1) / STAGES.length) * 100),
    });
    setSaving(false);
    if (!error) {
      setForm({ borrower: '', address: '', amount: '', type: 'Conventional', rate: '', stage: 'Application', ltv: '', fico: '', close_date: '', officer: '' });
      setShowAdd(false);
      fetchLoans();
    }
  };

  if (!can(user.role, 'VIEW_LOAN_PIPELINE')) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
        <div style={{ textAlign: 'center', color: '#4a4845' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⊘</div>
          <div>You don&apos;t have access to the loan pipeline.</div>
        </div>
      </div>
    );
  }

  const volume = loans.reduce((a, l) => a + (Number(l.amount) || 0), 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: '400', color: '#f0ede8' }}>
          Loan Pipeline
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '12px', color: '#4a4845', fontFamily: 'DM Mono, monospace' }}>
            {loans.length} active · ${(volume / 1000000).toFixed(1)}M in volume
          </div>
          {can(user.role, 'EDIT_LOAN_DATA') && (
            <button
              onClick={() => setShowAdd(!showAdd)}
              style={{
                padding: '10px 20px',
                background: showAdd ? '#1a1a1a' : 'linear-gradient(135deg, #c9a84c, #8a6e2a)',
                border: showAdd ? '1px solid #242424' : 'none',
                borderRadius: '8px',
                color: showAdd ? '#f0ede8' : '#080808',
                fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              }}
            >{showAdd ? 'Cancel' : '+ New Loan'}</button>
          )}
        </div>
      </div>

      {showAdd && (
        <div style={{ background: '#0f0f0f', border: '1px solid #242424', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', color: '#f0ede8', marginBottom: '16px' }}>New Loan</h3>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Borrower *</label>
              <input value={form.borrower} onChange={e => setForm(p => ({ ...p, borrower: e.target.value }))} placeholder="Robert Thompson" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Property address</label>
              <input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="142 Maple St" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Loan amount</label>
              <input type="number" value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} placeholder="388000" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Type</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} style={inputStyle}>
                {['Conventional', 'FHA', 'VA', 'Jumbo', 'Cash', 'USDA'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Rate</label>
              <input value={form.rate} onChange={e => setForm(p => ({ ...p, rate: e.target.value }))} placeholder="6.875%" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Stage</label>
              <select value={form.stage} onChange={e => setForm(p => ({ ...p, stage: e.target.value }))} style={inputStyle}>
                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>LTV</label>
              <input value={form.ltv} onChange={e => setForm(p => ({ ...p, ltv: e.target.value }))} placeholder="80%" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>FICO</label>
              <input value={form.fico} onChange={e => setForm(p => ({ ...p, fico: e.target.value }))} placeholder="748" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Close date</label>
              <input type="date" value={form.close_date} onChange={e => setForm(p => ({ ...p, close_date: e.target.value }))} style={{ ...inputStyle, colorScheme: 'dark' }} />
            </div>
          </div>
          <button
            onClick={addLoan}
            disabled={saving || !form.borrower.trim()}
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #c9a84c, #8a6e2a)',
              border: 'none', borderRadius: '8px',
              color: '#080808', fontSize: '13px', fontWeight: '600',
              cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1,
            }}
          >{saving ? 'Saving…' : 'Save Loan'}</button>
        </div>
      )}

      {loading ? (
        <div style={{ color: '#4a4845', fontFamily: 'DM Mono, monospace', fontSize: '13px', padding: '40px 0', textAlign: 'center' }}>
          Loading pipeline…
        </div>
      ) : loans.length === 0 ? (
        <div style={{ color: '#4a4845', fontSize: '14px', padding: '40px 0', textAlign: 'center' }}>
          No loans in the pipeline yet.
        </div>
      ) : (
        <>
          {/* Kanban-style stage header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${STAGES.length}, ${isMobile ? '200px' : '1fr'})`,
            gap: '8px', marginBottom: '24px',
            ...(isMobile ? { overflowX: 'auto', paddingBottom: '8px' } : {}),
          }}>
            {STAGES.map(stage => {
              const count = loans.filter(l => l.stage === stage).length;
              return (
                <div key={stage} style={{
                  padding: '10px 12px',
                  background: count > 0 ? '#0f0f0f' : 'transparent',
                  border: `1px solid ${count > 0 ? '#1a1a1a' : '#0f0f0f'}`,
                  borderRadius: '8px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '11px', color: count > 0 ? '#f0ede8' : '#4a4845', fontFamily: 'DM Mono, monospace', marginBottom: '4px' }}>
                    {stage}
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: count > 0 ? '#c9a84c' : '#242424' }}>
                    {count}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Loan cards */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(340px, 1fr))', gap: '14px' }}>
            {loans.map(l => (
              <div key={l.id} style={{
                background: '#0f0f0f', border: '1px solid #1a1a1a',
                borderRadius: '12px', padding: '20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '500', color: '#f0ede8' }}>{l.borrower}</div>
                    <div style={{ fontSize: '12px', color: '#8a8580' }}>{l.address || '—'}</div>
                  </div>
                  <span style={{
                    fontSize: '10px', fontFamily: 'DM Mono, monospace',
                    color: '#c9a84c', border: '1px solid #c9a84c44',
                    borderRadius: '4px', padding: '2px 8px', alignSelf: 'flex-start',
                  }}>{l.stage}</span>
                </div>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: '#4a4845', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase' }}>Amount</div>
                    <div style={{ fontSize: '15px', color: '#f0ede8', fontFamily: 'DM Mono, monospace' }}>
                      {l.amount ? `$${Number(l.amount).toLocaleString()}` : '—'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#4a4845', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase' }}>Type</div>
                    <div style={{ fontSize: '13px', color: '#f0ede8' }}>{l.type || '—'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#4a4845', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase' }}>Rate</div>
                    <div style={{ fontSize: '13px', color: '#f0ede8' }}>{l.rate || '—'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#4a4845', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase' }}>FICO</div>
                    <div style={{ fontSize: '13px', color: '#f0ede8' }}>{l.fico || '—'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ flex: 1, height: '3px', background: '#1a1a1a', borderRadius: '2px' }}>
                    <div style={{
                      height: '100%', borderRadius: '2px',
                      background: 'linear-gradient(to right, #38a169, #2f855a)',
                      width: `${l.progress || 0}%`,
                    }} />
                  </div>
                  <span style={{ fontSize: '11px', color: '#4a4845', fontFamily: 'DM Mono, monospace' }}>{l.progress || 0}%</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                  <span style={{ fontSize: '11px', color: '#4a4845' }}>Officer: {l.officer || '—'}</span>
                  <span style={{ fontSize: '11px', color: '#4a4845' }}>
                    {l.close_date ? `Close ${new Date(l.close_date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
