import React, { useState } from 'react';

/**
 * CommentsSection: add/view comments for agent/MCP
 * @param {Object} props
 * @param {Object} props.item
 * @param {Function} props.onAddComment
 */
const CommentsSection = ({ item, onAddComment }) => {
  const [comment, setComment] = useState('');

  const handleAdd = () => {
    if (comment.trim()) {
      onAddComment(comment.trim());
      setComment('');
    }
  };

  return (
    <div style={{ marginTop: 16 }}>
      <details>
        <summary style={{ cursor: 'pointer', fontWeight: 500 }}>Comments</summary>
        <div style={{ marginTop: 8 }}>
          <input
            type="text"
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Add a comment..."
            style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 14 }}
            aria-label="Add comment"
          />
          <button
            className="nav-btn"
            style={{ marginTop: 8, fontSize: 13, padding: '6px 16px' }}
            onClick={handleAdd}
            disabled={!comment.trim()}
            aria-label="Add comment"
          >
            Add Comment
          </button>
          <ul style={{ marginTop: 8, paddingLeft: 16 }}>
            {(item.comments || []).map((c, idx) => (
              <li key={idx} style={{ marginBottom: 4 }}>{c}</li>
            ))}
          </ul>
        </div>
      </details>
    </div>
  );
};

export default CommentsSection;
