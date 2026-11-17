import React from 'react'
import { TrainIcon, StarIcon, ArrowLeftIcon } from '../common/Icons'

interface TopNavProps {
  onBackToHome?: () => void
  showBackButton?: boolean
  favouriteCount?: number
  onFavouritesClick?: () => void
}

export const TopNav: React.FC<TopNavProps> = ({
  onBackToHome,
  showBackButton = false,
  favouriteCount = 0,
  onFavouritesClick,
}) => {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '64px',
        backgroundColor: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {showBackButton && (
          <button
            onClick={onBackToHome}
            aria-label="Back to dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface)')}
          >
            <ArrowLeftIcon size={18} />
          </button>
        )}

        <div
          onClick={onBackToHome}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'var(--color-accent-soft)',
              color: 'var(--color-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrainIcon size={20} />
          </div>
          <div>
            <span
              style={{
                fontSize: '18px',
                fontWeight: 700,
                letterSpacing: '-0.3px',
                color: 'var(--color-text-primary)',
              }}
            >
              check<span style={{ color: 'var(--color-accent)' }}>Rail</span>
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {favouriteCount > 0 && onFavouritesClick && (
          <button
            onClick={onFavouritesClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '999px',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--color-text-primary)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface)')}
          >
            <StarIcon size={15} filled={true} />
            <span>Favourites</span>
            <span
              style={{
                backgroundColor: 'var(--color-text-primary)',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 600,
                padding: '1px 6px',
                borderRadius: '999px',
              }}
            >
              {favouriteCount}
            </span>
          </button>
        )}
      </div>
    </header>
  )
}
