// frontend/src/components/BookForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createBook, getBookById, updateBook } from '../api/booksApi';
import type { Book } from '../api/booksApi';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBook((prev) => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setLoading(true); // [cite: 32]

    // Basic validation [cite: 33]
    if (!book.title || !book.author || !book.genre || !book.publishedDate) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }
    if (book.rating < 1 || book.rating > 5) {
      setError('Rating must be between 1 and 5.');
      setLoading(false);
      return;
    }

    try {
      // Ensure publishedDate is a UTC string for the backend [cite: 41]
      const submittedBook = {
        ...book,
        publishedDate: new Date(book.publishedDate).toISOString(),
      };

      if (id) {
        await updateBook(id, submittedBook as Book);
      } else {
        await createBook(submittedBook);
      }
      navigate('/'); // Redirect to book list on success
    } catch (err) {
      setError(`Failed to ${id ? 'update' : 'create'} book.`); // [cite: 32]
      console.error(err);
    } finally {
      setLoading(false); // [cite: 32]
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
        <div>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            name="title"
            value={book.title}
            onChange={handleChange}
            required
            placeholder="Enter book title"
          />
        </div>
        <div>
          <label htmlFor="author">Author:</label>
          <input
            id="author"
            type="text"
            name="author"
            value={book.author}
            onChange={handleChange}
            required
            placeholder="Enter author name"
          />
        </div>
        <div>
          <label htmlFor="genre">Genre:</label>
          <input
            id="genre"
            type="text"
            name="genre"
            value={book.genre}
            onChange={handleChange}
            required
            placeholder="Enter genre"
          />
        </div>
        <div>
          <label htmlFor="publishedDate">Published Date:</label>
          <input
            id="publishedDate"
            type="date"
            name="publishedDate"
            value={book.publishedDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="rating">Rating (1-5):</label>
          <input
            id="rating"
            type="number"
            name="rating"
            value={book.rating}
            onChange={handleChange}
            min="1"
            max="5"
            required
          />
        </div>
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            type="submit" 
            disabled={loading}
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