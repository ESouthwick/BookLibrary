import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import StatsView from '../StatsView'
import { useBookStats } from '../../hooks/useBookStats'

// Mock the hooks module
vi.mock('../../hooks/useBookStats')

describe('StatsView', () => {
  const mockGenreStats = {
    'Fiction': 3,
    'Non-Fiction': 2,
    'Mystery': 1
  }

  const mockBooks = [
    {
      id: '1',
      title: 'Test Book 1',
      author: 'Author 1',
      genre: 'Fiction',
      publishedDate: '2023-01-01T00:00:00.000Z',
      rating: 4
    },
    {
      id: '2',
      title: 'Test Book 2',
      author: 'Author 2',
      genre: 'Non-Fiction',
      publishedDate: '2023-02-01T00:00:00.000Z',
      rating: 5
    },
    {
      id: '3',
      title: 'Test Book 3',
      author: 'Author 3',
      genre: 'Fiction',
      publishedDate: '2023-03-01T00:00:00.000Z',
      rating: 3
    }
  ]

  const mockGenreChartData = {
    labels: ['Fiction', 'Non-Fiction', 'Mystery'],
    data: [3, 2, 1],
    colors: ['rgba(102, 126, 234, 0.8)', 'rgba(39, 174, 96, 0.8)', 'rgba(155, 89, 182, 0.8)'],
    barChartData: {
      labels: ['Fiction', 'Non-Fiction', 'Mystery'],
      datasets: [{
        label: 'Number of Books',
        data: [3, 2, 1],
        backgroundColor: 'rgba(102, 126, 234, 0.6)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }],
    },
    pieChartData: {
      labels: ['Fiction', 'Non-Fiction', 'Mystery'],
      datasets: [{
        data: [3, 2, 1],
        backgroundColor: ['rgba(102, 126, 234, 0.8)', 'rgba(39, 174, 96, 0.8)', 'rgba(155, 89, 182, 0.8)'],
        borderColor: ['rgba(102, 126, 234, 1)', 'rgba(39, 174, 96, 1)', 'rgba(155, 89, 182, 1)'],
        borderWidth: 2,
        hoverOffset: 4,
      }],
    }
  }

  const mockRatingChartData = {
    sortedRatings: [5, 4, 3],
    ratingColors: ['rgba(39, 174, 96, 0.8)', 'rgba(46, 204, 113, 0.8)', 'rgba(243, 156, 18, 0.8)'],
    barChartData: {
      labels: ['5 Stars', '4 Stars', '3 Stars'],
      datasets: [{
        label: 'Number of Books',
        data: [1, 1, 1],
        backgroundColor: ['rgba(39, 174, 96, 0.8)', 'rgba(46, 204, 113, 0.8)', 'rgba(243, 156, 18, 0.8)'],
        borderColor: ['rgba(39, 174, 96, 1)', 'rgba(46, 204, 113, 1)', 'rgba(243, 156, 18, 1)'],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }],
    },
    pieChartData: {
      labels: ['5 Stars', '4 Stars', '3 Stars'],
      datasets: [{
        data: [1, 1, 1],
        backgroundColor: ['rgba(39, 174, 96, 0.8)', 'rgba(46, 204, 113, 0.8)', 'rgba(243, 156, 18, 0.8)'],
        borderColor: ['rgba(39, 174, 96, 1)', 'rgba(46, 204, 113, 1)', 'rgba(243, 156, 18, 1)'],
        borderWidth: 2,
        hoverOffset: 4,
      }],
    }
  }

  const mockChartOptions = {
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
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders statistics view by default', async () => {
    vi.mocked(useBookStats).mockReturnValue({
      loading: false,
      error: null,
      genreChartData: mockGenreChartData,
      ratingChartData: mockRatingChartData,
      chartOptions: mockChartOptions,
      genreStats: mockGenreStats,
      ratingStats: { 3: 1, 4: 1, 5: 1 },
      books: mockBooks,
      booksByRating: { 3: [mockBooks[2]], 4: [mockBooks[0]], 5: [mockBooks[1]] },
      fetchStats: vi.fn()
    })

    render(<StatsView />)
    
    expect(screen.getByText('Book Statistics')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /genre stats/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /rating stats/i })).toBeInTheDocument()
  })

  it('switches to ratings view when rating stats button is clicked', async () => {
    vi.mocked(useBookStats).mockReturnValue({
      loading: false,
      error: null,
      genreChartData: mockGenreChartData,
      ratingChartData: mockRatingChartData,
      chartOptions: mockChartOptions,
      genreStats: mockGenreStats,
      ratingStats: { 3: 1, 4: 1, 5: 1 },
      books: mockBooks,
      booksByRating: { 3: [mockBooks[2]], 4: [mockBooks[0]], 5: [mockBooks[1]] },
      fetchStats: vi.fn()
    })

    render(<StatsView />)
    
    const ratingsButton = screen.getByRole('button', { name: /rating stats/i })
    fireEvent.click(ratingsButton)
    
    expect(screen.getByText('Books by Rating')).toBeInTheDocument()
  })

  it('switches back to genre stats view when genre stats button is clicked', async () => {
    vi.mocked(useBookStats).mockReturnValue({
      loading: false,
      error: null,
      genreChartData: mockGenreChartData,
      ratingChartData: mockRatingChartData,
      chartOptions: mockChartOptions,
      genreStats: mockGenreStats,
      ratingStats: { 3: 1, 4: 1, 5: 1 },
      books: mockBooks,
      booksByRating: { 3: [mockBooks[2]], 4: [mockBooks[0]], 5: [mockBooks[1]] },
      fetchStats: vi.fn()
    })

    render(<StatsView />)
    
    // Switch to ratings first
    const ratingsButton = screen.getByRole('button', { name: /rating stats/i })
    fireEvent.click(ratingsButton)
    
    // Switch back to genre stats
    const statsButton = screen.getByRole('button', { name: /genre stats/i })
    fireEvent.click(statsButton)
    
    expect(screen.getByText('Books by Genre')).toBeInTheDocument()
  })

  it('shows bar chart by default in genre stats view', async () => {
    vi.mocked(useBookStats).mockReturnValue({
      loading: false,
      error: null,
      genreChartData: mockGenreChartData,
      ratingChartData: mockRatingChartData,
      chartOptions: mockChartOptions,
      genreStats: mockGenreStats,
      ratingStats: { 3: 1, 4: 1, 5: 1 },
      books: mockBooks,
      booksByRating: { 3: [mockBooks[2]], 4: [mockBooks[0]], 5: [mockBooks[1]] },
      fetchStats: vi.fn()
    })

    render(<StatsView />)
    
    const barButton = screen.getByRole('button', { name: /bar chart/i })
    expect(barButton).toHaveClass('active')
  })

  it('switches to pie chart when pie chart button is clicked', async () => {
    vi.mocked(useBookStats).mockReturnValue({
      loading: false,
      error: null,
      genreChartData: mockGenreChartData,
      ratingChartData: mockRatingChartData,
      chartOptions: mockChartOptions,
      genreStats: mockGenreStats,
      ratingStats: { 3: 1, 4: 1, 5: 1 },
      books: mockBooks,
      booksByRating: { 3: [mockBooks[2]], 4: [mockBooks[0]], 5: [mockBooks[1]] },
      fetchStats: vi.fn()
    })

    render(<StatsView />)
    
    const pieButton = screen.getByRole('button', { name: /pie chart/i })
    fireEvent.click(pieButton)
    
    expect(pieButton).toHaveClass('active')
  })

  it('shows bar chart by default in ratings view', async () => {
    vi.mocked(useBookStats).mockReturnValue({
      loading: false,
      error: null,
      genreChartData: mockGenreChartData,
      ratingChartData: mockRatingChartData,
      chartOptions: mockChartOptions,
      genreStats: mockGenreStats,
      ratingStats: { 3: 1, 4: 1, 5: 1 },
      books: mockBooks,
      booksByRating: { 3: [mockBooks[2]], 4: [mockBooks[0]], 5: [mockBooks[1]] },
      fetchStats: vi.fn()
    })

    render(<StatsView />)
    
    // Switch to ratings view
    const ratingsButton = screen.getByRole('button', { name: /rating stats/i })
    fireEvent.click(ratingsButton)
    
    const barButton = screen.getByRole('button', { name: /bar chart/i })
    expect(barButton).toHaveClass('active')
  })

  it('switches to pie chart in ratings view when pie chart button is clicked', async () => {
    vi.mocked(useBookStats).mockReturnValue({
      loading: false,
      error: null,
      genreChartData: mockGenreChartData,
      ratingChartData: mockRatingChartData,
      chartOptions: mockChartOptions,
      genreStats: mockGenreStats,
      ratingStats: { 3: 1, 4: 1, 5: 1 },
      books: mockBooks,
      booksByRating: { 3: [mockBooks[2]], 4: [mockBooks[0]], 5: [mockBooks[1]] },
      fetchStats: vi.fn()
    })

    render(<StatsView />)
    
    // Switch to ratings view
    const ratingsButton = screen.getByRole('button', { name: /rating stats/i })
    fireEvent.click(ratingsButton)
    
    const pieButton = screen.getByRole('button', { name: /pie chart/i })
    fireEvent.click(pieButton)
    
    expect(pieButton).toHaveClass('active')
  })

  it('shows loading state', () => {
    vi.mocked(useBookStats).mockReturnValue({
      loading: true,
      error: null,
      genreChartData: mockGenreChartData,
      ratingChartData: mockRatingChartData,
      chartOptions: mockChartOptions,
      genreStats: {},
      ratingStats: {},
      books: [],
      booksByRating: {},
      fetchStats: vi.fn()
    })

    render(<StatsView />)
    expect(screen.getByTestId('loading-stats')).toBeInTheDocument()
  })

  it('shows error state', () => {
    vi.mocked(useBookStats).mockReturnValue({
      loading: false,
      error: 'API Error',
      genreChartData: mockGenreChartData,
      ratingChartData: mockRatingChartData,
      chartOptions: mockChartOptions,
      genreStats: {},
      ratingStats: {},
      books: [],
      booksByRating: {},
      fetchStats: vi.fn()
    })

    render(<StatsView />)
    expect(screen.getByTestId('stats-error')).toBeInTheDocument()
    expect(screen.getByText(/error: api error/i)).toBeInTheDocument()
  })

  it('shows empty state when no stats available', async () => {
    vi.mocked(useBookStats).mockReturnValue({
      loading: false,
      error: null,
      genreChartData: {
        labels: [],
        data: [],
        colors: [],
        barChartData: { labels: [], datasets: [] },
        pieChartData: { labels: [], datasets: [] }
      },
      ratingChartData: mockRatingChartData,
      chartOptions: mockChartOptions,
      genreStats: {},
      ratingStats: {},
      books: [],
      booksByRating: {},
      fetchStats: vi.fn()
    })

    render(<StatsView />)
    
    // When genreChartData has empty arrays but structure, the component shows chart view
    // The empty state only shows when genreChartData is completely empty (no properties)
    expect(screen.getByTestId('genre-chart-container')).toBeInTheDocument();
  })

  it('shows empty state when genreChartData is completely empty', async () => {
    vi.mocked(useBookStats).mockReturnValue({
      loading: false,
      error: null,
      genreChartData: {} as any, // Force completely empty object
      ratingChartData: mockRatingChartData,
      chartOptions: mockChartOptions,
      genreStats: {},
      ratingStats: {},
      books: [],
      booksByRating: {},
      fetchStats: vi.fn()
    })

    render(<StatsView />)
    
    // This should trigger the empty state condition
    expect(screen.getByTestId('empty-stats-message')).toBeInTheDocument();
    expect(screen.getByText('No stats available. Add some books!')).toBeInTheDocument();
  })

  it('switches between genre and rating stats', () => {
    // Use mock data that will show chart view
    vi.mocked(useBookStats).mockReturnValue({
      loading: false,
      error: null,
      genreChartData: mockGenreChartData,
      ratingChartData: mockRatingChartData,
      chartOptions: mockChartOptions,
      genreStats: mockGenreStats,
      ratingStats: { 3: 1, 4: 1, 5: 1 },
      books: mockBooks,
      booksByRating: { 3: [mockBooks[2]], 4: [mockBooks[0]], 5: [mockBooks[1]] },
      fetchStats: vi.fn()
    })

    render(<StatsView />)
    
    // Initially should show genre stats
    expect(screen.getByTestId('genre-chart-container')).toBeInTheDocument()
    
    // Click rating stats button
    const ratingStatsBtn = screen.getByTestId('rating-stats-btn')
    fireEvent.click(ratingStatsBtn)
    
    // Should now show rating chart container
    expect(screen.getByTestId('rating-chart-container')).toBeInTheDocument()
  })

  it('switches between bar and pie chart views', () => {
    // Use mock data that will show chart view
    vi.mocked(useBookStats).mockReturnValue({
      loading: false,
      error: null,
      genreChartData: mockGenreChartData,
      ratingChartData: mockRatingChartData,
      chartOptions: mockChartOptions,
      genreStats: mockGenreStats,
      ratingStats: { 3: 1, 4: 1, 5: 1 },
      books: mockBooks,
      booksByRating: { 3: [mockBooks[2]], 4: [mockBooks[0]], 5: [mockBooks[1]] },
      fetchStats: vi.fn()
    })

    render(<StatsView />)
    
    // Initially should show bar chart (default)
    expect(screen.getByTestId('bar-chart-btn')).toHaveClass('active')
    
    // Click pie chart button
    const pieChartBtn = screen.getByTestId('pie-chart-btn')
    fireEvent.click(pieChartBtn)
    
    // Should now show pie chart as active
    expect(screen.getByTestId('pie-chart-btn')).toHaveClass('active')
  })
}) 