import React from 'react'
import { TrainIcon, MapPinIcon, ClockIcon, ShareIcon } from '../common/Icons'

interface EmptyHeroProps {
  onSelectQuickTrain: (trainNumber: string) => void
}

const POPULAR_TRAINS = [
  { number: '12951', name: 'Rajdhani Express', route: 'MMCT → NDLS' },
  { number: '22436', name: 'Vande Bharat', route: 'NDLS → BSB' },
  { number: '12002', name: 'Shatabdi Express', route: 'NDLS → RKMP' },
  { number: '12627', name: 'Karnataka Express', route: 'SBC → NDLS' },
]

export const EmptyHero: React.FC<EmptyHeroProps> = ({ onSelectQuickTrain }) => {
  return (
    <div
      style={{
        marginTop: '44px',
        textAlign: 'center',
        padding: '0 16px',
        maxWidth: '680px',
        marginInline: 'auto',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '999px',
          backgroundColor: 'var(--color-accent-soft)',
          color: 'var(--color-accent)',
          fontSize: '13px',
          fontWeight: 600,
          marginBottom: '20px',
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-accent)',
          }}
        />
        Live GPS-Precision Railway Tracking
      </div>

      <h1
        style={{
          fontSize: '40px',
          fontWeight: 700,
          letterSpacing: '-1px',
          lineHeight: 1.15,
          color: 'var(--color-text-primary)',
          marginBottom: '14px',
        }}
      >
        Track any train, live.
      </h1>

      <p
        style={{
          fontSize: '17px',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.5,
          maxWidth: '520px',
          margin: '0 auto 36px',
        }}
      >
        Real-time coordinates on an interactive map, dynamic ETAs to upcoming stops, running delays, and one-tap journey sharing.
      </p>

      {/* Feature highlights */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '12px',
          marginBottom: '36px',
        }}
      >
        <div
          style={{
            padding: '14px',
            borderRadius: 'var(--radius-base)',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div style={{ color: 'var(--color-accent)' }}>
            <MapPinIcon size={20} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Live Map
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
            Real coordinates
          </span>
        </div>

        <div
          style={{
            padding: '14px',
            borderRadius: 'var(--radius-base)',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div style={{ color: 'var(--color-accent)' }}>
            <ClockIcon size={20} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Exact ETAs
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
            Station countdowns
          </span>
        </div>

        <div
          style={{
            padding: '14px',
            borderRadius: 'var(--radius-base)',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div style={{ color: 'var(--color-accent)' }}>
            <TrainIcon size={20} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Auto Refresh
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
            Every 30 seconds
          </span>
        </div>

        <div
          style={{
            padding: '14px',
            borderRadius: 'var(--radius-base)',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div style={{ color: 'var(--color-accent)' }}>
            <ShareIcon size={20} />
          </div>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Share Link
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
            WhatsApp & native
          </span>
        </div>
      </div>

      {/* Quick search suggestions */}
      <div>
        <div
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--color-text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '10px',
          }}
        >
          Popular Trains to Track
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          {POPULAR_TRAINS.map((item) => (
            <button
              key={item.number}
              onClick={() => onSelectQuickTrain(item.number)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 14px',
                borderRadius: '999px',
                backgroundColor: '#FFFFFF',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-xs)',
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--color-text-primary)',
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-accent)'
                e.currentTarget.style.color = 'var(--color-accent)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)'
                e.currentTarget.style.color = 'var(--color-text-primary)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <span style={{ fontWeight: 600 }}>{item.number}</span>
              <span>{item.name}</span>
              <span style={{ color: 'var(--color-text-tertiary)', fontSize: '12px' }}>{item.route}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
