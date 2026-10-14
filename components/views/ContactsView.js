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

export default function ContactsView({ user, isMobile }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'buyer', phone: '', email: '', address: '', notes: '' });

  const fetchContacts = async () => {
    const { data } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });
    setContacts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchContacts(); }, []);

  const addContact = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    const { error } = await supabase.from('contacts').insert({
      agent_id: user.id,
      name: form.name.trim(),
      type: form.type,
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      address: form.address.trim() || null,
      notes: form.notes.trim() || null,
    });
    setSaving(false);
    if (!error) {
      setForm({ name: '', type: 'buyer', phone: '', email: '', address: '', notes: '' });
      setShowAdd(false);
      fetchContacts();
    }
  };

  const filtered = contacts.filter(c => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.address || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.type === filter;
    return matchSearch && matchFilter;
  });

  const contact = selected ? contacts.find(c => c.id === selected) : null;
  const showPII = can(user.role, 'VIEW_PII');
  const canEdit = can(user.role, 'EDIT_CONTACTS');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: '400', color: '#f0ede8' }}>
          Contacts
        </h1>
        {canEdit && (
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
          >{showAdd ? 'Cancel' : '+ New Contact'}</button>
        )}
      </div>

      {showAdd && (
        <div style={{ background: '#0f0f0f', border: '1px solid #242424', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '18px', color: '#f0ede8', marginBottom: '16px' }}>New Contact</h3>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={labelStyle}>Name *</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Full name" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Type</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} style={inputStyle}>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="lead">Lead</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Phone</label>
              <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="(512) 555-0100" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="name@email.com" style={inputStyle} />
            </div>
            <div style={{ gridColumn: isMobile ? 'auto' : '1 / -1' }}>
              <label style={labelStyle}>Address</label>
              <input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="123 Main St" style={inputStyle} />
            </div>
            <div style={{ gridColumn: isMobile ? 'auto' : '1 / -1' }}>
              <label style={labelStyle}>Notes</label>
              <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Pre-approved, timeline, preferences…" rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
          </div>
          <button
            onClick={addContact}
            disabled={saving || !form.name.trim()}
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #c9a84c, #8a6e2a)',
              border: 'none', borderRadius: '8px',
              color: '#080808', fontSize: '13px', fontWeight: '600',
              cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1,
            }}
          >{saving ? 'Saving…' : 'Save Contact'}</button>
        </div>
      )}

      {/* Search + filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by name or address..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: '180px', padding: '10px 16px',
            background: '#141414', border: '1px solid #1a1a1a',
            borderRadius: '8px', color: '#f0ede8', fontSize: '14px',
          }}
        />
        {['all', 'buyer', 'seller', 'lead'].map(f => (
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

      {loading ? (
        <div style={{ color: '#4a4845', fontFamily: 'DM Mono, monospace', fontSize: '13px', padding: '40px 0', textAlign: 'center' }}>
          Loading contacts…
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ color: '#4a4845', fontSize: '14px', padding: '40px 0', textAlign: 'center' }}>
          No contacts yet. Add your first one above.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : (contact ? '1fr 360px' : '1fr'), gap: '20px' }}>
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
                      {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#f0ede8' }}>{c.name}</div>
                      <div style={{ fontSize: '11px', color: '#4a4845' }}>{c.address || '—'}</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '10px', fontFamily: 'DM Mono, monospace',
                    color: c.type === 'buyer' ? '#4a90d9' : '#c9a84c',
                    border: `1px solid ${c.type === 'buyer' ? '#4a90d944' : '#c9a84c44'}`,
                    borderRadius: '4px', padding: '2px 6px', textTransform: 'capitalize',
                  }}>{c.type}</span>
                </div>
                {c.notes && (
                  <div style={{ fontSize: '12px', color: '#8a8580', lineHeight: '1.5', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {c.notes}
                  </div>
                )}
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
                { label: 'Address', value: contact.address || '—' },
                { label: 'Phone', value: showPII ? (contact.phone || '—') : (contact.phone ? contact.phone.slice(0, 5) + ' ••• ••••' : '—'), pii: !showPII && !!contact.phone },
                { label: 'Email', value: showPII ? (contact.email || '—') : (contact.email ? '••••••@••••.com' : '—'), pii: !showPII && !!contact.email },
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
                    textAlign: 'right',
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}
