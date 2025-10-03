import React, { useCallback, useState, useRef, useEffect, useMemo } from 'react';
import { Handle, Position } from '@xyflow/react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { ReactFlow, MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';


const initialNodes = [
  { id: '1', type: 'agent', data: { label: 'Agent', icon: '🤖', color: '#4f8cff' }, position: { x: 100, y: 100 } },
  { id: '2', type: 'mcp', data: { label: 'MCP Server', icon: '🗄️', color: '#ffb84f' }, position: { x: 400, y: 100 } }
];
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true }
];

const AgentNode = ({ data }) => (
  <div style={{ background: data.color || '#4f8cff', color: '#fff', borderRadius: 8, padding: 8, minWidth: 80, textAlign: 'center', boxShadow: 'var(--shadow-sm)', fontWeight: 500, position: 'relative' }}>
    <Handle type="source" position={Position.Right} id="out" style={{ background: '#fff', border: '2px solid #4f8cff', width: 12, height: 12, top: '50%', right: -6, transform: 'translateY(-50%)' }} />
    <span style={{ fontSize: 22 }}>{data.icon || '🤖'}</span><br />
    {data.label}
    <Handle type="target" position={Position.Left} id="in" style={{ background: '#fff', border: '2px solid #4f8cff', width: 12, height: 12, top: '50%', left: -6, transform: 'translateY(-50%)' }} />
  </div>
);

const McpNode = ({ data }) => (
  <div style={{ background: data.color || '#ffb84f', color: '#222', borderRadius: 8, padding: 8, minWidth: 80, textAlign: 'center', boxShadow: 'var(--shadow-sm)', fontWeight: 500, position: 'relative' }}>
    <Handle type="source" position={Position.Right} id="out" style={{ background: '#222', border: '2px solid #ffb84f', width: 12, height: 12, top: '50%', right: -6, transform: 'translateY(-50%)' }} />
    <span style={{ fontSize: 22 }}>{data.icon || '🗄️'}</span><br />
    {data.label}
    <Handle type="target" position={Position.Left} id="in" style={{ background: '#222', border: '2px solid #ffb84f', width: 12, height: 12, top: '50%', left: -6, transform: 'translateY(-50%)' }} />
  </div>
);

const nodeTypes = {
  agent: AgentNode,
  mcp: McpNode
};

const BuilderView = ({ agents, mcpServers, onSaveAgent, onSaveMcp }) => {
  // Theme sync (observe body attribute like other views)
  const [theme, setTheme] = useState(() => document.body.getAttribute('data-color-scheme') || 'light');
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const attr = document.body.getAttribute('data-color-scheme') || 'light';
      setTheme(prev => (prev !== attr ? attr : prev));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-color-scheme'] });
    return () => observer.disconnect();
  }, []);
  const isDark = theme === 'dark';
  // Yjs setup
  const ydocRef = useRef();
  const nodesMapRef = useRef();
  const edgesMapRef = useRef();
  const [yReady, setYReady] = useState(false);
  useEffect(() => {
    if (!ydocRef.current) {
      const ydoc = new Y.Doc();
      ydocRef.current = ydoc;
      // Use a room name for your app, e.g. 'agent-mcp-builder'
      new WebsocketProvider('wss://demos.yjs.dev', 'agent-mcp-builder', ydoc);
      nodesMapRef.current = ydoc.getMap('nodes');
      edgesMapRef.current = ydoc.getMap('edges');
      setYReady(true);
    }
  }, []);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync Yjs state to ReactFlow state
  useEffect(() => {
    if (!yReady) return;
    const nodesMap = nodesMapRef.current;
    const edgesMap = edgesMapRef.current;
    // Initial sync from Yjs
    setNodes(Array.from(nodesMap.values()).length ? Array.from(nodesMap.values()) : initialNodes);
    setEdges(Array.from(edgesMap.values()).length ? Array.from(edgesMap.values()) : initialEdges);
    // Observe Yjs changes
    const nodesObserver = () => setNodes(Array.from(nodesMap.values()));
    const edgesObserver = () => setEdges(Array.from(edgesMap.values()));
    nodesMap.observe(nodesObserver);
    edgesMap.observe(edgesObserver);
    return () => {
      nodesMap.unobserve(nodesObserver);
      edgesMap.unobserve(edgesObserver);
    };
  }, [yReady]);
  const [editingNode, setEditingNode] = useState(null);
  const [editLabel, setEditLabel] = useState('');
  const [editType, setEditType] = useState('default');
  const [saveType, setSaveType] = useState('agent');
  const workspaceRef = useRef();
  // Palette search/filter and grouping
  const [paletteQuery, setPaletteQuery] = useState('');
  const [showAgents, setShowAgents] = useState(true);
  const [showMcps, setShowMcps] = useState(true);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, item: null });

  const onConnect = useCallback((params) => {
    setEdges((eds) => {
      const newEdge = { ...params, animated: true, id: `e${params.source}-${params.target}-${Date.now()}` };
      if (yReady) edgesMapRef.current.set(newEdge.id, newEdge);
      return [...eds, newEdge];
    });
  }, [yReady]);

  // Drag-to-add logic
  const handleDragStart = (type, label) => (e) => {
    e.dataTransfer.setData('nodeType', type);
    e.dataTransfer.setData('nodeLabel', label);
    e.dataTransfer.setData('nodeIcon', type === 'agent' ? '🤖' : '🗄️');
    e.dataTransfer.setData('nodeColor', type === 'agent' ? '#4f8cff' : '#ffb84f');
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('nodeType');
    const label = e.dataTransfer.getData('nodeLabel');
    const icon = e.dataTransfer.getData('nodeIcon');
    const color = e.dataTransfer.getData('nodeColor');
    const bounds = workspaceRef.current.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    const id = `${type}-${Date.now()}`;
    const newNode = { id, type, data: { label, icon, color }, position: { x, y } };
    setNodes((nds) => {
      if (yReady) nodesMapRef.current.set(id, newNode);
      return [...nds, newNode];
    });
  };
  const handleDragOver = (e) => e.preventDefault();

  // Node editing logic
  const handleNodeClick = (evt, node) => {
    setEditingNode(node);
    setEditLabel(node.data.label);
    setEditType(node.type);
  };
  const handleEditSave = () => {
    setNodes(nds => nds.map(n => {
      if (n.id === editingNode.id) {
        const updated = { ...n, data: { ...n.data, label: editLabel }, type: editType };
        if (yReady) nodesMapRef.current.set(n.id, updated);
        return updated;
      }
      return n;
    }));
    setEditingNode(null);
  };

  // Save workflow logic with validation and type
  const handleSaveWorkflow = () => {
  const agentNodes = nodes.filter(n => n.type === 'agent');
  const mcpNodes = nodes.filter(n => n.type === 'mcp');
    if (agentNodes.length === 0 || mcpNodes.length === 0) {
      alert('Please add at least one Agent and one MCP Server node before saving.');
      return;
    }
    const newItem = {
      id: `${saveType}-${Date.now()}`,
      name: editLabel || (saveType === 'agent' ? 'New Agent' : 'New MCP Server'),
      description: 'Created via Builder',
      type: editType,
      workflow: { nodes, edges }
    };
    if (saveType === 'agent' && onSaveAgent) onSaveAgent(prev => [...prev, newItem]);
    if (saveType === 'mcp' && onSaveMcp) onSaveMcp(prev => [...prev, newItem]);
    alert(`Workflow saved as new ${saveType === 'agent' ? 'agent' : 'MCP server'}!`);
  };

  return (
    <div className="view active" style={{
      position: 'relative',
      width: '100%',
      height: 'calc(100vh - 120px)', // adjust for header/nav
      background: isDark ? '#23272f' : 'var(--color-surface)',
      borderRadius: 12,
      padding: 0,
      boxShadow: isDark ? '0 4px 18px #1118' : 'var(--shadow-md)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      border: isDark ? '1px solid #444' : 'none',
      color: isDark ? '#e0e6ed' : '#222'
    }}>
      {!yReady && (
        <div style={{ background: isDark ? '#2d1f00' : '#ffe0e0', color: isDark ? '#ffcc02' : '#b00', padding: 12, borderRadius: 8, marginBottom: 16, fontWeight: 500, border: isDark ? '1px solid #444' : 'none' }}>
          Connecting to collaboration server...
        </div>
      )}
      <div style={{ padding: '24px 32px 0 32px' }}>
        <div style={{ fontWeight: 600, fontSize: 22, marginBottom: 8, color: isDark ? '#e0e6ed' : '#222' }}>🛠️ Agent & MCP Builder</div>
        <div style={{ fontSize: 15, color: isDark ? '#b0b8c1' : 'var(--color-text-secondary)', marginBottom: 16 }}>
          Drag and drop agents and MCP servers to visually build workflows. Connect nodes to define dependencies.<br />
          <span style={{ color: isDark ? '#32b8c6' : '#4f8cff', fontWeight: 500 }}>
            Real-time collaboration enabled! Open this builder in multiple tabs or devices to see live sync.
          </span>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', gap: 24, minHeight: 0, padding: '0 32px 0 32px' }}>
        {/* Node palette */}
  <div style={{ minWidth: 180, maxWidth: 220, flexShrink: 0, overflowY: 'auto', paddingBottom: 24, background: isDark ? '#1f242b' : 'transparent', borderRadius: 12 }}>
    <div style={{ fontWeight: 500, marginBottom: 8, color: isDark ? '#e0e6ed' : '#222' }}>Palette</div>
    <input
      type="text"
      value={paletteQuery}
      onChange={e => setPaletteQuery(e.target.value)}
      placeholder="Search agents/MCPs..."
      style={{ width: '100%', marginBottom: 10, padding: 7, borderRadius: 8, border: isDark ? '1px solid #444' : '1px solid var(--color-border)', fontSize: 14, background: isDark ? '#2c313a' : '#fff', color: isDark ? '#e0e6ed' : '#222' }}
      aria-label="Search palette"
    />
    <div style={{ marginBottom: 8 }}>
      <button
        className="nav-btn"
        style={{ fontSize: 14, marginBottom: 4, background: showAgents ? (isDark ? '#153a4a' : '#e0edff') : (isDark ? '#1e2d3a' : '#f4f8ff'), color: isDark ? '#32b8c6' : '#234', border: isDark ? '1px solid #31737d' : '1px solid #4f8cff', borderRadius: 8 }}
        onClick={() => setShowAgents(v => !v)}
      >{showAgents ? '▼' : '▶'} Agents</button>
      {showAgents && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          {agents.filter(a => a.name.toLowerCase().includes(paletteQuery.toLowerCase())).map(a => (
            <div
              key={a.id}
              draggable
              onDragStart={handleDragStart('agent', a.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: isDark ? '#1f2732' : '#f4f8ff',
                border: isDark ? '1px solid #31737d' : '1px solid #4f8cff',
                borderRadius: 10,
                padding: '8px 14px',
                fontWeight: 500,
                fontSize: 15,
                color: isDark ? '#e0e6ed' : '#234',
                cursor: 'grab',
                boxShadow: isDark ? '0 1px 4px #0008' : '0 1px 4px rgba(79,140,255,0.08)',
                transition: 'background 0.2s, box-shadow 0.2s',
                position: 'relative'
              }}
              onMouseDown={e => e.currentTarget.style.background = isDark ? '#2a3644' : '#e0edff'}
              onMouseUp={e => e.currentTarget.style.background = isDark ? '#1f2732' : '#f4f8ff'}
              onMouseLeave={e => { e.currentTarget.style.background = isDark ? '#1f2732' : '#f4f8ff'; setTooltip({ visible: false }); }}
              onMouseMove={e => {
                setTooltip({
                  visible: true,
                  x: e.clientX + 12,
                  y: e.clientY + 12,
                  item: { ...a, type: 'Agent' }
                });
              }}
              aria-label={`Drag ${a.name}`}
            >
              <span style={{ fontSize: 20, marginRight: 2 }}>🤖</span>
              {a.name}
            </div>
          ))}
        </div>
      )}
    </div>
    <div style={{ marginTop: 12 }}>
      <button
        className="nav-btn"
        style={{ fontSize: 14, marginBottom: 4, background: showMcps ? (isDark ? '#4a3615' : '#ffe6b3') : (isDark ? '#3a2a10' : '#fff7e6'), color: isDark ? '#ffce80' : '#7a4f00', border: '1px solid #ffb84f', borderRadius: 8 }}
        onClick={() => setShowMcps(v => !v)}
      >{showMcps ? '▼' : '▶'} MCP Servers</button>
      {showMcps && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
          {mcpServers.filter(m => m.name.toLowerCase().includes(paletteQuery.toLowerCase())).map(m => (
            <div
              key={m.id}
              draggable
              onDragStart={handleDragStart('mcp', m.name)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: isDark ? '#3a2a10' : '#fff7e6',
                border: '1px solid #ffb84f',
                borderRadius: 10,
                padding: '8px 14px',
                fontWeight: 500,
                fontSize: 15,
                color: isDark ? '#ffce80' : '#7a4f00',
                cursor: 'grab',
                boxShadow: isDark ? '0 1px 4px #0008' : '0 1px 4px rgba(255,184,79,0.08)',
                transition: 'background 0.2s, box-shadow 0.2s',
                position: 'relative'
              }}
              onMouseDown={e => e.currentTarget.style.background = isDark ? '#4a3615' : '#ffe6b3'}
              onMouseUp={e => e.currentTarget.style.background = isDark ? '#3a2a10' : '#fff7e6'}
              onMouseLeave={e => { e.currentTarget.style.background = isDark ? '#3a2a10' : '#fff7e6'; setTooltip({ visible: false }); }}
              onMouseMove={e => {
                setTooltip({
                  visible: true,
                  x: e.clientX + 12,
                  y: e.clientY + 12,
                  item: { ...m, type: 'MCP Server' }
                });
              }}
              aria-label={`Drag ${m.name}`}
            >
              <span style={{ fontSize: 20, marginRight: 2 }}>🗄️</span>
              {m.name}
            </div>
          ))}
        </div>
      )}
    </div>
        </div>
        {/* Advanced tooltip for palette items */}
        {tooltip.visible && tooltip.item && (
          <div style={{
            position: 'fixed',
            left: tooltip.x,
            top: tooltip.y,
            zIndex: 9999,
            background: isDark ? '#23272f' : '#fff',
            border: isDark ? '1px solid #444' : '1px solid #ddd',
            borderRadius: 10,
            boxShadow: isDark ? '0 4px 16px #0009' : '0 2px 12px rgba(0,0,0,0.12)',
            padding: '14px 18px',
            minWidth: 220,
            maxWidth: 320,
            color: isDark ? '#e0e6ed' : '#222',
            fontSize: 15,
            pointerEvents: 'none'
          }}>
            <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 4 }}>
              {tooltip.item.type === 'Agent' ? '🤖' : '🗄️'} {tooltip.item.name}
            </div>
            <div style={{ fontSize: 14, color: isDark ? '#32b8c6' : '#4f8cff', marginBottom: 6 }}>{tooltip.item.type}</div>
            <div style={{ fontSize: 14, marginBottom: 6, color: isDark ? '#b0b8c1' : '#222' }}>{tooltip.item.description || 'No description.'}</div>
            {tooltip.item.tags && tooltip.item.tags.length > 0 && (
              <div style={{ fontSize: 13, color: isDark ? '#888' : '#888', marginBottom: 2 }}>
                Tags: {tooltip.item.tags.join(', ')}
              </div>
            )}
          </div>
        )}
        {/* ReactFlow workspace */}
        <div
          ref={workspaceRef}
          style={{
            flex: 1,
            minHeight: 0,
            height: '100%',
            background: isDark ? '#1f242b' : '#fff',
            borderRadius: 8,
            overflow: 'hidden',
            display: 'flex'
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={handleNodeClick}
            fitView
            attributionPosition="top-right"
            nodeTypes={nodeTypes}
            style={{ width: '100%', height: '100%', background: isDark ? '#1f242b' : '#fff', color: isDark ? '#e0e6ed' : '#222' }}
          >
            <MiniMap zoomable pannable />
            <Controls />
            <Background color={isDark ? '#333' : '#eaeaea'} gap={24} />
          </ReactFlow>
        </div>
      </div>
      <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
        <label>Save as:</label>
        <select value={saveType} onChange={e => setSaveType(e.target.value)} style={{ padding: 8, borderRadius: 8, border: isDark ? '1px solid #444' : '1px solid var(--color-border)', fontSize: 14, background: isDark ? '#2c313a' : '#fff', color: isDark ? '#e0e6ed' : '#222' }}>
          <option value="agent">Agent</option>
          <option value="mcp">MCP Server</option>
        </select>
        <button className="nav-btn" onClick={handleSaveWorkflow}>Save Workflow</button>
        <button className="nav-btn" onClick={() => {
          const data = JSON.stringify({ nodes, edges }, null, 2);
          const blob = new Blob([data], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'workflow.json';
          a.click();
          URL.revokeObjectURL(url);
        }}>Export Workflow</button>
        <input type="file" accept="application/json" style={{ display: 'none' }} id="import-workflow" onChange={e => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = evt => {
            try {
              const data = JSON.parse(evt.target.result);
              setNodes(data.nodes || []);
              setEdges(data.edges || []);
              alert('Workflow imported!');
            } catch {
              alert('Invalid workflow file.');
            }
          };
          reader.readAsText(file);
        }} />
        <button className="nav-btn" onClick={() => document.getElementById('import-workflow').click()}>Import Workflow</button>
      </div>
      {/* Node editing modal */}
      {editingNode && (
        <div style={{ position: 'fixed', top: 80, left: 0, right: 0, margin: '0 auto', maxWidth: 360, background: isDark ? '#23272f' : '#fff', borderRadius: 12, boxShadow: isDark ? '0 4px 16px #0009' : 'var(--shadow-md)', padding: 24, zIndex: 1000, border: isDark ? '1px solid #444' : 'none', color: isDark ? '#e0e6ed' : '#222' }}>
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12 }}>Edit Node</div>
          <div style={{ marginBottom: 8 }}>
            <label>Label:</label>
            <input type="text" value={editLabel} onChange={e => setEditLabel(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, border: isDark ? '1px solid #444' : '1px solid var(--color-border)', fontSize: 14, background: isDark ? '#2c313a' : '#fff', color: isDark ? '#e0e6ed' : '#222' }} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Type:</label>
            <select value={editType} onChange={e => setEditType(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, border: isDark ? '1px solid #444' : '1px solid var(--color-border)', fontSize: 14, background: isDark ? '#2c313a' : '#fff', color: isDark ? '#e0e6ed' : '#222' }}>
              <option value="agent">Agent</option>
              <option value="mcp">MCP Server</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button className="nav-btn" onClick={handleEditSave}>Save</button>
            <button className="nav-btn" style={{ background: isDark ? '#ff5459' : 'var(--color-error)' }} onClick={() => setEditingNode(null)}>Cancel</button>
            <button className="nav-btn" style={{ background: isDark ? '#ff5459' : 'var(--color-error)' }} onClick={() => {
              setNodes(nds => {
                if (yReady) nodesMapRef.current.delete(editingNode.id);
                return nds.filter(n => n.id !== editingNode.id);
              });
              setEditingNode(null);
            }}>Delete Node</button>
          </div>
        </div>
      )}
      {/* Edge delete support: right-click edge to delete */}
      <style>{`
        .react-flow__edge-path { cursor: pointer; }
      `}</style>
      <script>{`
        document.querySelectorAll('.react-flow__edge-path').forEach(edge => {
          edge.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            const edgeId = edge.getAttribute('data-id');
            if (edgeId) {
              if (window.yReady) {
                window.edgesMapRef.current.delete(edgeId);
              }
              setEdges(eds => eds.filter(ed => ed.id !== edgeId));
            }
          });
        });
      `}</script>
    </div>
  );
};

export default BuilderView;
