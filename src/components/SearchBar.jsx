import React, { useState, useRef, useEffect } from 'react';

/**
 * SearchBar component for semantic search and tag filtering
 * @param {Object} props
 * @param {string} props.query
 * @param {Function} props.onQueryChange
 * @param {Array} props.tags
 * @param {Array} props.selectedTags
 * @param {Function} props.onTagToggle
 */
const COMMON_QUERIES = [
  'RAG agent',
  'MCP with vector search',
  'OpenAI integration',
  'Postgres',
  'Realtime monitoring',
  'Free agents',
  'Enterprise MCP',
];

const SearchBar = ({ query, onQueryChange, tags, selectedTags, onTagToggle, items }) => {
  const [semanticResults, setSemanticResults] = useState([]);
  const [semanticMode, setSemanticMode] = useState(false);
  const [input, setInput] = useState(query);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(-1);
  const inputRef = useRef();

  // Theme handling (sync with body attribute + observer so changes via global toggle reflect here)
  const [colorScheme, setColorScheme] = useState(() => document.body.getAttribute('data-color-scheme') || 'light');
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const attr = document.body.getAttribute('data-color-scheme') || 'light';
      setColorScheme(prev => (prev !== attr ? attr : prev));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-color-scheme'] });
    return () => observer.disconnect();
  }, []);
  const isDark = colorScheme === 'dark';
  // Inject placeholder color styling (scoped) so placeholder remains legible in dark mode
  useEffect(() => {
    let styleEl = document.getElementById('search-bar-theme-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'search-bar-theme-style';
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = `.search-bar-input::placeholder { color: ${isDark ? '#b0b8c1' : '#666'}; opacity: 1; }`;
  }, [isDark]);

  // Build suggestions from names, tags, and common queries
  const suggestions = [
    ...items.map(i => i.name),
    ...tags,
    ...COMMON_QUERIES
  ].filter((s, idx, arr) => arr.indexOf(s) === idx && s.toLowerCase().includes(input.toLowerCase()) && s.toLowerCase() !== input.toLowerCase()).slice(0, 8);

  const handleInputChange = e => {
    setInput(e.target.value);
    onQueryChange(e.target.value);
    setShowSuggestions(e.target.value.length > 0 && suggestions.length > 0);
    setHighlightedIdx(-1);
  };

  const handleSuggestionClick = suggestion => {
    setInput(suggestion);
    onQueryChange(suggestion);
    setShowSuggestions(false);
    inputRef.current.blur();
  };

  const handleInputKeyDown = e => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      setHighlightedIdx(idx => Math.min(idx + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      setHighlightedIdx(idx => Math.max(idx - 1, 0));
    } else if (e.key === 'Enter' && highlightedIdx >= 0) {
      handleSuggestionClick(suggestions[highlightedIdx]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  // Restore semantic search handler
  const handleSemanticSearch = async () => {
    if (!input || !items?.length) return;
    try {
      // Get embedding for query
      const embedRes = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY || 'sk-PLACEHOLDER'}`
        },
        body: JSON.stringify({
          model: 'text-embedding-ada-002',
          input: input
        })
      });
      const embedData = await embedRes.json();
      const queryEmbedding = embedData.data?.[0]?.embedding;
      // Get embeddings for items (mock: use description)
      const itemEmbeddings = await Promise.all(items.map(async item => {
        const res = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY || 'sk-PLACEHOLDER'}`
          },
          body: JSON.stringify({
            model: 'text-embedding-ada-002',
            input: item.description || item.name
          })
        });
        const data = await res.json();
        return { id: item.id, embedding: data.data?.[0]?.embedding, item };
      }));
      // Cosine similarity
      function cosine(a, b) {
        let dot = 0, normA = 0, normB = 0;
        for (let i = 0; i < a.length; i++) {
          dot += a[i] * b[i];
          normA += a[i] * a[i];
          normB += b[i] * b[i];
        }
        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
      }
      const results = itemEmbeddings.map(e => ({
        item: e.item,
        score: cosine(queryEmbedding, e.embedding)
      })).sort((a, b) => b.score - a.score).slice(0, 5);
      setSemanticResults(results);
      setSemanticMode(true);
    } catch (err) {
      alert('Semantic search failed.');
    }
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16, position: 'relative' }}>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        placeholder="Semantic search (e.g. 'RAG agent with Postgres')"
        className="search-bar-input"
        style={{
          padding: 10,
          borderRadius: 10,
          border: isDark ? '1px solid #444' : '1px solid var(--color-border)',
            fontSize: 14,
            width: '100%',
            background: isDark ? '#2c313a' : '#fff',
            color: isDark ? '#e0e6ed' : '#222',
            boxShadow: isDark ? '0 1px 3px #0008 inset' : 'none',
            transition: 'background .25s, color .25s, border-color .25s'
        }}
        aria-label="Semantic search"
        autoComplete="off"
        onFocus={() => setShowSuggestions(input.length > 0 && suggestions.length > 0)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
      />
      {/* Query Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: 38,
          left: 0,
          width: '100%',
          background: isDark ? '#23272f' : '#fff',
          border: isDark ? '1px solid #444' : '1px solid #e0e6ed',
          borderRadius: 8,
          boxShadow: isDark ? '0 4px 18px #0009' : 'var(--shadow-md)',
          zIndex: 100,
          maxHeight: 220,
          overflowY: 'auto',
        }}>
          {suggestions.map((s, idx) => (
            <div
              key={s}
              style={{
                padding: '8px 14px',
                background: highlightedIdx === idx ? (isDark ? '#31737d' : '#e0f7fa') : (isDark ? '#23272f' : '#fff'),
                cursor: 'pointer',
                fontSize: 15,
                color: isDark ? '#e0e6ed' : '#222',
                borderBottom: idx < suggestions.length - 1 ? (isDark ? '1px solid #333' : '1px solid #f0f0f0') : 'none',
                transition: 'background .15s'
              }}
              onMouseDown={() => handleSuggestionClick(s)}
              onMouseEnter={() => setHighlightedIdx(idx)}
              aria-selected={highlightedIdx === idx}
            >
              {s}
            </div>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {tags.map(tag => (
          <button
            key={tag}
            className="nav-btn"
            style={{
              background: selectedTags.includes(tag)
                ? (isDark ? '#31737d' : 'var(--color-primary-hover)')
                : (isDark ? '#23272f' : 'var(--color-surface)'),
              color: selectedTags.includes(tag)
                ? (isDark ? '#e0e6ed' : 'var(--color-white)')
                : (isDark ? '#32b8c6' : 'var(--color-primary)'),
              border: selectedTags.includes(tag)
                ? (isDark ? '1px solid #31737d' : '1px solid var(--color-primary-hover)')
                : (isDark ? '1px solid #444' : '1px solid var(--color-border)'),
              fontSize: 13,
              padding: '4px 12px',
              borderRadius: 20,
              cursor: 'pointer',
              boxShadow: selectedTags.includes(tag) ? (isDark ? '0 1px 3px #0008 inset' : 'var(--shadow-sm)') : 'none',
              transition: 'background .2s, color .2s, border-color .2s'
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
