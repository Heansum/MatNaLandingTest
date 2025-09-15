'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { FeedItem } from '@/types';

interface VideoPlayerProps {
  item: FeedItem;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export function VideoPlayer({
  item,
  onSwipeUp,
  onSwipeDown,
  onSwipeLeft,
  onSwipeRight,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const mediaUrl = item.type === 'POST' ? item.post?.mediaUrl : item.businessVideo?.videoUrl;
  const thumbnailUrl = item.type === 'POST' ? item.post?.thumbnailUrl : item.businessVideo?.thumbnailUrl;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      // Auto-play next video
      onSwipeUp?.();
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onSwipeUp]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleMuteToggle = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;
    const minSwipeDistance = 50;

    // Determine swipe direction
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      // Vertical swipe
      if (deltaY > minSwipeDistance) {
        onSwipeDown?.();
      } else if (deltaY < -minSwipeDistance) {
        onSwipeUp?.();
      }
    } else {
      // Horizontal swipe
      if (deltaX > minSwipeDistance) {
        onSwipeRight?.();
      } else if (deltaX < -minSwipeDistance) {
        onSwipeLeft?.();
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleClick = () => {
    setShowControls(true);
    setTimeout(() => setShowControls(false), 3000);
  };

  return (
    <div
      className="relative w-full h-full bg-black"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
        autoPlay
        muted={isMuted}
        loop
        poster={thumbnailUrl}
        preload="metadata"
      >
        <source src={mediaUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Video overlay content */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Restaurant info overlay */}
        <div className="absolute bottom-20 left-4 right-4 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-2"
          >
            <h3 className="text-xl font-bold">
              {item.type === 'POST' ? item.post?.restaurant.name : item.businessVideo?.restaurant.name}
            </h3>
            <p className="text-white/80 text-sm">
              {item.type === 'POST' ? item.post?.restaurant.address : item.businessVideo?.restaurant.address}
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <span className="flex items-center">
                ⭐ {item.type === 'POST' ? item.post?.restaurant.rating : item.businessVideo?.restaurant.rating || '4.5'}
              </span>
              <span>
                {item.type === 'POST' ? item.post?.restaurant.priceRange : item.businessVideo?.restaurant.priceRange || '$$'}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Video controls overlay */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/20"
            >
              <div className="flex items-center space-x-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayPause();
                  }}
                  className="tap-target flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-md rounded-full"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-1" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMuteToggle();
                  }}
                  className="tap-target flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-md rounded-full"
                >
                  {isMuted ? (
                    <VolumeX className="w-6 h-6 text-white" />
                  ) : (
                    <Volume2 className="w-6 h-6 text-white" />
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Swipe hints */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60 text-xs text-center">
          <p>↑↓ 스와이프로 탐색</p>
        </div>
      </div>
    </div>
  );
}
