// frontend/src/components/BookForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBooks } from '../hooks';
import { BookService } from '../services/bookService';
import StarRating from './StarRating';
import type { CreateBookRequest, UpdateBookRequest } from '../types';

interface ValidationErrors {
  title?: string;
  author?: string;
  genre?: string;
  publishedDate?: string;
  rating?: string;
}

const BookForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { createBook, updateBook, getBookById, loading, error } = useBooks();
  
  const [book, setBook] = useState<CreateBookRequest>({
    title: '',
    author: '',
    genre: '',
    publishedDate: '',
    rating: 1,
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (id) {
      const fetchBook = async () => {
        const data = await getBookById(id);
        if (data) {
          setBook({
            ...data,
            publishedDate: data.publishedDate.split('T')[0], // Format for input type="date"
          });
        }
      };
      fetchBook();
    }
  }, [id, getBookById]);

  // Validate all fields using service
  const validateAll = (): ValidationErrors => {
    const validation = BookService.validateBook(book);
    const errors: ValidationErrors = {};
    
    if (!validation.isValid) {
      validation.errors.forEach(error => {
        if (error.includes('Title')) errors.title = error;
        else if (error.includes('Author')) errors.author = error;
        else if (error.includes('Genre')) errors.genre = error;
        else if (
          error.includes('Publication date') ||
          error.includes('Published date') ||
          error.includes('date')
        ) errors.publishedDate = error;
        else if (error.includes('Rating')) errors.rating = error;
      });
    }
    
    return errors;
  };

  // Check if form is valid
  const isFormValid = (): boolean => {
    const errors = validateAll();
    return !Object.values(errors).some(error => error !== undefined);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setBook((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate field immediately if it has been touched
    if (touched[name]) {
      const validation = BookService.validateBook({
        ...book,
        [name]: value,
      });
      
      const fieldError = validation.errors.find(error => 
        error.includes(name.charAt(0).toUpperCase() + name.slice(1))
      );
      
      setValidationErrors(prev => ({
        ...prev,
        [name]: fieldError,
      }));
    }
  };

  const handleRatingChange = (newRating: number) => {
    setBook((prev) => ({
      ...prev,
      rating: newRating,
    }));

    // Validate rating immediately if it has been touched
    if (touched.rating) {
      const validation = BookService.validateBook({
        ...book,
        rating: newRating,
      });
      
      const fieldError = validation.errors.find(error => error.includes('Rating'));
      
      setValidationErrors(prev => ({
        ...prev,
        rating: fieldError,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Mark field as touched
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));

    // Validate field
    const validation = BookService.validateBook({
      ...book,
      [name]: value,
    });
    
    const fieldError = validation.errors.find(error => 
      error.includes(name.charAt(0).toUpperCase() + name.slice(1))
    );
    
    setValidationErrors(prev => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched and validate
    setTouched({
      title: true,
      author: true,
      genre: true,
      publishedDate: true,
      rating: true,
    });

    const errors = validateAll();
    setValidationErrors(errors);

    if (!isFormValid()) {
      return;
    }

    try {
      if (id) {
        // Update existing book - exclude id from the book data
        const { id: bookId, ...bookData } = book as any;
        const success = await updateBook(id, bookData as UpdateBookRequest);
        if (success) {
          navigate('/');
        }
      } else {
        // Create new book
        const newBook = await createBook(book);
        if (newBook) {
          navigate('/');
        }
      }
    } catch (err) {
      // Error handling is done in the hook
      console.error('Form submission error:', err);
    }
  };

  if (loading) return (
    <div className="container">
      <div className="loading">Loading...</div>
    </div>
  );

  return (
    <div className="container">
      <h2>{id ? 'Edit Book' : 'Add New Book'}</h2>
      
      {error && (
        <div className="error" data-testid="form-error">
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="book-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={book.title}
            onChange={handleChange}
            onBlur={handleBlur}
            className={validationErrors.title ? 'error' : ''}
            data-testid="title-input"
          />
          {validationErrors.title && (
            <span className="error-message" data-testid="title-error">
              {validationErrors.title}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="author">Author *</label>
          <input
            type="text"
            id="author"
            name="author"
            value={book.author}
            onChange={handleChange}
            onBlur={handleBlur}
            className={validationErrors.author ? 'error' : ''}
            data-testid="author-input"
          />
          {validationErrors.author && (
            <span className="error-message" data-testid="author-error">
              {validationErrors.author}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="genre">Genre *</label>
          <select
            id="genre"
            name="genre"
            value={book.genre}
            onChange={handleChange}
            onBlur={handleBlur}
            className={validationErrors.genre ? 'error' : ''}
            data-testid="genre-select"
          >
            <option value="">Select a genre</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-Fiction">Non-Fiction</option>
            <option value="Mystery">Mystery</option>
            <option value="Thriller">Thriller</option>
            <option value="Romance">Romance</option>
            <option value="Science Fiction">Science Fiction</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Horror">Horror</option>
            <option value="Biography">Biography</option>
            <option value="Autobiography">Autobiography</option>
            <option value="History">History</option>
            <option value="Self-Help">Self-Help</option>
            <option value="Business">Business</option>
            <option value="Technology">Technology</option>
            <option value="Philosophy">Philosophy</option>
            <option value="Poetry">Poetry</option>
            <option value="Drama">Drama</option>
            <option value="Comedy">Comedy</option>
            <option value="Adventure">Adventure</option>
            <option value="Young Adult">Young Adult</option>
            <option value="Children">Children</option>
            <option value="Cooking">Cooking</option>
            <option value="Travel">Travel</option>
            <option value="Art">Art</option>
            <option value="Music">Music</option>
            <option value="Sports">Sports</option>
            <option value="Education">Education</option>
            <option value="Religion">Religion</option>
            <option value="Politics">Politics</option>
            <option value="Economics">Economics</option>
            <option value="Psychology">Psychology</option>
            <option value="Sociology">Sociology</option>
            <option value="Other">Other</option>
          </select>
          {validationErrors.genre && (
            <span className="error-message" data-testid="genre-error">
              {validationErrors.genre}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="publishedDate">Published Date *</label>
          <input
            type="date"
            id="publishedDate"
            name="publishedDate"
            value={book.publishedDate}
            onChange={handleChange}
            onBlur={handleBlur}
            className={validationErrors.publishedDate ? 'error' : ''}
            data-testid="published-date-input"
          />
          {validationErrors.publishedDate && (
            <span className="error-message" data-testid="published-date-error">
              {validationErrors.publishedDate}
            </span>
          )}
        </div>

        <div className="form-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ marginBottom: 0, minWidth: 'fit-content' }}>Rating *</label>
            <StarRating
              rating={book.rating}
              onRatingChange={handleRatingChange}
              data-testid="rating-input"
            />
          </div>
          {validationErrors.rating && (
            <span className="error-message" data-testid="rating-error">
              {validationErrors.rating}
            </span>
          )}
        </div>

        <div className="form-actions" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading || !isFormValid()}
            data-testid="submit-button"
          >
            {id ? 'Update Book' : 'Add Book'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/')}
            className="btn btn-secondary"
            data-testid="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;