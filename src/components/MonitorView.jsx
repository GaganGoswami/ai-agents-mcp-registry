import React from 'react';

/**
 * Monitor view: shows health metrics and logs (mocked)
 * @param {Object} props
 * @param {Array} props.agents
 * @param {Array} props.mcpServers
 * @param {Function} props.onSelect
 */
const MonitorView = ({ agents, mcpServers, onSelect }) => {
  // Simulate metrics
  const metrics = item => ({
    uptime: Math.floor(Math.random() * 5) + 95,
    latency: Math.floor(Math.random() * 500) + 100,
    errors: +(Math.random() * 1).toFixed(2)
  });

  return (
    <div className="view active">
      <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 16 }}>Monitoring Dashboard</div>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 320 }}>
          <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 8 }}>Agents</div>
          {agents.map(agent => (
            <div key={agent.id} className="item-card" style={{ marginBottom: 16 }} onClick={() => onSelect(agent)}>
              <div style={{ fontWeight: 600 }}>{agent.name}</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{agent.description}</div>
              <div style={{ marginTop: 8 }}>
                <span className={`status ${agent.status}`}>{agent.status}</span>
                <span style={{ marginLeft: 16 }}>Uptime: {metrics(agent).uptime}%</span>
                <span style={{ marginLeft: 16 }}>Latency: {metrics(agent).latency}ms</span>
                <span style={{ marginLeft: 16 }}>Errors: {metrics(agent).errors}%</span>
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
                <span style={{ marginLeft: 16 }}>Uptime: {metrics(mcp).uptime}%</span>
                <span style={{ marginLeft: 16 }}>Latency: {metrics(mcp).latency}ms</span>
                <span style={{ marginLeft: 16 }}>Errors: {metrics(mcp).errors}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 32 }}>
        <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 8 }}>Recent Activity (Mocked)</div>
        <div style={{ background: 'var(--color-background)', padding: 16, borderRadius: 8, fontSize: 13 }}>
          <div>[{new Date().toLocaleTimeString()}] All systems nominal.</div>
          <div>[{new Date().toLocaleTimeString()}] No errors detected.</div>
          <div>[{new Date().toLocaleTimeString()}] 2 agents checked health.</div>
        </div>
      </div>
    </div>
  );
};

export default MonitorView;
