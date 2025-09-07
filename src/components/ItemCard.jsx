import React from 'react';

/**
 * Card for displaying agent or MCP server item
 * @param {Object} props
 * @param {Object} props.item
 * @param {string} props.type
 * @param {Function} props.onSelect
 */
const ItemCard = ({ item, type, onSelect }) => (
  <div
    className="item-card"
    tabIndex={0}
    role="button"
    aria-label={`View details for ${item.name}`}
    onClick={() => onSelect(item)}
    onKeyDown={e => (e.key === 'Enter' ? onSelect(item) : null)}
  >
    <div className="name" style={{ fontWeight: 600, fontSize: '16px', display: 'flex', alignItems: 'center', gap: 8 }}>
      {item.name}
      {item.verified && (
        <span title="Verified" style={{ display: 'inline-flex', alignItems: 'center', background: '#e0f7fa', color: '#00796b', borderRadius: 6, padding: '2px 6px', fontSize: 12, fontWeight: 500, marginLeft: 4 }}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" style={{ marginRight: 2 }}>
            <circle cx="10" cy="10" r="10" fill="#00796b" />
            <path d="M6 10.5l2.5 2.5L14 7.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Verified
        </span>
      )}
    </div>
    <div className="description" style={{ marginTop: 4 }}>{item.description}</div>
    <div className={`status ${item.status}`}>{item.status}</div>
    <div style={{ marginTop: 4, fontSize: '12px', color: 'var(--color-text-secondary)' }}>
      Governance: <span style={{ fontWeight: 500 }}>{item.governanceStatus || 'pending'}</span>
    </div>
    <div style={{ marginTop: 8, fontSize: '12px', color: 'var(--color-text-secondary)' }}>
      {type === 'agent' ? 'Agent' : 'MCP Server'}
    </div>
  </div>
);

export default ItemCard;
