import React, { useCallback, useState, useRef, useEffect } from 'react';
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

const BuilderView = ({ agents, mcpServers, onSaveAgent, onSaveMcp }) => {
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
    <div className="view active" style={{ maxWidth: 900, margin: '0 auto', background: 'var(--color-surface)', borderRadius: 12, padding: 24, boxShadow: 'var(--shadow-md)' }}>
      <div style={{ fontWeight: 600, fontSize: 22, marginBottom: 8 }}>🛠️ Agent & MCP Builder</div>
      <div style={{ fontSize: 15, color: 'var(--color-text-secondary)', marginBottom: 16 }}>
        Drag and drop agents and MCP servers to visually build workflows. Connect nodes to define dependencies.
      </div>
      <div style={{ display: 'flex', gap: 24 }}>
        {/* Node palette */}
        <div style={{ minWidth: 180 }}>
          <div style={{ fontWeight: 500, marginBottom: 8 }}>Palette</div>
          <div style={{ marginBottom: 8 }}>
            <b>Agents:</b>
            <ul style={{ paddingLeft: 16 }}>
              {agents.map(a => (
                <li key={a.id} draggable onDragStart={handleDragStart('agent', a.name)} style={{ cursor: 'grab', marginBottom: 4 }}>{a.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <b>MCP Servers:</b>
            <ul style={{ paddingLeft: 16 }}>
              {mcpServers.map(m => (
                <li key={m.id} draggable onDragStart={handleDragStart('mcp', m.name)} style={{ cursor: 'grab', marginBottom: 4 }}>{m.name}</li>
              ))}
            </ul>
          </div>
        </div>
        {/* ReactFlow workspace */}
        <div
          ref={workspaceRef}
          style={{ flex: 1, height: 500, background: '#fff', borderRadius: 8 }}
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
            nodeTypes={{
              agent: ({ data }) => (
                <div style={{ background: data.color || '#4f8cff', color: '#fff', borderRadius: 8, padding: 8, minWidth: 80, textAlign: 'center', boxShadow: 'var(--shadow-sm)', fontWeight: 500 }}>
                  <span style={{ fontSize: 22 }}>{data.icon || '🤖'}</span><br />
                  {data.label}
                </div>
              ),
              mcp: ({ data }) => (
                <div style={{ background: data.color || '#ffb84f', color: '#222', borderRadius: 8, padding: 8, minWidth: 80, textAlign: 'center', boxShadow: 'var(--shadow-sm)', fontWeight: 500 }}>
                  <span style={{ fontSize: 22 }}>{data.icon || '🗄️'}</span><br />
                  {data.label}
                </div>
              )
            }}
          >
            <MiniMap zoomable pannable />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      </div>
      <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
        <label>Save as:</label>
        <select value={saveType} onChange={e => setSaveType(e.target.value)} style={{ padding: 8, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }}>
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
        <div style={{ position: 'fixed', top: 80, left: 0, right: 0, margin: '0 auto', maxWidth: 340, background: '#fff', borderRadius: 12, boxShadow: 'var(--shadow-md)', padding: 24, zIndex: 1000 }}>
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 12 }}>Edit Node</div>
          <div style={{ marginBottom: 8 }}>
            <label>Label:</label>
            <input type="text" value={editLabel} onChange={e => setEditLabel(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label>Type:</label>
            <select value={editType} onChange={e => setEditType(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }}>
              <option value="agent">Agent</option>
              <option value="mcp">MCP Server</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button className="nav-btn" onClick={handleEditSave}>Save</button>
            <button className="nav-btn" style={{ background: 'var(--color-error)' }} onClick={() => setEditingNode(null)}>Cancel</button>
            <button className="nav-btn" style={{ background: 'var(--color-error)' }} onClick={() => {
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
