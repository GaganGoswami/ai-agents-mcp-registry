import React, { useState } from 'react';
import { EXAMPLE_AGENTS, EXAMPLE_MCP_SERVERS } from '../data/examples';

/**
 * Registration wizard for new agent or MCP server
 * @param {Object} props
 * @param {Function} props.onRegister
 * @param {Function} props.onCancel
 * @param {Array} props.agents
 * @param {Array} props.mcpServers
 */
const RegisterWizard = ({ onRegister, onCancel, agents, mcpServers }) => {
  const [step, setStep] = useState(1);
  const [type, setType] = useState('agent');
  const [form, setForm] = useState({
    name: '',
    description: '',
    endpoint: '',
    type: '',
    compatible: '',
    instructions: ''
  });
  const [errors, setErrors] = useState([]);

  const validateRegistration = (data) => {
    const errors = [];
    if (!data.name) errors.push('Name required');
    if (!data.endpoint || !data.endpoint.startsWith('http')) errors.push('Valid endpoint URL required');
    const allIds = [...agents, ...mcpServers].map(i => i.name.toLowerCase());
    if (allIds.includes(data.name.toLowerCase())) errors.push('Name must be unique');
    return errors;
  };

  const handleNext = () => {
    if (step === 2) {
      setErrors(validateRegistration(form));
      if (validateRegistration(form).length === 0) setStep(step + 1);
    } else {
      setStep(step + 1);
    }
  };

  const handlePrev = () => setStep(step - 1);

  const handleConfirm = () => {
    onRegister({
      id: Date.now().toString(),
      ...form,
      compatible: form.compatible.split(',').map(s => s.trim()),
      status: 'unknown'
    }, type);
  };

  return (
    <div className="view active" style={{ maxWidth: 480, margin: '0 auto', background: 'var(--color-surface)', borderRadius: 12, padding: 24, boxShadow: 'var(--shadow-md)' }}>
      <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 16 }}>Register New {type === 'agent' ? 'Agent' : 'MCP Server'}</div>
      {step === 1 && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontWeight: 500 }}>Type:</label>
            <select value={type} onChange={e => setType(e.target.value)} style={{ marginLeft: 16, padding: 8, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }}>
              <option value="agent">Agent</option>
              <option value="mcp">MCP Server</option>
            </select>
          </div>
          <button className="nav-btn" onClick={handleNext} style={{ marginTop: 16 }}>Next</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <div style={{ marginBottom: 12 }}>
            <label>Name:</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Description:</label>
            <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Endpoint URL:</label>
            <input type="text" value={form.endpoint} onChange={e => setForm({ ...form, endpoint: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Type:</label>
            <input type="text" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }} placeholder="e.g. rag, chatbot, mcp" />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Compatible (comma separated):</label>
            <input type="text" value={form.compatible} onChange={e => setForm({ ...form, compatible: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }} placeholder="e.g. langchain, openai" />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Instructions:</label>
            <textarea value={form.instructions} onChange={e => setForm({ ...form, instructions: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14, minHeight: 60 }} placeholder="Step-by-step integration guide" />
          </div>
          {errors.length > 0 && (
            <div style={{ color: 'var(--color-error)', marginBottom: 8 }}>
              {errors.map((err, i) => <div key={i}>{err}</div>)}
            </div>
          )}
          <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
            <button className="nav-btn" onClick={handlePrev}>Back</button>
            <button className="nav-btn" onClick={handleNext}>Next</button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 500 }}>Summary</div>
            <div>Name: {form.name}</div>
            <div>Description: {form.description}</div>
            <div>Endpoint: {form.endpoint}</div>
            <div>Type: {form.type}</div>
            <div>Compatible: {form.compatible}</div>
            <div>Instructions: <pre style={{ background: 'var(--color-background)', padding: 8, borderRadius: 8 }}>{form.instructions}</pre></div>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <button className="nav-btn" onClick={handlePrev}>Back</button>
            <button className="nav-btn" onClick={handleConfirm}>Register</button>
          </div>
        </div>
      )}
      <button className="nav-btn" style={{ marginTop: 24, background: 'var(--color-error)' }} onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default RegisterWizard;
