import React, { useState, useEffect, useCallback } from 'react';
import { EXAMPLE_AGENTS, EXAMPLE_MCP_SERVERS } from './data/examples';
import Dashboard from './components/Dashboard';
import RegisterWizard from './components/RegisterWizard';
import DetailsView from './components/DetailsView';
import MonitorView from './components/MonitorView';

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
  const [currentView, setCurrentView] = useState('dashboard');
  const [agents, setAgents] = useState(() => getInitialData(LOCAL_KEY_AGENTS, EXAMPLE_AGENTS));
  const [mcpServers, setMcpServers] = useState(() => getInitialData(LOCAL_KEY_MCP, EXAMPLE_MCP_SERVERS));
  const [darkMode, setDarkMode] = useState(() => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

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
    if (window.confirm(`Unregister ${item.name}?`)) {
      if (type === 'agent') setAgents(prev => prev.filter(a => a.id !== item.id));
      else setMcpServers(prev => prev.filter(m => m.id !== item.id));
      setCurrentView('dashboard');
    }
  }, []);

  const handleBack = useCallback(() => {
    setCurrentView('dashboard');
    setSelectedItem(null);
    setSelectedType(null);
  }, []);

  return (
    <div>
      <header className="app-header">
        <span className="app-title">🤖 AI Agents & MCP Registry</span>
        <div>
          <button
            className="theme-toggle"
            aria-label="Toggle dark mode"
            onClick={() => setDarkMode(d => !d)}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '🌙' : '☀️'}
          </button>
        </div>
      </header>
      <nav className="navbar">
        <button className={`nav-btn${currentView === 'dashboard' ? ' active' : ''}`} onClick={() => setCurrentView('dashboard')}>Dashboard</button>
        <button className={`nav-btn${currentView === 'monitor' ? ' active' : ''}`} onClick={() => setCurrentView('monitor')}>Monitor</button>
      </nav>
      <main className="main-content">
        {showRegister && (
          <RegisterWizard
            onRegister={handleRegisterConfirm}
            onCancel={() => setShowRegister(false)}
            agents={agents}
            mcpServers={mcpServers}
          />
        )}
        {!showRegister && currentView === 'dashboard' && (
          <Dashboard
            agents={agents}
            mcpServers={mcpServers}
            onSelect={handleSelect}
            onRegister={handleRegister}
          />
        )}
        {!showRegister && currentView === 'details' && selectedItem && (
          <DetailsView
            item={selectedItem}
            type={selectedType}
            onUnregister={handleUnregister}
            onBack={handleBack}
          />
        )}
        {!showRegister && currentView === 'monitor' && (
          <MonitorView
            agents={agents}
            mcpServers={mcpServers}
            onSelect={handleSelect}
          />
        )}
      </main>
    </div>
  );
};

export default App;
