import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BookForm from '../BookForm'
import { useBooks } from '../../hooks/useBooks'

// Mock the hooks module
vi.mock('../../hooks/useBooks')

// Mock react-router-dom
const mockNavigate = vi.fn()
const mockUseParams = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
  Link: ({ children, to }: any) => `Link to ${to}: ${children}`,
  NavLink: ({ children, to }: any) => `NavLink to ${to}: ${children}`,
}))

describe('BookForm', () => {
  const mockBook = {
    id: '22222222-2222-2222-2222-222222222222',
    title: 'Test Book',
    author: 'Test Author',
    genre: 'Fiction',
    publishedDate: '2023-01-01T00:00:00.000Z',
    rating: 4
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseParams.mockReturnValue({})
    
    // Mock useBooks hook
    vi.mocked(useBooks).mockReturnValue({
      books: [],
      loading: false,
      error: null,
      fetchBooks: vi.fn(),
      createBook: vi.fn().mockResolvedValue(mockBook),
      updateBook: vi.fn().mockResolvedValue(true),
      deleteBook: vi.fn(),
      getBookById: vi.fn().mockResolvedValue(mockBook),
      clearError: vi.fn()
    })
  })

  it('renders form fields for adding new book', () => {
    render(<BookForm />)
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/author/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/genre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/published date/i)).toBeInTheDocument()
    expect(screen.getByText(/rating/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add book/i })).toBeInTheDocument()
  })

  it('renders form fields for editing existing book', async () => {
    mockUseParams.mockReturnValue({ id: '22222222-2222-2222-2222-222222222222' })
    render(<BookForm />)
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Book')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test Author')).toBeInTheDocument()
    })
  })
  
  it('validates title length', async () => {
    render(<BookForm />)
    
    const titleInput = screen.getByLabelText(/title/i)
    fireEvent.change(titleInput, { target: { value: 'A' } })
    fireEvent.blur(titleInput)
    
    await waitFor(() => {
      expect(screen.getByTestId('title-error')).toBeInTheDocument()
      expect(screen.getByText(/title must be at least 2 characters long/i)).toBeInTheDocument()
    })
  })

  it('validates author name format', async () => {
    render(<BookForm />)
    
    const authorInput = screen.getByLabelText(/author/i)
    fireEvent.change(authorInput, { target: { value: 'Author123' } })
    fireEvent.blur(authorInput)
    
    await waitFor(() => {
      expect(screen.getByTestId('author-error')).toBeInTheDocument()
      expect(screen.getByText(/author name contains invalid characters/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const mockCreateBook = vi.fn().mockResolvedValue(mockBook)
    vi.mocked(useBooks).mockReturnValue({
      books: [],
      loading: false,
      error: null,
      fetchBooks: vi.fn(),
      createBook: mockCreateBook,
      updateBook: vi.fn().mockResolvedValue(true),
      deleteBook: vi.fn(),
      getBookById: vi.fn().mockResolvedValue(mockBook),
      clearError: vi.fn()
    })

    render(<BookForm />)
    
    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Valid Book' } })
    fireEvent.change(screen.getByLabelText(/author/i), { target: { value: 'Valid Author' } })
    fireEvent.change(screen.getByLabelText(/genre/i), { target: { value: 'Fiction' } })
    fireEvent.change(screen.getByLabelText(/published date/i), { target: { value: '2023-01-01' } })
    
    // Set rating to 5 stars
    const stars = screen.getAllByText('★')
    fireEvent.click(stars[4]) // Click 5th star
    
    const submitButton = screen.getByRole('button', { name: /add book/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockCreateBook).toHaveBeenCalledWith({
        title: 'Valid Book',
        author: 'Valid Author',
        genre: 'Fiction',
        publishedDate: '2023-01-01', // Form sends date in YYYY-MM-DD format
        rating: 5
      })
    })
  })

  it('disables submit button when form is invalid', async () => {
    render(<BookForm />)

    // Form starts with empty required fields, so it should be invalid
    const submitButton = screen.getByTestId('submit-button')
    expect(submitButton).toBeDisabled()
  })

  it('enables submit button when form is valid', async () => {
    render(<BookForm />)
    
    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Valid Book' } })
    fireEvent.change(screen.getByLabelText(/author/i), { target: { value: 'Valid Author' } })
    fireEvent.change(screen.getByLabelText(/genre/i), { target: { value: 'Fiction' } })
    fireEvent.change(screen.getByLabelText(/published date/i), { target: { value: '2023-01-01' } })
    
    const submitButton = screen.getByRole('button', { name: /add book/i })
    expect(submitButton).not.toBeDisabled()
  })

  it('updates existing book when editing', async () => {
    const mockUpdateBook = vi.fn().mockResolvedValue(true)
    vi.mocked(useBooks).mockReturnValue({
      books: [],
      loading: false,
      error: null,
      fetchBooks: vi.fn(),
      createBook: vi.fn().mockResolvedValue(mockBook),
      updateBook: mockUpdateBook,
      deleteBook: vi.fn(),
      getBookById: vi.fn().mockResolvedValue(mockBook),
      clearError: vi.fn()
    })

    mockUseParams.mockReturnValue({ id: '22222222-2222-2222-2222-222222222222' })
    render(<BookForm />)
    
    // Wait for the book to be loaded and displayed
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Book')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test Author')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Fiction')).toBeInTheDocument()
      expect(screen.getByDisplayValue('2023-01-01')).toBeInTheDocument()
    })
    
    // Update the title
    const titleInput = screen.getByTestId('title-input')
    fireEvent.change(titleInput, { target: { value: 'Updated Book' } })
    
    // Ensure the form is valid by checking the submit button is enabled
    const submitButton = screen.getByTestId('submit-button')
    expect(submitButton).not.toBeDisabled()
    
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockUpdateBook).toHaveBeenCalledWith('22222222-2222-2222-2222-222222222222', {
        title: 'Updated Book',
        author: 'Test Author',
        genre: 'Fiction',
        publishedDate: '2023-01-01', // Form sends date in YYYY-MM-DD format
        rating: 4 // This matches the mock book rating
      })
    })
  })
}) 