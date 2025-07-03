// frontend/src/api/booksApi.ts
import axios from 'axios';
import type { Book, CreateBookRequest, UpdateBookRequest, GenreStats } from '../types';

const API_BASE_URL = 'http://localhost:5086/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Book CRUD operations
export const getBooks = async (): Promise<Book[]> => {
  const response = await apiClient.get<Book[]>('/books');
  return response.data;
};

export const getBookById = async (id: string): Promise<Book> => {
  const response = await apiClient.get<Book>(`/books/${id}`);
  return response.data;
};

export const createBook = async (book: CreateBookRequest): Promise<Book> => {
  const response = await apiClient.post<Book>('/books', book);
  return response.data;
};

export const updateBook = async (id: string, book: UpdateBookRequest): Promise<void> => {
  await apiClient.put<void>(`/books/${id}`, book);
};

export const deleteBook = async (id: string): Promise<void> => {
  await apiClient.delete<void>(`/books/${id}`);
};

// Statistics endpoint
export const getBookStats = async (): Promise<GenreStats> => {
  const response = await apiClient.get<GenreStats>('/books/stats');
  return response.data;
};