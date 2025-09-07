import React from 'react';

/**
 * DependencyGraph: simple visualization of agent-MCP dependencies
 * @param {Object} props
 * @param {Array} props.agents
 * @param {Array} props.mcpServers
 */
const DependencyGraph = ({ agents, mcpServers }) => {
  // Build edges: agent -> MCP
  const edges = agents.flatMap(agent =>
    (agent.dependencies || []).map(depId => {
      const mcp = mcpServers.find(m => m.id === depId);
      return mcp ? { agent, mcp } : null;
    }).filter(Boolean)
  );

  return (
    <div style={{ marginBottom: 32, background: 'var(--color-background)', borderRadius: 8, padding: 16, boxShadow: 'var(--shadow-md)' }}>
      <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Dependency Graph</div>
      {edges.length === 0 ? (
        <div style={{ color: 'var(--color-text-secondary)' }}>No dependencies found.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {edges.map(({ agent, mcp }, idx) => (
            <li key={agent.id + mcp.id} style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 500 }}>{agent.name}</span>
              <span style={{ margin: '0 8px' }}>→</span>
              <span style={{ fontWeight: 500 }}>{mcp.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DependencyGraph;
