import * as booksApi from '../api/booksApi';
import type { 
  Book, 
  CreateBookRequest, 
  UpdateBookRequest, 
  GenreStats, 
  RatingStats,
  BookFilters,
  SortConfig 
} from '../types';

export class BookService {
  // Fetch all books
  static async getAllBooks(): Promise<Book[]> {
    return await booksApi.getBooks();
  }

  // Fetch a single book by ID
  static async getBookById(id: string): Promise<Book> {
    return await booksApi.getBookById(id);
  }

  // Create a new book
  static async createBook(bookData: CreateBookRequest): Promise<Book> {
    return await booksApi.createBook(bookData);
  }

  // Update an existing book
  static async updateBook(id: string, bookData: UpdateBookRequest): Promise<void> {
    await booksApi.updateBook(id, bookData);
  }

  // Delete a book
  static async deleteBook(id: string): Promise<void> {
    await booksApi.deleteBook(id);
  }

  // Get genre statistics
  static async getGenreStats(): Promise<GenreStats> {
    return await booksApi.getBookStats();
  }

  // Business logic: Filter books based on criteria
  static filterBooks(books: Book[], filters: BookFilters): Book[] {
    return books.filter(book => {
      const titleMatch = book.title.toLowerCase().includes(filters.title.toLowerCase());
      const authorMatch = book.author.toLowerCase().includes(filters.author.toLowerCase());
      const genreMatch = filters.genre === '' || book.genre === filters.genre;
      const ratingMatch = filters.rating === '' || book.rating.toString() === filters.rating;
      
      return titleMatch && authorMatch && genreMatch && ratingMatch;
    });
  }

  // Business logic: Sort books
  static sortBooks(books: Book[], sortConfig: SortConfig): Book[] {
    if (!sortConfig.field) return books;

    return [...books].sort((a, b) => {
      let aValue = a[sortConfig.field!];
      let bValue = b[sortConfig.field!];

      // Handle date sorting
      if (sortConfig.field === 'publishedDate') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      // Handle string sorting (case-insensitive)
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Business logic: Get unique genres from books
  static getUniqueGenres(books: Book[]): string[] {
    const genres = books.map(book => book.genre);
    return [...new Set(genres)].sort();
  }

  // Business logic: Calculate rating statistics
  static calculateRatingStats(books: Book[]): RatingStats {
    return books.reduce((acc, book) => {
      const rating = book.rating;
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, {} as RatingStats);
  }

  // Business logic: Get books by rating
  static getBooksByRating(books: Book[]): { [rating: number]: Book[] } {
    return books.reduce((acc, book) => {
      const rating = book.rating;
      if (!acc[rating]) {
        acc[rating] = [];
      }
      acc[rating].push(book);
      return acc;
    }, {} as { [rating: number]: Book[] });
  }

  // Business logic: Validate book data
  static validateBook(book: CreateBookRequest): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!book.title.trim()) errors.push('Title is required');
    if (!book.author.trim()) errors.push('Author is required');
    if (!book.genre.trim()) errors.push('Genre is required');
    if (!book.publishedDate) errors.push('Publication date is required');
    if (book.rating < 1 || book.rating > 5) errors.push('Rating must be between 1 and 5');

    // Validate title length (minimum 2 characters, maximum 100)
    if (book.title.trim().length < 2) errors.push('Title must be at least 2 characters long');
    if (book.title.length > 100) errors.push('Title must be 100 characters or less');
    
    // Validate author name format (no numbers or special characters except spaces, hyphens, and apostrophes)
    if (book.author.trim() && /[0-9]/.test(book.author)) {
      errors.push('Author name contains invalid characters');
    }
    if (book.author.length > 50) errors.push('Author must be 50 characters or less');

    // Validate date format and that it's not in the future
    if (book.publishedDate) {
      if (isNaN(Date.parse(book.publishedDate))) {
        errors.push('Invalid publication date format');
      } else {
        const publishedDate = new Date(book.publishedDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
        
        if (publishedDate > today) {
          errors.push('Published date cannot be in the future');
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Business logic: Format book for display
  static formatBookForDisplay(book: Book): Book {
    return {
      ...book,
      title: book.title.trim(),
      author: book.author.trim(),
      genre: book.genre.trim(),
      publishedDate: new Date(book.publishedDate).toISOString().split('T')[0]
    };
  }
} 