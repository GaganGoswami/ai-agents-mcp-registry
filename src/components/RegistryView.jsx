import React from 'react';
import Dashboard from './Dashboard';

/**
 * RegistryView: New dedicated tab that shows only Agents & MCP servers lists with filters.
 * Reuses Dashboard component with selective sections disabled (charts, logs, graph, recommendations).
 */
const RegistryView = (props) => {
  return (
    <Dashboard
      {...props}
      sections={{
        showFilters: true,
        showLists: true,
        showCharts: false,
        showLogs: false,
        showGraph: false,
        showRecommendations: false
      }}
    />
  );
};

export default RegistryView;
