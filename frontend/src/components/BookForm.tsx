// frontend/src/components/BookForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createBook, getBookById, updateBook } from '../api/booksApi';
import type { Book } from '../api/booksApi';
import StarRating from './StarRating';

interface ValidationErrors {
  title?: string;
  author?: string;
  genre?: string;
  publishedDate?: string;
  rating?: string;
}

const BookForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Get ID from URL for editing
  const [book, setBook] = useState<Omit<Book, 'id'> & { id?: string }>({
    title: '',
    author: '',
    genre: '',
    publishedDate: '',
    rating: 1,
  });
  const [loading, setLoading] = useState<boolean>(false); // [cite: 32]
  const [error, setError] = useState<string | null>(null); // [cite: 32]
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (id) {
      setLoading(true); // [cite: 32]
      const fetchBook = async () => {
        try {
          const data = await getBookById(id);
          setBook({
            ...data,
            publishedDate: data.publishedDate.split('T')[0], // Format for input type="date"
          });
        } catch (err) {
          setError('Failed to load book for editing.'); // [cite: 32]
          console.error(err);
        } finally {
          setLoading(false); // [cite: 32]
        }
      };
      fetchBook();
    }
  }, [id]);

  // Validation functions
  const validateTitle = (title: string): string | undefined => {
    if (!title.trim()) return 'Title is required';
    if (title.trim().length < 2) return 'Title must be at least 2 characters long';
    if (title.trim().length > 40) return 'Title must be less than 40 characters';
    if (!/^[a-zA-Z0-9\s\-_.,!?'"()]+$/.test(title.trim())) {
      return 'Title contains invalid characters';
    }
    return undefined;
  };

  const validateAuthor = (author: string): string | undefined => {
    if (!author.trim()) return 'Author is required';
    if (author.trim().length < 2) return 'Author name must be at least 2 characters long';
    if (author.trim().length > 40) return 'Author name must be less than 40 characters';
    if (!/^[a-zA-Z\s\-'.,]+$/.test(author.trim())) {
      return 'Author name contains invalid characters';
    }
    return undefined;
  };

  const validateGenre = (genre: string): string | undefined => {
    if (!genre.trim()) return 'Please select a genre';
    return undefined;
  };

  const validatePublishedDate = (date: string): string | undefined => {
    if (!date) return 'Published date is required';
    
    const selectedDate = new Date(date);
    const currentDate = new Date();
    const minDate = new Date('1800-01-01');
    
    if (isNaN(selectedDate.getTime())) return 'Invalid date format';
    if (selectedDate > currentDate) return 'Published date cannot be in the future';
    if (selectedDate < minDate) return 'Published date cannot be before 1800';
    
    return undefined;
  };

  const validateRating = (rating: number): string | undefined => {
    if (rating < 1 || rating > 5) return 'Rating must be between 1 and 5';
    if (!Number.isInteger(rating)) return 'Rating must be a whole number';
    return undefined;
  };

  // Validate all fields
  const validateAll = (): ValidationErrors => {
    const errors: ValidationErrors = {};
    
    errors.title = validateTitle(book.title);
    errors.author = validateAuthor(book.author);
    errors.genre = validateGenre(book.genre);
    errors.publishedDate = validatePublishedDate(book.publishedDate);
    errors.rating = validateRating(book.rating);
    
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
      const fieldError = name === 'title' ? validateTitle(value) :
                        name === 'author' ? validateAuthor(value) :
                        name === 'genre' ? validateGenre(value) :
                        name === 'publishedDate' ? validatePublishedDate(value) :
                        undefined;
      
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
      const fieldError = validateRating(newRating);
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
    const fieldError = name === 'title' ? validateTitle(value) :
                      name === 'author' ? validateAuthor(value) :
                      name === 'genre' ? validateGenre(value) :
                      name === 'publishedDate' ? validatePublishedDate(value) :
                      name === 'rating' ? validateRating(parseInt(value)) :
                      undefined;
    
    setValidationErrors(prev => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setLoading(true);

    // Mark all fields as touched and validate in the same tick
    setTouched(prev => {
      const allTouched = {
        title: true,
        author: true,
        genre: true,
        publishedDate: true,
        rating: true,
      };
      setValidationErrors(validateAll());
      return allTouched;
    });

    // Force a re-render to show validation errors
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Set validation errors again after touched state is updated
    const errors = validateAll();
    setValidationErrors(errors);

    if (!isFormValid()) {
      setError('Please fix the validation errors before submitting.');
      setLoading(false);
      return;
    }

    try {

      const submittedBook = {
        ...book,
        publishedDate: new Date(book.publishedDate).toISOString(),
      };

      if (id) {
        await updateBook(id, submittedBook as Book);
      } else {
        await createBook(submittedBook);
      }
      navigate('/');
    } catch (err) {
      setError(`Failed to ${id ? 'update' : 'create'} book.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) return (
    <div className="container">
      <div className="loading">Loading book for editing...</div>
    </div>
  );

  return (
    <div className="container">
      <h2>{id ? 'Edit Book' : 'Add New Book'}</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            name="title"
            value={book.title}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.title && validationErrors.title ? 'input-error' : ''}
            placeholder="Enter book title"
          />
          {touched.title && validationErrors.title && (
            <div className="validation-error" data-testid="title-error">{validationErrors.title}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="author">Author:</label>
          <input
            id="author"
            type="text"
            name="author"
            value={book.author}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.author && validationErrors.author ? 'input-error' : ''}
            placeholder="Enter author name"
          />
          {touched.author && validationErrors.author && (
            <div className="validation-error" data-testid="author-error">{validationErrors.author}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="genre">Genre:</label>
          <select
            id="genre"
            name="genre"
            value={book.genre}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.genre && validationErrors.genre ? 'input-error' : ''}
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
          {touched.genre && validationErrors.genre && (
            <div className="validation-error" data-testid="genre-error">{validationErrors.genre}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="publishedDate">Published Date:</label>
          <input
            id="publishedDate"
            type="date"
            name="publishedDate"
            value={book.publishedDate}
            onChange={handleChange}
            onBlur={handleBlur}
            className={touched.publishedDate && validationErrors.publishedDate ? 'input-error' : ''}
          />
          {touched.publishedDate && validationErrors.publishedDate && (
            <div className="validation-error" data-testid="publishedDate-error">{validationErrors.publishedDate}</div>
          )}
        </div>
        <div className="form-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label htmlFor="rating" style={{ marginBottom: 0, minWidth: '60px' }}>Rating:</label>
            <div 
              onBlur={() => {
                setTouched(prev => ({ ...prev, rating: true }));
                const fieldError = validateRating(book.rating);
                setValidationErrors(prev => ({ ...prev, rating: fieldError }));
              }}
            >
            <StarRating
              rating={book.rating}
              onRatingChange={handleRatingChange}
              className={touched.rating && validationErrors.rating ? 'input-error' : ''}
            />
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            type="submit" 
            disabled={loading || !isFormValid()}
            className="btn btn-primary"
            style={{ marginRight: '1rem' }}
          >
            {loading ? 'Submitting...' : (id ? 'Update Book' : 'Add Book')}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/')}
            className="btn"
            style={{ background: '#95a5a6', color: 'white' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookForm;