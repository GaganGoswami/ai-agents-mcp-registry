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
    <div className="name" style={{ fontWeight: 600, fontSize: '16px' }}>{item.name}</div>
    <div className="description" style={{ marginTop: 4 }}>{item.description}</div>
    <div className={`status ${item.status}`}>{item.status}</div>
    <div style={{ marginTop: 8, fontSize: '12px', color: 'var(--color-text-secondary)' }}>
      {type === 'agent' ? 'Agent' : 'MCP Server'}
    </div>
  </div>
);

export default ItemCard;
