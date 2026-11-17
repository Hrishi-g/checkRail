import React from 'react'
import type { LiveStatusResponse } from '../../types'
import { StatusBadge } from '../common/Badge'
import { StarIcon, RefreshIcon, ShareIcon, DownloadCloudIcon, CheckIcon, BoltIcon } from '../common/Icons'

interface TrainHeaderCardProps {
  liveData: LiveStatusResponse
  isFavourite: boolean
  onToggleFavourite: () => void
  onRefresh: () => void
  isRefreshing: boolean
  onOpenShareModal: () => void
  isOfflineSaved: boolean
  onToggleOffline: () => void
  lastSyncedText: string
}

export const TrainHeaderCard: React.FC<TrainHeaderCardProps> = ({
  liveData,
  isFavourite,
  onToggleFavourite,
  onRefresh,
  isRefreshing,
  onOpenShareModal,
  isOfflineSaved,
  onToggleOffline,
  lastSyncedText,
}) => {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: 'var(--color-accent)',
                backgroundColor: 'var(--color-accent-soft)',
                padding: '3px 10px',
                borderRadius: '6px',
                letterSpacing: '0.4px',
              }}
            >
              #{liveData.trainNumber}
            </span>
            <StatusBadge
              status={liveData.runningStatus.status}
              delayMinutes={liveData.runningStatus.delayMinutes}
            />
            {isOfflineSaved && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#059669',
                  backgroundColor: '#D1FAE5',
                  padding: '2px 8px',
                  borderRadius: '6px',
                }}
              >
                <BoltIcon size={12} />
                Offline Ready
              </span>
            )}
          </div>

          <h1
            style={{
              fontSize: '26px',
              fontWeight: 700,
              letterSpacing: '-0.5px',
              color: 'var(--color-text-primary)',
              margin: '0 0 4px',
            }}
          >
            {liveData.trainName}
          </h1>

          <div
            style={{
              fontSize: '15px',
              color: 'var(--color-text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ fontWeight: 600 }}>{liveData.source.name}</span>
            <span style={{ color: 'var(--color-text-tertiary)' }}>({liveData.source.code})</span>
            <span>→</span>
            <span style={{ fontWeight: 600 }}>{liveData.destination.name}</span>
            <span style={{ color: 'var(--color-text-tertiary)' }}>({liveData.destination.code})</span>
          </div>
        </div>

        {/* Action Buttons: Offline Toggle, Favourite, Share, Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Make Available Offline Toggle Button */}
          <button
            onClick={onToggleOffline}
            title={isOfflineSaved ? 'Remove from offline cache' : 'Save route snapshot for offline tracking'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '0 14px',
              height: '40px',
              borderRadius: '999px',
              backgroundColor: isOfflineSaved ? '#ECFDF5' : 'var(--color-surface)',
              border: isOfflineSaved ? '1px solid #A7F3D0' : '1px solid var(--color-border)',
              color: isOfflineSaved ? '#065F46' : 'var(--color-text-primary)',
              fontSize: '13px',
              fontWeight: 600,
              transition: 'all 0.18s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = isOfflineSaved ? '#D1FAE5' : 'var(--color-surface-hover)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isOfflineSaved ? '#ECFDF5' : 'var(--color-surface)'
            }}
          >
            {isOfflineSaved ? (
              <>
                <CheckIcon size={16} />
                <span>Saved Offline</span>
              </>
            ) : (
              <>
                <DownloadCloudIcon size={16} />
                <span>Save Offline</span>
              </>
            )}
          </button>

          <button
            onClick={onToggleFavourite}
            title={isFavourite ? 'Remove from favourites' : 'Save to favourites'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: isFavourite ? '#FFB800' : 'var(--color-text-secondary)',
              transition: 'all 0.18s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface)')}
          >
            <StarIcon size={19} filled={isFavourite} className={isFavourite ? 'star-pop' : ''} />
          </button>

          <button
            onClick={onOpenShareModal}
            title="Share live journey link"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '0 14px',
              height: '40px',
              borderRadius: '999px',
              backgroundColor: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
              fontSize: '13px',
              fontWeight: 500,
              transition: 'all 0.18s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface)')}
          >
            <ShareIcon size={17} />
            <span>Share</span>
          </button>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Fetch latest live status from API and update offline snapshot"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '0 16px',
              height: '40px',
              borderRadius: '999px',
              backgroundColor: 'var(--color-accent)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(0, 113, 227, 0.3)',
              opacity: isRefreshing ? 0.8 : 1,
              transition: 'all 0.18s ease',
              cursor: isRefreshing ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!isRefreshing) e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-accent)'
            }}
          >
            <div className={isRefreshing ? 'animate-spin' : ''} style={{ display: 'flex' }}>
              <RefreshIcon size={16} />
            </div>
            <span>{isRefreshing ? 'Updating...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Telemetry Status Bar: No Polling / Client Time-Interpolation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          fontSize: '12px',
          color: 'var(--color-text-tertiary)',
          paddingTop: '10px',
          borderTop: '1px solid var(--color-surface)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.25)',
              display: 'inline-block',
            }}
          />
          <span style={{ fontWeight: 500, color: 'var(--color-text-secondary)' }}>
            Real-time Clock Telemetry Active (0 API calls consumed)
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>Last Synced:</span>
          <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{lastSyncedText}</span>
        </div>
      </div>
    </div>
  )
}

