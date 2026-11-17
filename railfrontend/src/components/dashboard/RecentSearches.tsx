import React from 'react'
import type { RecentSearch } from '../../types'
import { CloseIcon, ClockIcon } from '../common/Icons'

interface RecentSearchesProps {
  recents: RecentSearch[]
  onSelectRecent: (recent: RecentSearch) => void
  onRemoveRecent: (trainNumber: string) => void
  onClearAll: () => void
}

export const RecentSearches: React.FC<RecentSearchesProps> = ({
  recents,
  onSelectRecent,
  onRemoveRecent,
  onClearAll,
}) => {
  if (recents.length === 0) return null

  return (
    <div style={{ marginTop: '24px', width: '100%', maxWidth: '680px', marginInline: 'auto' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
          padding: '0 4px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ClockIcon size={14} style={{ color: 'var(--color-text-secondary)' }} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Recent Searches
          </span>
        </div>
        <button
          onClick={onClearAll}
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--color-text-tertiary)',
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-danger)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-tertiary)')}
        >
          Clear all
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        {recents.map((item) => (
          <div
            key={item.trainNumber}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '999px',
              padding: '6px 10px 6px 14px',
              gap: '8px',
              transition: 'all 0.18s ease',
            }}
          >
            <div
              onClick={() => onSelectRecent(item)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                userSelect: 'none',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {item.trainNumber}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                {item.trainName}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation()
                onRemoveRecent(item.trainNumber)
              }}
              aria-label={`Remove ${item.trainNumber}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-tertiary)',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-border)'
                e.currentTarget.style.color = 'var(--color-text-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = 'var(--color-text-tertiary)'
              }}
            >
              <CloseIcon size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
