import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import { getBooks, getBookById, createBook, updateBook, deleteBook, getBookStats } from '../booksApi'
import type { Book } from '../booksApi'

// Mock axios
vi.mock('axios')
const mockedAxios = vi.mocked(axios) as any

describe('booksApi', () => {
  const mockBook: Book = {
    id: 'test-id',
    title: 'Test Book',
    author: 'Test Author',
    genre: 'Fiction',
    publishedDate: '2023-01-01T00:00:00.000Z',
    rating: 4
  }

  const mockStats = {
    'Fiction': 3,
    'Non-Fiction': 2
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('getBooks', () => {
    it('fetches all books successfully', async () => {
      const mockResponse = { data: [mockBook] }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await getBooks()

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5086/api/books')
      expect(result).toEqual([mockBook])
    })

    it('handles API error', async () => {
      const error = new Error('Network error')
      mockedAxios.get.mockRejectedValue(error)

      await expect(getBooks()).rejects.toThrow('Network error')
    })
  })

  describe('getBookById', () => {
    it('fetches a book by ID successfully', async () => {
      const mockResponse = { data: mockBook }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await getBookById('test-id')

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5086/api/books/test-id')
      expect(result).toEqual(mockBook)
    })

    it('handles API error', async () => {
      const error = new Error('Book not found')
      mockedAxios.get.mockRejectedValue(error)

      await expect(getBookById('test-id')).rejects.toThrow('Book not found')
    })
  })

  describe('createBook', () => {
    it('creates a new book successfully', async () => {
      const newBook = {
        title: 'New Book',
        author: 'New Author',
        genre: 'Fiction',
        publishedDate: '2023-01-01T00:00:00.000Z',
        rating: 5
      }
      const mockResponse = { data: { ...newBook, id: 'new-id' } }
      mockedAxios.post.mockResolvedValue(mockResponse)

      const result = await createBook(newBook)

      expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:5086/api/books', newBook)
      expect(result).toEqual({ ...newBook, id: 'new-id' })
    })

    it('handles API error', async () => {
      const newBook = {
        title: 'New Book',
        author: 'New Author',
        genre: 'Fiction',
        publishedDate: '2023-01-01T00:00:00.000Z',
        rating: 5
      }
      const error = new Error('Validation error')
      mockedAxios.post.mockRejectedValue(error)

      await expect(createBook(newBook)).rejects.toThrow('Validation error')
    })
  })

  describe('updateBook', () => {
    it('updates a book successfully', async () => {
      const updatedBook = { ...mockBook, title: 'Updated Book' }
      mockedAxios.put.mockResolvedValue({})

      await updateBook('test-id', updatedBook)

      expect(mockedAxios.put).toHaveBeenCalledWith('http://localhost:5086/api/books/test-id', updatedBook)
    })

    it('handles API error', async () => {
      const updatedBook = { ...mockBook, title: 'Updated Book' }
      const error = new Error('Book not found')
      mockedAxios.put.mockRejectedValue(error)

      await expect(updateBook('test-id', updatedBook)).rejects.toThrow('Book not found')
    })
  })

  describe('deleteBook', () => {
    it('deletes a book successfully', async () => {
      mockedAxios.delete.mockResolvedValue({})

      await deleteBook('test-id')

      expect(mockedAxios.delete).toHaveBeenCalledWith('http://localhost:5086/api/books/test-id')
    })

    it('handles API error', async () => {
      const error = new Error('Book not found')
      mockedAxios.delete.mockRejectedValue(error)

      await expect(deleteBook('test-id')).rejects.toThrow('Book not found')
    })
  })

  describe('getBookStats', () => {
    it('fetches book statistics successfully', async () => {
      const mockResponse = { data: mockStats }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await getBookStats()

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5086/api/books/stats')
      expect(result).toEqual(mockStats)
    })

    it('handles API error', async () => {
      const error = new Error('Server error')
      mockedAxios.get.mockRejectedValue(error)

      await expect(getBookStats()).rejects.toThrow('Server error')
    })
  })

  describe('API base URL', () => {
    it('uses correct base URL for all endpoints', async () => {
      const mockResponse = { data: [mockBook] }
      mockedAxios.get.mockResolvedValue(mockResponse)

      await getBooks()

      expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5086/api/books')
    })
  })

  describe('Error handling', () => {
    it('propagates axios errors correctly', async () => {
      const axiosError = {
        response: {
          status: 404,
          data: { message: 'Not found' }
        }
      }
      mockedAxios.get.mockRejectedValue(axiosError)

      await expect(getBooks()).rejects.toEqual(axiosError)
    })

    it('handles network errors', async () => {
      const networkError = new Error('Network Error')
      mockedAxios.get.mockRejectedValue(networkError)

      await expect(getBooks()).rejects.toThrow('Network Error')
    })
  })

  describe('Request/Response types', () => {
    it('maintains correct TypeScript types', async () => {
      const mockResponse = { data: [mockBook] }
      mockedAxios.get.mockResolvedValue(mockResponse)

      const result = await getBooks()

      // TypeScript should infer the correct type
      expect(Array.isArray(result)).toBe(true)
      expect(result[0]).toHaveProperty('id')
      expect(result[0]).toHaveProperty('title')
      expect(result[0]).toHaveProperty('author')
      expect(result[0]).toHaveProperty('genre')
      expect(result[0]).toHaveProperty('publishedDate')
      expect(result[0]).toHaveProperty('rating')
    })
  })
}) 