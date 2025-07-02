import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useNavigate, useParams } from 'react-router-dom'
import BookForm from '../BookForm'
import * as booksApi from '../../api/booksApi'

// Mock the API module
vi.mock('../../api/booksApi')

// Mock react-router-dom
const mockNavigate = vi.fn()
const mockUseParams = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams(),
  Link: ({ children, to }: any) => `Link to ${to}: ${children}`,
  NavLink: ({ children, to, className }: any) => `NavLink to ${to}: ${children}`,
}))

describe('BookForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseParams.mockReturnValue({})
    // Mock useNavigate
    vi.mocked(booksApi.createBook).mockResolvedValue({
      id: 'test-id',
      title: 'Test Book',
      author: 'Test Author',
      genre: 'Fiction',
      publishedDate: '2023-01-01T00:00:00.000Z',
      rating: 4
    })
    vi.mocked(booksApi.updateBook).mockResolvedValue()
    vi.mocked(booksApi.getBookById).mockResolvedValue({
      id: 'test-id',
      title: 'Test Book',
      author: 'Test Author',
      genre: 'Fiction',
      publishedDate: '2023-01-01T00:00:00.000Z',
      rating: 4
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
    mockUseParams.mockReturnValue({ id: 'test-id' })
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
      expect(screen.getByText(/title must be at least 2 characters long/i)).toBeInTheDocument()
    })
  })

  it('validates author name format', async () => {
    render(<BookForm />)
    
    const authorInput = screen.getByLabelText(/author/i)
    fireEvent.change(authorInput, { target: { value: 'Author123' } })
    fireEvent.blur(authorInput)
    
    await waitFor(() => {
      expect(screen.getByText(/author name contains invalid characters/i)).toBeInTheDocument()
    })
  })

  it('validates published date is not in future', async () => {
    render(<BookForm />)
    
    const dateInput = screen.getByLabelText(/published date/i)
    const futureDate = new Date()
    futureDate.setFullYear(futureDate.getFullYear() + 1)
    fireEvent.change(dateInput, { target: { value: futureDate.toISOString().split('T')[0] } })
    fireEvent.blur(dateInput)
    
    await waitFor(() => {
      expect(screen.getByText(/published date cannot be in the future/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
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
      expect(booksApi.createBook).toHaveBeenCalledWith({
        title: 'Valid Book',
        author: 'Valid Author',
        genre: 'Fiction',
        publishedDate: '2023-01-01T00:00:00.000Z',
        rating: 5
      })
    })
  })

  it('shows loading state during submission', async () => {
    // Mock a delayed API response
    vi.mocked(booksApi.createBook).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        id: 'test-id',
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Fiction',
        publishedDate: '2023-01-01T00:00:00.000Z',
        rating: 4
      }), 100))
    )
    
    render(<BookForm />)
    
    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Valid Book' } })
    fireEvent.change(screen.getByLabelText(/author/i), { target: { value: 'Valid Author' } })
    fireEvent.change(screen.getByLabelText(/genre/i), { target: { value: 'Fiction' } })
    fireEvent.change(screen.getByLabelText(/published date/i), { target: { value: '2023-01-01' } })
    
    const submitButton = screen.getByRole('button', { name: /add book/i })
    fireEvent.click(submitButton)
    
    expect(screen.getByText(/submitting/i)).toBeInTheDocument()
  })

  it('shows error message on API failure', async () => {
    vi.mocked(booksApi.createBook).mockRejectedValue(new Error('API Error'))
    
    render(<BookForm />)
    
    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Valid Book' } })
    fireEvent.change(screen.getByLabelText(/author/i), { target: { value: 'Valid Author' } })
    fireEvent.change(screen.getByLabelText(/genre/i), { target: { value: 'Fiction' } })
    fireEvent.change(screen.getByLabelText(/published date/i), { target: { value: '2023-01-01' } })
    
    const submitButton = screen.getByRole('button', { name: /add book/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/failed to create book/i)).toBeInTheDocument()
    })
  })

  it('disables submit button when form is invalid', () => {
    render(<BookForm />)
    
    const submitButton = screen.getByRole('button', { name: /add book/i })
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
}) 