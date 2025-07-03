// frontend/src/types/index.ts

// Core Book interface
export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  publishedDate: string; // ISO 8601 string
  rating: number;
}

// Book creation interface (without ID)
export interface CreateBookRequest {
  title: string;
  author: string;
  genre: string;
  publishedDate: string;
  rating: number;
}

// Book update interface
export interface UpdateBookRequest extends Book {}

// Statistics interfaces
export interface GenreStats {
  [genre: string]: number;
}

export interface RatingStats {
  [rating: number]: number;
}

// Filter interfaces
export interface BookFilters {
  title: string;
  author: string;
  genre: string;
  rating: string;
}

// Sort interfaces
export interface SortConfig {
  field: keyof Book | null;
  direction: 'asc' | 'desc';
}

// View mode types
export type ViewMode = 'table' | 'cards';
export type ChartViewMode = 'bar' | 'pie';
export type PageMode = 'stats' | 'ratings';

// API Response interfaces
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

// Loading and error states
export interface LoadingState {
  loading: boolean;
  error: string | null;
} 