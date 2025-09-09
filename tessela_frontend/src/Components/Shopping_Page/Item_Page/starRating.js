import { useState } from 'react';

export default function StarRating({
  value = 0,
  outOf = 5,
  size = 20,
  readOnly = false,
  onChange,
  idPrefix = 'star',
}) {
  const [hover, setHover] = useState(null);
  const effective = hover ?? value;

  return (
    <div className="d-inline-flex align-items-center" aria-label={`${value} out of ${outOf} stars`}>
      {Array.from({ length: outOf }).map((_, i) => {
        const idx = i + 1;
        const filled = idx <= effective;
        const labelId = `${idPrefix}-${idx}`;
        return (
          <button
            key={idx}
            id={labelId}
            type="button"
            className="btn p-0 border-0 bg-transparent"
            style={{ lineHeight: 1, cursor: readOnly ? 'default' : 'pointer' }}
            onMouseEnter={() => !readOnly && setHover(idx)}
            onMouseLeave={() => !readOnly && setHover(null)}
            onFocus={() => {}}
            onBlur={() => {}}
            onClick={() => !readOnly && onChange?.(idx)}
            aria-pressed={filled}
            aria-label={`${idx} star${idx > 1 ? 's' : ''}`}
            disabled={readOnly}
          >
            {/* simple inline SVG star for crisp rendering */}
            <svg width={size} height={size} viewBox="0 0 24 24" role="img" aria-hidden="true">
              <path
                d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.786 1.402 8.173L12 18.896 4.664 23.17l1.402-8.173L.132 9.211l8.2-1.193L12 .587z"
                fill={filled ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}