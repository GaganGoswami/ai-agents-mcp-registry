
import React, { useRef, useState, useEffect } from 'react';
// Helper to get unique tags/types
function getUnique(arr, key) {
  return Array.from(new Set(arr.flatMap(i => i[key] || []))).sort();
}
import ImportModal from './ImportModal';
import SearchBar from './SearchBar';
import ItemCard from './ItemCard';
import DependencyGraph from './DependencyGraph';
import MonitorCharts from './MonitorCharts';
import LogViewer from './LogViewer';

// Example PRICING_MODELS and filterByPricing for context
const PRICING_MODELS = [
  'Free',
  'Subscription',
  'Pay-per-use',
  'Enterprise',
  'Custom',
];

function Dashboard({ agents = [], mcpServers = [], user, onRegister, onSelect, onNlpRegister, recommendations = [], handleExport, handleImport, sections = {} }) {
  // Section visibility controls (allow reuse for Registry vs Dashboard)
  const {
    showFilters = true,
    showLists = true,
    showCharts = true,
    showLogs = true,
    showGraph = true,
    showRecommendations = true,
  } = sections;
  // Theme state
  // Local theme mirrors body attribute but can be changed via the select.
  const [theme, setTheme] = useState(() => document.body.getAttribute('data-color-scheme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  // Apply when user changes from the select.
  useEffect(() => {
    const current = document.body.getAttribute('data-color-scheme');
    if (current !== theme) document.body.setAttribute('data-color-scheme', theme);
  }, [theme]);
  // Keep in sync with global toggles (header dark mode button) via MutationObserver.
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const attr = document.body.getAttribute('data-color-scheme');
      setTheme(prev => (attr && attr !== prev ? attr : prev));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-color-scheme'] });
    return () => observer.disconnect();
  }, []);
  // Simulate real-time updates
  const [liveAgents, setLiveAgents] = useState(agents);
  const [liveMcpServers, setLiveMcpServers] = useState(mcpServers);
  useEffect(() => {
    setLiveAgents(agents);
    setLiveMcpServers(mcpServers);
  }, [agents, mcpServers]);
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveAgents(prev => prev.map(a => ({
        ...a,
        usageStats: {
          ...a.usageStats,
          invocations: (a.usageStats?.invocations || 0) + Math.floor(Math.random() * 5),
          success: (a.usageStats?.success || 0) + Math.floor(Math.random() * 4),
          error: (a.usageStats?.error || 0) + (Math.random() < 0.2 ? 1 : 0)
        },
        auditLogs: [
          ...(a.auditLogs || []),
          ...(Math.random() < 0.1 ? [{
            time: new Date().toLocaleTimeString(),
            action: 'Invoked',
            user: 'system',
          }] : [])
        ]
      })));
      setLiveMcpServers(prev => prev.map(m => ({
        ...m,
        usageStats: {
          ...m.usageStats,
          invocations: (m.usageStats?.invocations || 0) + Math.floor(Math.random() * 8),
          success: (m.usageStats?.success || 0) + Math.floor(Math.random() * 7),
          error: (m.usageStats?.error || 0) + (Math.random() < 0.15 ? 1 : 0)
        },
        auditLogs: [
          ...(m.auditLogs || []),
          ...(Math.random() < 0.08 ? [{
            time: new Date().toLocaleTimeString(),
            action: 'HealthCheck',
            user: 'system',
          }] : [])
        ]
      })));
    }, 2500);
    return () => clearInterval(interval);
  }, []);
  // Debug: print incoming data
  console.log('DASHBOARD AGENTS:', agents);
  console.log('DASHBOARD MCP_SERVERS:', mcpServers);
  const [selectedPricing, setSelectedPricing] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [showNlpModal, setShowNlpModal] = useState(false);
  const [nlpInput, setNlpInput] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  // Sorting state
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  // Grouping state
  const [groupKey, setGroupKey] = useState('none');

  // Search & chip tags for unified top bar
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTags, setSearchTags] = useState([]);
  const allTags = Array.from(new Set([...agents, ...mcpServers].flatMap(i => i.tags || [])));
  const toggleSearchTag = tag => setSearchTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  // Combined filter
  const filterItem = item => {
    if (!item) return false;
    // Pricing
    if (selectedPricing.length > 0) {
      const itemModel = (item.pricingModel || '').toLowerCase().trim();
      const selectedNormalized = selectedPricing.map(m => m.toLowerCase().trim());
      if (!selectedNormalized.includes(itemModel)) return false;
    }
    // Tags (all selected tags must be present)
    if (selectedTags.length > 0) {
      if (!item.tags || !selectedTags.every(tag => item.tags.includes(tag))) return false;
    }
    // Search query text match across name/description/tags
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matches = (item.name || '').toLowerCase().includes(q) || (item.description || '').toLowerCase().includes(q) || (item.tags || []).some(t => t.toLowerCase().includes(q));
      if (!matches) return false;
    }
    // Search bar selected tags
    if (searchTags.length > 0) {
      if (!item.tags || !searchTags.every(tag => item.tags.includes(tag))) return false;
    }
    // Verified
    if (showVerifiedOnly && !item.verified) return false;
    // Type
    if (selectedType && item.type !== selectedType) return false;
    return true;
  };

    // Sorting logic
    const sortItems = items => {
      if (!Array.isArray(items)) return [];
      const keyPath = sortKey.split('.');
      const getVal = obj => keyPath.reduce((acc, k) => (acc && acc[k] !== undefined ? acc[k] : undefined), obj);
      return [...items].sort((a, b) => {
        let valA = getVal(a);
        let valB = getVal(b);
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA === undefined) return 1;
        if (valB === undefined) return -1;
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    };

    // Grouping logic
    const groupItems = (items, key) => {
      if (key === 'none') return { All: items };
      return items.reduce((acc, item) => {
        let groupVal = item[key];
        if (Array.isArray(groupVal)) groupVal = groupVal.join(', ');
        if (!groupVal) groupVal = 'Other';
        if (!acc[groupVal]) acc[groupVal] = [];
        acc[groupVal].push(item);
        return acc;
      }, {});
    };

  const onlineAgents = liveAgents.filter(a => a.status === 'online').length;
  const onlineMCP = liveMcpServers.filter(m => m.status === 'online').length;

  // Aggregated analytics for sidebar (when filters hidden)
  const combinedItems = [...liveAgents, ...liveMcpServers];
  const totalInvocations = combinedItems.reduce((sum, i) => sum + (i.usageStats?.invocations || 0), 0);
  const totalErrors = combinedItems.reduce((sum, i) => sum + (i.usageStats?.error || 0), 0);
  const totalSuccess = combinedItems.reduce((sum, i) => sum + (i.usageStats?.success || 0), 0);
  const successRate = totalInvocations > 0 ? ((totalSuccess / (totalSuccess + totalErrors)) * 100).toFixed(1) : '—';
  const topByUsage = [...combinedItems]
    .sort((a, b) => (b.usageStats?.invocations || 0) - (a.usageStats?.invocations || 0))
    .slice(0, 5);
  const topByErrors = [...combinedItems]
    .sort((a, b) => (b.usageStats?.error || 0) - (a.usageStats?.error || 0))
    .filter(i => (i.usageStats?.error || 0) > 0)
    .slice(0, 5);
  const statusCounts = combinedItems.reduce((acc, i) => { const s = i.status || 'unknown'; acc[s] = (acc[s] || 0) + 1; return acc; }, {});
  const governanceCounts = combinedItems.reduce((acc, i) => { const s = i.governanceStatus || 'pending'; acc[s] = (acc[s] || 0) + 1; return acc; }, {});
  const tagFrequency = combinedItems.flatMap(i => i.tags || []).reduce((acc, t) => { acc[t] = (acc[t] || 0) + 1; return acc; }, {});
  const topTags = Object.entries(tagFrequency).sort((a, b) => b[1] - a[1]).slice(0, 8);

  const isDark = theme === 'dark';
  return (
    <div className="view active" style={{ background: isDark ? '#23272f' : '#fff', minHeight: '100vh', color: isDark ? '#e0e6ed' : '#222' }}>
  <div style={{ display: 'flex', flexDirection: 'row', gap: 24 }}>
  {/* Sidebar: filters or analytics */}
    {showFilters ? (
    <div style={{ minWidth: 200, maxWidth: 260, background: isDark ? '#23272f' : '#f8fafc', borderRadius: 12, boxShadow: isDark ? '0 2px 8px #1116' : 'var(--shadow-sm)', padding: 18, marginRight: 8, height: 'fit-content', border: isDark ? '1px solid #444' : 'none', color: isDark ? '#e0e6ed' : '#222' }}>
          {/* Theme Switcher */}
          <div style={{ fontWeight: 500, fontSize: 15, margin: '12px 0 6px 0' }}>Theme</div>
          <select value={theme} onChange={e => setTheme(e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 8, border: theme === 'dark' ? '1px solid #444' : '1px solid var(--color-border)', fontSize: 14, marginBottom: 12, background: theme === 'dark' ? '#23272f' : '#fff', color: theme === 'dark' ? '#e0e6ed' : '#222' }}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="accent">Accent</option>
          </select>
          {/* Grouping Controls */}
          <div style={{ fontWeight: 500, fontSize: 15, margin: '12px 0 6px 0' }}>Group By</div>
          <select value={groupKey} onChange={e => setGroupKey(e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 8, border: isDark ? '1px solid #444' : '1px solid var(--color-border)', fontSize: 14, marginBottom: 12, background: isDark ? '#23272f' : '#fff', color: isDark ? '#e0e6ed' : '#222' }}>
            <option value="none">None</option>
            <option value="type">Type</option>
            <option value="status">Status</option>
            <option value="tags">Tags</option>
          </select>
          {/* Sorting Controls */}
          <div style={{ fontWeight: 500, fontSize: 15, margin: '12px 0 6px 0' }}>Sort By</div>
          <select value={sortKey} onChange={e => setSortKey(e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 8, border: isDark ? '1px solid #444' : '1px solid var(--color-border)', fontSize: 14, marginBottom: 6, background: isDark ? '#23272f' : '#fff', color: isDark ? '#e0e6ed' : '#222' }}>
            <option value="name">Name</option>
            <option value="status">Status</option>
            <option value="type">Type</option>
            <option value="usageStats.invocations">Usage</option>
          </select>
          <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 8, border: isDark ? '1px solid #444' : '1px solid var(--color-border)', fontSize: 14, marginBottom: 12, background: isDark ? '#23272f' : '#fff', color: isDark ? '#e0e6ed' : '#222' }}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 10 }}>Filters</div>
          {/* Pricing Model */}
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
          {/* Tags */}
          <div style={{ fontWeight: 500, fontSize: 15, margin: '12px 0 6px 0' }}>Tags</div>
          {getUnique([...agents, ...mcpServers], 'tags').map(tag => (
            <label key={tag} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 14 }}>
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={e => {
                  setSelectedTags(prev =>
                    e.target.checked ? [...prev, tag] : prev.filter(t => t !== tag)
                  );
                }}
              />
              {tag}
            </label>
          ))}
          {/* Verified */}
          <div style={{ fontWeight: 500, fontSize: 15, margin: '12px 0 6px 0' }}>Verified Only</div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 14 }}>
            <input
              type="checkbox"
              checked={showVerifiedOnly}
              onChange={e => setShowVerifiedOnly(e.target.checked)}
            />
            Show only verified
          </label>
          {/* Type */}
          <div style={{ fontWeight: 500, fontSize: 15, margin: '12px 0 6px 0' }}>Type</div>
          <select value={selectedType} onChange={e => setSelectedType(e.target.value)} style={{ width: '100%', padding: 6, borderRadius: 8, border: isDark ? '1px solid #444' : '1px solid var(--color-border)', fontSize: 14, background: isDark ? '#23272f' : '#fff', color: isDark ? '#e0e6ed' : '#222' }}>
            <option value="">All</option>
            {getUnique([...agents, ...mcpServers], 'type').map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
  </div>
        ) : (
        <div style={{ minWidth: 240, maxWidth: 280, background: isDark ? '#23272f' : '#f8fafc', borderRadius: 12, boxShadow: isDark ? '0 2px 8px #1116' : 'var(--shadow-sm)', padding: 18, marginRight: 8, height: 'fit-content', border: isDark ? '1px solid #444' : 'none', color: isDark ? '#e0e6ed' : '#222', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>Overview</div>
            <div style={{ fontSize: 13, lineHeight: 1.5 }}>
              <div>Total Invocations: <strong>{totalInvocations}</strong></div>
              <div>Success: <strong>{totalSuccess}</strong></div>
              <div>Errors: <strong style={{ color: totalErrors > 0 ? '#ff5459' : undefined }}>{totalErrors}</strong></div>
              <div>Success Rate: <strong>{successRate}%</strong></div>
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>Status</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13 }}>
              {Object.entries(statusCounts).map(([s, c]) => (
                <div key={s} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ textTransform: 'capitalize' }}>{s}</span>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>Governance</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13 }}>
              {Object.entries(governanceCounts).map(([s, c]) => (
                <div key={s} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ textTransform: 'capitalize' }}>{s}</span>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
          {topByUsage.length > 0 && (
            <div>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>Top Usage</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {topByUsage.map(i => (
                  <div key={i.id} style={{ fontSize: 13, display: 'flex', flexDirection: 'column', background: isDark ? '#1e2228' : '#fff', padding: 8, borderRadius: 8, boxShadow: isDark ? '0 1px 4px #1116' : 'var(--shadow-sm)' }}>
                    <span style={{ fontWeight: 500 }}>{i.name}</span>
                    <span style={{ fontSize: 12, color: isDark ? '#b0b8c1' : '#555' }}>Invocations: {i.usageStats?.invocations || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {topByErrors.length > 0 && (
            <div>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>Top Errors</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {topByErrors.map(i => (
                  <div key={i.id} style={{ fontSize: 13, display: 'flex', flexDirection: 'column', background: '#392424', padding: 8, borderRadius: 8, boxShadow: isDark ? '0 1px 4px #1116' : 'var(--shadow-sm)', color: '#ffb5b7' }}>
                    <span style={{ fontWeight: 500 }}>{i.name}</span>
                    <span style={{ fontSize: 12 }}>Errors: {i.usageStats?.error || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {topTags.length > 0 && (
            <div>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 6 }}>Top Tags</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {topTags.map(([tag, count]) => (
                  <span key={tag} style={{ fontSize: 12, background: isDark ? '#1e2228' : '#fff', padding: '4px 8px', borderRadius: 16, boxShadow: isDark ? '0 1px 4px #1116' : 'var(--shadow-sm)' }}>{tag} ({count})</span>
                ))}
              </div>
            </div>
          )}
        </div>
        )}
        {/* Main dashboard content */}
        <div style={{ flex: 1 }}>
          {/* Unified Search / Actions bar (always visible to keep UX consistent) */}
          <div style={{ marginBottom: 20 }}>
            <SearchBar
              query={searchQuery}
              onQueryChange={setSearchQuery}
              tags={allTags}
              selectedTags={searchTags}
              onTagToggle={toggleSearchTag}
              items={[...agents, ...mcpServers]}
            />
            {user?.role === 'admin' && (
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
                <button className="nav-btn" style={{ fontSize: 14, background: theme === 'dark' ? '#31737d' : '#32b8c6', color: theme === 'dark' ? '#e0e6ed' : '#fff', border: 'none', borderRadius: 8, boxShadow: theme === 'dark' ? '0 1px 4px #1116' : 'var(--shadow-sm)' }} onClick={() => setShowNlpModal(true)} aria-label="NLP Register">NLP Register</button>
                <button className="nav-btn" style={{ fontSize: 14, background: theme === 'dark' ? '#31737d' : '#32b8c6', color: theme === 'dark' ? '#e0e6ed' : '#fff', border: 'none', borderRadius: 8, boxShadow: theme === 'dark' ? '0 1px 4px #1116' : 'var(--shadow-sm)' }} onClick={handleExport} aria-label="Export registry data">Export</button>
                <button className="nav-btn" style={{ fontSize: 14, background: theme === 'dark' ? '#31737d' : '#32b8c6', color: theme === 'dark' ? '#e0e6ed' : '#fff', border: 'none', borderRadius: 8, boxShadow: theme === 'dark' ? '0 1px 4px #1116' : 'var(--shadow-sm)' }} onClick={() => setShowImportModal(true)} aria-label="Import registry data">Import</button>
              </div>
            )}
          </div>
          {/* Top stats and admin actions */}
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 24 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 18 }}>Agents</div>
              <div style={{ fontSize: 13, color: isDark ? '#b0b8c1' : 'var(--color-text-secondary)' }}>Total: {agents.length} | Online: {onlineAgents}</div>
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 18 }}>MCP Servers</div>
              <div style={{ fontSize: 13, color: isDark ? '#b0b8c1' : 'var(--color-text-secondary)' }}>Total: {mcpServers.length} | Online: {onlineMCP}</div>
            </div>
            {/* (Admin action buttons now live in unified bar) */}
          </div>
          {/* NLP Registration Modal */}
          {showNlpModal && (
            <div style={{ position: 'fixed', top: 80, left: 0, right: 0, margin: '0 auto', maxWidth: 420, background: isDark ? '#23272f' : '#fff', borderRadius: 12, boxShadow: isDark ? '0 4px 16px #1116' : 'var(--shadow-md)', padding: 24, zIndex: 1000, border: isDark ? '1px solid #444' : 'none', color: isDark ? '#e0e6ed' : '#222' }}>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12 }}>NLP Registration</div>
              <div style={{ marginBottom: 8 }}>
                <textarea value={nlpInput} onChange={e => setNlpInput(e.target.value)} rows={5} style={{ width: '100%', padding: 8, borderRadius: 8, border: isDark ? '1px solid #444' : '1px solid var(--color-border)', fontSize: 14, background: isDark ? '#23272f' : '#fff', color: isDark ? '#e0e6ed' : '#222' }} placeholder="Describe your agent or MCP server in natural language..." />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                <button className="nav-btn" style={{ background: theme === 'dark' ? '#31737d' : '#32b8c6', color: theme === 'dark' ? '#e0e6ed' : '#fff', border: 'none', borderRadius: 8, boxShadow: theme === 'dark' ? '0 1px 4px #1116' : 'var(--shadow-sm)', transition: 'background 0.2s, color 0.2s' }} onClick={async () => {
                  if (onNlpRegister) {
                    const result = await onNlpRegister(nlpInput);
                    if (result && result.governanceStatus === undefined) {
                      result.governanceStatus = 'pending';
                    }
                  }
                  setShowNlpModal(false); setNlpInput('');
                }}>Submit</button>
                <button className="nav-btn" style={{ background: theme === 'dark' ? '#ff5459' : 'var(--color-error)', color: theme === 'dark' ? '#fff' : '#fff', border: 'none', borderRadius: 8, boxShadow: theme === 'dark' ? '0 1px 4px #1116' : 'var(--shadow-sm)', transition: 'background 0.2s, color 0.2s' }} onClick={() => { setShowNlpModal(false); setNlpInput(''); }}>Cancel</button>
              </div>
            </div>
          )}
          {/* Import Modal */}
          {showImportModal && (
            <ImportModal
              onImportData={(newAgents, newMcpServers) => {
                // Ensure governanceStatus is set for all imported items
                const normAgents = newAgents.map(a => ({ ...a, governanceStatus: a.governanceStatus || 'pending' }));
                const normMcpServers = newMcpServers.map(m => ({ ...m, governanceStatus: m.governanceStatus || 'pending' }));
                if (handleImport) handleImport({ agents: normAgents, mcpServers: normMcpServers });
                setShowImportModal(false);
              }}
              onClose={() => setShowImportModal(false)}
            />
          )}
          {/* Recommendations Section */}
          {showRecommendations && recommendations.length > 0 && (
            <div style={{ marginBottom: 24, background: isDark ? '#23272f' : 'var(--color-background)', borderRadius: 8, padding: 16, boxShadow: isDark ? '0 2px 8px #1116' : 'var(--shadow-md)', border: isDark ? '1px solid #444' : 'none' }}>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Recommended MCP Pairings</div>
              {recommendations.map(({ agent, mcp }, idx) => (
                <div key={agent.id + mcp.id} style={{ marginBottom: 8 }}>
                  <span style={{ fontWeight: 500 }}>{agent.name}</span> pairs well with <span style={{ fontWeight: 500 }}>{mcp.name}</span>
                </div>
              ))}
            </div>
          )}
          {/* Monitoring Charts */}
          {showCharts && <MonitorCharts agents={liveAgents} mcpServers={liveMcpServers} />}
          {/* Alert system for error spikes */}
          {showCharts && (() => {
            const totalErrors = [...liveAgents, ...liveMcpServers].reduce((sum, item) => sum + (item.usageStats?.error || 0), 0);
            if (totalErrors > 10) {
              return (
                <div style={{ background: isDark ? '#2d1f00' : '#fff3cd', color: isDark ? '#ffcc02' : '#856404', borderRadius: 8, padding: 12, margin: '16px 0', boxShadow: isDark ? '0 2px 8px #1116' : 'var(--shadow-sm)', fontWeight: 500, border: isDark ? '1px solid #444' : 'none' }}>
                  <span role="img" aria-label="alert" style={{ marginRight: 8 }}>⚠️</span>
                  High error rate detected! ({totalErrors} errors in last period)
                </div>
              );
            }
            return null;
          })()}
          {/* Log Viewer for audit logs */}
          {showLogs && <LogViewer agents={liveAgents} mcpServers={liveMcpServers} />}
          {/* Dependency Graph Visualization */}
          {showGraph && <DependencyGraph agents={agents} mcpServers={mcpServers} />}
          {/* Agent and MCP lists */}
          {showLists && <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 320 }}>
              <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 8 }}>Agents</div>
              {Object.entries(groupItems(sortItems(liveAgents.filter(filterItem)), groupKey)).map(([group, items]) => (
                <div key={group} style={{ marginBottom: 18 }}>
                  {groupKey !== 'none' && <div style={{ fontWeight: 500, fontSize: 15, color: '#31737d', marginBottom: 6 }}>{group}</div>}
                  {items.map(agent => (
                    <ItemCard key={agent.id} item={agent} type="agent" onSelect={onSelect} />
                  ))}
                  {items.length === 0 && <div style={{ color: '#aaa', fontSize: 13, marginBottom: 8 }}>No agents in this group.</div>}
                </div>
              ))}
            </div>
            <div style={{ flex: 1, minWidth: 320 }}>
              <div style={{ fontWeight: 500, fontSize: 16, marginBottom: 8 }}>MCP Servers</div>
              {Object.entries(groupItems(sortItems(liveMcpServers.filter(filterItem)), groupKey)).map(([group, items]) => (
                <div key={group} style={{ marginBottom: 18 }}>
                  {groupKey !== 'none' && <div style={{ fontWeight: 500, fontSize: 15, color: '#31737d', marginBottom: 6 }}>{group}</div>}
                  {items.map(mcp => (
                    <ItemCard key={mcp.id} item={mcp} type="mcp" onSelect={onSelect} />
                  ))}
                  {items.length === 0 && <div style={{ color: '#aaa', fontSize: 13, marginBottom: 8 }}>No MCP servers in this group.</div>}
                </div>
              ))}
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
