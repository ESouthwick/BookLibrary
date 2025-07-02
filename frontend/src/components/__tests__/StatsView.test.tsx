import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import StatsView from '../StatsView'
import * as booksApi from '../../api/booksApi'

// Mock the API module
vi.mock('../../api/booksApi')

describe('StatsView', () => {
  const mockStats = {
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

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(booksApi.getBookStats).mockResolvedValue(mockStats)
    vi.mocked(booksApi.getBooks).mockResolvedValue(mockBooks)
  })

  it('renders statistics view by default', async () => {
    render(<StatsView />)
    
    await waitFor(() => {
      expect(screen.getByText('Book Analytics')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /statistics/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /ratings/i })).toBeInTheDocument()
    })
  })

  it('switches to ratings view when ratings button is clicked', async () => {
    render(<StatsView />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /statistics/i })).toBeInTheDocument()
    })
    
    const ratingsButton = screen.getByRole('button', { name: /ratings/i })
    fireEvent.click(ratingsButton)
    
    // Should show ratings content - look for actual content that exists
    await waitFor(() => {
      expect(screen.getByText('Rating')).toBeInTheDocument()
      expect(screen.getByText('Books')).toBeInTheDocument()
      expect(screen.getByText('Percentage')).toBeInTheDocument()
    })
  })

  it('switches back to statistics view when statistics button is clicked', async () => {
    render(<StatsView />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /statistics/i })).toBeInTheDocument()
    })
    
    // Switch to ratings first
    const ratingsButton = screen.getByRole('button', { name: /ratings/i })
    fireEvent.click(ratingsButton)
    
    // Switch back to statistics
    const statsButton = screen.getByRole('button', { name: /statistics/i })
    fireEvent.click(statsButton)
    
    // Should show statistics content - use role selectors to avoid ambiguity
    expect(screen.getByRole('button', { name: /bar chart/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /pie chart/i })).toBeInTheDocument()
  })

  it('shows bar chart by default in statistics view', async () => {
    render(<StatsView />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /bar chart/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /pie chart/i })).toBeInTheDocument()
    })
    
    const barButton = screen.getByRole('button', { name: /bar chart/i })
    expect(barButton).toHaveClass('active')
  })

  it('switches to pie chart when pie chart button is clicked', async () => {
    render(<StatsView />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /bar chart/i })).toBeInTheDocument()
    })
    
    const pieButton = screen.getByRole('button', { name: /pie chart/i })
    fireEvent.click(pieButton)
    
    expect(pieButton).toHaveClass('active')
  })

  it('shows pie chart by default in ratings view', async () => {
    render(<StatsView />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /statistics/i })).toBeInTheDocument()
    })
    
    // Switch to ratings view
    const ratingsButton = screen.getByRole('button', { name: /ratings/i })
    fireEvent.click(ratingsButton)
    
    const pieButton = screen.getByRole('button', { name: /pie chart/i })
    expect(pieButton).toHaveClass('active')
  })

  it('switches to bar chart in ratings view when bar chart button is clicked', async () => {
    render(<StatsView />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /statistics/i })).toBeInTheDocument()
    })
    
    // Switch to ratings view
    const ratingsButton = screen.getByRole('button', { name: /ratings/i })
    fireEvent.click(ratingsButton)
    
    const barButton = screen.getByRole('button', { name: /bar chart/i })
    fireEvent.click(barButton)
    
    expect(barButton).toHaveClass('active')
  })

  it('displays correct statistics cards', async () => {
    render(<StatsView />)
    
    await waitFor(() => {
      // Use within to scope to the correct card
      const genreCard = screen.getByText('Total Genres').closest('div');
      expect(within(genreCard!).getByText('3')).toBeInTheDocument();
      const booksCard = screen.getByText('Total Books').closest('div');
      expect(within(booksCard!).getByText('3')).toBeInTheDocument();
      const avgCard = screen.getByText('Average Rating').closest('div');
      expect(within(avgCard!).getByText('4.0')).toBeInTheDocument();
      const uniqueCard = screen.getByText('Unique Authors').closest('div');
      expect(within(uniqueCard!).getByText('3')).toBeInTheDocument();
    })
  })

  it('displays correct ratings cards', async () => {
    render(<StatsView />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /statistics/i })).toBeInTheDocument()
    })
    
    // Switch to ratings view
    const ratingsButton = screen.getByRole('button', { name: /ratings/i })
    fireEvent.click(ratingsButton)
    
    await waitFor(() => {
      expect(screen.getByText('Total Books')).toBeInTheDocument()
      expect(screen.getByText('3')).toBeInTheDocument()
      expect(screen.getByText('Average Rating')).toBeInTheDocument()
      expect(screen.getByText('4.0')).toBeInTheDocument()
      expect(screen.getByText('Highest Rated')).toBeInTheDocument()
      expect(screen.getByText('5 Stars')).toBeInTheDocument()
      expect(screen.getByText('Lowest Rated')).toBeInTheDocument()
      expect(screen.getByText('3 Stars')).toBeInTheDocument()
    })
  })

  it('displays ratings table with correct data', async () => {
    render(<StatsView />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /statistics/i })).toBeInTheDocument()
    })
    
    // Switch to ratings view
    const ratingsButton = screen.getByRole('button', { name: /ratings/i })
    fireEvent.click(ratingsButton)
    
    await waitFor(() => {
      expect(screen.getByText('Rating')).toBeInTheDocument()
      expect(screen.getByText('Books')).toBeInTheDocument()
      expect(screen.getByText('Percentage')).toBeInTheDocument()
      expect(screen.getByText('Sample Books')).toBeInTheDocument()
    })
  })

  it('shows loading state initially', () => {
    render(<StatsView />)
    
    expect(screen.getByText(/loading stats/i)).toBeInTheDocument()
  })

  it('shows error message when API fails', async () => {
    vi.mocked(booksApi.getBookStats).mockRejectedValue(new Error('API Error'))
    
    render(<StatsView />)
    
    await waitFor(() => {
      expect(screen.getByText(/error: failed to fetch book stats/i)).toBeInTheDocument()
    })
  })

  it('shows empty state when no stats available', async () => {
    vi.mocked(booksApi.getBookStats).mockResolvedValue({})
    vi.mocked(booksApi.getBooks).mockResolvedValue([])
    
    render(<StatsView />)
    
    await waitFor(() => {
      expect(screen.getByText(/no stats available/i)).toBeInTheDocument()
      expect(screen.getByText(/add some books/i)).toBeInTheDocument()
    })
  })

  it('calculates recent books correctly', async () => {
    const recentBooks = [
      {
        id: '1',
        title: 'Recent Book',
        author: 'Author',
        genre: 'Fiction',
        publishedDate: new Date().toISOString(), // Current year
        rating: 4
      },
      {
        id: '2',
        title: 'Old Book',
        author: 'Author',
        genre: 'Fiction',
        publishedDate: '2015-01-01T00:00:00.000Z', // 8 years ago
        rating: 3
      }
    ]
    
    vi.mocked(booksApi.getBooks).mockResolvedValue(recentBooks)
    
    render(<StatsView />)
    
    await waitFor(() => {
      const recentCard = screen.getByText('Recent Books').closest('div');
      expect(within(recentCard!).getByText('1')).toBeInTheDocument(); // Only 1 book in last 5 years
    })
  })

  it('displays correct genre with most books', async () => {
    render(<StatsView />)
    
    await waitFor(() => {
      const biggestCard = screen.getByText('Biggest Selection').closest('div');
      expect(within(biggestCard!).getByText('Fiction')).toBeInTheDocument(); // Fiction has 2 books
    })
  })
}) 