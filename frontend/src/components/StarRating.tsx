import React, { useState } from 'react';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  className?: string;
  disabled?: boolean;
  showText?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  onRatingChange, 
  className = '', 
  disabled = false,
  showText = true
}) => {
  const [hoverRating, setHoverRating] = useState<number>(0);

  const handleStarClick = (starValue: number) => {
    if (!disabled) {
      onRatingChange(starValue);
    }
  };

  const handleStarHover = (starValue: number) => {
    if (!disabled) {
      setHoverRating(starValue);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div 
      className={`star-rating ${className}`}
      onMouseLeave={handleMouseLeave}
      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleStarClick(star)}
          onMouseEnter={() => handleStarHover(star)}
          style={{
            cursor: disabled ? 'default' : 'pointer',
            fontSize: '24px',
            color: star <= displayRating ? '#ffd700' : '#e0e0e0',
            transition: 'color 0.2s ease',
            userSelect: 'none'
          }}
        >
          ★
        </span>
      ))}
      {showText && (
        <span style={{ marginLeft: '8px', fontSize: '14px', color: '#666' }}>
          ({rating}/5)
        </span>
      )}
    </div>
  );
};

export default StarRating; 