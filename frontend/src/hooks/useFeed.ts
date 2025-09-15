'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { FeedItem, RecommendationRequest, RecommendationResponse } from '@/types';
import { apiClient } from '@/lib/api';

export function useFeed() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: async ({ pageParam = 0 }) => {
      const request: RecommendationRequest = {
        userId: 'current-user', // TODO: Get from auth context
        page: pageParam,
        size: 10,
      };
      
      return apiClient.get<RecommendationResponse>('/feed/recommendations', {
        params: request,
      });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasNextPage ? lastPage.pagination.page + 1 : undefined;
    },
    initialPageParam: 0,
  });

  useEffect(() => {
    if (data) {
      const allItems = data.pages.flatMap(page => page.feedItems);
      setFeedItems(allItems);
    }
  }, [data]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    feedItems,
    loadMore,
    hasMore: hasNextPage,
    isLoading: isLoading || isFetchingNextPage,
    error,
  };
}

export function usePostActions(postId: string) {
  const likeMutation = useQuery({
    queryKey: ['post', postId, 'like'],
    queryFn: () => apiClient.post(`/posts/${postId}/like`),
    enabled: false,
  });

  const saveMutation = useQuery({
    queryKey: ['post', postId, 'save'],
    queryFn: () => apiClient.post(`/posts/${postId}/save`),
    enabled: false,
  });

  const shareMutation = useQuery({
    queryKey: ['post', postId, 'share'],
    queryFn: () => apiClient.post(`/posts/${postId}/share`),
    enabled: false,
  });

  const handleLike = useCallback(() => {
    likeMutation.refetch();
  }, [likeMutation]);

  const handleSave = useCallback(() => {
    saveMutation.refetch();
  }, [saveMutation]);

  const handleShare = useCallback(() => {
    shareMutation.refetch();
  }, [shareMutation]);

  return {
    handleLike,
    handleSave,
    handleShare,
    isLiking: likeMutation.isFetching,
    isSaving: saveMutation.isFetching,
    isSharing: shareMutation.isFetching,
  };
}
