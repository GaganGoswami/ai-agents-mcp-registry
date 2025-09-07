import React from 'react';
import { saveAs } from 'file-saver';

/**
 * Generates integration instructions and export button
 * @param {Object} props
 * @param {Object} props.item
 */
const InstructionsGenerator = ({ item }) => {
  const exportInstructions = () => {
    const blob = new Blob([item.instructions], { type: 'text/markdown' });
    saveAs(blob, `${item.name}-integration.md`);
  };

  return (
    <div style={{ marginTop: 16 }}>
      <details>
        <summary style={{ cursor: 'pointer', fontWeight: 500 }}>Integration Instructions</summary>
        <pre style={{ background: 'var(--color-background)', padding: 12, borderRadius: 8, marginTop: 8, fontFamily: 'var(--font-family-mono)', fontSize: 13 }}>
          {item.instructions}
        </pre>
        <button
          className="nav-btn"
          style={{ marginTop: 8, fontSize: 13, padding: '6px 16px' }}
          onClick={exportInstructions}
          aria-label="Export instructions"
        >
          Export as Markdown
        </button>
      </details>
    </div>
  );
};

export default InstructionsGenerator;
