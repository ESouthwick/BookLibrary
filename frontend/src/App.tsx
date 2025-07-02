// frontend/src/App.tsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import './App.css'; // Basic styling
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import StatsView from './components/StatsView';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <Router>
      <div className="App">
        {/* Top Navigation */}
        <header className="top-nav">
          {/* Hamburger (mobile only) */}
          <button
            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <Link to="/" className="logo" onClick={closeMenu}>
            📚 BookLibrary
          </Link>
          {/* Desktop Nav */}
          <nav className="header-nav">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
              Book List
            </NavLink>
            <NavLink to="/add" className={({ isActive }) => isActive ? 'active' : ''}>
              Add Book
            </NavLink>
            <NavLink to="/stats" className={({ isActive }) => isActive ? 'active' : ''}>
              Stats
            </NavLink>
          </nav>
        </header>

        {/* Overlay (mobile only) */}
        <div
          className={`overlay ${isMenuOpen ? 'active' : ''}`}
          onClick={closeMenu}
        ></div>

        {/* Side Menu (mobile only) */}
        <div className={`side-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="side-menu-header">
            <h3>Menu</h3>
            <button className="close-menu" onClick={closeMenu}>
              ✕
            </button>
          </div>
          <nav>
            <ul>
              <li>
                <Link to="/" onClick={closeMenu}>
                  📖 Book List
                </Link>
              </li>
              <li>
                <Link to="/add" onClick={closeMenu}>
                  ➕ Add Book
                </Link>
              </li>
              <li>
                <Link to="/stats" onClick={closeMenu}>
                  📊 Statistics
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/add" element={<BookForm />} />
            <Route path="/edit/:id" element={<BookForm />} />
            <Route path="/stats" element={<StatsView />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;