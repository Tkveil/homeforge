import { useState } from 'react';

const LISTINGS = [
  { id: 1, address: '2847 Westlake Dr', city: 'Austin, TX 78746', price: 1250000, beds: 4, baths: 3.5, sqft: 3200, type: 'Single Family', status: 'Active', days: 12, img: null, tags: ['Pool', 'Lake View', 'Updated Kitchen'] },
  { id: 2, address: '512 Congress Ave #804', city: 'Austin, TX 78701', price: 485000, beds: 2, baths: 2, sqft: 1180, type: 'Condo', status: 'Active', days: 3, img: null, tags: ['Downtown', 'City Views', 'Concierge'] },
  { id: 3, address: '18 Barton Hills Dr', city: 'Austin, TX 78704', price: 875000, beds: 3, baths: 2, sqft: 2100, type: 'Single Family', status: 'Active', days: 28, img: null, tags: ['Greenbelt', 'Renovated', 'Guest Suite'] },
  { id: 4, address: '4401 North Loop Blvd', city: 'Austin, TX 78756', price: 635000, beds: 3, baths: 2.5, sqft: 1870, type: 'Townhome', status: 'Pending', days: 8, img: null, tags: ['New Build', 'Smart Home'] },
  { id: 5, address: '9803 Lake Creek Pkwy', city: 'Austin, TX 78729', price: 392000, beds: 3, baths: 2, sqft: 1650, type: 'Single Family', status: 'Active', days: 45, img: null, tags: ['Move-In Ready', 'Large Yard'] },
  { id: 6, address: '3311 Red River St', city: 'Austin, TX 78705', price: 720000, beds: 4, baths: 3, sqft: 2400, type: 'Single Family', status: 'Active', days: 7, img: null, tags: ['Historic', 'Corner Lot', 'Garage Apt'] },
];

export default function IDXView({ user }) {
  const [search, setSearch] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [view, setView] = useState('grid');

  const filtered = LISTINGS.filter(l => {
    const matchSearch = l.address.toLowerCase().includes(search.toLowerCase()) ||
      l.city.toLowerCase().includes(search.toLowerCase()) ||
      l.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchPrice = !priceMax || l.price <= parseInt(priceMax);
    return matchSearch && matchPrice;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: '400', color: '#f0ede8' }}>
            IDX Listings
          </h1>
          <p style={{ fontSize: '12px', color: '#4a4845', fontFamily: 'DM Mono, monospace', marginTop: '2px' }}>
            Austin MLS · {LISTINGS.length} active listings · synced 4 min ago
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['grid', 'list'].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '8px 14px',
              background: view === v ? '#1a1a1a' : 'none',
              border: `1px solid ${view === v ? '#242424' : '#1a1a1a'}`,
              borderRadius: '8px', color: view === v ? '#f0ede8' : '#4a4845',
              fontSize: '14px', cursor: 'pointer', textTransform: 'capitalize',
            }}>{v === 'grid' ? '⊞' : '≡'}</button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <input
          placeholder="Search address, city, features..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, padding: '10px 16px',
            background: '#141414', border: '1px solid #1a1a1a',
            borderRadius: '8px', color: '#f0ede8', fontSize: '14px',
          }}
        />
        <input
          type="number"
          placeholder="Max price"
          value={priceMax}
          onChange={e => setPriceMax(e.target.value)}
          style={{
            width: '160px', padding: '10px 16px',
            background: '#141414', border: '1px solid #1a1a1a',
            borderRadius: '8px', color: '#f0ede8', fontSize: '14px',
          }}
        />
      </div>

      {/* Grid view */}
      {view === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
          {filtered.map(l => (
            <div key={l.id} style={{
              background: '#0f0f0f', border: '1px solid #1a1a1a',
              borderRadius: '14px', overflow: 'hidden',
              cursor: 'pointer', transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#242424'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#1a1a1a'}
            >
              {/* Photo placeholder */}
              <div style={{
                height: '180px',
                background: `linear-gradient(135deg, #141414, #1a1a1a)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                <span style={{ fontSize: '48px', opacity: 0.1 }}>⌂</span>
                <div style={{
                  position: 'absolute', top: '12px', right: '12px',
                  padding: '4px 10px',
                  background: l.status === 'Active' ? 'rgba(56,161,105,0.9)' : 'rgba(201,168,76,0.9)',
                  borderRadius: '20px', fontSize: '11px',
                  color: '#fff', fontFamily: 'DM Mono, monospace',
                }}>{l.status}</div>
                <div style={{
                  position: 'absolute', top: '12px', left: '12px',
                  padding: '4px 10px',
                  background: 'rgba(8,8,8,0.8)',
                  borderRadius: '20px', fontSize: '11px',
                  color: '#4a4845', fontFamily: 'DM Mono, monospace',
                }}>{l.days}d ago</div>
              </div>

              <div style={{ padding: '18px' }}>
                <div style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '20px', color: '#c9a84c', fontWeight: '500',
                  marginBottom: '4px',
                }}>
                  ${l.price.toLocaleString()}
                </div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#f0ede8', marginBottom: '2px' }}>{l.address}</div>
                <div style={{ fontSize: '12px', color: '#4a4845', marginBottom: '14px' }}>{l.city}</div>

                <div style={{
                  display: 'flex', gap: '16px',
                  fontSize: '13px', color: '#8a8580', marginBottom: '14px',
                }}>
                  <span>{l.beds} bd</span>
                  <span>{l.baths} ba</span>
                  <span>{l.sqft.toLocaleString()} sqft</span>
                  <span style={{ marginLeft: 'auto', color: '#4a4845', fontSize: '11px' }}>{l.type}</span>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {l.tags.map(tag => (
                    <span key={tag} style={{
                      padding: '3px 8px',
                      background: '#141414', border: '1px solid #242424',
                      borderRadius: '20px', fontSize: '10px', color: '#8a8580',
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <div style={{ background: '#0f0f0f', border: '1px solid #1a1a1a', borderRadius: '12px', overflow: 'hidden' }}>
          {filtered.map((l, i) => (
            <div key={l.id} style={{
              display: 'flex', gap: '20px', alignItems: 'center',
              padding: '16px 20px',
              borderBottom: i < filtered.length - 1 ? '1px solid #141414' : 'none',
              cursor: 'pointer', transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#141414'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{
                width: '60px', height: '44px', borderRadius: '6px',
                background: '#141414', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '20px', opacity: 0.3, flexShrink: 0,
              }}>⌂</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#f0ede8' }}>{l.address}</div>
                <div style={{ fontSize: '12px', color: '#4a4845' }}>{l.beds}bd · {l.baths}ba · {l.sqft.toLocaleString()} sqft</div>
              </div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '15px', color: '#c9a84c' }}>
                ${l.price.toLocaleString()}
              </div>
              <span style={{
                padding: '3px 10px',
                background: l.status === 'Active' ? 'rgba(56,161,105,0.1)' : 'rgba(201,168,76,0.1)',
                border: `1px solid ${l.status === 'Active' ? 'rgba(56,161,105,0.3)' : 'rgba(201,168,76,0.3)'}`,
                borderRadius: '20px', fontSize: '11px',
                color: l.status === 'Active' ? '#38a169' : '#c9a84c',
                fontFamily: 'DM Mono, monospace',
              }}>{l.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
