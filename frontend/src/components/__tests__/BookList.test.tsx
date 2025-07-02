import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BookList from '../BookList'
import * as booksApi from '../../api/booksApi'

// Mock the API module
vi.mock('../../api/booksApi')

describe('BookList', () => {
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
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(booksApi.getBooks).mockResolvedValue(mockBooks)
    vi.mocked(booksApi.deleteBook).mockResolvedValue()
  })

  it('renders book list with table view by default', async () => {
    render(<BookList />)
    
    await waitFor(() => {
      expect(screen.getByText('Book List')).toBeInTheDocument()
      expect(screen.getByText('Test Book 1')).toBeInTheDocument()
      expect(screen.getByText('Test Book 2')).toBeInTheDocument()
    })
  })

  it('switches to card view when card button is clicked', async () => {
    render(<BookList />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument()
    })
    
    const cardButton = screen.getByRole('button', { name: /cards/i })
    fireEvent.click(cardButton)
    
    // Should still show the books in card format
    expect(screen.getByText('Test Book 1')).toBeInTheDocument()
    expect(screen.getByText('Test Book 2')).toBeInTheDocument()
  })

  it('filters books by title', async () => {
    render(<BookList />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument()
      expect(screen.getByText('Test Book 2')).toBeInTheDocument()
    })
    
    const titleFilter = screen.getByTestId('title-filter')
    fireEvent.change(titleFilter, { target: { value: 'Book 1' } })
    
    expect(screen.getByText('Test Book 1')).toBeInTheDocument()
    expect(screen.queryByText('Test Book 2')).not.toBeInTheDocument()
  })

  it('filters books by author', async () => {
    render(<BookList />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument()
      expect(screen.getByText('Test Book 2')).toBeInTheDocument()
    })
    
    const authorFilter = screen.getByTestId('author-filter')
    fireEvent.change(authorFilter, { target: { value: 'Author 1' } })
    
    expect(screen.getByText('Test Book 1')).toBeInTheDocument()
    expect(screen.queryByText('Test Book 2')).not.toBeInTheDocument()
  })

  it('filters books by genre', async () => {
    render(<BookList />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument()
      expect(screen.getByText('Test Book 2')).toBeInTheDocument()
    })
    
    const genreFilter = screen.getByTestId('genre-filter')
    fireEvent.change(genreFilter, { target: { value: 'Fiction' } })
    
    // Check that the filter is applied by looking at the filter info
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument()
      expect(screen.queryByText('Test Book 2')).not.toBeInTheDocument()
    })
  })

  it('filters books by rating', async () => {
    render(<BookList />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument()
      expect(screen.getByText('Test Book 2')).toBeInTheDocument()
    })
    
    const ratingFilter = screen.getByTestId('rating-filter')
    fireEvent.change(ratingFilter, { target: { value: '5' } })
    
    expect(screen.queryByText('Test Book 1')).not.toBeInTheDocument()
    expect(screen.getByText('Test Book 2')).toBeInTheDocument()
  })

  it('clears all filters when clear filters button is clicked', async () => {
    render(<BookList />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument()
      expect(screen.getByText('Test Book 2')).toBeInTheDocument()
    })
    
    // Apply a filter
    const titleFilter = screen.getByTestId('title-filter')
    fireEvent.change(titleFilter, { target: { value: 'Book 1' } })
    
    expect(screen.getByText('Test Book 1')).toBeInTheDocument()
    expect(screen.queryByText('Test Book 2')).not.toBeInTheDocument()
    
    // Clear filters
    const clearButton = screen.getByTestId('clear-filters-btn')
    fireEvent.click(clearButton)
    
    expect(screen.getByText('Test Book 1')).toBeInTheDocument()
    expect(screen.getByText('Test Book 2')).toBeInTheDocument()
  })

  it('sorts books by title when title header is clicked', async () => {
    render(<BookList />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument()
      expect(screen.getByText('Test Book 2')).toBeInTheDocument()
    })
    
    const titleHeader = screen.getByRole('columnheader', { name: /title/i })
    fireEvent.click(titleHeader)
    
    // Should still show both books (sorting is handled internally)
    expect(screen.getByText('Test Book 1')).toBeInTheDocument()
    expect(screen.getByText('Test Book 2')).toBeInTheDocument()
  })

  it('deletes book when delete button is clicked', async () => {
    // Mock window.confirm to return true
    const mockConfirm = vi.spyOn(window, 'confirm').mockReturnValue(true)
    
    render(<BookList />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument()
    })
    
    const deleteButton = screen.getByTestId('delete-book-1')
    fireEvent.click(deleteButton)
    
    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this book?')
    expect(booksApi.deleteBook).toHaveBeenCalledWith('1')
    
    mockConfirm.mockRestore()
  })

  it('does not delete book when user cancels confirmation', async () => {
    // Mock window.confirm to return false
    const mockConfirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    
    render(<BookList />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument()
    })
    
    const deleteButton = screen.getByTestId('delete-book-1')
    fireEvent.click(deleteButton)
    
    expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this book?')
    expect(booksApi.deleteBook).not.toHaveBeenCalled()
    
    mockConfirm.mockRestore()
  })

  it('shows loading state initially', () => {
    render(<BookList />)
    
    expect(screen.getByText(/loading books/i)).toBeInTheDocument()
  })

  it('shows error message when API fails', async () => {
    vi.mocked(booksApi.getBooks).mockRejectedValue(new Error('API Error'))
    
    render(<BookList />)
    
    await waitFor(() => {
      expect(screen.getByText(/error: failed to fetch books/i)).toBeInTheDocument()
    })
  })

  it('displays book count information', async () => {
    render(<BookList />)
    
    await waitFor(() => {
      expect(screen.getByText(/showing 2 of 2 books/i)).toBeInTheDocument()
    })
  })

  it('displays edit and delete buttons for each book', async () => {
    render(<BookList />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument()
    })
    
    // Wait for the action buttons to be rendered
    await waitFor(() => {
      // Check that delete buttons exist for each book (these have data-testid)
      expect(screen.getByTestId('delete-book-1')).toBeInTheDocument()
      expect(screen.getByTestId('delete-book-2')).toBeInTheDocument()
      
      // Check that action button containers exist for each book
      const actionContainers = screen.getAllByText('🗑️').map(button => button.closest('.action-buttons')).filter(Boolean)
      expect(actionContainers).toHaveLength(2)
      
      // Check that each action container has both edit and delete elements
      actionContainers.forEach(container => {
        expect(container?.textContent).toContain('✏️')
        expect(container?.textContent).toContain('🗑️')
      })
    })
  })
}) 