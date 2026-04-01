// ============================================
// src/pages/ArticlePage.jsx
// ============================================
// FIXED: Uses article.article_id (not article.id) for comment fetching.
//        Passes authenticated user data when creating comments.
//        Shows login prompt for unauthenticated users.
// ============================================

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { articlesApi } from '../api/articlesApi';
import { commentsApi } from '../api/commentsApi';
import { useAuth } from '../context/AuthContext';
import ArticleContent from '../components/articles/ArticleContent';
import CommentSection from '../components/articles/CommentSection';
import Breadcrumb from '../components/common/Breadcrumb';
import Loader from '../components/common/Loader';

export default function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const isSlug = isNaN(id);
        const aRes = isSlug ? await articlesApi.getBySlug(id) : await articlesApi.getById(id);
        const art = aRes?.data || aRes;
        setArticle(art);

        // Use article_id (the actual DB column name)
        const articleId = art?.article_id || art?.id;
        if (articleId) {
          const cRes = await commentsApi.getByArticle(articleId);
          setComments(cRes?.data || cRes || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleComment = async (text) => {
    const articleId = article?.article_id || article?.id;
    if (!articleId || !isAuthenticated) return;

    try {
      await commentsApi.create({
        article_id: articleId,
        user_id: String(user.user_id),
        user_name: user.name || user.email,
        content: text,
      });

      // Re-fetch comments to show the new one with timestamp
      const cRes = await commentsApi.getByArticle(articleId);
      setComments(cRes?.data || cRes || []);
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  if (loading) return <div className="page-wrapper"><Loader text="Loading article..." /></div>;

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