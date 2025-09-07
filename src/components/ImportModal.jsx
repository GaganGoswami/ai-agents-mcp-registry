import React, { useState } from 'react';

/**
 * Modal for importing agents/MCPs from external sources
 * @param {Object} props
 * @param {Function} props.onImportData
 * @param {Function} props.onClose
 */
const ImportModal = ({ onImportData, onClose }) => {
  const isDark = document.body.getAttribute('data-color-scheme') === 'dark';
  const [importSource, setImportSource] = useState('file');
  const [importUrl, setImportUrl] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);

  const handleFileImport = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const data = JSON.parse(evt.target.result);
        if (Array.isArray(data.agents) && Array.isArray(data.mcpServers)) {
          onImportData(data.agents, data.mcpServers);
          setImportSuccess(true);
          setTimeout(() => onClose(), 1200);
        } else {
          setImportError('Invalid file format.');
        }
      } catch {
        setImportError('Failed to parse file.');
      }
    };
    reader.readAsText(file);
  };

  const handleUrlImport = async () => {
    setImportError('');
    try {
      const res = await fetch(importUrl);
      const data = await res.json();
      if (Array.isArray(data.agents) && Array.isArray(data.mcpServers)) {
        onImportData(data.agents, data.mcpServers);
        setImportSuccess(true);
        setTimeout(() => onClose(), 1200);
      } else {
        setImportError('Invalid data format from URL.');
      }
    } catch {
      setImportError('Failed to fetch or parse data from URL.');
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.2)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: isDark ? '#23272f' : '#fff', borderRadius: 12, boxShadow: isDark ? '0 4px 16px #1116' : 'var(--shadow-md)', padding: 32, minWidth: 340, maxWidth: 420, border: isDark ? '1px solid #444' : 'none', color: isDark ? '#e0e6ed' : '#222' }}>
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 18 }}>Import Agents & MCP Servers</div>
        <div style={{ fontSize: 13, color: isDark ? '#b0b8c1' : 'var(--color-text-secondary)', marginBottom: 10 }}>
          <span title="Expected format: { agents: [...], mcpServers: [...] }">Format: <code style={{ background: isDark ? '#2c313a' : '#f5f5f5', padding: '2px 4px', borderRadius: 4 }}>{`{ agents: [...], mcpServers: [...] }`}</code></span>
          <a href="https://gist.github.com/" target="_blank" rel="noopener" style={{ marginLeft: 8, color: '#31737d', textDecoration: 'underline' }}>Example</a>
        </div>
        <div style={{ fontSize: 12, color: isDark ? '#b0b8c1' : 'var(--color-text-secondary)', marginBottom: 8 }}>
          Sample public registry URL: <code style={{ background: isDark ? '#2c313a' : '#f5f5f5', padding: '2px 4px', borderRadius: 4 }}>https://raw.githubusercontent.com/GaganGoswami/ai-agents-mcp-registry/main/public/sample-registry.json</code>
        </div>
        <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
          <label style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
            <input type="radio" name="importSource" checked={importSource === 'file'} onChange={() => setImportSource('file')} /> Import from file
          </label>
          <label style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
            <input type="radio" name="importSource" checked={importSource === 'url'} onChange={() => setImportSource('url')} /> Import from URL
          </label>
        </div>
        {importSource === 'file' && (
          <div style={{ marginBottom: 16 }}>
            <input type="file" accept="application/json" onChange={handleFileImport} style={{ color: isDark ? '#e0e6ed' : '#222' }} />
          </div>
        )}
        {importSource === 'url' && (
          <div style={{ marginBottom: 16 }}>
            <input type="text" value={importUrl} onChange={e => setImportUrl(e.target.value)} placeholder="Paste public registry URL..." style={{ width: '100%', padding: 8, borderRadius: 8, border: isDark ? '1px solid #444' : '1px solid var(--color-border)', fontSize: 14, background: isDark ? '#23272f' : '#fff', color: isDark ? '#e0e6ed' : '#222' }} />
            <button className="nav-btn" style={{ marginTop: 8, background: isDark ? '#31737d' : '#32b8c6', color: isDark ? '#e0e6ed' : '#fff', border: 'none', borderRadius: 8, boxShadow: isDark ? '0 1px 4px #1116' : 'var(--shadow-sm)', transition: 'background 0.2s, color 0.2s' }} onClick={handleUrlImport}>Import from URL</button>
          </div>
        )}
        {importError && <div style={{ color: isDark ? '#ff5459' : 'var(--color-error)', marginBottom: 8 }}>{importError}</div>}
        {importSuccess && <div style={{ color: isDark ? '#7fffa0' : 'var(--color-success)', marginBottom: 8 }}>Import successful!</div>}
        <button className="nav-btn" style={{ marginTop: 8, background: isDark ? '#ff5459' : 'var(--color-error)', color: '#fff', border: 'none', borderRadius: 8, boxShadow: isDark ? '0 1px 4px #1116' : 'var(--shadow-sm)', transition: 'background 0.2s, color 0.2s' }} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ImportModal;
