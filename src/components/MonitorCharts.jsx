import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, AreaChart, Area } from 'recharts';

/**
 * MonitorCharts: metrics dashboard for agents and MCP servers
 * @param {Object} props
 * @param {Array} props.agents
 * @param {Array} props.mcpServers
 */
const MonitorCharts = ({ agents, mcpServers }) => {
  // Prepare data for charts
  // Simulate time series data for charts
  function genTrend(name, key) {
    return Array.from({ length: 12 }).map((_, i) => ({
      time: `T${i+1}`,
      name,
      value: Math.floor(Math.random() * (key === 'latency' ? 500 : key === 'errors' ? 10 : 100)) + (key === 'latency' ? 100 : 0)
    }));
  }
  const agentData = agents.map(a => {
    const stats = a.usageStats || { invocations: 0, success: 0, error: 0 };
    return {
      name: a.name,
      Uptime: stats.invocations > 0 ? Math.floor((stats.success / stats.invocations) * 100) : 100,
      Errors: stats.error,
      Latency: Math.floor(Math.random() * 500) + 100,
      Requests: stats.invocations
    };
  });
  const mcpData = mcpServers.map(m => ({
    name: m.name,
    Uptime: Math.floor(Math.random() * 5) + 95,
    Errors: Math.floor(Math.random() * 2),
    Latency: Math.floor(Math.random() * 500) + 100,
    Requests: Math.floor(Math.random() * 1000)
  }));

  const isDark = document.body.getAttribute('data-color-scheme') === 'dark';
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Agent Metrics</div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={agentData} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
          <XAxis dataKey="name" fontSize={12} stroke={isDark ? '#e0e6ed' : '#222'} />
          <YAxis fontSize={12} stroke={isDark ? '#e0e6ed' : '#222'} />
          <Tooltip wrapperStyle={{ background: isDark ? '#23272f' : '#fff', color: isDark ? '#e0e6ed' : '#222', borderRadius: 8, border: isDark ? '1px solid #444' : '1px solid #e0e6ed' }} />
          <Legend wrapperStyle={{ color: isDark ? '#e0e6ed' : '#222' }} />
          <Bar dataKey="Uptime" fill={isDark ? '#32b8c6' : '#32b8c6'} radius={[8,8,0,0]} />
          <Bar dataKey="Errors" fill={isDark ? '#ff5459' : '#ff5459'} radius={[8,8,0,0]} />
          <Bar dataKey="Latency" fill={isDark ? '#b0b8c1' : '#626c71'} radius={[8,8,0,0]} />
          <Bar dataKey="Requests" fill={isDark ? '#a3e635' : '#a3e635'} radius={[8,8,0,0]} />
        </BarChart>
      </ResponsiveContainer>
      {/* Agent Error Rate Trend */}
      <div style={{ fontWeight: 500, fontSize: 15, margin: '24px 0 8px 0' }}>Agent Error Rate Trend</div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={genTrend(agentData[0]?.name || 'Agent', 'errors')}>
          <XAxis dataKey="time" fontSize={12} stroke={isDark ? '#e0e6ed' : '#222'} />
          <YAxis fontSize={12} stroke={isDark ? '#e0e6ed' : '#222'} />
          <Tooltip wrapperStyle={{ background: isDark ? '#23272f' : '#fff', color: isDark ? '#e0e6ed' : '#222', borderRadius: 8, border: isDark ? '1px solid #444' : '1px solid #e0e6ed' }} />
          <Line type="monotone" dataKey="value" stroke={isDark ? '#ff5459' : '#ff5459'} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      {/* Agent Latency Trend */}
      <div style={{ fontWeight: 500, fontSize: 15, margin: '24px 0 8px 0' }}>Agent Latency Trend</div>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={genTrend(agentData[0]?.name || 'Agent', 'latency')}>
          <XAxis dataKey="time" fontSize={12} stroke={isDark ? '#e0e6ed' : '#222'} />
          <YAxis fontSize={12} stroke={isDark ? '#e0e6ed' : '#222'} />
          <Tooltip wrapperStyle={{ background: isDark ? '#23272f' : '#fff', color: isDark ? '#e0e6ed' : '#222', borderRadius: 8, border: isDark ? '1px solid #444' : '1px solid #e0e6ed' }} />
          <Area type="monotone" dataKey="value" stroke={isDark ? '#b0b8c1' : '#626c71'} fill={isDark ? '#23272f' : '#e0e7ef'} />
        </AreaChart>
      </ResponsiveContainer>
      {/* MCP Server Metrics */}
      <div style={{ fontWeight: 600, fontSize: 16, margin: '32px 0 8px 0' }}>MCP Server Metrics</div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={mcpData} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
          <XAxis dataKey="name" fontSize={12} stroke={isDark ? '#e0e6ed' : '#222'} />
          <YAxis fontSize={12} stroke={isDark ? '#e0e6ed' : '#222'} />
          <Tooltip wrapperStyle={{ background: isDark ? '#23272f' : '#fff', color: isDark ? '#e0e6ed' : '#222', borderRadius: 8, border: isDark ? '1px solid #444' : '1px solid #e0e6ed' }} />
          <Legend wrapperStyle={{ color: isDark ? '#e0e6ed' : '#222' }} />
          <Bar dataKey="Uptime" fill={isDark ? '#32b8c6' : '#32b8c6'} radius={[8,8,0,0]} />
          <Bar dataKey="Errors" fill={isDark ? '#ff5459' : '#ff5459'} radius={[8,8,0,0]} />
          <Bar dataKey="Latency" fill={isDark ? '#b0b8c1' : '#626c71'} radius={[8,8,0,0]} />
          <Bar dataKey="Requests" fill={isDark ? '#a3e635' : '#a3e635'} radius={[8,8,0,0]} />
        </BarChart>
      </ResponsiveContainer>
      {/* MCP Error Rate Trend */}
      <div style={{ fontWeight: 500, fontSize: 15, margin: '24px 0 8px 0' }}>MCP Error Rate Trend</div>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={genTrend(mcpData[0]?.name || 'MCP', 'errors')}>
          <XAxis dataKey="time" fontSize={12} stroke={isDark ? '#e0e6ed' : '#222'} />
          <YAxis fontSize={12} stroke={isDark ? '#e0e6ed' : '#222'} />
          <Tooltip wrapperStyle={{ background: isDark ? '#23272f' : '#fff', color: isDark ? '#e0e6ed' : '#222', borderRadius: 8, border: isDark ? '1px solid #444' : '1px solid #e0e6ed' }} />
          <Line type="monotone" dataKey="value" stroke={isDark ? '#ff5459' : '#ff5459'} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
      {/* MCP Latency Trend */}
      <div style={{ fontWeight: 500, fontSize: 15, margin: '24px 0 8px 0' }}>MCP Latency Trend</div>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={genTrend(mcpData[0]?.name || 'MCP', 'latency')}>
          <XAxis dataKey="time" fontSize={12} stroke={isDark ? '#e0e6ed' : '#222'} />
          <YAxis fontSize={12} stroke={isDark ? '#e0e6ed' : '#222'} />
          <Tooltip wrapperStyle={{ background: isDark ? '#23272f' : '#fff', color: isDark ? '#e0e6ed' : '#222', borderRadius: 8, border: isDark ? '1px solid #444' : '1px solid #e0e6ed' }} />
          <Area type="monotone" dataKey="value" stroke={isDark ? '#b0b8c1' : '#626c71'} fill={isDark ? '#23272f' : '#e0e7ef'} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonitorCharts;
