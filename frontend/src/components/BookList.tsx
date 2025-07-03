// frontend/src/components/BookList.tsx
import React, { useState } from 'react';
import { useBooks, useBookFilters } from '../hooks';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import type { ViewMode } from '../types';

const BookList: React.FC = () => {
  const { books, loading, error, deleteBook } = useBooks();
  const {
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
  } = useBookFilters(books);

  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      await deleteBook(id);
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
      <Link to="/add" className="btn btn-primary" data-testid="add-first-book-link">Add Your First Book</Link>
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
            data-testid="view-table-btn"
          >
            Table
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
            onClick={() => setViewMode('cards')}
            title="Card View"
            data-testid="view-cards-btn"
          >
            Cards
          </button>
        </div>
      </div>
      
      {/* Filter Controls */}
      <div className="filter-controls">
        <div className="filter-row">
          <div className="filter-group">
            <label>Title:</label>
            <input
              type="text"
              value={filters.title}
              onChange={(e) => updateFilter('title', e.target.value)}
              placeholder="Filter by title..."
              className="filter-input"
              data-testid="title-filter"
            />
          </div>
          <div className="filter-group">
            <label>Author:</label>
            <input
              type="text"
              value={filters.author}
              onChange={(e) => updateFilter('author', e.target.value)}
              placeholder="Filter by author..."
              className="filter-input"
              data-testid="author-filter"
            />
          </div>
          <div className="filter-group">
            <label>Genre:</label>
            <select
              value={filters.genre}
              onChange={(e) => updateFilter('genre', e.target.value)}
              className="filter-input"
              data-testid="genre-filter"
            >
              <option value="">All Genres</option>
              {uniqueGenres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Rating:</label>
            <select
              value={filters.rating}
              onChange={(e) => updateFilter('rating', e.target.value)}
              className="filter-input"
              data-testid="rating-filter"
            >
              <option value="">All Ratings</option>
              {uniqueRatings.map(rating => (
                <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="filter-actions">
          <button 
            onClick={clearFilters}
            className="btn btn-secondary"
            disabled={!hasActiveFilters}
            data-testid="clear-filters-btn"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Book List */}
      {viewMode === 'table' ? (
        <div className="book-table-container">
          <table className="book-table" data-testid="book-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('title')} className="sortable" data-testid="sort-title-btn">
                  Title {sortConfig.field === 'title' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('author')} className="sortable" data-testid="sort-author-btn">
                  Author {sortConfig.field === 'author' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('genre')} className="sortable" data-testid="sort-genre-btn">
                  Genre {sortConfig.field === 'genre' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('publishedDate')} className="sortable" data-testid="sort-published-btn">
                  Published {sortConfig.field === 'publishedDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('rating')} className="sortable" data-testid="sort-rating-btn">
                  Rating {sortConfig.field === 'rating' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedBooks.map((book) => (
                <tr key={book.id} data-testid={`book-row-${book.id}`}>
                  <td>
                    <Link to={`/edit/${book.id}`} className="book-link" data-testid={`book-title-${book.id}`}>
                      {book.title}
                    </Link>
                  </td>
                  <td>{book.author}</td>
                  <td>{book.genre}</td>
                  <td>{new Date(book.publishedDate).toLocaleDateString()}</td>
                                     <td>
                     <StarRating rating={book.rating} disabled={true} showText={false} onRatingChange={() => {}} />
                   </td>
                  <td>
                    <div className="action-buttons">
                      <Link to={`/edit/${book.id}`} className="btn btn-small btn-primary" data-testid={`edit-btn-${book.id}`}>
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(book.id)} 
                        className="btn btn-small btn-danger"
                        data-testid={`delete-btn-${book.id}`}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="book-cards" data-testid="book-cards">
          {filteredAndSortedBooks.map((book) => (
            <div key={book.id} className="book-card" data-testid={`book-card-${book.id}`}>
              <div className="book-card-header">
                <h3>
                  <Link to={`/edit/${book.id}`} className="book-link" data-testid={`book-title-${book.id}`}>
                    {book.title}
                  </Link>
                </h3>
              </div>
              <div className="book-card-content">
                <p><strong>Author:</strong> {book.author}</p>
                <p><strong>Genre:</strong> {book.genre}</p>
                <p><strong>Published:</strong> {new Date(book.publishedDate).toLocaleDateString()}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <strong>Rating:</strong>
                  <StarRating rating={book.rating} disabled={true} showText={false} onRatingChange={() => {}} />
                </div>
              </div>
              <div className="book-card-actions">
                <Link to={`/edit/${book.id}`} className="btn btn-small btn-primary" data-testid={`edit-btn-${book.id}`}>
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(book.id)} 
                  className="btn btn-small btn-danger"
                  data-testid={`delete-btn-${book.id}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results Summary */}
      <div className="results-summary">
        <p>
          Showing {filteredAndSortedBooks.length} of {books.length} books
          {hasActiveFilters && ` (filtered)`}
        </p>
      </div>

      {/* Add Book Button */}
      <div className="add-book-section">
        <Link to="/add" className="btn btn-primary" data-testid="add-book-link">
          Add New Book
        </Link>
      </div>
    </div>
  );
};

export default BookList;