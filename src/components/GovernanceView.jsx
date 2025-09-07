import React, { useState } from 'react';
import ItemCard from './ItemCard';

/**
 * GovernanceView: manage approval, compliance, and audit for agents/MCPs
 */
const GOVERNANCE_STATUSES = ['approved', 'pending', 'rejected'];

function GovernanceView({ agents = [], mcpServers = [], onApprove, onReject }) {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(false);
  // Normalize governanceStatus for all items
  const normalizedAgents = agents.map(a => ({ ...a, governanceStatus: a.governanceStatus || 'pending' }));
  const normalizedMcpServers = mcpServers.map(m => ({ ...m, governanceStatus: m.governanceStatus || 'pending' }));
  const filterItem = item => {
    if (selectedStatus && item.governanceStatus !== selectedStatus) return false;
    return true;
  };

  const handleApprove = (item, type) => {
    if (window.confirm(`Approve ${type === 'agent' ? 'Agent' : 'MCP'} "${item.name}"?`)) {
      setLoading(true);
      onApprove(item, type);
      setTimeout(() => setLoading(false), 400);
    }
  };
  const handleReject = (item, type) => {
    if (window.confirm(`Reject ${type === 'agent' ? 'Agent' : 'MCP'} "${item.name}"?`)) {
      setLoading(true);
      onReject(item, type);
      setTimeout(() => setLoading(false), 400);
    }
  };
  return (
    <div className="view governance" style={{ padding: 32 }}>
      <div style={{ fontWeight: 600, fontSize: 22, marginBottom: 18 }}>Governance & Compliance</div>
      <div style={{ marginBottom: 18 }}>
        <label style={{ fontWeight: 500, marginRight: 12 }}>Filter by status:</label>
        <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)} style={{ padding: 6, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }}>
          <option value="">All</option>
          {GOVERNANCE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      {loading && <div style={{ marginBottom: 18, color: '#31737d', fontWeight: 500 }}>Updating status...</div>}
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 320 }}>
          <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 8 }}>Agents</div>
          {normalizedAgents.filter(filterItem).length === 0 ? (
            <div style={{ color: '#888', fontSize: 14, marginBottom: 16 }}>No agents found for this status.</div>
          ) : (
            normalizedAgents.filter(filterItem).map(agent => (
              <div key={agent.id} style={{ marginBottom: 16 }}>
                <ItemCard item={agent} type="agent" onSelect={() => {}} />
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                  {agent.governanceStatus === 'pending' && (
                    <>
                      <button className="nav-btn" style={{ background: '#32b8c6' }} onClick={() => handleApprove(agent, 'agent')}>Approve</button>
                      <button className="nav-btn" style={{ background: '#ff5459' }} onClick={() => handleReject(agent, 'agent')}>Reject</button>
                    </>
                  )}
                  <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Status: <b>{agent.governanceStatus}</b></span>
                </div>
              </div>
            ))
          )}
        </div>
        <div style={{ flex: 1, minWidth: 320 }}>
          <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 8 }}>MCP Servers</div>
          {normalizedMcpServers.filter(filterItem).length === 0 ? (
            <div style={{ color: '#888', fontSize: 14, marginBottom: 16 }}>No MCP servers found for this status.</div>
          ) : (
            normalizedMcpServers.filter(filterItem).map(mcp => (
              <div key={mcp.id} style={{ marginBottom: 16 }}>
                <ItemCard item={mcp} type="mcp" onSelect={() => {}} />
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                  {mcp.governanceStatus === 'pending' && (
                    <>
                      <button className="nav-btn" style={{ background: '#32b8c6' }} onClick={() => handleApprove(mcp, 'mcp')}>Approve</button>
                      <button className="nav-btn" style={{ background: '#ff5459' }} onClick={() => handleReject(mcp, 'mcp')}>Reject</button>
                    </>
                  )}
                  <span style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>Status: <b>{mcp.governanceStatus}</b></span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default GovernanceView;
