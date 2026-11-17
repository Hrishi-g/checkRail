import React from 'react'
import type { StationStatus } from '../../types'
import { ClockIcon, MapPinIcon } from '../common/Icons'

interface CurrentNextStationProps {
  currentStation: StationStatus
  nextStation: StationStatus
}

export const CurrentNextStation: React.FC<CurrentNextStationProps> = ({
  currentStation,
  nextStation,
}) => {
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
        gap: '16px',
      }}
    >
      {/* Current Station */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '2px',
          }}
        >
          <MapPinIcon size={16} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Currently At / Last Passed
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)', marginTop: '2px' }}>
            {currentStation.name}{' '}
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              ({currentStation.code})
            </span>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Departed at{' '}
            <strong style={{ color: 'var(--color-text-primary)' }}>
              {currentStation.actualDeparture || currentStation.scheduledDeparture || 'N/A'}
            </strong>{' '}
            • Platform {currentStation.platformNumber || '1'}
          </div>
        </div>
      </div>

      <div style={{ height: '1px', backgroundColor: 'var(--color-surface)' }} />

      {/* Next Station with ETA countdown */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-accent-soft)',
            color: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '2px',
          }}
        >
          <ClockIcon size={16} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Next Station
            </span>
            {nextStation.minutesAway != null && (
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: 'var(--color-accent-soft)',
                  color: 'var(--color-accent)',
                  padding: '2px 8px',
                  borderRadius: '999px',
                }}
              >
                ETA in {nextStation.minutesAway} min
              </span>
            )}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)', marginTop: '2px' }}>
            {nextStation.name}{' '}
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              ({nextStation.code})
            </span>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
            Arriving approx{' '}
            <strong style={{ color: 'var(--color-text-primary)' }}>
              {nextStation.actualArrival || nextStation.scheduledArrival || 'N/A'}
            </strong>{' '}
            • Platform {nextStation.platformNumber || '1'}
          </div>
        </div>
      </div>
    </div>
  )
}
