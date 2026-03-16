import React from 'react';
import '../../styles/components/article.css';

export default function BreakingNewsBanner({ items = [] }) {
  if (!items.length) return null;

  return (
    <div className="breaking-banner">
      <div className="breaking-banner__inner">
        {[...items, ...items].map((item, i) => (
          <React.Fragment key={i}>
            <span className="breaking-banner__tag">Breaking</span>
            <span className="breaking-banner__text">{item.title || item}</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
