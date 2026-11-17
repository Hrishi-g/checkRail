import React from 'react'
import type { RunningStatusType } from '../../types'

interface BadgeProps {
  status: RunningStatusType
  delayMinutes?: number
  className?: string
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, delayMinutes = 0, className = '' }) => {
  if (status === 'ON_TIME' || (status === 'DELAYED' && delayMinutes === 0)) {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '999px',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.4px',
          textTransform: 'uppercase',
          backgroundColor: 'var(--color-success-soft)',
          color: '#15803d',
          border: '1px solid rgba(52, 199, 89, 0.35)',
        }}
        className={className}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-success)',
          }}
        />
        ON TIME
      </span>
    )
  }

  if (status === 'DELAYED') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '999px',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.4px',
          textTransform: 'uppercase',
          backgroundColor: 'var(--color-warning-soft)',
          color: '#b45309',
          border: '1px solid rgba(255, 159, 10, 0.4)',
        }}
        className={className}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-warning)',
          }}
        />
        DELAYED {delayMinutes > 0 ? `• ${delayMinutes} MIN` : ''}
      </span>
    )
  }

  if (status === 'CANCELLED') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '999px',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.4px',
          textTransform: 'uppercase',
          backgroundColor: 'var(--color-danger-soft)',
          color: '#b91c1c',
          border: '1px solid rgba(255, 59, 48, 0.35)',
        }}
        className={className}
      >
        CANCELLED
      </span>
    )
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 12px',
        borderRadius: '999px',
        fontSize: '12px',
        fontWeight: 600,
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-text-secondary)',
        border: '1px solid var(--color-border)',
      }}
      className={className}
    >
      {status.replace('_', ' ')}
    </span>
  )
}
