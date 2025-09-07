import React, { useState } from 'react';

/**
 * AuthLogin component for user authentication and role selection
 * @param {Object} props
 * @param {Function} props.onLogin
 */
const AuthLogin = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('viewer');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!username.trim()) {
      setError('Username required');
      return;
    }
    onLogin({ username, role });
  };

  return (
    <div className="view active" style={{ maxWidth: 340, margin: '48px auto', background: 'var(--color-surface)', borderRadius: 12, padding: 24, boxShadow: 'var(--shadow-md)' }}>
      <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 16 }}>Sign In</div>
      <div style={{ marginBottom: 12 }}>
        <label>Username:</label>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }} />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label>Role:</label>
        <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }}>
          <option value="admin">Admin</option>
          <option value="developer">Developer</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>
      {error && <div style={{ color: 'var(--color-error)', marginBottom: 8 }}>{error}</div>}
      <button className="nav-btn" style={{ width: '100%', fontSize: 15 }} onClick={handleLogin}>Sign In</button>
    </div>
  );
};

export default AuthLogin;
