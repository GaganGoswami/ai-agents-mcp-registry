import React from 'react';
import HealthChecker from './HealthChecker';
import InstructionsGenerator from './InstructionsGenerator';

/**
 * Details view for agent or MCP server
 * @param {Object} props
 * @param {Object} props.item
 * @param {string} props.type
 * @param {Function} props.onUnregister
 * @param {Function} props.onBack
 */
const DetailsView = ({ item, type, onUnregister, onBack }) => (
  <div className="view active" style={{ maxWidth: 600, margin: '0 auto', background: 'var(--color-surface)', borderRadius: 12, padding: 24, boxShadow: 'var(--shadow-md)' }}>
    <div style={{ fontWeight: 600, fontSize: 22, marginBottom: 8 }}>{item.name}</div>
    <div style={{ fontSize: 15, color: 'var(--color-text-secondary)', marginBottom: 16 }}>{item.description}</div>
    <div style={{ marginBottom: 8 }}><b>Type:</b> {item.type || (type === 'agent' ? 'agent' : 'mcp')}</div>
    <div style={{ marginBottom: 8 }}><b>Endpoint:</b> <span style={{ fontFamily: 'var(--font-family-mono)' }}>{item.endpoint}</span></div>
    <div style={{ marginBottom: 8 }}><b>Compatible:</b> {item.compatible && item.compatible.join(', ')}</div>
    <div style={{ marginBottom: 8 }}><b>Status:</b> <span className={`status ${item.status}`}>{item.status}</span></div>
    <HealthChecker item={item} />
    <InstructionsGenerator item={item} />
    <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
      <button className="nav-btn" style={{ background: 'var(--color-error)' }} onClick={() => onUnregister(item, type)} aria-label="Unregister">Unregister</button>
      <button className="nav-btn" onClick={onBack} aria-label="Back">Back</button>
    </div>
  </div>
);

export default DetailsView;
