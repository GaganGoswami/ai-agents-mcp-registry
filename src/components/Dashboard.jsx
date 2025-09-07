import React, { useState } from 'react';
import ItemCard from './ItemCard';

/**
 * Dashboard view: lists agents and MCP servers, with search/filter
 * @param {Object} props
 * @param {Array} props.agents
 * @param {Array} props.mcpServers
 * @param {Function} props.onSelect
 * @param {Function} props.onRegister
 */
const Dashboard = ({ agents, mcpServers, onSelect, onRegister }) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filterItems = (items) => {
    return items.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (typeFilter === 'all' || item.type === typeFilter)
    );
  };

  const onlineAgents = agents.filter(a => a.status === 'online').length;
  const onlineMCP = mcpServers.filter(m => m.status === 'online').length;

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
        <div>
          <button className="nav-btn" style={{ fontSize: 14 }} onClick={onRegister} aria-label="Register new agent or MCP server">+ Register</button>
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search agents or MCP servers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: 8, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14, width: 240 }}
          aria-label="Search"
        />
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          style={{ marginLeft: 16, padding: 8, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }}
          aria-label="Filter by type"
        >
          <option value="all">All Types</option>
          <option value="rag">RAG</option>
          <option value="chatbot">Chatbot</option>
          <option value="web-research">Web Research</option>
          <option value="automator">Automator</option>
          <option value="code-assistant">Code Assistant</option>
          <option value="multimodal">Multimodal</option>
          <option value="local-first">Local-First</option>
        </select>
      </div>
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 320 }}>
          <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 8 }}>Agents</div>
          {filterItems(agents).map(agent => (
            <ItemCard key={agent.id} item={agent} type="agent" onSelect={onSelect} />
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 320 }}>
          <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 8 }}>MCP Servers</div>
          {filterItems(mcpServers).map(mcp => (
            <ItemCard key={mcp.id} item={mcp} type="mcp" onSelect={onSelect} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
