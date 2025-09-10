# AgentMatrix Demo Script

## Overview
AgentMatrix is a comprehensive registry and monitoring dashboard for AI agents and MCP (Model Context Protocol) servers. This demo will showcase the complete feature set including registration, governance, monitoring, and builder capabilities.

---

## Pre-Demo Setup

### Audience Context
- **Target Audience**: DevOps teams, AI developers, platform administrators
- **Demo Duration**: 15-20 minutes
- **Key Value Props**: Centralized management, governance controls, real-time monitoring

### Prerequisites
- Application running locally
- Sample data loaded (agents and MCP servers)
- Different user roles prepared (admin, developer, viewer)

---

## Demo Flow

### 1. Authentication & Role-Based Access (2 minutes)

#### Login as Viewer
```
"Let's start by logging in as a viewer to see the basic functionality."
```

**Actions:**
- Open the application
- Show the login screen
- Log in as: `viewer` / `viewer123`
- **Highlight**: Clean, modern interface with dark/light mode toggle

**Key Points:**
- Role-based access control
- Responsive design
- Theme switching capability

#### Switch to Developer Role
```
"Now let's see what additional capabilities developers have."
```

**Actions:**
- Sign out and log in as: `developer` / `dev123`
- **Highlight**: Builder tab now visible in navigation

### 2. Dashboard Overview (3 minutes)

```
"The Dashboard provides real-time analytics and monitoring for all registered agents and MCP servers."
```

#### Analytics Overview
**Actions:**
- Navigate to Dashboard tab
- **Show**: Live statistics (total agents, MCP servers, online status)
- **Highlight**: Real-time updates (numbers changing)
- **Point out**: Success rates, error tracking

#### Monitoring Features
**Actions:**
- Scroll to monitoring charts section
- **Show**: Usage graphs, performance metrics
- **Highlight**: Alert system (if errors > 10)
- **Demonstrate**: Log viewer with audit trails

#### Dependency Visualization
**Actions:**
- Show dependency graph
- **Explain**: Visual representation of agent-MCP relationships
- **Highlight**: Recommended pairings section

```
"Notice how the system automatically suggests optimal pairings between agents and MCP servers based on usage patterns and compatibility."
```

### 3. Registry Management (4 minutes)

```
"The Registry is where you manage your inventory of agents and MCP servers."
```

#### Navigation & Filtering
**Actions:**
- Navigate to Registry tab
- **Show**: Sidebar with filters (pricing model, tags, verification status)
- **Demonstrate**: Search functionality
- **Use filters**: Select "Free" pricing model, filter by "productivity" tag

#### Agent & MCP Server Lists
**Actions:**
- Browse through agent cards
- Click on an agent to view details
- **Show**: Detailed view with configuration, usage stats, governance status
- **Highlight**: Edit capabilities, version history

#### Registration Workflow
**Actions:**
- Click "+ Register" button
- **Show**: Step-by-step wizard
- Fill out sample agent registration:
  - **Name**: "Demo Assistant"
  - **Type**: Agent
  - **Description**: "AI assistant for demo purposes"
  - **Tags**: productivity, demo
- **Complete registration**

```
"The registration wizard guides users through the complete setup process, ensuring all necessary information is captured for proper governance and monitoring."
```

#### NLP Registration Demo
**Actions:**
- Click "NLP Register" button
- **Show**: Natural language input field
- **Check**: "Simulate NLP registration" checkbox
- **Type**: "Create an MCP server for database queries with PostgreSQL support"
- **Submit**: Show how it creates a structured entry

```
"Our NLP registration feature allows users to describe their agents or MCP servers in plain English, and the system automatically structures the information."
```

### 4. Advanced Registration Features (2 minutes)

#### Import/Export Functionality
**Actions:**
- Click "Export" button
- **Show**: Downloaded JSON file with registry data
- Click "Import" button
- **Demonstrate**: File upload interface

```
"Teams can easily migrate configurations between environments or share agent definitions across organizations."
```

### 5. Admin Capabilities - Governance (3 minutes)

```
"Now let's switch to admin role to see governance and administrative features."
```

#### Admin Login
**Actions:**
- Sign out and log in as: `admin` / `admin123`
- **Highlight**: Governance tab now visible

#### Governance Dashboard
**Actions:**
- Navigate to Governance tab
- **Show**: Registry sidebar alongside governance controls
- **Highlight**: Items with different governance statuses (pending, approved, rejected)

#### Approval Workflow
**Actions:**
- Find pending items
- **Demonstrate**: Approve an agent
- **Show**: Status change in real-time
- **Demonstrate**: Reject an MCP server with reason

```
"The governance system ensures that only approved and compliant agents and MCP servers are deployed in production environments."
```

#### Unregistration
**Actions:**
- Go to details view of an item
- **Show**: Unregister button (admin only)
- **Demonstrate**: Confirmation dialog

### 6. Builder Interface (2 minutes)

```
"The Builder provides a development environment for creating and testing agents and MCP servers."
```

#### Builder Overview
**Actions:**
- Navigate to Builder tab
- **Show**: Development interface
- **Highlight**: Integration with existing registry data

```
"Developers can prototype, test, and deploy new agents directly from this interface, with automatic integration into the registry and governance workflow."
```

### 7. Advanced Features Showcase (2 minutes)

#### Real-time Updates
**Actions:**
- Keep dashboard open
- **Show**: Usage statistics incrementing
- **Point out**: Audit log entries appearing

#### Search & Discovery
**Actions:**
- Use search bar with various queries
- **Show**: Tag-based filtering
- **Demonstrate**: Quick navigation between items

#### Dark/Light Mode
**Actions:**
- Toggle theme switcher
- **Show**: Consistent theming across all components

### 8. Use Cases & Benefits (1 minute)

```
"Let me summarize the key use cases this platform addresses:"
```

#### Enterprise Scenarios
- **Multi-team coordination**: Centralized registry prevents duplication
- **Compliance**: Governance workflow ensures regulatory adherence
- **Monitoring**: Real-time visibility into AI infrastructure health
- **Discovery**: Teams can find and reuse existing agents/MCPs

#### Developer Benefits
- **Self-service registration**: Reduced deployment friction
- **NLP interface**: Non-technical users can register resources
- **Version control**: Track changes and rollbacks
- **Analytics**: Data-driven optimization decisions

---

## Demo Closing

### Key Takeaways
```
"AgentMatrix provides enterprise-grade management for AI infrastructure with:"
```

1. **Centralized Registry**: Single source of truth for all AI agents and MCP servers
2. **Governance Controls**: Approval workflows and compliance tracking
3. **Real-time Monitoring**: Live analytics and performance metrics
4. **Role-based Access**: Appropriate permissions for different user types
5. **Developer Friendly**: Self-service registration and NLP interfaces
6. **Enterprise Ready**: Import/export, audit trails, and dependency tracking

### Next Steps
- **Pilot Program**: Start with a small team/project
- **Integration**: Connect with existing CI/CD pipelines
- **Customization**: Adapt governance workflows to organizational needs
- **Scaling**: Expand to enterprise-wide deployment

---

## Troubleshooting & FAQs

### Common Demo Issues
- **Login not working**: Check user credentials in demo setup
- **Real-time updates not showing**: Refresh browser or restart application
- **Registration fails**: Ensure all required fields are completed

### Audience Questions Preparation
- **Q**: How does this integrate with existing infrastructure?
- **A**: RESTful APIs, webhook support, and standard export formats

- **Q**: What about security and authentication?
- **A**: Role-based access control, audit logging, and enterprise SSO support

- **Q**: Can we customize governance workflows?
- **A**: Yes, approval processes can be configured per organizational requirements

- **Q**: How does the NLP registration work?
- **A**: Uses AI to parse natural language descriptions into structured metadata

---

## Demo Variations

### Technical Audience (Extended)
- Deep dive into API endpoints
- Show configuration files and data structures
- Demonstrate integration possibilities

### Executive Audience (Shortened)
- Focus on business value and ROI
- Emphasize governance and compliance benefits
- Highlight cost savings from reduced duplication

### Developer Audience
- Extended builder interface demo
- Show registration wizard details
- Demonstrate import/export capabilities

---

## Post-Demo Resources

### Documentation Links
- User Guide: `README.md`
- API Documentation: `/docs/api`
- Configuration Guide: `/docs/config`

### Sample Files
- Export sample: `public/sample-registry.json`
- Configuration templates: `/docs/templates`

### Contact Information
- Technical Support: [support@agentmatrix.com]
- Sales Inquiries: [sales@agentmatrix.com]
- Documentation: [docs.agentmatrix.com]
