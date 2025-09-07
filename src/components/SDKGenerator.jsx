import React from 'react';
import { saveAs } from 'file-saver';

/**
 * SDKGenerator: generates code snippets/SDK for agent/MCP integration
 * @param {Object} props
 * @param {Object} props.item
 */
const SDKGenerator = ({ item }) => {
  // Simple SDK code generation based on type
  let code = '';
  if (item.type === 'rag' || item.type === 'web-research') {
    code = `# Python SDK Example\nimport requests\n\ndef call_agent(input):\n    resp = requests.post('${item.endpoint}/invoke', json={'input': input})\n    return resp.json()`;
  } else if (item.type === 'chatbot') {
    code = `# Python Chatbot Example\nimport requests\n\ndef chat(message):\n    resp = requests.post('${item.endpoint}/chat', json={'message': message})\n    return resp.json()`;
  } else if (item.type === 'code-assistant') {
    code = `// JS SDK Example\nimport axios from 'axios';\n\nexport async function codeAssist(input) {\n  const resp = await axios.post('${item.endpoint}/assist', { input });\n  return resp.data;\n}`;
  } else if (item.type === 'multimodal') {
    code = `# Multimodal Example\nimport requests\n\ndef multimodal(input):\n    resp = requests.post('${item.endpoint}/multi', json={'input': input})\n    return resp.json()`;
  } else {
    code = `# Generic Example\nimport requests\n\ndef call(input):\n    resp = requests.post('${item.endpoint}', json={'input': input})\n    return resp.json()`;
  }

  const exportSDK = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    saveAs(blob, `${item.name}-sdk-example.txt`);
  };

  return (
    <div style={{ marginTop: 16 }}>
      <details>
        <summary style={{ cursor: 'pointer', fontWeight: 500 }}>SDK Example</summary>
        <pre style={{ background: 'var(--color-background)', padding: 12, borderRadius: 8, marginTop: 8, fontFamily: 'var(--font-family-mono)', fontSize: 13 }}>
          {code}
        </pre>
        <button
          className="nav-btn"
          style={{ marginTop: 8, fontSize: 13, padding: '6px 16px' }}
          onClick={exportSDK}
          aria-label="Export SDK example"
        >
          Export Example
        </button>
      </details>
    </div>
  );
};

export default SDKGenerator;
