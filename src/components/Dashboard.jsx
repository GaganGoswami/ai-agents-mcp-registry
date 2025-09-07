
import React, { useRef, useState } from 'react';
import ItemCard from './ItemCard';
import DependencyGraph from './DependencyGraph';

// Example PRICING_MODELS and filterByPricing for context
const PRICING_MODELS = [
  'Free',
  'Subscription',
  'Pay-per-use',
  'Enterprise',
  'Custom',
];

function Dashboard({ agents = [], mcpServers = [], user, onRegister, onSelect, onNlpRegister, recommendations = [], handleExport, handleImport }) {
  // Debug: print incoming data
  console.log('DASHBOARD AGENTS:', agents);
  console.log('DASHBOARD MCP_SERVERS:', mcpServers);
  const [selectedPricing, setSelectedPricing] = useState([]);
  const [showNlpModal, setShowNlpModal] = useState(false);
  const [nlpInput, setNlpInput] = useState('');
  const fileInputRef = useRef();

  const filterByPricing = item => {
    if (selectedPricing.length === 0) return true;
    // Normalize both sides for robust matching
    const itemModel = (item.pricingModel || '').toLowerCase().trim();
    const selectedNormalized = selectedPricing.map(m => m.toLowerCase().trim());
    const match = selectedNormalized.includes(itemModel);
    if (!match) {
      console.log('FILTER OUT:', item.name, '| item.pricingModel:', item.pricingModel, '| selectedPricing:', selectedPricing);
    }
    return match;
  };

  const onlineAgents = agents.filter(a => a.status === 'online').length;
  const onlineMCP = mcpServers.filter(m => m.status === 'online').length;

  return (
    <div className="view active">
      <div style={{ display: 'flex', flexDirection: 'row', gap: 24 }}>
        {/* Sidebar for monetization filters */}
        <div style={{ minWidth: 180, maxWidth: 220, background: '#f8fafc', borderRadius: 12, boxShadow: 'var(--shadow-sm)', padding: 18, marginRight: 8, height: 'fit-content' }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 10 }}>Filters</div>
          <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 6 }}>Pricing Model</div>
          {PRICING_MODELS.map(model => (
            <label key={model} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 14 }}>
              <input
                type="checkbox"
                checked={selectedPricing.includes(model)}
                onChange={e => {
                  setSelectedPricing(prev =>
                    e.target.checked ? [...prev, model] : prev.filter(m => m !== model)
                  );
                }}
              />
              {model}
            </label>
          ))}
        </div>
        {/* Main dashboard content */}
        <div style={{ flex: 1 }}>
          {/* Top stats and admin actions */}
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
          </div>
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
          {/* Agent and MCP lists */}
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 320 }}>
              <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 8 }}>Agents</div>
              {agents.filter(filterByPricing).map(agent => (
                <ItemCard key={agent.id} item={agent} type="agent" onSelect={onSelect} />
              ))}
            </div>
            <div style={{ flex: 1, minWidth: 320 }}>
              <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 8 }}>MCP Servers</div>
              {mcpServers.filter(filterByPricing).map(mcp => (
                <ItemCard key={mcp.id} item={mcp} type="mcp" onSelect={onSelect} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
