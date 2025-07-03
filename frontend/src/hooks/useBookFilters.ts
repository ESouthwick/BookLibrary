import { useState, useMemo } from 'react';
import { BookService } from '../services/bookService';
import type { Book, BookFilters, SortConfig } from '../types';

export const useBookFilters = (books: Book[]) => {
  const [filters, setFilters] = useState<BookFilters>({
    title: '',
    author: '',
    genre: '',
    rating: ''
  });

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: null,
    direction: 'asc'
  });

  // Apply filters and sorting
  const filteredAndSortedBooks = useMemo(() => {
    let filtered = BookService.filterBooks(books, filters);
    return BookService.sortBooks(filtered, sortConfig);
  }, [books, filters, sortConfig]);

  // Get unique genres for filter dropdown
  const uniqueGenres = useMemo(() => {
    return BookService.getUniqueGenres(books);
  }, [books]);

  // Get unique ratings for filter dropdown
  const uniqueRatings = useMemo(() => {
    const ratings = books.map(book => book.rating);
    return [...new Set(ratings)].sort((a, b) => b - a);
  }, [books]);

  // Update a specific filter
  const updateFilter = (field: keyof BookFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      title: '',
      author: '',
      genre: '',
      rating: ''
    });
  };

  // Handle sorting
  const handleSort = (field: keyof Book) => {
    setSortConfig(prev => {
      if (prev.field === field) {
        // Toggle direction if same field
        return {
          field,
          direction: prev.direction === 'asc' ? 'desc' : 'asc'
        };
      } else {
        // Set new field with ascending direction
        return {
          field,
          direction: 'asc'
        };
      }
    });
  };

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return Object.values(filters).some(value => value !== '');
  }, [filters]);

  // Get filter summary
  const filterSummary = useMemo(() => {
    const activeFilters = Object.entries(filters)
      .filter(([_, value]) => value !== '')
      .map(([key, value]) => `${key}: ${value}`);

    return activeFilters.length > 0 ? activeFilters.join(', ') : 'No filters applied';
  }, [filters]);

  return {
    filters,
    sortConfig,
    filteredAndSortedBooks,
    uniqueGenres,
    uniqueRatings,
    updateFilter,
    clearFilters,
    handleSort,
    hasActiveFilters,
    filterSummary
  };
}; 