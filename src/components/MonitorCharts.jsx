import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

/**
 * MonitorCharts: metrics dashboard for agents and MCP servers
 * @param {Object} props
 * @param {Array} props.agents
 * @param {Array} props.mcpServers
 */
const MonitorCharts = ({ agents, mcpServers }) => {
  // Prepare data for charts
  const agentData = agents.map(a => {
    const stats = a.usageStats || { invocations: 0, success: 0, error: 0 };
    return {
      name: a.name,
      Uptime: stats.invocations > 0 ? Math.floor((stats.success / stats.invocations) * 100) : 100,
      Errors: stats.error,
      Latency: Math.floor(Math.random() * 500) + 100
    };
  });
  const mcpData = mcpServers.map(m => ({
    name: m.name,
    Uptime: Math.floor(Math.random() * 5) + 95,
    Errors: Math.floor(Math.random() * 2),
    Latency: Math.floor(Math.random() * 500) + 100
  }));

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Agent Metrics</div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={agentData} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
          <XAxis dataKey="name" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Uptime" fill="#32b8c6" radius={[8,8,0,0]} />
          <Bar dataKey="Errors" fill="#ff5459" radius={[8,8,0,0]} />
          <Bar dataKey="Latency" fill="#626c71" radius={[8,8,0,0]} />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ fontWeight: 600, fontSize: 16, margin: '32px 0 8px 0' }}>MCP Server Metrics</div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={mcpData} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
          <XAxis dataKey="name" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Uptime" fill="#32b8c6" radius={[8,8,0,0]} />
          <Bar dataKey="Errors" fill="#ff5459" radius={[8,8,0,0]} />
          <Bar dataKey="Latency" fill="#626c71" radius={[8,8,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonitorCharts;
