import { can } from '../../lib/roles';

const LOANS = [
  { id: 1, borrower: 'Robert Thompson', address: '142 Maple St', amount: 388000, type: 'Conventional', rate: '6.875%', stage: 'Processing', ltv: '80%', fico: 748, close: 'Nov 14', officer: 'Chris Vega', agent: 'Sarah Mills', progress: 55 },
  { id: 2, borrower: 'Michael Johnson', address: '89 Oak Ave', amount: 0, type: 'Cash', rate: 'N/A', stage: 'Clear to Close', ltv: 'N/A', fico: 'N/A', close: 'Nov 21', officer: 'N/A', agent: 'Sarah Mills', progress: 90 },
  { id: 3, borrower: 'Patricia Martinez', address: '310 Cedar Ln', amount: 386060, type: 'FHA', rate: '6.625%', stage: 'Underwriting', ltv: '96.5%', fico: 682, close: 'Nov 30', officer: 'Chris Vega', agent: 'Sarah Mills', progress: 40 },
  { id: 4, borrower: 'Linda Williams', address: '55 Birch Ct', amount: 712800, type: 'Jumbo', rate: '7.125%', stage: 'Conditional Approval', ltv: '80%', fico: 792, close: 'Dec 7', officer: 'Chris Vega', agent: 'Sarah Mills', progress: 70 },
];

const STAGES = ['Application', 'Processing', 'Underwriting', 'Conditional Approval', 'Clear to Close', 'Closed'];

export default function PipelineView({ user }) {
  if (!can(user.role, 'VIEW_LOAN_PIPELINE')) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
        <div style={{ textAlign: 'center', color: '#4a4845' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>⊘</div>
          <div>You don't have access to the loan pipeline.</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: '400', color: '#f0ede8' }}>
          Loan Pipeline
        </h1>
        <div style={{ fontSize: '12px', color: '#4a4845', fontFamily: 'DM Mono, monospace' }}>
          {LOANS.length} active · ${(LOANS.reduce((a, l) => a + (l.amount || 0), 0) / 1000000).toFixed(1)}M in volume
        </div>
      </div>

      {/* Kanban-style stage header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${STAGES.length}, 1fr)`,
        gap: '8px', marginBottom: '24px',
      }}>
        {STAGES.map(stage => {
          const count = LOANS.filter(l => l.stage === stage).length;
          return (
            <div key={stage} style={{
              padding: '10px 12px',
              background: count > 0 ? '#0f0f0f' : 'transparent',
              border: `1px solid ${count > 0 ? '#1a1a1a' : '#0f0f0f'}`,
              borderRadius: '8px', textAlign: 'center',
            }}>
              <div style={{ fontSize: '11px', color: count > 0 ? '#8a8580' : '#242424', fontFamily: 'DM Mono, monospace', marginBottom: '4px' }}>{stage}</div>
              {count > 0 && (
                <div style={{ fontSize: '18px', fontFamily: 'Cormorant Garamond, serif', color: '#f0ede8' }}>{count}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Loan cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {LOANS.map(loan => (
          <div key={loan.id} style={{
            background: '#0f0f0f', border: '1px solid #1a1a1a',
            borderRadius: '12px', padding: '22px',
            transition: 'border-color 0.15s', cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#242424'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#1a1a1a'}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '15px', fontWeight: '500', color: '#f0ede8', marginBottom: '3px' }}>
                  {loan.borrower} — {loan.address}
                </div>
                <div style={{ fontSize: '12px', color: '#8a8580' }}>
                  Agent: {loan.agent} {loan.officer !== 'N/A' && `· MLO: ${loan.officer}`}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '16px', color: '#c9a84c' }}>
                  {loan.amount > 0 ? `$${loan.amount.toLocaleString()}` : 'Cash'}
                </div>
                <div style={{ fontSize: '11px', color: '#4a4845' }}>Close {loan.close}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '16px' }}>
              {[
                { label: 'Type', value: loan.type },
                { label: 'Rate', value: loan.rate },
                { label: 'LTV', value: loan.ltv },
                { label: 'FICO', value: loan.fico },
                { label: 'Stage', value: loan.stage },
              ].map(item => (
                <div key={item.label} style={{
                  background: '#141414', borderRadius: '8px', padding: '10px 12px',
                }}>
                  <div style={{ fontSize: '10px', color: '#4a4845', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{
                    fontSize: '13px',
                    color: item.label === 'Stage' ? '#c9a84c' :
                           item.label === 'FICO' && loan.fico >= 740 ? '#38a169' :
                           item.label === 'FICO' && loan.fico >= 680 ? '#c9a84c' : '#f0ede8',
                    fontFamily: item.label === 'Rate' || item.label === 'LTV' ? 'DM Mono, monospace' : 'inherit',
                  }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, height: '4px', background: '#1a1a1a', borderRadius: '2px' }}>
                <div style={{
                  height: '100%', borderRadius: '2px',
                  background: loan.progress >= 90 ? '#38a169' : 'linear-gradient(to right, #c9a84c, #8a6e2a)',
                  width: `${loan.progress}%`, transition: 'width 0.5s ease',
                }} />
              </div>
              <span style={{ fontSize: '11px', color: '#4a4845', fontFamily: 'DM Mono, monospace' }}>{loan.progress}% complete</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
