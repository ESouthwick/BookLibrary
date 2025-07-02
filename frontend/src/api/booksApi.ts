// frontend/src/api/booksApi.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5086/api'; // Use HTTP since backend is running on HTTP

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  publishedDate: string; // ISO 8601 string
  rating: number;
}

export const getBooks = async (): Promise<Book[]> => {
  const response = await axios.get<Book[]>(`${API_BASE_URL}/books`);
  return response.data;
};

export const getBookById = async (id: string): Promise<Book> => {
  const response = await axios.get<Book>(`${API_BASE_URL}/books/${id}`);
  return response.data;
};

export const createBook = async (book: Omit<Book, 'id'>): Promise<Book> => {
  const response = await axios.post<Book>(`${API_BASE_URL}/books`, book);
  return response.data;
};

export const updateBook = async (id: string, book: Book): Promise<void> => {
  await axios.put<void>(`${API_BASE_URL}/books/${id}`, book);
};

export const deleteBook = async (id: string): Promise<void> => {
  await axios.delete<void>(`${API_BASE_URL}/books/${id}`);
};

export const getBookStats = async (): Promise<{ [genre: string]: number }> => {
  const response = await axios.get<{ [genre: string]: number }>(`${API_BASE_URL}/books/stats`);
  return response.data;
};