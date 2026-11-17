import React from 'react'
import type { RunningStatus, StationInfo } from '../../types'
import { RouteIcon, SpeedIcon, ClockIcon, MapPinIcon } from '../common/Icons'
import { AnimatedCounter } from '../common/AnimatedCounter'

interface StatCardGridProps {
  runningStatus: RunningStatus
  destination: StationInfo
}

export const StatCardGrid: React.FC<StatCardGridProps> = ({ runningStatus, destination }) => {
  const remainingKm = Math.max(0, runningStatus.totalDistanceKm - runningStatus.distanceCoveredKm)

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px',
      }}
    >
      {/* Distance Covered */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-accent)' }}>
          <RouteIcon size={16} />
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Covered
          </span>
        </div>
        <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.5px' }}>
          <AnimatedCounter value={runningStatus.distanceCoveredKm} />
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-secondary)', marginLeft: '4px' }}>km</span>
        </div>
      </div>

      {/* Distance Remaining */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-secondary)' }}>
          <MapPinIcon size={16} />
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Remaining
          </span>
        </div>
        <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.5px' }}>
          <AnimatedCounter value={remainingKm} />
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-secondary)', marginLeft: '4px' }}>km</span>
        </div>
      </div>

      {/* Speed */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981' }}>
          <SpeedIcon size={16} />
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Current Speed
          </span>
        </div>
        <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.5px' }}>
          <AnimatedCounter value={runningStatus.speedKmh} />
          <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-text-secondary)', marginLeft: '4px' }}>km/h</span>
        </div>
      </div>

      {/* Arrival ETA */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b' }}>
          <ClockIcon size={16} />
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Dest. ETA
          </span>
        </div>
        <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.3px' }}>
          {destination.scheduledTime || '08:32 AM'}
        </div>
      </div>
    </div>
  )
}
