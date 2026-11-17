import React from 'react'
import type { StationStatus } from '../../types'
import { TrainIcon } from '../common/Icons'

interface StationTimelineProps {
  stations: StationStatus[]
  currentStationCode: string
}

export const StationTimeline: React.FC<StationTimelineProps> = ({
  stations,
  currentStationCode,
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
          Route & Timetable ({stations.length} Stops)
        </h2>
        <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>
          Times in IST (24h)
        </span>
      </div>

      <div
        style={{
          maxHeight: '440px',
          overflowY: 'auto',
          paddingRight: '6px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {stations.map((station, idx) => {
          const isCurrent = station.code === currentStationCode
          const isDeparted = station.status === 'DEPARTED'
          const isLast = idx === stations.length - 1

          return (
            <div
              key={station.code}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                paddingBottom: isLast ? '0' : '20px',
              }}
            >
              {/* Connecting Vertical Line */}
              {!isLast && (
                <div
                  style={{
                    position: 'absolute',
                    left: '11px',
                    top: '20px',
                    bottom: 0,
                    width: '2px',
                    backgroundColor: isDeparted ? 'var(--color-border-strong)' : 'var(--color-border)',
                    zIndex: 0,
                  }}
                />
              )}

              {/* Status Circle Node */}
              <div
                style={{
                  position: 'relative',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                  flexShrink: 0,
                }}
              >
                {isCurrent ? (
                  <div
                    className="radar-pulse"
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      boxShadow: '0 2px 6px rgba(0, 113, 227, 0.4)',
                    }}
                  >
                    <TrainIcon size={11} />
                  </div>
                ) : isDeparted ? (
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: '#8E8E93',
                      border: '2px solid #FFFFFF',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      border: '2.5px solid var(--color-border-strong)',
                    }}
                  />
                )}
              </div>

              {/* Station Details */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: isCurrent ? 700 : isDeparted ? 500 : 600,
                        color: isCurrent
                          ? 'var(--color-accent)'
                          : isDeparted
                          ? 'var(--color-text-secondary)'
                          : 'var(--color-text-primary)',
                      }}
                    >
                      {station.name}
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--color-text-tertiary)',
                        backgroundColor: 'var(--color-surface)',
                        padding: '1px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      {station.code}
                    </span>
                    {isCurrent && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          backgroundColor: 'var(--color-accent-soft)',
                          color: 'var(--color-accent)',
                          padding: '1px 6px',
                          borderRadius: '999px',
                        }}
                      >
                        HERE NOW
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--color-text-tertiary)',
                      marginTop: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>Platform {station.platformNumber || '1'}</span>
                    <span>•</span>
                    <span>{station.distanceFromSourceKm} km</span>
                    {station.haltMinutes > 0 && (
                      <>
                        <span>•</span>
                        <span>{station.haltMinutes}m halt</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Timing column */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: isCurrent ? 'var(--color-accent)' : 'var(--color-text-primary)',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {station.actualDeparture || station.actualArrival || station.scheduledDeparture || station.scheduledArrival || '—'}
                  </div>
                  {(station.scheduledDeparture || station.scheduledArrival) && (
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-tertiary)',
                        fontVariantNumeric: 'tabular-nums',
                        marginTop: '1px',
                      }}
                    >
                      Sched: {station.scheduledDeparture || station.scheduledArrival}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
