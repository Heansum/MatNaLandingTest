'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeedItem } from '@/types';
import { VideoPlayer } from '@/components/feed/VideoPlayer';
import { FeedControls } from '@/components/feed/FeedControls';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { useFeed } from '@/hooks/useFeed';

export default function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { feedItems, loadMore, hasMore, isLoading: feedLoading } = useFeed();

  useEffect(() => {
    // Simulate loading screen
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const currentItem = feedItems[currentIndex];
  const nextItem = feedItems[currentIndex + 1];

  const handleSwipeUp = () => {
    if (currentIndex < feedItems.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (hasMore) {
      loadMore();
    }
  };

  const handleSwipeDown = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSwipeLeft = () => {
    // Navigate to restaurant details or booking
    console.log('Navigate to restaurant details');
  };

  const handleSwipeRight = () => {
    // Navigate to map or directions
    console.log('Navigate to map');
  };

  if (!currentItem) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-primary">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">피드가 비어있습니다</h2>
          <p className="text-white/80">새로운 맛집 콘텐츠를 추가해보세요!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen overflow-hidden bg-black">
      {/* Main video container */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <VideoPlayer
              item={currentItem}
              onSwipeUp={handleSwipeUp}
              onSwipeDown={handleSwipeDown}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
            />
          </motion.div>
        </AnimatePresence>

        {/* Preload next video */}
        {nextItem && (
          <div className="absolute inset-0 opacity-0 pointer-events-none">
            <VideoPlayer item={nextItem} />
          </div>
        )}

        {/* Feed controls overlay */}
        <FeedControls
          item={currentItem}
          onLike={() => console.log('Like')}
          onComment={() => console.log('Comment')}
          onShare={() => console.log('Share')}
          onSave={() => console.log('Save')}
        />

        {/* Swipe indicators */}
        <div className="swipe-indicator">
          {feedItems.slice(0, 5).map((_, index) => (
            <div
              key={index}
              className={`swipe-dot ${index === currentIndex ? 'active' : ''}`}
            />
          ))}
        </div>

        {/* Loading overlay */}
        {feedLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="spinner w-8 h-8"></div>
          </div>
        )}
      </div>
    </div>
  );
}