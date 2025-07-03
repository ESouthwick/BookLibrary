// frontend/src/components/StatsView.tsx
import React, { useState, useMemo } from 'react';
import { useBookStats } from '../hooks';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import StarRating from './StarRating';
import type { ChartViewMode, PageMode } from '../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const StatsView: React.FC = () => {
  const {
    loading,
    error,
    genreStats,
    ratingStats,
    books,
    booksByRating,
    genreChartData,
    ratingChartData,
  } = useBookStats();

  const [viewMode, setViewMode] = useState<ChartViewMode>('bar');
  const [ratingsViewMode, setRatingsViewMode] = useState<ChartViewMode>('bar');
  const [pageMode, setPageMode] = useState<PageMode>('stats');

  // Chart options
  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#333',
          font: {
            size: 14,
            weight: 'bold' as const,
          },
        },
      },
      title: {
        display: true,
        text: 'Book Statistics',
        color: '#667eea',
        font: {
          size: 18,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#333',
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#333',
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  }), []);

  // Pie chart options (no scales, no grid lines)
  const pieChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#333',
          font: {
            size: 14,
            weight: 'bold' as const,
          },
        },
      },
      title: {
        display: true,
        text: 'Book Statistics',
        color: '#667eea',
        font: {
          size: 18,
          weight: 'bold' as const,
        },
      },
    },
  }), []);

  if (loading) return (
    <div className="container">
      <div className="loading" data-testid="loading-stats">Loading stats...</div>
    </div>
  );
  
  if (error) return (
    <div className="container">
      <div className="error" data-testid="stats-error">Error: {error}</div>
    </div>
  );
  
  if (Object.keys(genreChartData).length === 0) return (
    <div className="container">
      <h2>Book Statistics</h2>
      <p data-testid="empty-stats-message">No stats available. Add some books!</p>
    </div>
  );

  // Calculate summary statistics
  const totalBooks = books.length;
  const averageRating = books.length > 0 
    ? (books.reduce((sum, book) => sum + book.rating, 0) / books.length).toFixed(1)
    : '0.0';
  const topGenre = Object.entries(genreStats).sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';
  const topRating = Object.entries(booksByRating).sort(([,a], [,b]) => b.length - a.length)[0]?.[0] || 'None';
  const topRatingNum = topRating !== 'None' ? Number(topRating) : 0;
  // New stats
  const distinctAuthors = Array.from(new Set(books.map(b => b.author))).length;
  const newestBook = books.length > 0 ? books.reduce((latest, b) => new Date(b.publishedDate) > new Date(latest.publishedDate) ? b : latest, books[0]) : null;

  return (
    <div className="container">
      <div className="stats-header">
        <h2>Book Statistics </h2>
        <div className="page-toggle">
          <button 
            className={`toggle-btn ${pageMode === 'stats' ? 'active' : ''}`}
            onClick={() => setPageMode('stats')}
            data-testid="genre-stats-btn"
          >
            Genre Stats
          </button>
          <button 
            className={`toggle-btn ${pageMode === 'ratings' ? 'active' : ''}`}
            onClick={() => setPageMode('ratings')}
            data-testid="rating-stats-btn"
          >
            Rating Stats
          </button>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="stats-cards-grid" data-testid="stats-cards">
        <div className="stats-card">
          <h3>Total Books</h3>
          <div className="stats-card-content">
            <div className="stats-item">
              <span className="stats-label">Books in Library</span>
              <span className="stats-value">{totalBooks}</span>
            </div>
          </div>
        </div>
        
        <div className="stats-card">
          <h3>Average Rating</h3>
          <div className="stats-card-content">
            <div className="stats-item">
              <span className="stats-label">Overall Rating</span>
              <span className="stats-value">{averageRating} / 5</span>
            </div>
          </div>
        </div>
        
        <div className="stats-card">
          <h3>Top Genre</h3>
          <div className="stats-card-content">
            <div className="stats-item">
              <span className="stats-label">Most Popular</span>
              <span className="stats-value">{topGenre}</span>
            </div>
          </div>
        </div>
        
        <div className="stats-card">
          <h3>Top Rating</h3>
          <div className="stats-card-content">
            <div className="stats-item">
              <span className="stats-label">Most Common</span>
              <span className="stats-value">{topRating} Star{topRatingNum > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
        {/* New Card: Distinct Authors */}
        <div className="stats-card">
          <h3>Distinct Authors</h3>
          <div className="stats-card-content">
            <div className="stats-item">
              <span className="stats-label">Unique Authors</span>
              <span className="stats-value">{distinctAuthors}</span>
            </div>
          </div>
        </div>
        {/* New Card: Newest Book */}
        <div className="stats-card">
          <h3>Newest Book</h3>
          <div className="stats-card-content">
            {newestBook ? (
              <div className="stats-item">
                <span className="stats-label">Book</span>
                <span className="stats-value">{newestBook.title}</span>
              </div>
            ) : (
              <div className="stats-item">
                <span className="stats-label">No books</span>
                <span className="stats-value">-</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {pageMode === 'stats' ? (
        <>
          {/* Genre Statistics Table */}
          <div className="stats-table-container" data-testid="genre-stats-table">
            <h3>Genre Distribution</h3>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Genre</th>
                  <th>Number of Books</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(genreStats)
                  .sort(([,a], [,b]) => b - a)
                  .map(([genre, count]) => (
                    <tr key={genre}>
                      <td>{genre}</td>
                      <td>{count}</td>
                      <td>{((count / totalBooks) * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Genre Chart */}
          <div className="stats-section">
            <div className="chart-controls">
              <h3>Books by Genre</h3>
              <div className="view-toggle">
                <button 
                  className={`toggle-btn ${viewMode === 'bar' ? 'active' : ''}`}
                  onClick={() => setViewMode('bar')}
                  data-testid="bar-chart-btn"
                >
                  Bar Chart
                </button>
                <button 
                  className={`toggle-btn ${viewMode === 'pie' ? 'active' : ''}`}
                  onClick={() => setViewMode('pie')}
                  data-testid="pie-chart-btn"
                >
                  Pie Chart
                </button>
              </div>
            </div>
            
            <div className={viewMode === 'pie' ? 'pie-chart-container' : 'chart-container'} data-testid="genre-chart-container">
              {viewMode === 'bar' ? (
                <Bar data={genreChartData.barChartData} options={chartOptions} />
              ) : (
                <Pie data={genreChartData.pieChartData} options={pieChartOptions} />
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Rating Statistics Table */}
          <div className="stats-table-container" data-testid="rating-stats-table">
            <h3>Rating Distribution</h3>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Rating</th>
                  <th>Number of Books</th>
                  <th>Percentage</th>
                  <th>Books</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(booksByRating)
                  .sort(([a], [b]) => Number(b) - Number(a))
                  .map(([rating, books]) => (
                    <tr key={rating}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <StarRating rating={Number(rating)} disabled={true} showText={false} onRatingChange={() => {}} />
                          <span>{rating} Star{Number(rating) > 1 ? 's' : ''}</span>
                        </div>
                      </td>
                      <td>{books.length}</td>
                      <td>{((books.length / totalBooks) * 100).toFixed(1)}%</td>
                      <td>{books.map(book => book.title).join(', ')}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Rating Chart */}
          <div className="stats-section">
            <div className="chart-controls">
              <h3>Books by Rating</h3>
              <div className="view-toggle">
                <button 
                  className={`toggle-btn ${ratingsViewMode === 'bar' ? 'active' : ''}`}
                  onClick={() => setRatingsViewMode('bar')}
                  data-testid="bar-chart-btn"
                >
                  Bar Chart
                </button>
                <button 
                  className={`toggle-btn ${ratingsViewMode === 'pie' ? 'active' : ''}`}
                  onClick={() => setRatingsViewMode('pie')}
                  data-testid="pie-chart-btn"
                >
                  Pie Chart
                </button>
              </div>
            </div>
            
            <div className={ratingsViewMode === 'pie' ? 'pie-chart-container' : 'chart-container'} data-testid="rating-chart-container">
              {ratingsViewMode === 'bar' ? (
                <Bar data={ratingChartData.barChartData} options={chartOptions} />
              ) : (
                <Pie data={ratingChartData.pieChartData} options={pieChartOptions} />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StatsView;