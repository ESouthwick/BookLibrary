// frontend/src/components/BookList.tsx
import React, { useEffect, useState } from 'react';
import { getBooks, deleteBook } from '../api/booksApi';
import type { Book } from '../api/booksApi';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  
  // Filter states
  const [filters, setFilters] = useState({
    title: '',
    author: '',
    genre: '',
    rating: ''
  });

  // Sorting states
  const [sortField, setSortField] = useState<keyof Book | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks();
        setBooks(data);
        setFilteredBooks(data);
      } catch (err) {
        setError('Failed to fetch books.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Apply filters and sorting whenever filters or sorting change
  useEffect(() => {
    let filtered = books.filter(book => {
      const titleMatch = book.title.toLowerCase().includes(filters.title.toLowerCase());
      const authorMatch = book.author.toLowerCase().includes(filters.author.toLowerCase());
      const genreMatch = book.genre.toLowerCase().includes(filters.genre.toLowerCase());
      const ratingMatch = filters.rating === '' || book.rating.toString() === filters.rating;
      
      return titleMatch && authorMatch && genreMatch && ratingMatch;
    });

    // Apply sorting
    if (sortField) {
      filtered.sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        // Handle date sorting
        if (sortField === 'publishedDate') {
          aValue = new Date(aValue as string).getTime();
          bValue = new Date(bValue as string).getTime();
        }

        // Handle string sorting (case-insensitive)
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredBooks(filtered);
  }, [books, filters, sortField, sortDirection]);

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      title: '',
      author: '',
      genre: '',
      rating: ''
    });
  };

  const handleSort = (field: keyof Book) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field with ascending direction
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
        setBooks(books.filter((book) => book.id !== id));
      } catch (err) {
        setError('Failed to delete book.');
        console.error(err);
      }
    }
  };

  if (loading) return (
    <div className="container">
      <div className="loading">Loading books...</div>
    </div>
  );
  
  if (error) return (
    <div className="container">
      <div className="error">Error: {error}</div>
    </div>
  );
  
  if (books.length === 0) return (
    <div className="container">
      <h2>Book List</h2>
      <p>No books found. Add some!</p>
      <Link to="/add" className="btn btn-primary">Add Your First Book</Link>
    </div>
  );

  return (
    <div className="container">
      <div className="book-list-header">
        <h2>Book List</h2>
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
            title="Table View"
          >
            Table
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
            onClick={() => setViewMode('cards')}
            title="Card View"
          >
            Cards
          </button>
        </div>
      </div>
      
      {/* Filter Controls */}
      <div className="filter-controls">
        <div className="filter-row">
          <div className="filter-group">
            <label>🔍 Title:</label>
            <input
              type="text"
              value={filters.title}
              onChange={(e) => handleFilterChange('title', e.target.value)}
              placeholder="Filter by title..."
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label>👤 Author:</label>
            <input
              type="text"
              value={filters.author}
              onChange={(e) => handleFilterChange('author', e.target.value)}
              placeholder="Filter by author..."
              className="filter-input"
            />
          </div>
          <div className="filter-group">
            <label>📚 Genre:</label>
            <select
              value={filters.genre}
              onChange={(e) => handleFilterChange('genre', e.target.value)}
              className="filter-input"
            >
              <option value="">All Genres</option>
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
          </div>
          <div className="filter-group">
            <label>⭐ Rating:</label>
            <select
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
              className="filter-input"
            >
              <option value="">All Ratings</option>
              <option value="1">★☆☆☆☆ (1 Star)</option>
              <option value="2">★★☆☆☆ (2 Stars)</option>
              <option value="3">★★★☆☆ (3 Stars)</option>
              <option value="4">★★★★☆ (4 Stars)</option>
              <option value="5">★★★★★ (5 Stars)</option>
            </select>
          </div>
          <button onClick={clearFilters} className="btn btn-secondary">
            🗑️ Clear Filters
          </button>
        </div>
        <div className="filter-info">
          Showing {filteredBooks.length} of {books.length} books
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th 
                  className="sortable-header"
                  onClick={() => handleSort('title')}
                  title="Click to sort by title"
                >
                  Title
                  <span className="sort-icon">
                    {sortField === 'title' ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
                  </span>
                </th>
                <th 
                  className="sortable-header"
                  onClick={() => handleSort('author')}
                  title="Click to sort by author"
                >
                  Author
                  <span className="sort-icon">
                    {sortField === 'author' ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
                  </span>
                </th>
                <th 
                  className="sortable-header"
                  onClick={() => handleSort('genre')}
                  title="Click to sort by genre"
                >
                  Genre
                  <span className="sort-icon">
                    {sortField === 'genre' ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
                  </span>
                </th>
                <th 
                  className="sortable-header"
                  onClick={() => handleSort('publishedDate')}
                  title="Click to sort by published date"
                >
                  Published Date
                  <span className="sort-icon">
                    {sortField === 'publishedDate' ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
                  </span>
                </th>
                <th 
                  className="sortable-header"
                  onClick={() => handleSort('rating')}
                  title="Click to sort by rating"
                >
                  Rating
                  <span className="sort-icon">
                    {sortField === 'rating' ? (sortDirection === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
                  </span>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr key={book.id}>
                  <td data-label="Title">{book.title}</td>
                  <td data-label="Author">{book.author}</td>
                  <td data-label="Genre">{book.genre}</td>
                  <td data-label="Published Date">{new Date(book.publishedDate).toLocaleDateString()}</td>
                  <td data-label="Rating">
                    <StarRating
                      rating={book.rating}
                      onRatingChange={() => {}} // Read-only in table view
                      disabled={true}
                      showText={false}
                    />
                  </td>
                  <td data-label="Actions">
                    <div className="action-buttons">
                      <Link 
                        to={`/edit/${book.id}`} 
                        className="action-btn edit-btn"
                        title="Edit Book"
                      >
                        ✏️
                      </Link>
                      <button 
                        onClick={() => handleDelete(book.id)} 
                        className="action-btn delete-btn"
                        title="Delete Book"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Card View */}
      {viewMode === 'cards' && (
        <div className="book-cards">
          {filteredBooks.map((book) => (
            <div key={book.id} className="book-card">
              <div className="book-card-header">
                <h3 className="book-title">{book.title}</h3>
                <div className="book-rating">
                  <StarRating
                    rating={book.rating}
                    onRatingChange={() => {}} // Read-only in card view
                    disabled={true}
                    showText={false}
                  />
                </div>
              </div>
              <div className="book-card-content">
                <div className="book-info">
                  <p><strong>👤 Author:</strong> {book.author}</p>
                  <p><strong>📚 Genre:</strong> {book.genre}</p>
                  <p><strong>📅 Published:</strong> {new Date(book.publishedDate).toLocaleDateString()}</p>
                </div>
                <div className="book-card-actions">
                  <Link 
                    to={`/edit/${book.id}`} 
                    className="btn btn-primary"
                    title="Edit Book"
                  >
                    ✏️ Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(book.id)} 
                    className="btn btn-danger"
                    title="Delete Book"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;