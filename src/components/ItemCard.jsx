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
    style={{
      background: document.body.getAttribute('data-color-scheme') === 'dark' ? '#23272f' : '#fff',
      border: document.body.getAttribute('data-color-scheme') === 'dark' ? '1px solid #444' : '1px solid #e0e6ed',
      borderRadius: 12,
      boxShadow: document.body.getAttribute('data-color-scheme') === 'dark' ? '0 2px 8px #1116' : 'var(--shadow-sm)',
      marginBottom: 12,
      padding: 16,
      color: document.body.getAttribute('data-color-scheme') === 'dark' ? '#e0e6ed' : '#222',
      transition: 'background 0.2s, color 0.2s',
      cursor: 'pointer',
    }}
  >
  <div className="name" style={{ fontWeight: 600, fontSize: '16px', display: 'flex', alignItems: 'center', gap: 8 }}>
      {item.name}
      {item.verified && (
        <span title="Verified" style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: document.body.getAttribute('data-color-scheme') === 'dark' ? '#31737d' : '#e0f7fa',
          color: document.body.getAttribute('data-color-scheme') === 'dark' ? '#e0e6ed' : '#00796b',
          borderRadius: 6,
          padding: '2px 6px',
          fontSize: 12,
          fontWeight: 500,
          marginLeft: 4
        }}>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" style={{ marginRight: 2 }}>
            <circle cx="10" cy="10" r="10" fill={document.body.getAttribute('data-color-scheme') === 'dark' ? '#31737d' : '#00796b'} />
            <path d="M6 10.5l2.5 2.5L14 7.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Verified
        </span>
      )}
    </div>
  <div className="description" style={{ marginTop: 4 }}>{item.description}</div>
    <div className={`status ${item.status}`} style={{
      marginTop: 4,
      fontSize: 13,
      fontWeight: 500,
      color: item.status === 'online'
        ? (document.body.getAttribute('data-color-scheme') === 'dark' ? '#7fffa0' : '#00796b')
        : (document.body.getAttribute('data-color-scheme') === 'dark' ? '#ff5459' : '#d32f2f'),
      letterSpacing: 1
    }}>{item.status}</div>
  <div style={{ marginTop: 4, fontSize: '12px', color: document.body.getAttribute('data-color-scheme') === 'dark' ? '#b0b8c1' : 'var(--color-text-secondary)' }}>
      Governance: <span style={{ fontWeight: 500 }}>{item.governanceStatus || 'pending'}</span>
    </div>
  <div style={{ marginTop: 8, fontSize: '12px', color: document.body.getAttribute('data-color-scheme') === 'dark' ? '#b0b8c1' : 'var(--color-text-secondary)' }}>
      {type === 'agent' ? 'Agent' : 'MCP Server'}
    </div>
  </div>
);

export default ItemCard;
