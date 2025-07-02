// frontend/src/components/BookList.tsx
import React, { useEffect, useState } from 'react';
import { getBooks, deleteBook, type Book } from '../api/booksApi';
import { Link } from 'react-router-dom';

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // [cite: 32]
  const [error, setError] = useState<string | null>(null); // [cite: 32]

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks();
        setBooks(data);
      } catch (err) {
        setError('Failed to fetch books.'); // [cite: 32]
        console.error(err);
      } finally {
        setLoading(false); // [cite: 32]
      }
    };
    fetchBooks();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
        setBooks(books.filter((book) => book.id !== id));
      } catch (err) {
        setError('Failed to delete book.'); // [cite: 32]
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
  
  if (Object.keys(books).length === 0) return (
    <div className="container">
      <h2>Book Statistics</h2>
      <p>No books found. Add some!</p>
    </div>
  );

  return (
    <div className="container">
      <h2>Book List</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>Published Date</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.genre}</td>
              <td>{new Date(book.publishedDate).toLocaleDateString()}</td>
              <td>{book.rating}</td>
              <td>
                <Link to={`/edit/${book.id}`}>Edit</Link> |{' '}
                <button onClick={() => handleDelete(book.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookList;