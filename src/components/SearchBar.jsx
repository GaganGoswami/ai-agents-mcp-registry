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
const SearchBar = ({ query, onQueryChange, tags, selectedTags, onTagToggle, items }) => {
  const [semanticResults, setSemanticResults] = useState([]);
  const [semanticMode, setSemanticMode] = useState(false);
  const [input, setInput] = useState(query);

  const handleInputChange = e => {
    setInput(e.target.value);
    onQueryChange(e.target.value);
  };

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
      <button className="nav-btn" style={{ marginTop: 8, alignSelf: 'flex-start' }} onClick={handleSemanticSearch}>Semantic Search</button>
      {semanticMode && (
        <div style={{ marginTop: 16, background: '#f6f6f6', borderRadius: 8, padding: 12 }}>
          <div style={{ fontWeight: 500, marginBottom: 8 }}>Semantic Results:</div>
          <ul>
            {semanticResults.map(r => (
              <li key={r.item.id} style={{ marginBottom: 6 }}>
                <b>{r.item.name}</b> <span style={{ color: '#888' }}>({r.score.toFixed(2)})</span><br />
                <span style={{ fontSize: 13 }}>{r.item.description}</span>
              </li>
            ))}
          </ul>
          <button className="nav-btn" style={{ marginTop: 8 }} onClick={() => setSemanticMode(false)}>Back to normal search</button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
