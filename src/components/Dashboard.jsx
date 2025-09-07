import React, { useRef, useState } from 'react';
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
const Dashboard = ({ agents, mcpServers, onSelect, onRegister, user, onImportData, onNlpRegister }) => {
  const [showNlpModal, setShowNlpModal] = useState(false);
  const [nlpInput, setNlpInput] = useState('');
  // Export registry data as JSON
  const handleExport = () => {
    const data = { agents, mcpServers };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'registry-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import registry data from JSON
  const fileInputRef = useRef();
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (Array.isArray(data.agents) && Array.isArray(data.mcpServers)) {
          if (onImportData) onImportData(data.agents, data.mcpServers);
          alert('Registry imported successfully!');
        } else {
          alert('Invalid registry file format.');
        }
      } catch {
        alert('Failed to parse registry file.');
      }
    };
    reader.readAsText(file);
  };
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
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="nav-btn" style={{ fontSize: 14 }} onClick={onRegister} aria-label="Register new agent or MCP server">+ Register</button>
            <button className="nav-btn" style={{ fontSize: 14 }} onClick={() => setShowNlpModal(true)} aria-label="NLP Register">NLP Register</button>
            <button className="nav-btn" style={{ fontSize: 14 }} onClick={handleExport} aria-label="Export registry data">Export</button>
            <button className="nav-btn" style={{ fontSize: 14 }} onClick={() => fileInputRef.current.click()} aria-label="Import registry data">Import</button>
            <input type="file" accept="application/json" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImport} />
          </div>
        )}
      {/* NLP Registration Modal */}
      {showNlpModal && (
        <div style={{ position: 'fixed', top: 80, left: 0, right: 0, margin: '0 auto', maxWidth: 420, background: '#fff', borderRadius: 12, boxShadow: 'var(--shadow-md)', padding: 24, zIndex: 1000 }}>
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12 }}>NLP Registration</div>
          <div style={{ marginBottom: 8 }}>
            <textarea value={nlpInput} onChange={e => setNlpInput(e.target.value)} rows={5} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }} placeholder="Describe your agent or MCP server in natural language..." />
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button className="nav-btn" onClick={() => { if (onNlpRegister) onNlpRegister(nlpInput); setShowNlpModal(false); setNlpInput(''); }}>Submit</button>
            <button className="nav-btn" style={{ background: 'var(--color-error)' }} onClick={() => { setShowNlpModal(false); setNlpInput(''); }}>Cancel</button>
          </div>
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
