import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate, getRelativeTime } from '../../utils/formatDate';
import '../../styles/components/article.css';

export default function ArticleCard({ article }) {
  const navigate = useNavigate();

  // Extract image from media JSON
  const media = typeof article.media === 'string' ? JSON.parse(article.media) : article.media;
  const image = media?.featured_image || null;

  return (
    <div className="article-card" onClick={() => navigate(`/news/${article.slug || article.article_id}`)}>
      {image && <img src={image} alt="" className="article-card__image" />}
      <div className="article-card__body">
        {article.article_type && <div className="article-card__category">{article.article_type}</div>}
        <h3 className="article-card__title">{article.title}</h3>
        {article.excerpt && <p className="article-card__excerpt">{article.excerpt}</p>}
        <div className="article-card__meta">
          <div className="article-card__author">
            <div className="article-card__author-avatar" />
            <span>{article.author_name || 'FootyPulse'}</span>
          </div>
          <span>{getRelativeTime(new Date(article.published_at || article.created_at))}</span>
        </div>
      </div>
    </div>
  );
}