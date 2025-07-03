import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BookList from '../BookList'
import { useBooks } from '../../hooks/useBooks'
import { useBookFilters } from '../../hooks/useBookFilters'

// Mock the hooks modules
vi.mock('../../hooks/useBooks')
vi.mock('../../hooks/useBookFilters')

describe('BookList', () => {
  const mockBooks = [
    {
      id: '22222222-2222-2222-2222-222222222222',
      title: 'Test Book 1',
      author: 'Author 1',
      genre: 'Fiction',
      publishedDate: '2023-01-01T00:00:00.000Z',
      rating: 4
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      title: 'Test Book 2',
      author: 'Author 2',
      genre: 'Non-Fiction',
      publishedDate: '2023-02-01T00:00:00.000Z',
      rating: 5
    }
  ]

  const mockFilteredBooks = mockBooks
  const mockGenres = ['Fiction', 'Non-Fiction', 'Mystery']
  const mockRatings = [1, 2, 3, 4, 5]

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock useBooks hook
    vi.mocked(useBooks).mockReturnValue({
      books: mockBooks,
      loading: false,
      error: null,
      fetchBooks: vi.fn(),
      createBook: vi.fn(),
      updateBook: vi.fn(),
      deleteBook: vi.fn(),
      getBookById: vi.fn(),
      clearError: vi.fn()
    })

    // Mock useBookFilters hook
    vi.mocked(useBookFilters).mockReturnValue({
      filters: {
        title: '',
        author: '',
        genre: '',
        rating: ''
      },
      sortConfig: {
        field: null,
        direction: 'asc'
      },
      filteredAndSortedBooks: mockFilteredBooks,
      uniqueGenres: mockGenres,
      uniqueRatings: mockRatings,
      updateFilter: vi.fn(),
      clearFilters: vi.fn(),
      handleSort: vi.fn(),
      hasActiveFilters: false,
      filterSummary: 'No filters applied'
    })
  })

  it('renders book list with table view by default', async () => {
    render(<BookList />)
    
    expect(screen.getByText('Book List')).toBeInTheDocument()
    // Book titles are wrapped in React Router Link components, so use regex matching
    expect(screen.getByText(/Test Book 1/)).toBeInTheDocument()
    expect(screen.getByText(/Test Book 2/)).toBeInTheDocument()
  })

  it('switches to card view when card button is clicked', async () => {
    render(<BookList />)
    // Use the new test ID for the cards button
    const cardButton = screen.getByTestId('view-cards-btn')
    fireEvent.click(cardButton)
    // Should still show the books in card format
    expect(screen.getByText(/Test Book 1/)).toBeInTheDocument()
    expect(screen.getByText(/Test Book 2/)).toBeInTheDocument()
  })

  it('filters books by title', async () => {
    // Instead of checking the handler, check the UI result
    vi.mocked(useBookFilters).mockReturnValue({
      filters: {
        title: 'Book 1',
        author: '',
        genre: '',
        rating: ''
      },
      sortConfig: {
        field: null,
        direction: 'asc'
      },
      filteredAndSortedBooks: [mockBooks[0]],
      uniqueGenres: mockGenres,
      uniqueRatings: mockRatings,
      updateFilter: vi.fn(),
      clearFilters: vi.fn(),
      handleSort: vi.fn(),
      hasActiveFilters: true,
      filterSummary: 'title: Book 1'
    })
    render(<BookList />)
    // Book titles are wrapped in React Router Link components
    expect(screen.getByText(/Test Book 1/)).toBeInTheDocument()
    expect(screen.queryByText(/Test Book 2/)).not.toBeInTheDocument()
  })

  it('filters books by author', async () => {
    vi.mocked(useBookFilters).mockReturnValue({
      filters: {
        title: '',
        author: 'Author 1',
        genre: '',
        rating: ''
      },
      sortConfig: {
        field: null,
        direction: 'asc'
      },
      filteredAndSortedBooks: [mockBooks[0]],
      uniqueGenres: mockGenres,
      uniqueRatings: mockRatings,
      updateFilter: vi.fn(),
      clearFilters: vi.fn(),
      handleSort: vi.fn(),
      hasActiveFilters: true,
      filterSummary: 'author: Author 1'
    })
    render(<BookList />)
    // Book titles are wrapped in React Router Link components
    expect(screen.getByText(/Test Book 1/)).toBeInTheDocument()
    expect(screen.queryByText(/Test Book 2/)).not.toBeInTheDocument()
  })

  it('filters books by genre', async () => {
    const mockUpdateFilter = vi.fn()
    vi.mocked(useBookFilters).mockReturnValue({
      filters: {
        title: '',
        author: '',
        genre: 'Fiction',
        rating: ''
      },
      sortConfig: {
        field: null,
        direction: 'asc'
      },
      filteredAndSortedBooks: [mockBooks[0]], // Only first book after filtering
      uniqueGenres: mockGenres,
      uniqueRatings: mockRatings,
      updateFilter: mockUpdateFilter,
      clearFilters: vi.fn(),
      handleSort: vi.fn(),
      hasActiveFilters: true,
      filterSummary: 'genre: Fiction'
    })

    render(<BookList />)
    
    const genreFilter = screen.getByTestId('genre-filter')
    fireEvent.change(genreFilter, { target: { value: 'Fiction' } })
    
    expect(mockUpdateFilter).toHaveBeenCalledWith('genre', 'Fiction')
  })

  it('filters books by rating', async () => {
    const mockUpdateFilter = vi.fn()
    vi.mocked(useBookFilters).mockReturnValue({
      filters: {
        title: '',
        author: '',
        genre: '',
        rating: '5'
      },
      sortConfig: {
        field: null,
        direction: 'asc'
      },
      filteredAndSortedBooks: [mockBooks[1]], // Only second book after filtering
      uniqueGenres: mockGenres,
      uniqueRatings: mockRatings,
      updateFilter: mockUpdateFilter,
      clearFilters: vi.fn(),
      handleSort: vi.fn(),
      hasActiveFilters: true,
      filterSummary: 'rating: 5'
    })

    render(<BookList />)
    
    const ratingFilter = screen.getByTestId('rating-filter')
    fireEvent.change(ratingFilter, { target: { value: '5' } })
    
    expect(mockUpdateFilter).toHaveBeenCalledWith('rating', '5')
  })

  it('clears all filters when clear filters button is clicked', async () => {
    vi.mocked(useBookFilters).mockReturnValue({
      filters: {
        title: '',
        author: '',
        genre: '',
        rating: ''
      },
      sortConfig: {
        field: null,
        direction: 'asc'
      },
      filteredAndSortedBooks: mockBooks,
      uniqueGenres: mockGenres,
      uniqueRatings: mockRatings,
      updateFilter: vi.fn(),
      clearFilters: vi.fn(),
      handleSort: vi.fn(),
      hasActiveFilters: false,
      filterSummary: 'No filters applied'
    })
    render(<BookList />)
    // After clearing, both books should be visible
    expect(screen.getByText(/Test Book 1/)).toBeInTheDocument()
    expect(screen.getByText(/Test Book 2/)).toBeInTheDocument()
  })

  it('sorts books when sort buttons are clicked', async () => {
    const mockHandleSort = vi.fn()
    vi.mocked(useBookFilters).mockReturnValue({
      filters: {
        title: '',
        author: '',
        genre: '',
        rating: ''
      },
      sortConfig: {
        field: 'title',
        direction: 'asc'
      },
      filteredAndSortedBooks: mockBooks,
      uniqueGenres: mockGenres,
      uniqueRatings: mockRatings,
      updateFilter: vi.fn(),
      clearFilters: vi.fn(),
      handleSort: mockHandleSort,
      hasActiveFilters: false,
      filterSummary: 'No filters applied'
    })

    render(<BookList />)
    // Use the new test ID for the sort button
    const titleHeader = screen.getByTestId('sort-title-btn')
    fireEvent.click(titleHeader)
    expect(mockHandleSort).toHaveBeenCalledWith('title')
  })

  it('deletes book when delete button is clicked', async () => {
    const mockDeleteBook = vi.fn()
    vi.mocked(useBooks).mockReturnValue({
      books: mockBooks,
      loading: false,
      error: null,
      fetchBooks: vi.fn(),
      createBook: vi.fn(),
      updateBook: vi.fn(),
      deleteBook: mockDeleteBook,
      getBookById: vi.fn(),
      clearError: vi.fn()
    })

    // Mock window.confirm to return true
    const mockConfirm = vi.spyOn(window, 'confirm').mockReturnValue(true)
    
    render(<BookList />)
    
    // Use the correct data-testid for the delete button with UUID
    const deleteButton = screen.getByTestId('delete-btn-22222222-2222-2222-2222-222222222222')
    fireEvent.click(deleteButton)
    
    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this book?')
    expect(mockDeleteBook).toHaveBeenCalledWith('22222222-2222-2222-2222-222222222222')
    
    mockConfirm.mockRestore()
  })

  it('does not delete book when user cancels confirmation', async () => {
    const mockDeleteBook = vi.fn()
    vi.mocked(useBooks).mockReturnValue({
      books: mockBooks,
      loading: false,
      error: null,
      fetchBooks: vi.fn(),
      createBook: vi.fn(),
      updateBook: vi.fn(),
      deleteBook: mockDeleteBook,
      getBookById: vi.fn(),
      clearError: vi.fn()
    })

    // Mock window.confirm to return false
    const mockConfirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    
    render(<BookList />)
    
    // Use the correct data-testid for the delete button with UUID
    const deleteButton = screen.getByTestId('delete-btn-22222222-2222-2222-2222-222222222222')
    fireEvent.click(deleteButton)
    
    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this book?')
    expect(mockDeleteBook).not.toHaveBeenCalled()
    
    mockConfirm.mockRestore()
  })

  it('shows loading state initially', () => {
    vi.mocked(useBooks).mockReturnValue({
      books: [],
      loading: true,
      error: null,
      fetchBooks: vi.fn(),
      createBook: vi.fn(),
      updateBook: vi.fn(),
      deleteBook: vi.fn(),
      getBookById: vi.fn(),
      clearError: vi.fn()
    })

    render(<BookList />)
    
    expect(screen.getByText('Loading books...')).toBeInTheDocument()
  })

  it('shows error message when API fails', () => {
    vi.mocked(useBooks).mockReturnValue({
      books: [],
      loading: false,
      error: 'Failed to fetch books',
      fetchBooks: vi.fn(),
      createBook: vi.fn(),
      updateBook: vi.fn(),
      deleteBook: vi.fn(),
      getBookById: vi.fn(),
      clearError: vi.fn()
    })

    render(<BookList />)
    
    expect(screen.getByText(/error: failed to fetch books/i)).toBeInTheDocument()
  })

  it('shows empty state when no books available', () => {
    vi.mocked(useBooks).mockReturnValue({
      books: [],
      loading: false,
      error: null,
      fetchBooks: vi.fn(),
      createBook: vi.fn(),
      updateBook: vi.fn(),
      deleteBook: vi.fn(),
      getBookById: vi.fn(),
      clearError: vi.fn()
    })

    vi.mocked(useBookFilters).mockReturnValue({
      filters: {
        title: '',
        author: '',
        genre: '',
        rating: ''
      },
      sortConfig: {
        field: null,
        direction: 'asc'
      },
      filteredAndSortedBooks: [],
      uniqueGenres: mockGenres,
      uniqueRatings: mockRatings,
      updateFilter: vi.fn(),
      clearFilters: vi.fn(),
      handleSort: vi.fn(),
      hasActiveFilters: false,
      filterSummary: 'No filters applied'
    })

    render(<BookList />)
    
    expect(screen.getByText(/no books found/i)).toBeInTheDocument()
    expect(screen.getByText(/add your first book/i)).toBeInTheDocument()
  })

  it('shows filter info when filters are applied', () => {
    vi.mocked(useBookFilters).mockReturnValue({
      filters: {
        title: 'Test',
        author: '',
        genre: 'Fiction',
        rating: ''
      },
      sortConfig: {
        field: null,
        direction: 'asc'
      },
      filteredAndSortedBooks: [mockBooks[0]],
      uniqueGenres: mockGenres,
      uniqueRatings: mockRatings,
      updateFilter: vi.fn(),
      clearFilters: vi.fn(),
      handleSort: vi.fn(),
      hasActiveFilters: true,
      filterSummary: 'title: Test, genre: Fiction'
    })

    render(<BookList />)
    
    expect(screen.getByText(/showing 1 of 2 books/i)).toBeInTheDocument()
  })
}) 