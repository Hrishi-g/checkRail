import React from 'react'
import { TrainIcon, SearchIcon, StarIcon } from '../common/Icons'

interface BottomNavProps {
  activeTab: 'home' | 'search' | 'favourites'
  onSelectTab: (tab: 'home' | 'search' | 'favourites') => void
  favouriteCount?: number
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  favouriteCount = 0,
}) => {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '62px',
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 100,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
      className="mobile-bottom-nav"
    >
      <button
        onClick={() => onSelectTab('home')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: activeTab === 'home' ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
          fontSize: '11px',
          fontWeight: activeTab === 'home' ? 600 : 500,
          transition: 'color 0.15s ease',
        }}
      >
        <TrainIcon size={20} />
        <span>Home</span>
      </button>

      <button
        onClick={() => onSelectTab('search')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: activeTab === 'search' ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
          fontSize: '11px',
          fontWeight: activeTab === 'search' ? 600 : 500,
          transition: 'color 0.15s ease',
        }}
      >
        <SearchIcon size={20} />
        <span>Search</span>
      </button>

      <button
        onClick={() => onSelectTab('favourites')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
          color: activeTab === 'favourites' ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
          fontSize: '11px',
          fontWeight: activeTab === 'favourites' ? 600 : 500,
          transition: 'color 0.15s ease',
          position: 'relative',
        }}
      >
        <StarIcon size={20} filled={activeTab === 'favourites'} />
        <span>Favourites</span>
        {favouriteCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-6px',
              backgroundColor: 'var(--color-accent)',
              color: '#fff',
              fontSize: '10px',
              fontWeight: 700,
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {favouriteCount}
          </span>
        )}
      </button>
    </nav>
  )
}
