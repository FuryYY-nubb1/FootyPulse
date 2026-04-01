// ============================================
// src/components/articles/CommentSection.jsx
// ============================================
// FIXED: Shows actual date + time (e.g. "Apr 2, 2026 at 3:45 PM")
//        instead of broken relative time that showed wrong hours.
//        Root cause: Neon stores UTC timestamps without 'Z' suffix,
//        so the browser misinterprets them as local time.
// ============================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import { LogIn, MessageCircle, Send } from 'lucide-react';
import '../../styles/components/article.css';

// Format timestamp to "Apr 2, 2026 at 3:45 PM"
function formatCommentTime(dateStr) {
  if (!dateStr) return '';
  // Append 'Z' if no timezone info — Neon stores UTC timestamps without the Z suffix
  const raw = String(dateStr);
  const iso = (raw.includes('Z') || raw.includes('+')) ? raw : raw + 'Z';
  const date = new Date(iso);
  if (isNaN(date.getTime())) return '';

  const datePart = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timePart = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return `${datePart} at ${timePart}`;
}

export default function CommentSection({ comments = [], onSubmit }) {
  const { isAuthenticated, user } = useAuth();
  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || posting) return;
    setPosting(true);
    try {
      await onSubmit?.(text.trim());
      setText('');
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
    setPosting(false);
  };

  return (
    <div className="comment-section">
      <h3 className="comment-section__title" style={{
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <MessageCircle size={20} />
        Comments ({comments.length})
      </h3>

      {/* Comment form for authenticated users */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: 'var(--space-xl)' }}>
          <div style={{
            display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start',
          }}>
            <Avatar name={user?.name} size={36} />
            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: 'var(--fs-sm)', fontWeight: 600,
                marginBottom: 'var(--space-xs)',
                color: 'var(--text-primary)',
              }}>
                {user?.name || 'User'}
              </p>
              <textarea
                className="comment-form__input"
                placeholder="Write a comment..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={posting}
                style={{
                  opacity: posting ? 0.6 : 1,
                }}
              />
              <button
                type="submit"
                disabled={posting || !text.trim()}
                style={{
                  padding: 'var(--space-sm) var(--space-xl)',
                  background: (!text.trim() || posting) ? 'var(--bg-tertiary)' : 'var(--gradient-accent)',
                  color: 'var(--text-inverse)',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 600,
                  fontSize: 'var(--fs-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  opacity: (!text.trim() || posting) ? 0.6 : 1,
                  cursor: (!text.trim() || posting) ? 'not-allowed' : 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <Send size={14} />
                {posting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* Login prompt for unauthenticated users */
        <div style={{
          display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
          padding: 'var(--space-md) var(--space-lg)',
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--space-xl)',
        }}>
          <LogIn size={20} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
          <span style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)' }}>
            <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
            {' '}or{' '}
            <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>create an account</Link>
            {' '}to join the discussion.
          </span>
        </div>
      )}

      {/* Comments list */}
      {comments.map((c, i) => (
        <div key={c.comment_id || c.id || i} className="comment">
          <Avatar name={c.user_name || c.author_name || c.username} size={36} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
              <span className="comment__author">{c.user_name || c.author_name || c.username}</span>
              <span className="comment__date">
                {formatCommentTime(c.created_at)}
              </span>
            </div>
            <p className="comment__text">{c.content || c.body}</p>
            {c.likes_count > 0 && (
              <span style={{
                fontSize: 'var(--fs-xs)', color: 'var(--text-tertiary)',
                marginTop: 'var(--space-xs)', display: 'inline-block',
              }}>
                ♥ {c.likes_count}
              </span>
            )}
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