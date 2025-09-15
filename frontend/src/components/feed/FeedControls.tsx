'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share, Bookmark, MapPin, Clock } from 'lucide-react';
import { FeedItem } from '@/types';

interface FeedControlsProps {
  item: FeedItem;
  onLike: () => void;
  onComment: () => void;
  onShare: () => void;
  onSave: () => void;
}

export function FeedControls({
  item,
  onLike,
  onComment,
  onShare,
  onSave,
}: FeedControlsProps) {
  const [isLiked, setIsLiked] = useState(item.type === 'POST' ? item.post?.isLiked : false);
  const [isSaved, setIsSaved] = useState(item.type === 'POST' ? item.post?.isSaved : false);
  const [likeCount, setLikeCount] = useState(
    item.type === 'POST' ? item.post?.likeCount || 0 : item.businessVideo?.likeCount || 0
  );

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike();
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave();
  };

  const restaurant = item.type === 'POST' ? item.post?.restaurant : item.businessVideo?.restaurant;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Right side controls */}
      <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-6">
        {/* Like button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            handleLike();
          }}
          className="tap-target flex flex-col items-center space-y-1 pointer-events-auto"
        >
          <div className={`p-3 rounded-full backdrop-blur-md transition-all duration-200 ${
            isLiked ? 'bg-red-500/80' : 'bg-white/20'
          }`}>
            <Heart
              className={`w-6 h-6 ${
                isLiked ? 'text-white fill-white' : 'text-white'
              }`}
            />
          </div>
          <span className="text-white text-xs font-semibold">
            {likeCount > 1000 ? `${(likeCount / 1000).toFixed(1)}k` : likeCount}
          </span>
        </motion.button>

        {/* Comment button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onComment();
          }}
          className="tap-target flex flex-col items-center space-y-1 pointer-events-auto"
        >
          <div className="p-3 rounded-full bg-white/20 backdrop-blur-md">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs font-semibold">
            {item.type === 'POST' ? item.post?.commentCount || 0 : 0}
          </span>
        </motion.button>

        {/* Share button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onShare();
          }}
          className="tap-target flex flex-col items-center space-y-1 pointer-events-auto"
        >
          <div className="p-3 rounded-full bg-white/20 backdrop-blur-md">
            <Share className="w-6 h-6 text-white" />
          </div>
          <span className="text-white text-xs font-semibold">
            {item.type === 'POST' ? item.post?.shareCount || 0 : 0}
          </span>
        </motion.button>

        {/* Save button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            handleSave();
          }}
          className="tap-target flex flex-col items-center space-y-1 pointer-events-auto"
        >
          <div className={`p-3 rounded-full backdrop-blur-md transition-all duration-200 ${
            isSaved ? 'bg-yellow-500/80' : 'bg-white/20'
          }`}>
            <Bookmark
              className={`w-6 h-6 ${
                isSaved ? 'text-white fill-white' : 'text-white'
              }`}
            />
          </div>
        </motion.button>
      </div>

      {/* Bottom action buttons */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
        <div className="flex items-center justify-between">
          {/* Restaurant quick info */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-md rounded-full px-3 py-2">
              <MapPin className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-medium">
                {restaurant?.name}
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-md rounded-full px-3 py-2">
              <Clock className="w-4 h-4 text-white" />
              <span className="text-white text-sm">
                {restaurant?.businessHours || '영업중'}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="btn-secondary text-sm px-4 py-2"
            >
              예약하기
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-sm px-4 py-2"
            >
              찾아가기
            </motion.button>
          </div>
        </div>
      </div>

      {/* Tags overlay */}
      {item.type === 'POST' && item.post?.tags && item.post.tags.length > 0 && (
        <div className="absolute top-20 left-4 right-20">
          <div className="flex flex-wrap gap-2">
            {item.post.tags.slice(0, 3).map((tag) => (
              <motion.span
                key={tag.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-medium"
              >
                #{tag.name}
              </motion.span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
