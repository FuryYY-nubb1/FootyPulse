import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import { getRelativeTime } from '../../utils/formatDate';
import '../../styles/components/article.css';

export default function CommentSection({ comments = [], onSubmit }) {
  const { isAuthenticated, user } = useAuth();
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit?.(text.trim());
    setText('');
  };

  return (
    <div className="comment-section">
      <h3 className="comment-section__title">
        Comments ({comments.length})
      </h3>

      {isAuthenticated && (
        <form onSubmit={handleSubmit} style={{ marginBottom: 'var(--space-xl)' }}>
          <textarea
            className="comment-form__input"
            placeholder="Write a comment..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit" style={{
            padding: 'var(--space-sm) var(--space-xl)',
            background: 'var(--gradient-accent)',
            color: 'var(--text-inverse)',
            borderRadius: 'var(--radius-full)',
            fontWeight: 600, fontSize: 'var(--fs-sm)',
          }}>
            Post Comment
          </button>
        </form>
      )}

      {comments.map((c, i) => (
        <div key={c.id || i} className="comment">
          <Avatar name={c.author_name || c.username} size={36} />
          <div>
            <div>
              <span className="comment__author">{c.author_name || c.username}</span>
              <span className="comment__date">{getRelativeTime(new Date(c.created_at))}</span>
            </div>
            <p className="comment__text">{c.content || c.body}</p>
          </div>
        </div>
      ))}

      {!comments.length && (
        <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: 'var(--space-xl)' }}>
          No comments yet. Be the first!
        </p>
      )}
    </div>
  );
}
