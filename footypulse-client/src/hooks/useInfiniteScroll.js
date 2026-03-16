import { useState, useEffect, useCallback, useRef } from 'react';

export function useInfiniteScroll(fetchFn, options = {}) {
  const { threshold = 200, pageSize = 20 } = options;
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const result = await fetchFn({ page, limit: pageSize });
      const newItems = result?.data || result || [];
      setItems((prev) => [...prev, ...newItems]);
      setHasMore(newItems.length === pageSize);
      setPage((p) => p + 1);
    } catch (err) {
      console.error('Infinite scroll error:', err);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, fetchFn, pageSize]);

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      }, { rootMargin: `${threshold}px` });
      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, loadMore, threshold]
  );

  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, []);

  return { items, loading, hasMore, lastElementRef, reset, setItems };
}
