import { useState, useEffect, useCallback } from 'react';
import { Excerpt } from '../types/Excerpt';

const API_BASE_URL = 'http://localhost:8001';

export const useExcerpts = () => {
  const [excerpts, setExcerpts] = useState<Excerpt[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExcerpts = useCallback(async (pageNum: number, size: number = 5): Promise<Excerpt[]> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/excerpts?page=${pageNum}&size=${size}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json() as Excerpt[];
      
      // If no more excerpts, set hasMore to false
      if (data.length === 0) {
        setHasMore(false);
        return [];
      }
      
      return data;
    } catch (err) {
      console.error('Error fetching excerpts:', err);
      setError('Failed to load excerpts. Please try again later.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    
    const newExcerpts = await fetchExcerpts(page + 1);
    if (newExcerpts.length > 0) {
      setExcerpts((prev: Excerpt[]) => [...prev, ...newExcerpts]);
      setPage((prev: number) => prev + 1);
    }
  }, [page, hasMore, loading, fetchExcerpts]);

  // Initial load
  useEffect(() => {
    const loadInitialExcerpts = async () => {
      const initialExcerpts = await fetchExcerpts(0);
      setExcerpts(initialExcerpts);
      setPage(0);
      setHasMore(initialExcerpts.length > 0);
    };

    loadInitialExcerpts();
  }, [fetchExcerpts]);

  return { excerpts, loading, error, hasMore, loadMore };
};
