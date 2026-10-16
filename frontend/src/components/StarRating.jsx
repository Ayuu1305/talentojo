import React, { useState } from 'react';
import { Star } from 'lucide-react';

/**
 * StarRating Component
 * @param {number} value Current rating (1-5)
 * @param {function} onChange Callback when rating is selected (if interactive)
 * @param {boolean} readonly Whether the rating can be interacted with
 * @param {number} size Pixel size of star icon (default: 20)
 */
export const StarRating = ({ value = 0, onChange, readonly = false, size = 20 }) => {
  const [hoverValue, setHoverValue] = useState(0);

  const displayRating = hoverValue > 0 ? hoverValue : value;

  return (
    <div className="star-rating-container" role="radiogroup" aria-label={`Rating: ${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= displayRating;
        const isHovered = hoverValue > 0 && star <= hoverValue;

        return (
          <button
            type="button"
            key={star}
            disabled={readonly}
            className="star-btn"
            onClick={() => !readonly && onChange && onChange(star)}
            onMouseEnter={() => !readonly && setHoverValue(star)}
            onMouseLeave={() => !readonly && setHoverValue(0)}
            aria-label={`${star} Star${star > 1 ? 's' : ''}`}
          >
            <Star
              size={size}
              className={`star-icon ${isFilled ? 'filled' : ''} ${isHovered ? 'hovered' : ''}`}
            />
          </button>
        );
      })}
    </div>
  );
};
