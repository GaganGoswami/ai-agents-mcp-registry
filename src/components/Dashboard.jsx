import React from 'react';
import ItemCard from './ItemCard';
import DependencyGraph from './DependencyGraph';

/**
 * Dashboard view: lists agents and MCP servers, with search/filter
 * @param {Object} props
 * @param {Array} props.agents
 * @param {Array} props.mcpServers
 * @param {Function} props.onSelect
 * @param {Function} props.onRegister
 * @param {Object} props.user
 */
const Dashboard = ({ agents, mcpServers, onSelect, onRegister, user }) => {
  const onlineAgents = agents.filter(a => a.status === 'online').length;
  const onlineMCP = mcpServers.filter(m => m.status === 'online').length;

  // Recommendation engine: suggest MCP servers for agents based on dependencies
  const recommendations = agents.flatMap(agent => {
    if (!agent.dependencies || agent.dependencies.length === 0) return [];
    return agent.dependencies.map(depId => {
      const mcp = mcpServers.find(m => m.id === depId);
      return mcp ? { agent, mcp } : null;
    }).filter(Boolean);
  });

  return (
    <div className="view active">
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 24 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 18 }}>Agents</div>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Total: {agents.length} | Online: {onlineAgents}</div>
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: 18 }}>MCP Servers</div>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>Total: {mcpServers.length} | Online: {onlineMCP}</div>
        </div>
        {user?.role === 'admin' && (
          <div>
            <button className="nav-btn" style={{ fontSize: 14 }} onClick={onRegister} aria-label="Register new agent or MCP server">+ Register</button>
          </div>
        )}
      </div>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div style={{ marginBottom: 24, background: 'var(--color-background)', borderRadius: 8, padding: 16, boxShadow: 'var(--shadow-md)' }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Recommended MCP Pairings</div>
          {recommendations.map(({ agent, mcp }, idx) => (
            <div key={agent.id + mcp.id} style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 500 }}>{agent.name}</span> pairs well with <span style={{ fontWeight: 500 }}>{mcp.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Dependency Graph Visualization */}
      <DependencyGraph agents={agents} mcpServers={mcpServers} />

      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 320 }}>
          <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 8 }}>Agents</div>
          {agents.map(agent => (
            <ItemCard key={agent.id} item={agent} type="agent" onSelect={onSelect} />
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 320 }}>
          <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 8 }}>MCP Servers</div>
          {mcpServers.map(mcp => (
            <ItemCard key={mcp.id} item={mcp} type="mcp" onSelect={onSelect} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
