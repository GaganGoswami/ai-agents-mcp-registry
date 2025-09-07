import React from 'react';

/**
 * VersionHistory: shows version timeline for agent/MCP
 * @param {Object} props
 * @param {Object} props.item
 */
const VersionHistory = ({ item }) => {
  const versions = item.versions || [];
  if (versions.length === 0) return null;
  return (
    <div style={{ marginTop: 16, marginBottom: 16, background: 'var(--color-bg-alt)', borderRadius: 8, padding: 12 }}>
      <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 8 }}>Version History</div>
      <ul style={{ marginTop: 0, paddingLeft: 16 }}>
        {versions.map((v, idx) => (
          <li key={idx} style={{ marginBottom: 4 }}>
            <span style={{ fontWeight: 500 }}>v{v.v}</span>: {v.changelog}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VersionHistory;
