import React from 'react'
import type { RunningStatus, StationInfo } from '../../types'

interface JourneyProgressBarProps {
  source: StationInfo
  destination: StationInfo
  runningStatus: RunningStatus
}

export const JourneyProgressBar: React.FC<JourneyProgressBarProps> = ({
  source,
  destination,
  runningStatus,
}) => {
  const percentage = Math.min(
    100,
    Math.max(0, Math.round((runningStatus.distanceCoveredKm / runningStatus.totalDistanceKm) * 100))
  )

  const distanceRemaining = Math.max(0, runningStatus.totalDistanceKm - runningStatus.distanceCoveredKm)

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '13px',
          fontWeight: 600,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: 'var(--color-text-primary)' }}>{source.name}</span>
          <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontWeight: 500 }}>0 km</span>
        </div>

        <div style={{ textAlign: 'center' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--color-accent)',
              backgroundColor: 'var(--color-accent-soft)',
              padding: '2px 8px',
              borderRadius: '999px',
            }}
          >
            {percentage}% Complete
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span style={{ color: 'var(--color-text-primary)' }}>{destination.name}</span>
          <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', fontWeight: 500 }}>
            {runningStatus.totalDistanceKm.toLocaleString()} km
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div
        style={{
          position: 'relative',
          height: '8px',
          borderRadius: '999px',
          backgroundColor: 'var(--color-surface)',
          overflow: 'visible',
          marginTop: '6px',
        }}
      >
        {/* Filled Portion */}
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            borderRadius: '999px',
            background: 'linear-gradient(90deg, #0071E3, #34AADC)',
            transition: 'width 0.8s var(--ease-spring)',
          }}
        />

        {/* Current Position Marker with Pulse */}
        <div
          style={{
            position: 'absolute',
            left: `${percentage}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        >
          <div
            className="radar-pulse"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 113, 227, 0.4)',
            }}
          />
          <div
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-accent)',
              border: '3px solid #FFFFFF',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }}
          />
        </div>
      </div>

      {/* Progress Subtitle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: 'var(--color-text-secondary)',
          marginTop: '2px',
        }}
      >
        <span>
          <strong style={{ color: 'var(--color-text-primary)' }}>{runningStatus.distanceCoveredKm.toLocaleString()} km</strong> covered
        </span>
        <span>
          <strong style={{ color: 'var(--color-text-primary)' }}>{distanceRemaining.toLocaleString()} km</strong> remaining
        </span>
      </div>
    </div>
  )
}
