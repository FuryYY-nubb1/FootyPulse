import React from 'react';
import ArticleCard from './ArticleCard';
import Loader from '../common/Loader';

export default function ArticleList({ articles = [], loading }) {
  if (loading) return <Loader text="Loading articles..." />;
  if (!articles.length) return <p style={{ textAlign: 'center', padding: 'var(--space-2xl)', color: 'var(--text-secondary)' }}>No articles found</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
      {articles.map((a) => <ArticleCard key={a.id} article={a} />)}
    </div>
  );
}
