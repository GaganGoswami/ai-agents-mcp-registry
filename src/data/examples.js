// Example data for agents and MCP servers
export const EXAMPLE_AGENTS = [
  {
    id: 'rag-agent',
    name: 'RAG Agent',
    description: 'Retrieval-Augmented Generation agent using LangChain',
    type: 'rag',
    endpoint: 'http://localhost:8000/rag',
    compatible: ['langchain', 'openai', 'postgresql'],
    status: 'online',
    instructions: '1. Install: pip install langchain\n2. Connect: from langchain import Agent; agent = Agent(endpoint="http://localhost:8000/rag")',
    tags: ['rag', 'nlp', 'postgresql'],
    versions: [{v: '1.0', changelog: 'Initial release'}],
    dependencies: ['postgres-mcp'],
    usageStats: {invocations: 100, success: 98, error: 2},
    auditLogs: [],
    comments: [],
    visibility: 'public',
  verified: true,
  pricingModel: 'Subscription',
  governanceStatus: 'approved'
  },
  {
    id: 'chatbot',
    name: 'AI Chatbot',
    description: 'Streaming chatbot with tool calling',
    type: 'chatbot',
    endpoint: 'http://localhost:8001/chat',
    compatible: ['crewai', 'anthropic'],
    status: 'offline',
    instructions: '1. Install: pip install crewai\n2. Connect: from crewai import Chatbot; bot = Chatbot(endpoint="http://localhost:8001/chat")',
    tags: ['chatbot', 'streaming'],
    versions: [{v: '1.0', changelog: 'Initial release'}],
    dependencies: [],
    usageStats: {invocations: 50, success: 45, error: 5},
    auditLogs: [],
    comments: [],
    visibility: 'private',
  verified: true,
  pricingModel: 'Free',
  governanceStatus: 'pending'
  },
  {
    id: 'web-research',
    name: 'Web Research Agent',
    description: 'Automated web research and summarization',
    type: 'web-research',
    endpoint: 'http://localhost:8002/research',
    compatible: ['serpapi', 'langchain'],
    status: 'online',
    instructions: '1. Install: pip install serpapi\n2. Connect: agent = WebResearchAgent(endpoint="http://localhost:8002/research")',
    tags: ['web-research', 'summarization'],
    versions: [{v: '1.0', changelog: 'Initial release'}],
    dependencies: [],
    usageStats: {invocations: 30, success: 29, error: 1},
    auditLogs: [],
    comments: [],
  visibility: 'public',
  pricingModel: 'Pay-per-use',
  governanceStatus: 'approved'
  },
  {
    id: 'process-automator',
    name: 'Process Automator',
    description: 'Automates business processes and workflows',
    type: 'automator',
    endpoint: 'http://localhost:8003/automate',
    compatible: ['airflow', 'python'],
    status: 'online',
    instructions: '1. Install: pip install airflow\n2. Connect: automator = ProcessAutomator(endpoint="http://localhost:8003/automate")',
    tags: ['automator', 'workflow'],
    versions: [{v: '1.0', changelog: 'Initial release'}],
    dependencies: [],
    usageStats: {invocations: 20, success: 20, error: 0},
    auditLogs: [],
    comments: [],
  visibility: 'public',
  pricingModel: 'Enterprise',
  governanceStatus: 'rejected'
  },
  {
    id: 'code-assistant-mcp',
    name: 'Code Assistant (MCP)',
    description: 'Code assistant with MCP integration',
    type: 'code-assistant',
    endpoint: 'http://localhost:8004/code',
    compatible: ['mcp', 'github'],
    status: 'offline',
    instructions: '1. Install: npm install mcp-sdk\n2. Connect: assistant = CodeAssistant(endpoint="http://localhost:8004/code")',
    tags: ['code', 'assistant', 'mcp'],
    versions: [{v: '1.0', changelog: 'Initial release'}],
    dependencies: ['github-mcp'],
    usageStats: {invocations: 10, success: 9, error: 1},
    auditLogs: [],
    comments: [],
  visibility: 'private',
  pricingModel: 'Custom'
  },
  {
    id: 'multimodal',
    name: 'Multimodal Assistant',
    description: 'Handles text, image, and audio inputs',
    type: 'multimodal',
    endpoint: 'http://localhost:8005/multimodal',
    compatible: ['openai', 'anthropic'],
    status: 'online',
    instructions: '1. Install: pip install openai\n2. Connect: assistant = MultimodalAssistant(endpoint="http://localhost:8005/multimodal")',
    tags: ['multimodal', 'assistant'],
    versions: [{v: '1.0', changelog: 'Initial release'}],
    dependencies: [],
    usageStats: {invocations: 5, success: 5, error: 0},
    auditLogs: [],
    comments: [],
  visibility: 'public',
  pricingModel: 'Free'
  },
  {
    id: 'local-first',
    name: 'Local-First Agent',
    description: 'Runs locally for privacy and speed',
    type: 'local-first',
    endpoint: 'http://localhost:8006/local',
    compatible: ['sqlite', 'python'],
    status: 'online',
    instructions: '1. Install: pip install sqlite3\n2. Connect: agent = LocalFirstAgent(endpoint="http://localhost:8006/local")',
    tags: ['local', 'privacy'],
    versions: [{v: '1.0', changelog: 'Initial release'}],
    dependencies: [],
    usageStats: {invocations: 2, success: 2, error: 0},
    auditLogs: [],
    comments: [],
  visibility: 'private',
  pricingModel: 'Subscription'
  }
];

export const EXAMPLE_MCP_SERVERS = [
  {
    id: 'slack-mcp',
    name: 'Slack MCP Server',
    description: 'MCP server for Slack integration',
    endpoint: 'http://mcp.slack:9000',
    compatible: ['anthropic', 'claude'],
    status: 'online',
    instructions: '1. Install MCP SDK: npm install mcp-sdk\n2. Attach: mcp.attach("http://mcp.slack:9000", {token: "your-slack-token"})',
    versions: [
      { v: '1.0', changelog: 'Initial release' },
      { v: '1.1', changelog: 'Added Slack events support' }
    ],
  verified: true,
  pricingModel: 'Enterprise'
  },
  {
    id: 'github-mcp',
    name: 'GitHub MCP Server',
    description: 'MCP server for GitHub automation',
    endpoint: 'http://mcp.github:9001',
    compatible: ['github', 'mcp'],
    status: 'online',
    instructions: '1. Install MCP SDK: npm install mcp-sdk\n2. Attach: mcp.attach("http://mcp.github:9001", {token: "your-github-token"})',
    versions: [
      { v: '1.0', changelog: 'Initial release' },
      { v: '1.2', changelog: 'Added GitHub Actions integration' }
    ],
  verified: true,
  pricingModel: 'Subscription'
  },
  {
    id: 'postgres-mcp',
    name: 'Postgres MCP Server',
    description: 'MCP server for Postgres database',
    endpoint: 'http://mcp.postgres:9002',
    compatible: ['postgresql', 'mcp'],
    status: 'offline',
    instructions: '1. Install MCP SDK: npm install mcp-sdk\n2. Attach: mcp.attach("http://mcp.postgres:9002", {token: "your-postgres-token"})'
      ,
      versions: [
        { v: '1.0', changelog: 'Initial release' },
        { v: '1.1', changelog: 'Improved connection pooling' }
      ],
    pricingModel: 'Pay-per-use'
  },
  {
    id: 'google-drive-mcp',
    name: 'Google Drive MCP Server',
    description: 'MCP server for Google Drive integration',
    endpoint: 'http://mcp.drive:9003',
    compatible: ['google-drive', 'mcp'],
    status: 'online',
    instructions: '1. Install MCP SDK: npm install mcp-sdk\n2. Attach: mcp.attach("http://mcp.drive:9003", {token: "your-drive-token"})'
      ,
      versions: [
        { v: '1.0', changelog: 'Initial release' },
        { v: '1.1', changelog: 'Added folder sync support' }
      ],
    pricingModel: 'Custom'
  },
  {
    id: 'puppeteer-mcp',
    name: 'Puppeteer MCP Server',
    description: 'MCP server for browser automation',
    endpoint: 'http://mcp.puppeteer:9004',
    compatible: ['puppeteer', 'mcp'],
    status: 'offline',
    instructions: '1. Install MCP SDK: npm install mcp-sdk\n2. Attach: mcp.attach("http://mcp.puppeteer:9004", {token: "your-puppeteer-token"})'
      ,
      versions: [
        { v: '1.0', changelog: 'Initial release' },
        { v: '1.1', changelog: 'Added screenshot API' }
      ],
    pricingModel: 'Free'
  }
];
