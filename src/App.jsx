import React, { useState, useEffect, useCallback } from 'react';
import { EXAMPLE_AGENTS, EXAMPLE_MCP_SERVERS } from './data/examples';
import Dashboard from './components/Dashboard';
import RegisterWizard from './components/RegisterWizard';
import DetailsView from './components/DetailsView';
import MonitorView from './components/MonitorView';
import AuthLogin from './components/AuthLogin';
import SearchBar from './components/SearchBar';

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
  const [currentView, setCurrentView] = useState('dashboard');
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
  }, []);

  const handleRegisterConfirm = useCallback((data, type) => {
    if (type === 'agent') setAgents(prev => [...prev, data]);
    else setMcpServers(prev => [...prev, data]);
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

  return (
    <div>
      <header className="app-header">
        <span className="app-title">🤖 AI Agents & MCP Registry</span>
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
      <nav className="navbar">
        <button className={`nav-btn${currentView === 'dashboard' ? ' active' : ''}`} onClick={() => setCurrentView('dashboard')}>Dashboard</button>
        <button className={`nav-btn${currentView === 'monitor' ? ' active' : ''}`} onClick={() => setCurrentView('monitor')}>Monitor</button>
        {user.role === 'admin' && (
          <button className="nav-btn" onClick={handleRegister} aria-label="Register new agent or MCP server">+ Register</button>
        )}
      </nav>
      <main className="main-content">
        {currentView === 'dashboard' && (
          <>
            <SearchBar
              query={searchQuery}
              onQueryChange={setSearchQuery}
              tags={allTags}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
            />
            <Dashboard
              agents={filterItems(agents)}
              mcpServers={filterItems(mcpServers)}
              onSelect={handleSelect}
              onRegister={handleRegister}
              user={user}
              onImportData={(newAgents, newMcpServers) => {
                setAgents(newAgents);
                setMcpServers(newMcpServers);
              }}
            />
          </>
        )}
        {showRegister && (
          <RegisterWizard
            onRegister={handleRegisterConfirm}
            onCancel={() => setShowRegister(false)}
            agents={agents}
            mcpServers={mcpServers}
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
        {currentView === 'monitor' && (
          <MonitorView
            agents={agents}
            mcpServers={mcpServers}
            onSelect={handleSelect}
            user={user}
          />
        )}
      </main>
    </div>
  );
};

export default App;
