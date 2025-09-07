import React, { useState } from 'react';

/**
 * Modal for importing agents/MCPs from external sources
 * @param {Object} props
 * @param {Function} props.onImportData
 * @param {Function} props.onClose
 */
const ImportModal = ({ onImportData, onClose }) => {
  const [importSource, setImportSource] = useState('file');
  const [importUrl, setImportUrl] = useState('');
  const [importError, setImportError] = useState('');

  const handleFileImport = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const data = JSON.parse(evt.target.result);
        if (Array.isArray(data.agents) && Array.isArray(data.mcpServers)) {
          onImportData(data.agents, data.mcpServers);
          onClose();
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
        onClose();
      } else {
        setImportError('Invalid data format from URL.');
      }
    } catch {
      setImportError('Failed to fetch or parse data from URL.');
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.2)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: 'var(--shadow-md)', padding: 32, minWidth: 340, maxWidth: 420 }}>
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 18 }}>Import Agents & MCP Servers</div>
        <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 10 }}>
          <span title="Expected format: { agents: [...], mcpServers: [...] }">Format: <code>{`{ agents: [...], mcpServers: [...] }`}</code></span>
          <a href="https://gist.github.com/" target="_blank" rel="noopener" style={{ marginLeft: 8, color: '#31737d', textDecoration: 'underline' }}>Example</a>
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
            <input type="file" accept="application/json" onChange={handleFileImport} />
          </div>
        )}
        {importSource === 'url' && (
          <div style={{ marginBottom: 16 }}>
            <input type="text" value={importUrl} onChange={e => setImportUrl(e.target.value)} placeholder="Paste public registry URL..." style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }} />
            <button className="nav-btn" style={{ marginTop: 8 }} onClick={handleUrlImport}>Import from URL</button>
          </div>
        )}
        {importError && <div style={{ color: 'var(--color-error)', marginBottom: 8 }}>{importError}</div>}
        <button className="nav-btn" style={{ marginTop: 8, background: 'var(--color-error)' }} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ImportModal;
