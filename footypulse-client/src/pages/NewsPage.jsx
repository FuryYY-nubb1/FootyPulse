import React, { useState, useEffect } from 'react';
import { articlesApi } from '../api/articlesApi';
import ArticleFeatured from '../components/articles/ArticleFeatured';
import ArticleList from '../components/articles/ArticleList';
import Pagination from '../components/common/Pagination';

export default function NewsPage() {
  const [articles, setArticles] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await articlesApi.getAll({ page, limit: 12 });
        const all = res?.data || res || [];
        if (page === 1 && all.length) {
          setFeatured(all[0]);
          setArticles(all.slice(1));
        } else {
          setArticles(all);
        }
        setTotalPages(res?.pagination?.totalPages || 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page]);

  return (
    <div className="page-wrapper">
      <div className="container page-content">
        <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 800, marginBottom: 'var(--space-xl)' }}>Football News</h1>
        {page === 1 && featured && (
          <div style={{ marginBottom: 'var(--space-2xl)' }}>
            <ArticleFeatured article={featured} />
          </div>
        )}
        <ArticleList articles={articles} loading={loading} />
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}
