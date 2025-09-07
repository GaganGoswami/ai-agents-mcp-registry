import React from 'react';
import HealthChecker from './HealthChecker';
import InstructionsGenerator from './InstructionsGenerator';
import SDKGenerator from './SDKGenerator';
import TestingSandbox from './TestingSandbox';
import VersionHistory from './VersionHistory';
import CommentsSection from './CommentsSection';

// AuditLog section
const AuditLog = ({ logs }) => {
  if (!logs || logs.length === 0) return null;
  return (
    <div style={{ marginTop: 16, marginBottom: 16, background: 'var(--color-bg-alt)', borderRadius: 8, padding: 12 }}>
      <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 8 }}>Audit Logs</div>
      <ul style={{ marginTop: 0, paddingLeft: 16 }}>
        {logs.map((log, idx) => (
          <li key={idx} style={{ marginBottom: 4 }}>{log}</li>
        ))}
      </ul>
    </div>
  );
};

/**
 * Details view for agent or MCP server
 * @param {Object} props
 * @param {Object} props.item
 * @param {string} props.type
 * @param {Function} props.onUnregister
 * @param {Function} props.onBack
 * @param {Object} props.user
 */

const DetailsView = ({ item, type, onUnregister, onBack, user, onUpdateItem }) => {
  // Visibility toggle handler
  const handleVisibilityChange = () => {
    if (user?.role !== 'admin') return;
    const updated = { ...item, visibility: item.visibility === 'public' ? 'private' : 'public' };
    if (onUpdateItem) onUpdateItem(updated, type);
  };
  // Add comment handler
  const handleAddComment = (comment) => {
    if (!user) return;
    const updated = { ...item, comments: [...(item.comments || []), `${user.username}: ${comment}`] };
    if (onUpdateItem) onUpdateItem(updated, type);
  };

  return (
    <div className="view active" style={{ maxWidth: 600, margin: '0 auto', background: 'var(--color-surface)', borderRadius: 12, padding: 24, boxShadow: 'var(--shadow-md)' }}>
      <div style={{ fontWeight: 600, fontSize: 22, marginBottom: 8 }}>{item.name}</div>
      <div style={{ fontSize: 15, color: 'var(--color-text-secondary)', marginBottom: 16 }}>{item.description}</div>
      <VersionHistory item={item} />
      <div style={{ marginBottom: 8 }}><b>Type:</b> {item.type || (type === 'agent' ? 'agent' : 'mcp')}</div>
      <div style={{ marginBottom: 8 }}><b>Endpoint:</b> <span style={{ fontFamily: 'var(--font-family-mono)' }}>{item.endpoint}</span></div>
      <div style={{ marginBottom: 8 }}><b>Compatible:</b> {item.compatible && item.compatible.join(', ')}</div>
      <div style={{ marginBottom: 8 }}><b>Status:</b> <span className={`status ${item.status}`}>{item.status}</span></div>
      <div style={{ marginBottom: 8 }}>
        <b>Visibility:</b> {item.visibility}
        {user?.role === 'admin' && (
          <button className="nav-btn" style={{ marginLeft: 12, fontSize: 13 }} onClick={handleVisibilityChange} aria-label="Toggle visibility">
            Toggle Visibility
          </button>
        )}
      </div>
      {user?.role === 'admin' && <AuditLog logs={item.auditLogs} />}
      <HealthChecker item={item} />
      <InstructionsGenerator item={item} />
      <SDKGenerator item={item} />
      <TestingSandbox item={item} />
      <CommentsSection item={item} onAddComment={handleAddComment} />
      <div style={{ display: 'flex', gap: 16, marginTop: 24 }}>
        <button className="nav-btn" style={{ background: 'var(--color-error)' }} onClick={() => onUnregister(item, type)} aria-label="Unregister">Unregister</button>
        <button className="nav-btn" onClick={onBack} aria-label="Back">Back</button>
      </div>
    </div>
  );
};

export default DetailsView;
