import React, { useState, useEffect, useCallback } from 'react';
import GovernanceView from './components/GovernanceView';
import { EXAMPLE_AGENTS, EXAMPLE_MCP_SERVERS } from './data/examples';
import Dashboard from './components/Dashboard';
import RegistryView from './components/RegistryView';
import RegisterWizard from './components/RegisterWizard';
import DetailsView from './components/DetailsView';
// import MonitorView from './components/MonitorView';
import AuthLogin from './components/AuthLogin';
import SearchBar from './components/SearchBar';
// Builder view (to be implemented)
const BuilderView = React.lazy(() => import('./components/BuilderView'));

const LOCAL_KEY_AGENTS = 'agents';
const LOCAL_KEY_MCP = 'mcpServers';

const getInitialData = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const App = () => {
  const [user, setUser] = useState(null); // {username, role}
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard now analytics; new 'registry' view for lists
  const [agents, setAgents] = useState(() => getInitialData(LOCAL_KEY_AGENTS, EXAMPLE_AGENTS));
  const [mcpServers, setMcpServers] = useState(() => getInitialData(LOCAL_KEY_MCP, EXAMPLE_MCP_SERVERS));
  const [darkMode, setDarkMode] = useState(() => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY_AGENTS, JSON.stringify(agents));
    localStorage.setItem(LOCAL_KEY_MCP, JSON.stringify(mcpServers));
  }, [agents, mcpServers]);

  useEffect(() => {
    document.body.setAttribute('data-color-scheme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleSelect = useCallback((item) => {
    setSelectedItem(item);
    setSelectedType(agents.includes(item) ? 'agent' : 'mcp');
    setCurrentView('details');
  }, [agents, mcpServers]);

  const handleRegister = useCallback(() => {
    setShowRegister(true);
    setCurrentView('dashboard');
  }, []);

  const handleRegisterConfirm = useCallback((data, type) => {
  const normalized = { ...data, governanceStatus: data.governanceStatus || 'pending' };
  if (type === 'agent') setAgents(prev => [...prev, normalized]);
  else setMcpServers(prev => [...prev, normalized]);
    setShowRegister(false);
    setCurrentView('dashboard');
  }, []);

  const handleUnregister = useCallback((item, type) => {
    if (user?.role !== 'admin') {
      alert('Only admins can unregister items.');
      return;
    }
    if (window.confirm(`Unregister ${item.name}?`)) {
      if (type === 'agent') setAgents(prev => prev.filter(a => a.id !== item.id));
      else setMcpServers(prev => prev.filter(m => m.id !== item.id));
      setCurrentView('dashboard');
    }
  }, [user]);

  const handleBack = useCallback(() => {
    setCurrentView('dashboard');
    setSelectedItem(null);
    setSelectedType(null);
  }, []);

  // Tag logic
  const allTags = Array.from(new Set([
    ...agents.flatMap(a => a.tags || []),
    ...mcpServers.flatMap(m => m.tags || [])
  ]));
  const handleTagToggle = tag => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  // Filter logic for dashboard
  const filterItems = items => {
    return items.filter(item => {
      const matchesQuery = searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tags && item.tags.some(tag => searchQuery.toLowerCase().includes(tag)));
      const matchesTags = selectedTags.length === 0 || (item.tags && selectedTags.every(tag => item.tags.includes(tag)));
      return matchesQuery && matchesTags;
    });
  };

  if (!user) {
    return <AuthLogin onLogin={setUser} />;
  }

  const isDark = darkMode;
  return (
    <div>
      <header className="app-header" style={{ background: isDark ? '#1e2228' : undefined, borderBottom: isDark ? '1px solid #333' : undefined, color: isDark ? '#e0e6ed' : undefined }}>
        <span className="app-title">🤖 AgentMatrix</span>
        <div>
          <span style={{ marginRight: 16, fontSize: 14, color: 'var(--color-text-secondary)' }}>
            {user.username} ({user.role})
          </span>
          <button
            className="theme-toggle"
            aria-label="Toggle dark mode"
            onClick={() => setDarkMode(d => !d)}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '🌙' : '☀️'}
          </button>
          <button
            className="nav-btn"
            style={{ marginLeft: 8, fontSize: 13, background: 'var(--color-error)' }}
            onClick={() => setUser(null)}
            aria-label="Sign out"
          >Sign Out</button>
        </div>
      </header>
      <nav className="navbar" style={{
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        background: isDark ? '#23272f' : '#f8fafc',
        borderBottom: isDark ? '1px solid #333' : '1px solid #e0e6ed',
        padding: '0 32px',
        height: 56,
        fontWeight: 500,
        fontSize: 16,
        position: 'sticky',
        top: 0,
        zIndex: 10,
        color: isDark ? '#e0e6ed' : '#222'
      }} aria-label="Main Navigation">
        <button
          className="nav-btn"
          style={{
            color: isDark ? '#e0e6ed' : '#234',
            textDecoration: 'none',
            padding: '8px 18px',
            borderRadius: 8,
            background: currentView === 'dashboard' ? '#31737d' : (isDark ? '#2c313a' : '#31737d22'),
            border: currentView === 'dashboard' ? '1px solid #31737d' : '1px solid transparent',
            fontWeight: currentView === 'dashboard' ? 600 : 500,
            fontSize: 18
          }}
          onClick={() => setCurrentView('dashboard')}
        >Dashboard</button>
        <button
          className="nav-btn"
          style={{
            color: isDark ? '#e0e6ed' : '#234',
            textDecoration: 'none',
            padding: '8px 18px',
            borderRadius: 8,
            background: currentView === 'registry' ? '#31737d' : (isDark ? '#2c313a' : '#31737d22'),
            border: currentView === 'registry' ? '1px solid #31737d' : '1px solid transparent',
            fontWeight: currentView === 'registry' ? 600 : 500,
            fontSize: 18
          }}
          onClick={() => setCurrentView('registry')}
        >Registry</button>
  {/* Monitor tab removed */}
        {(user.role === 'admin' || user.role === 'developer') && (
          <>
            <button
              className="nav-btn"
              style={{
                color: isDark ? '#e0e6ed' : '#234',
                textDecoration: 'none',
                padding: '8px 18px',
                borderRadius: 8,
                background: currentView === 'governance' ? '#31737d' : (isDark ? '#2c313a' : '#31737d22'),
                border: currentView === 'governance' ? '1px solid #31737d' : '1px solid transparent',
                fontWeight: currentView === 'governance' ? 600 : 500,
                fontSize: 18
              }}
              onClick={() => setCurrentView('governance')}
            >Governance</button>
            <button
              className="nav-btn"
              style={{
                color: isDark ? '#e0e6ed' : '#234',
                textDecoration: 'none',
                padding: '8px 18px',
                borderRadius: 8,
                background: currentView === 'builder' ? '#31737d' : (isDark ? '#2c313a' : '#31737d22'),
                border: currentView === 'builder' ? '1px solid #31737d' : '1px solid transparent',
                fontWeight: currentView === 'builder' ? 600 : 500,
                fontSize: 18
              }}
              onClick={() => setCurrentView('builder')}
            >Builder</button>
          </>
        )}
      </nav>
      <main className="main-content" style={{ position: 'relative' }}>
        {showRegister && (
          <>
            {/* Backdrop with blur */}
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(6px)',
              zIndex: 1000
            }} />
            {/* Modal container */}
            <div style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1001,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 320,
              maxWidth: 400,
              width: '100%',
              padding: 0
            }}>
              <RegisterWizard
                onRegister={handleRegisterConfirm}
                onCancel={() => setShowRegister(false)}
                agents={agents}
                mcpServers={mcpServers}
              />
            </div>
          </>
        )}
        {/* Dashboard and other views, blurred if modal is open */}
        <div style={showRegister ? {
          filter: 'blur(4px)',
          pointerEvents: 'none',
          userSelect: 'none',
          opacity: 0.7
        } : {}}>
          {currentView === 'dashboard' && (
              <Dashboard
                agents={agents}
                mcpServers={mcpServers}
                onSelect={handleSelect}
                onRegister={handleRegister}
                user={user}
                onImportData={(newAgents, newMcpServers) => {
                  setAgents(newAgents);
                  setMcpServers(newMcpServers);
                }}
                onNlpRegister={async (nlpText) => {
                  if (!nlpText) return;
                  // If nlpText is an object, it's a simulated registration
                  if (typeof nlpText === 'object' && nlpText !== null) {
                    if (nlpText.type === 'agent') {
                      setAgents(prev => [...prev, { ...nlpText }]);
                    } else if (nlpText.type === 'mcp') {
                      setMcpServers(prev => [...prev, { ...nlpText }]);
                    }
                    // Do not show any error or call API for simulated registration
                    return;
                  }
                  // Otherwise, proceed with real API call
                  try {
                    const response = await fetch('https://api.openai.com/v1/chat/completions', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY || 'sk-PLACEHOLDER'}`
                      },
                      body: JSON.stringify({
                        model: 'gpt-4',
                        messages: [
                          { role: 'system', content: 'You are an expert at extracting structured agent/MCP details from natural language.' },
                          { role: 'user', content: nlpText }
                        ],
                        temperature: 0.2
                      })
                    });
                    const data = await response.json();
                    const content = data.choices?.[0]?.message?.content;
                    let details;
                    try { details = JSON.parse(content); } catch { details = { name: content }; }
                    if (details.type === 'agent' || details.role === 'agent') {
                      setAgents(prev => [...prev, { ...details, id: `agent-${Date.now()}` }]);
                    } else if (details.type === 'mcp' || details.role === 'mcp') {
                      setMcpServers(prev => [...prev, { ...details, id: `mcp-${Date.now()}` }]);
                    } else {
                      alert('Could not determine type. Please specify agent or MCP in your description.');
                    }
                  } catch (err) {
                    alert('NLP registration failed. Please check your API key and try again.');
                  }
                }}
                sections={{
                  showFilters: false,
                  showLists: false,
                  showCharts: true,
                  showLogs: true,
                  showGraph: true,
                  showRecommendations: true
                }}
              />
          )}
          {currentView === 'registry' && (
              <RegistryView
                agents={filterItems(agents)}
                mcpServers={filterItems(mcpServers)}
                onSelect={handleSelect}
                onRegister={handleRegister}
                user={user}
                onImportData={(newAgents, newMcpServers) => {
                  setAgents(newAgents);
                  setMcpServers(newMcpServers);
                }}
                onNlpRegister={async (nlpText) => {
                  if (!nlpText) return;
                  // If nlpText is an object, it's a simulated registration
                  if (typeof nlpText === 'object' && nlpText !== null) {
                    if (nlpText.type === 'agent') {
                      setAgents(prev => [...prev, { ...nlpText }]);
                    } else if (nlpText.type === 'mcp') {
                      setMcpServers(prev => [...prev, { ...nlpText }]);
                    }
                    // Do not show any error or call API for simulated registration
                    return;
                  }
                  // Otherwise, proceed with real API call
                  try {
                    const response = await fetch('https://api.openai.com/v1/chat/completions', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY || 'sk-PLACEHOLDER'}`
                      },
                      body: JSON.stringify({
                        model: 'gpt-4',
                        messages: [
                          { role: 'system', content: 'You are an expert at extracting structured agent/MCP details from natural language.' },
                          { role: 'user', content: nlpText }
                        ],
                        temperature: 0.2
                      })
                    });
                    const data = await response.json();
                    const content = data.choices?.[0]?.message?.content;
                    let details;
                    try { details = JSON.parse(content); } catch { details = { name: content }; }
                    if (details.type === 'agent' || details.role === 'agent') {
                      setAgents(prev => [...prev, { ...details, id: `agent-${Date.now()}` }]);
                    } else if (details.type === 'mcp' || details.role === 'mcp') {
                      setMcpServers(prev => [...prev, { ...details, id: `mcp-${Date.now()}` }]);
                    } else {
                      alert('Could not determine type. Please specify agent or MCP in your description.');
                    }
                  } catch (err) {
                    alert('NLP registration failed. Please check your API key and try again.');
                  }
                }}
              />
          )}
          {currentView === 'details' && selectedItem && (
              <DetailsView
                item={selectedItem}
                type={selectedType}
                onUnregister={handleUnregister}
                onBack={handleBack}
                user={user}
                onUpdateItem={(updated, type) => {
                  if (type === 'agent') {
                    setAgents(prev => prev.map(a => a.id === updated.id ? updated : a));
                    setSelectedItem(updated);
                  } else {
                    setMcpServers(prev => prev.map(m => m.id === updated.id ? updated : m));
                    setSelectedItem(updated);
                  }
                }}
              />
          )}
          {/* Monitor screen removed */}
          {currentView === 'builder' && (user?.role === 'admin' || user?.role === 'developer') && (
            <React.Suspense fallback={<div>Loading Builder...</div>}>
              <BuilderView agents={agents} mcpServers={mcpServers} onSaveAgent={setAgents} onSaveMcp={setMcpServers} />
            </React.Suspense>
          )}
          {currentView === 'governance' && user?.role === 'admin' && (
            <GovernanceView
              agents={agents}
              mcpServers={mcpServers}
              onApprove={(item, type) => {
                if (type === 'agent') {
                  setAgents(prev => prev.map(a => a.id === item.id ? { ...a, governanceStatus: 'approved' } : a));
                } else {
                  setMcpServers(prev => prev.map(m => m.id === item.id ? { ...m, governanceStatus: 'approved' } : m));
                }
              }}
              onReject={(item, type) => {
                if (type === 'agent') {
                  setAgents(prev => prev.map(a => a.id === item.id ? { ...a, governanceStatus: 'rejected' } : a));
                } else {
                  setMcpServers(prev => prev.map(m => m.id === item.id ? { ...m, governanceStatus: 'rejected' } : m));
                }
              }}
            />
          )}
        </div>

      </main>
    </div>
  );
};

export default App;
