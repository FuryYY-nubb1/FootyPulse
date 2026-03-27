import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { articlesApi } from '../api/articlesApi';
import { commentsApi } from '../api/commentsApi';
import ArticleContent from '../components/articles/ArticleContent';
import CommentSection from '../components/articles/CommentSection';
import Breadcrumb from '../components/common/Breadcrumb';
import Loader from '../components/common/Loader';
import ErrorBanner from '../components/common/ErrorBanner';

export default function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const isSlug = isNaN(id);
      const aRes = isSlug ? await articlesApi.getBySlug(id) : await articlesApi.getById(id);
      const art = aRes?.data || aRes;
      setArticle(art);
      if (art?.id) {
        const cRes = await commentsApi.getByArticle(art.id);
        setComments(cRes?.data || cRes || []);
      }
    } catch (err) {
      console.error(err);
      setError('Could not load article. The database may be waking up.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const handleComment = async (text) => {
    try {
      await commentsApi.create(article.id, { content: text });
      const cRes = await commentsApi.getByArticle(article.id);
      setComments(cRes?.data || cRes || []);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="page-wrapper"><Loader text="Loading article..." /></div>;

  if (error) {
    return (
      <div className="page-wrapper">
        <div className="container page-content">
          <ErrorBanner message={error} onRetry={load} />
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container page-content">
        <Breadcrumb items={[{ label: 'News', path: '/news' }, { label: article?.title || 'Article' }]} />
        <ArticleContent article={article} />
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <CommentSection comments={comments} onSubmit={handleComment} />
        </div>
      </div>
    </div>
  );
}
