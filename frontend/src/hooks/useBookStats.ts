import { useState, useEffect, useMemo } from 'react';
import { BookService } from '../services/bookService';
import type { Book, GenreStats, RatingStats, LoadingState } from '../types';

export const useBookStats = () => {
  const [genreStats, setGenreStats] = useState<GenreStats>({});
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ loading: true, error: null });

  // Fetch stats and books data
  const fetchStats = async () => {
    setLoading({ loading: true, error: null });
    try {
      const [statsData, booksData] = await Promise.all([
        BookService.getGenreStats(),
        BookService.getAllBooks()
      ]);
      setGenreStats(statsData);
      setBooks(booksData);
      setLoading({ loading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch book stats';
      setLoading({ loading: false, error: errorMessage });
    }
  };

  // Calculate rating statistics
  const ratingStats = useMemo(() => {
    return BookService.calculateRatingStats(books);
  }, [books]);

  // Get books grouped by rating
  const booksByRating = useMemo(() => {
    return BookService.getBooksByRating(books);
  }, [books]);

  // Generate chart colors
  const generateColors = (count: number) => {
    const colors = [
      'rgba(102, 126, 234, 0.8)',   // Blue
      'rgba(39, 174, 96, 0.8)',     // Green
      'rgba(155, 89, 182, 0.8)',    // Purple
      'rgba(231, 76, 60, 0.8)',     // Red
      'rgba(243, 156, 18, 0.8)',    // Orange
      'rgba(52, 152, 219, 0.8)',    // Light Blue
      'rgba(46, 204, 113, 0.8)',    // Light Green
      'rgba(142, 68, 173, 0.8)',    // Dark Purple
      'rgba(230, 126, 34, 0.8)',    // Dark Orange
      'rgba(26, 188, 156, 0.8)',    // Teal
    ];
    
    return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
  };

  // Prepare genre chart data
  const genreChartData = useMemo(() => {
    const labels = Object.keys(genreStats);
    const data = Object.values(genreStats);
    const colors = generateColors(labels.length);

    return {
      labels,
      data,
      colors,
      barChartData: {
        labels,
        datasets: [{
          label: 'Number of Books',
          data,
          backgroundColor: 'rgba(102, 126, 234, 0.6)',
          borderColor: 'rgba(102, 126, 234, 1)',
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }],
      },
      pieChartData: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderColor: colors.map(color => color.replace('0.8', '1')),
          borderWidth: 2,
          hoverOffset: 4,
        }],
      }
    };
  }, [genreStats]);

  // Prepare rating chart data
  const ratingChartData = useMemo(() => {
    const sortedRatings = Object.keys(booksByRating)
      .map(Number)
      .sort((a, b) => b - a);

    const ratingColors = [
      'rgba(39, 174, 96, 0.8)',   // Green (5 stars)
      'rgba(46, 204, 113, 0.8)',  // Light Green (4 stars)
      'rgba(243, 156, 18, 0.8)',  // Yellow (3 stars)
      'rgba(230, 126, 34, 0.8)',  // Orange (2 stars)
      'rgba(231, 76, 60, 0.8)',   // Red (1 star)
    ];

    return {
      sortedRatings,
      ratingColors,
      barChartData: {
        labels: sortedRatings.map(rating => `${rating} Star${rating > 1 ? 's' : ''}`),
        datasets: [{
          label: 'Number of Books',
          data: sortedRatings.map(rating => booksByRating[rating].length),
          backgroundColor: ratingColors,
          borderColor: ratingColors.map(color => color.replace('0.8', '1')),
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }],
      },
      pieChartData: {
        labels: sortedRatings.map(rating => `${rating} Star${rating > 1 ? 's' : ''}`),
        datasets: [{
          data: sortedRatings.map(rating => booksByRating[rating].length),
          backgroundColor: ratingColors,
          borderColor: ratingColors.map(color => color.replace('0.8', '1')),
          borderWidth: 2,
          hoverOffset: 4,
        }],
      }
    };
  }, [booksByRating]);

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

  // Initial fetch
  useEffect(() => {
    fetchStats();
  }, []);

  return {
    genreStats,
    ratingStats,
    books,
    booksByRating,
    loading: loading.loading,
    error: loading.error,
    genreChartData,
    ratingChartData,
    chartOptions,
    fetchStats
  };
}; 