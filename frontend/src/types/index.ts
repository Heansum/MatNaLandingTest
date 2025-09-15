// User Types
export interface User {
  id: string;
  email: string;
  username?: string;
  profileImageUrl?: string;
  bio?: string;
  authProvider: 'LOCAL' | 'GOOGLE' | 'APPLE' | 'KAKAO';
  externalId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  latitude?: number;
  longitude?: number;
  address?: string;
}

// Restaurant Types
export interface Restaurant {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phoneNumber?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  businessHours?: string;
  priceRange?: string;
  rating?: number;
  reviewCount?: number;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
  categories: RestaurantCategory[];
}

// Post Types
export interface Post {
  id: string;
  user: User;
  restaurant: Restaurant;
  content?: string;
  mediaUrl?: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'CAROUSEL';
  mediaDuration?: number;
  thumbnailUrl?: string;
  isPublic: boolean;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
  isLiked?: boolean;
  isSaved?: boolean;
}

// Tag Types
export interface Tag {
  id: string;
  name: string;
  description?: string;
  tagType: 'CUISINE' | 'MOOD' | 'PRICE' | 'DIETARY' | 'FEATURE' | 'LOCATION' | 'CUSTOM';
  usageCount: number;
  isTrending: boolean;
  createdAt: string;
  updatedAt: string;
}

// Comment Types
export interface Comment {
  id: string;
  user: User;
  post: Post;
  parent?: Comment;
  content: string;
  likeCount: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
  isLiked?: boolean;
}

// User Preference Types
export interface UserPreference {
  id: string;
  user: User;
  tag: Tag;
  preferenceScore: number;
  interactionCount: number;
  createdAt: string;
  updatedAt: string;
}

// Business Video Types
export interface BusinessVideo {
  id: string;
  restaurant: Restaurant;
  videoUrl: string;
  thumbnailUrl?: string;
  title?: string;
  description?: string;
  duration?: number;
  viewCount: number;
  likeCount: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Restaurant Category Types
export interface RestaurantCategory {
  id: string;
  restaurant: Restaurant;
  categoryName: string;
  description?: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// Feed Types
export interface FeedItem {
  id: string;
  type: 'POST' | 'BUSINESS_VIDEO';
  post?: Post;
  businessVideo?: BusinessVideo;
  score: number; // Recommendation score
  createdAt: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

// Recommendation Types
export interface RecommendationRequest {
  userId: string;
  page?: number;
  size?: number;
  tags?: string[];
  excludeIds?: string[];
}

export interface RecommendationResponse {
  feedItems: FeedItem[];
  pagination: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}
