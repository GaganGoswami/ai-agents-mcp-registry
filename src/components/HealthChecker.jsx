import React, { useState } from 'react';

/**
 * Simulates health check for an agent or MCP server
 * @param {Object} props
 * @param {Object} props.item
 */
const HealthChecker = ({ item }) => {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);

  const checkHealth = async endpoint => {
    setChecking(true);
    setResult(null);
    setTimeout(() => {
      const status = Math.random() > 0.2 ? 'online' : 'offline';
      setResult({
        status,
        latency: Math.floor(Math.random() * 500) + 100,
        errors: +(Math.random() * 1).toFixed(2)
      });
      setChecking(false);
    }, 1000);
  };

  return (
    <div style={{ marginTop: 16 }}>
      <button
        className="nav-btn"
        style={{ fontSize: 14, padding: '6px 16px' }}
        onClick={() => checkHealth(item.endpoint)}
        disabled={checking}
        aria-label="Check health"
      >
        {checking ? 'Checking...' : 'Check Health'}
      </button>
      {result && (
        <div style={{ marginTop: 12 }}>
          <span className={`status ${result.status}`}>{result.status}</span>
          <span style={{ marginLeft: 16 }}>Latency: {result.latency}ms</span>
          <span style={{ marginLeft: 16 }}>Errors: {result.errors}%</span>
        </div>
      )}
    </div>
  );
};

export default HealthChecker;
