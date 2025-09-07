import React, { useState } from 'react';

/**
 * TestingSandbox: UI to test agent/MCP endpoint calls
 * @param {Object} props
 * @param {Object} props.item
 */
const TestingSandbox = ({ item }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTest = async () => {
    setLoading(true);
    setError('');
    setOutput(null);
    try {
      // Simulate API call
      await new Promise(res => setTimeout(res, 1000));
      setOutput(`Simulated response from ${item.endpoint} for input: "${input}"`);
    } catch (e) {
      setError('Failed to call endpoint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 16 }}>
      <details>
        <summary style={{ cursor: 'pointer', fontWeight: 500 }}>Testing Sandbox</summary>
        <div style={{ marginTop: 8 }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Enter test input..."
            style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }}
            aria-label="Test input"
          />
          <button
            className="nav-btn"
            style={{ marginTop: 8, fontSize: 13, padding: '6px 16px' }}
            onClick={handleTest}
            disabled={loading || !input.trim()}
            aria-label="Test endpoint"
          >
            {loading ? 'Testing...' : 'Test Endpoint'}
          </button>
          {output && <div style={{ marginTop: 8, background: 'var(--color-background)', padding: 8, borderRadius: 8, fontFamily: 'var(--font-family-mono)', fontSize: 13 }}>{output}</div>}
          {error && <div style={{ color: 'var(--color-error)', marginTop: 8 }}>{error}</div>}
        </div>
      </details>
    </div>
  );
};

export default TestingSandbox;
