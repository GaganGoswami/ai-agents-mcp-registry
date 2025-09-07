import React from 'react';

/**
 * LogViewer: shows audit logs for agents and MCP servers
 * @param {Object} props
 * @param {Array} props.agents
 * @param {Array} props.mcpServers
 */
const LogViewer = ({ agents, mcpServers }) => {
  // Collect logs from all agents and MCP servers
  const logs = [
    ...agents.flatMap(a => (a.auditLogs ? a.auditLogs.map(log => ({ ...log, name: a.name, type: 'Agent' })) : [])),
    ...mcpServers.flatMap(m => (m.auditLogs ? m.auditLogs.map(log => ({ ...log, name: m.name, type: 'MCP' })) : []))
  ];

  if (logs.length === 0) {
    return <div style={{ color: 'var(--color-text-secondary)', marginTop: 16 }}>No audit logs available.</div>;
  }

  return (
    <div style={{ marginTop: 32, background: 'var(--color-background)', borderRadius: 8, padding: 16, boxShadow: 'var(--shadow-md)' }}>
      <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Audit Log Viewer</div>
      <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--color-surface)' }}>
            <th style={{ textAlign: 'left', padding: '8px 4px' }}>Time</th>
            <th style={{ textAlign: 'left', padding: '8px 4px' }}>Type</th>
            <th style={{ textAlign: 'left', padding: '8px 4px' }}>Name</th>
            <th style={{ textAlign: 'left', padding: '8px 4px' }}>Action</th>
            <th style={{ textAlign: 'left', padding: '8px 4px' }}>User</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid var(--color-border)' }}>
              <td style={{ padding: '6px 4px' }}>{log.time}</td>
              <td style={{ padding: '6px 4px' }}>{log.type}</td>
              <td style={{ padding: '6px 4px' }}>{log.name}</td>
              <td style={{ padding: '6px 4px' }}>{log.action}</td>
              <td style={{ padding: '6px 4px' }}>{log.user}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogViewer;
