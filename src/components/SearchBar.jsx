import React, { useState } from 'react';

/**
 * SearchBar component for semantic search and tag filtering
 * @param {Object} props
 * @param {string} props.query
 * @param {Function} props.onQueryChange
 * @param {Array} props.tags
 * @param {Array} props.selectedTags
 * @param {Function} props.onTagToggle
 */
const SearchBar = ({ query, onQueryChange, tags, selectedTags, onTagToggle }) => {
  const [input, setInput] = useState(query);

  const handleInputChange = e => {
    setInput(e.target.value);
    onQueryChange(e.target.value);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Semantic search (e.g. 'RAG agent with Postgres')"
        style={{ padding: 8, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14, width: '100%' }}
        aria-label="Semantic search"
      />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {tags.map(tag => (
          <button
            key={tag}
            className="nav-btn"
            style={{
              background: selectedTags.includes(tag) ? 'var(--color-primary-hover)' : 'var(--color-surface)',
              color: selectedTags.includes(tag) ? 'var(--color-white)' : 'var(--color-primary)',
              border: '1px solid var(--color-border)',
              fontSize: 13,
              padding: '4px 12px',
              borderRadius: 8,
              cursor: 'pointer'
            }}
            onClick={() => onTagToggle(tag)}
            aria-label={`Toggle tag ${tag}`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
