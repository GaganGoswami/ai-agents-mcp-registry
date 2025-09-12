import React, { useState } from 'react';
import { FaShieldAlt, FaRocket, FaUsers, FaChartLine } from 'react-icons/fa';

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
    <div style={{ minHeight: '100vh', background: 'var(--color-bg, var(--color-surface))', paddingTop: 48 }}>
      <div className="view active" style={{ maxWidth: 360, margin: '0 auto 32px auto', background: 'var(--color-surface)', borderRadius: 12, padding: 32, boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontWeight: 700, fontSize: 28, marginBottom: 8, color: 'var(--color-primary)', letterSpacing: 1 }}>Welcome to AgentMatrix</div>
        <div style={{ fontSize: 16, color: 'var(--color-text-secondary, #555)', marginBottom: 24, textAlign: 'center' }}>Sign in to unlock powerful AI infrastructure management.</div>
        <div style={{ width: '100%', marginBottom: 16 }}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block', color: 'var(--color-text)' }}>Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{
              width: '100%',
              height: 44,
              padding: '0 12px',
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              fontSize: 15,
              marginBottom: 8,
              background: 'var(--color-input-bg, #f3f4f6)',
              color: 'var(--color-text)',
              boxSizing: 'border-box',
              outline: 'none',
              appearance: 'none',
            }}
            placeholder="Enter your username"
          />
        </div>
        <div style={{ width: '100%', marginBottom: 16 }}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block', color: 'var(--color-text)' }}>Role</label>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            style={{
              width: '100%',
              height: 44,
              padding: '0 12px',
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              fontSize: 15,
              background: 'var(--color-input-bg, #f3f4f6)',
              color: 'var(--color-text)',
              boxSizing: 'border-box',
              outline: 'none',
              appearance: 'none',
            }}
          >
            <option value="admin">Admin</option>
            <option value="developer">Developer</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
        {error && <div style={{ color: 'var(--color-error)', marginBottom: 12 }}>{error}</div>}
        <button
          className="nav-btn"
          style={{
            width: '100%',
            fontSize: 16,
            background: 'var(--color-primary, #6366f1)',
            color: 'var(--color-on-accent, #fff)',
            border: '1px solid var(--color-border, #6366f1)',
            borderRadius: 8,
            padding: '12px 0',
            fontWeight: 600,
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            marginTop: 16,
            transition: 'background 0.2s',
          }}
          onClick={handleLogin}
        >
          Sign In
        </button>
      </div>
      <div style={{ maxWidth: 700, margin: '32px auto 0 auto', display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
        <HeroCard icon={<FaShieldAlt size={36} color="var(--color-primary)" />} title="Enterprise Security" desc="Robust authentication, role-based access, and compliance-ready governance." />
        <HeroCard icon={<FaRocket size={36} color="var(--color-accent)" />} title="Lightning Fast" desc="Instant onboarding and real-time analytics for all your AI agents." />
        <HeroCard icon={<FaUsers size={36} color="var(--color-warning, #f59e42)" />} title="Collaborative" desc="Empower teams with seamless workflows and transparent approvals." />
        <HeroCard icon={<FaChartLine size={36} color="var(--color-error)" />} title="Actionable Insights" desc="Monitor, optimize, and scale with live dashboards and alerts." />
      </div>
    </div>
  );
};


// HeroCard component for feature highlights
function HeroCard({ icon, title, desc }) {
  return (
    <div style={{ background: 'var(--color-surface)', borderRadius: 12, boxShadow: 'var(--shadow-sm)', padding: '24px 20px', minWidth: 160, maxWidth: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <div>{icon}</div>
      <div style={{ fontWeight: 600, fontSize: 17, color: 'var(--color-text)', marginBottom: 2 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--color-text-secondary, #6b7280)', textAlign: 'center' }}>{desc}</div>
    </div>
  );
}

export default AuthLogin;
