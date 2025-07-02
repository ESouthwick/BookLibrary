import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import StarRating from '../StarRating'

describe('StarRating', () => {
  const mockOnRatingChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders 5 stars', () => {
    render(<StarRating rating={3} onRatingChange={mockOnRatingChange} />)
    
    const stars = screen.getAllByText('★')
    expect(stars).toHaveLength(5)
  })

  it('displays correct rating with filled stars', () => {
    render(<StarRating rating={4} onRatingChange={mockOnRatingChange} />)
    
    const stars = screen.getAllByText('★')
    // First 4 stars should be filled (gold), last 1 should be empty (gray)
    expect(stars[0]).toHaveStyle({ color: 'rgb(255, 215, 0)' }) // #ffd700
    expect(stars[1]).toHaveStyle({ color: 'rgb(255, 215, 0)' })
    expect(stars[2]).toHaveStyle({ color: 'rgb(255, 215, 0)' })
    expect(stars[3]).toHaveStyle({ color: 'rgb(255, 215, 0)' })
    expect(stars[4]).toHaveStyle({ color: 'rgb(224, 224, 224)' }) // #e0e0e0
  })

  it('shows text rating when showText is true', () => {
    render(<StarRating rating={3} onRatingChange={mockOnRatingChange} showText={true} />)
    
    expect(screen.getByText('(3/5)')).toBeInTheDocument()
  })

  it('hides text rating when showText is false', () => {
    render(<StarRating rating={3} onRatingChange={mockOnRatingChange} showText={false} />)
    
    expect(screen.queryByText('(3/5)')).not.toBeInTheDocument()
  })

  it('calls onRatingChange when star is clicked', () => {
    render(<StarRating rating={3} onRatingChange={mockOnRatingChange} />)
    
    const stars = screen.getAllByText('★')
    fireEvent.click(stars[4]) // Click the 5th star
    
    expect(mockOnRatingChange).toHaveBeenCalledWith(5)
  })

  it('does not call onRatingChange when disabled', () => {
    render(<StarRating rating={3} onRatingChange={mockOnRatingChange} disabled={true} />)
    
    const stars = screen.getAllByText('★')
    fireEvent.click(stars[4]) // Click the 5th star
    
    expect(mockOnRatingChange).not.toHaveBeenCalled()
  })

  it('shows hover effect when mouse enters star', () => {
    render(<StarRating rating={3} onRatingChange={mockOnRatingChange} />)
    
    const stars = screen.getAllByText('★')
    fireEvent.mouseEnter(stars[4]) // Hover over the 5th star
    
    // The 5th star should now be filled due to hover
    expect(stars[4]).toHaveStyle({ color: 'rgb(255, 215, 0)' })
  })

  it('removes hover effect when mouse leaves', () => {
    render(<StarRating rating={3} onRatingChange={mockOnRatingChange} />)
    
    const stars = screen.getAllByText('★')
    fireEvent.mouseEnter(stars[4]) // Hover over the 5th star
    fireEvent.mouseLeave(stars[4]) // Leave the 5th star
    
    // Should return to original state
    expect(stars[4]).toHaveStyle({ color: 'rgb(224, 224, 224)' })
  })

  it('applies custom className', () => {
    render(<StarRating rating={3} onRatingChange={mockOnRatingChange} className="custom-class" />)
    
    const stars = screen.getAllByText('★')
    const container = stars[0].parentElement
    expect(container).toHaveClass('custom-class')
  })

  it('has correct cursor style when enabled', () => {
    render(<StarRating rating={3} onRatingChange={mockOnRatingChange} />)
    
    const stars = screen.getAllByText('★')
    expect(stars[0]).toHaveStyle({ cursor: 'pointer' })
  })

  it('has correct cursor style when disabled', () => {
    render(<StarRating rating={3} onRatingChange={mockOnRatingChange} disabled={true} />)
    
    const stars = screen.getAllByText('★')
    expect(stars[0]).toHaveStyle({ cursor: 'default' })
  })
}) 