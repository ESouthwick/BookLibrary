import { useState, useEffect, useCallback } from 'react';
import { BookService } from '../services/bookService';
import type { Book, CreateBookRequest, UpdateBookRequest, LoadingState } from '../types';

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ loading: true, error: null });

  // Fetch all books
  const fetchBooks = useCallback(async () => {
    setLoading({ loading: true, error: null });
    try {
      const data = await BookService.getAllBooks();
      setBooks(data);
      setLoading({ loading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch books';
      setLoading({ loading: false, error: errorMessage });
    }
  }, []);

  // Create a new book
  const createBook = useCallback(async (bookData: CreateBookRequest): Promise<Book | null> => {
    try {
      const newBook = await BookService.createBook(bookData);
      setBooks(prev => [...prev, newBook]);
      return newBook;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create book';
      setLoading(prev => ({ ...prev, error: errorMessage }));
      return null;
    }
  }, []);

  // Update an existing book
  const updateBook = useCallback(async (id: string, bookData: UpdateBookRequest): Promise<boolean> => {
    try {
      await BookService.updateBook(id, bookData);
      setBooks(prev => prev.map(book => book.id === id ? bookData : book));
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update book';
      setLoading(prev => ({ ...prev, error: errorMessage }));
      return false;
    }
  }, []);

  // Delete a book
  const deleteBook = useCallback(async (id: string): Promise<boolean> => {
    try {
      await BookService.deleteBook(id);
      setBooks(prev => prev.filter(book => book.id !== id));
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete book';
      setLoading(prev => ({ ...prev, error: errorMessage }));
      return false;
    }
  }, []);

  // Get a single book by ID
  const getBookById = useCallback(async (id: string): Promise<Book | null> => {
    try {
      return await BookService.getBookById(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch book';
      setLoading(prev => ({ ...prev, error: errorMessage }));
      return null;
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setLoading(prev => ({ ...prev, error: null }));
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return {
    books,
    loading: loading.loading,
    error: loading.error,
    fetchBooks,
    createBook,
    updateBook,
    deleteBook,
    getBookById,
    clearError
  };
}; 