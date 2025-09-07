import React, { useState, useEffect } from 'react';
import MonitorCharts from './MonitorCharts';
import AlertModal from './AlertModal';
import LogViewer from './LogViewer';

/**
 * Monitor view: shows health metrics and logs (mocked)
 * @param {Object} props
 * @param {Array} props.agents
 * @param {Array} props.mcpServers
 * @param {Function} props.onSelect
 */
const MonitorView = ({ agents, mcpServers, onSelect }) => {
  const [alert, setAlert] = useState(null);

  // Simulate alert for offline agent every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      const offlineAgent = agents.find(a => a.status === 'offline');
      if (offlineAgent) {
        setAlert(`Alert: ${offlineAgent.name} is offline!`);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [agents]);

  return (
    <div className="view active">
      <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 16 }}>Monitoring Dashboard</div>
      {alert && <AlertModal message={alert} onClose={() => setAlert(null)} />}
      <MonitorCharts agents={agents} mcpServers={mcpServers} />
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 320 }}>
          <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 8 }}>Agents</div>
          {agents.map(agent => (
            <div key={agent.id} className="item-card" style={{ marginBottom: 16 }} onClick={() => onSelect(agent)}>
              <div style={{ fontWeight: 600 }}>{agent.name}</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{agent.description}</div>
              <div style={{ marginTop: 8 }}>
                <span className={`status ${agent.status}`}>{agent.status}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 320 }}>
          <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 8 }}>MCP Servers</div>
          {mcpServers.map(mcp => (
            <div key={mcp.id} className="item-card" style={{ marginBottom: 16 }} onClick={() => onSelect(mcp)}>
              <div style={{ fontWeight: 600 }}>{mcp.name}</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{mcp.description}</div>
              <div style={{ marginTop: 8 }}>
                <span className={`status ${mcp.status}`}>{mcp.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
  <LogViewer agents={agents} mcpServers={mcpServers} />
    </div>
  );
};

export default MonitorView;
