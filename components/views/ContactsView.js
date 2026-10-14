import { useState } from 'react';
import { can } from '../../lib/roles';

const CONTACTS = [
  { id: 1, name: 'Robert Thompson', type: 'buyer', stage: 'Under Contract', phone: '(512) 555-8204', email: 'r.thompson@gmail.com', address: '142 Maple St', agent: 'Sarah Mills', notes: 'Pre-approved $520k. Flexible on close date.', bgCheck: true },
  { id: 2, name: 'Michael Johnson', type: 'buyer', stage: 'Active', phone: '(512) 555-0391', email: 'm.johnson@gmail.com', address: '89 Oak Ave', agent: 'Sarah Mills', notes: 'Cash buyer. Tight timeline.', bgCheck: true },
  { id: 3, name: 'Patricia Martinez', type: 'buyer', stage: 'Loan Approval', phone: '(512) 555-7722', email: 'p.martinez@gmail.com', address: '310 Cedar Ln', agent: 'Sarah Mills', notes: 'FHA loan. First-time buyer.', bgCheck: false },
  { id: 4, name: 'David Chen', type: 'seller', stage: 'Listed', phone: '(737) 555-4411', email: 'd.chen@outlook.com', address: '18 Elm Street', agent: 'Sarah Mills', notes: 'Motivated seller. 60-day close preferred.', bgCheck: false },
  { id: 5, name: 'Linda Williams', type: 'buyer', stage: 'In Escrow', phone: '(512) 555-9982', email: 'l.williams@gmail.com', address: '55 Birch Ct', agent: 'Sarah Mills', notes: 'Relocation from Chicago. Kids start school Jan 1.', bgCheck: true },
];

export default function ContactsView({ user }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  const filtered = CONTACTS.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.type === filter;
    return matchSearch && matchFilter;
  });

  const contact = selected ? CONTACTS.find(c => c.id === selected) : null;
  const showPII = can(user.role, 'VIEW_PII');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: '400', color: '#f0ede8' }}>
          Contacts
        </h1>
        {can(user.role, 'EDIT_CONTACTS') && (
          <button style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #c9a84c, #8a6e2a)',
            border: 'none', borderRadius: '8px',
            color: '#080808', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
          }}>+ New Contact</button>
        )}
      </div>

      {/* Search + filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by name or address..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, padding: '10px 16px',
            background: '#141414', border: '1px solid #1a1a1a',
            borderRadius: '8px', color: '#f0ede8', fontSize: '14px',
          }}
        />
        {['all', 'buyer', 'seller'].map(f => (
          <button key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px',
              background: filter === f ? '#1a1a1a' : 'none',
              border: `1px solid ${filter === f ? '#242424' : '#1a1a1a'}`,
              borderRadius: '20px', color: filter === f ? '#f0ede8' : '#8a8580',
              fontSize: '12px', fontFamily: 'DM Mono, monospace',
              cursor: 'pointer', textTransform: 'capitalize',
            }}
          >{f}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: contact ? '1fr 360px' : '1fr', gap: '20px' }}>
        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px', alignContent: 'start' }}>
          {filtered.map(c => (
            <div key={c.id}
              onClick={() => setSelected(selected === c.id ? null : c.id)}
              style={{
                background: selected === c.id ? '#141414' : '#0f0f0f',
                border: `1px solid ${selected === c.id ? '#c9a84c44' : '#1a1a1a'}`,
                borderRadius: '12px', padding: '20px',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (selected !== c.id) { e.currentTarget.style.borderColor = '#242424'; e.currentTarget.style.background = '#141414'; } }}
              onMouseLeave={e => { if (selected !== c.id) { e.currentTarget.style.borderColor = '#1a1a1a'; e.currentTarget.style.background = '#0f0f0f'; } }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: c.type === 'buyer' ? 'rgba(74,144,217,0.15)' : 'rgba(201,168,76,0.15)',
                    border: `1px solid ${c.type === 'buyer' ? '#4a90d944' : '#c9a84c44'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: '600',
                    color: c.type === 'buyer' ? '#4a90d9' : '#c9a84c',
                  }}>
                    {c.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#f0ede8' }}>{c.name}</div>
                    <div style={{ fontSize: '11px', color: '#4a4845' }}>{c.address}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {c.bgCheck && (
                    <span title="Background check verified" style={{
                      fontSize: '11px', color: '#38a169',
                      border: '1px solid #38a16944', borderRadius: '4px', padding: '2px 6px',
                      fontFamily: 'DM Mono, monospace',
                    }}>✓ BGC</span>
                  )}
                  <span style={{
                    fontSize: '10px', fontFamily: 'DM Mono, monospace',
                    color: c.type === 'buyer' ? '#4a90d9' : '#c9a84c',
                    border: `1px solid ${c.type === 'buyer' ? '#4a90d944' : '#c9a84c44'}`,
                    borderRadius: '4px', padding: '2px 6px', textTransform: 'capitalize',
                  }}>{c.type}</span>
                </div>
              </div>
              <div style={{
                display: 'inline-block', padding: '3px 10px',
                background: 'rgba(56,161,105,0.1)', border: '1px solid rgba(56,161,105,0.25)',
                borderRadius: '20px', fontSize: '11px', color: '#38a169',
                fontFamily: 'DM Mono, monospace',
              }}>{c.stage}</div>
            </div>
          ))}
        </div>

        {/* Detail */}
        {contact && (
          <div style={{
            background: '#0f0f0f', border: '1px solid #1a1a1a',
            borderRadius: '12px', padding: '24px',
            position: 'sticky', top: 0, alignSelf: 'flex-start',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '20px', color: '#f0ede8' }}>{contact.name}</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#4a4845', cursor: 'pointer', fontSize: '18px' }}>×</button>
            </div>

            {[
              { label: 'Type', value: contact.type, cap: true },
              { label: 'Stage', value: contact.stage },
              { label: 'Agent', value: contact.agent },
              { label: 'Address', value: contact.address },
              { label: 'Phone', value: showPII ? contact.phone : '(512) ••• ••••', pii: !showPII },
              { label: 'Email', value: showPII ? contact.email : '••••••@••••.com', pii: !showPII },
            ].map(row => (
              <div key={row.label} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '10px 0', borderBottom: '1px solid #141414',
              }}>
                <span style={{ fontSize: '12px', color: '#4a4845', fontFamily: 'DM Mono, monospace' }}>{row.label}</span>
                <span style={{
                  fontSize: '13px',
                  color: row.pii ? '#4a4845' : '#f0ede8',
                  textTransform: row.cap ? 'capitalize' : 'none',
                }}>
                  {row.value}
                  {row.pii && <span style={{ fontSize: '10px', color: '#242424', marginLeft: '6px' }}>· protected</span>}
                </span>
              </div>
            ))}

            {contact.notes && (
              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '11px', color: '#4a4845', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Notes</div>
                <div style={{
                  background: '#141414', border: '1px solid #1a1a1a',
                  borderRadius: '8px', padding: '12px',
                  fontSize: '13px', color: '#8a8580', lineHeight: '1.6',
                }}>{contact.notes}</div>
              </div>
            )}

            {contact.bgCheck && (
              <div style={{
                marginTop: '16px', padding: '12px',
                background: 'rgba(56,161,105,0.08)',
                border: '1px solid rgba(56,161,105,0.2)',
                borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <span style={{ color: '#38a169' }}>✓</span>
                <span style={{ fontSize: '12px', color: '#38a169' }}>Background check verified</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
