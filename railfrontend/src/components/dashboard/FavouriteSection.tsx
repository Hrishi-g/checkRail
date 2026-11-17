import React, { useState, useEffect } from 'react'
import type { FavouriteTrain, RunningStatusType } from '../../types'
import { StarIcon, TrainIcon, ChevronRightIcon, BoltIcon } from '../common/Icons'
import { StatusBadge } from '../common/Badge'
import { storage } from '../../services/api'
import { interpolateLiveStatusFromTime } from '../../utils/telemetryEngine'

interface FavouriteSectionProps {
  favourites: FavouriteTrain[]
  onSelectTrain: (trainNumber: string) => void
  onRemoveFavourite: (trainNumber: string) => void
}

interface StatusMap {
  [trainNumber: string]: {
    status: RunningStatusType
    delayMinutes: number
    isOffline: boolean
  }
}

export const FavouriteSection: React.FC<FavouriteSectionProps> = ({
  favourites,
  onSelectTrain,
  onRemoveFavourite,
}) => {
  const [statuses, setStatuses] = useState<StatusMap>({})

  // Compute status locally from offline snapshot using current time (0 API calls!)
  useEffect(() => {
    const computeLocalStatuses = () => {
      const newStatuses: StatusMap = {}
      const now = new Date()

      for (const fav of favourites) {
        const cached = storage.getOfflineSnapshot(fav.trainNumber)
        const isOffline = storage.isOfflineSaved(fav.trainNumber)

        if (cached && cached.data) {
          try {
            const interpolated = interpolateLiveStatusFromTime(cached.data, now)
            newStatuses[fav.trainNumber] = {
              status: interpolated.runningStatus.status,
              delayMinutes: interpolated.runningStatus.delayMinutes,
              isOffline,
            }
          } catch {
            newStatuses[fav.trainNumber] = {
              status: cached.data.runningStatus?.status || 'ON_TIME',
              delayMinutes: cached.data.runningStatus?.delayMinutes || 0,
              isOffline,
            }
          }
        } else {
          newStatuses[fav.trainNumber] = {
            status: 'ON_TIME',
            delayMinutes: 0,
            isOffline,
          }
        }
      }
      setStatuses(newStatuses)
    }

    computeLocalStatuses()
    // Re-check periodically every 15s without any network request
    const interval = setInterval(computeLocalStatuses, 15000)
    return () => clearInterval(interval)
  }, [favourites])

  if (favourites.length === 0) return null

  return (
    <div style={{ marginTop: '36px', width: '100%', maxWidth: '680px', marginInline: 'auto' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '16px',
          padding: '0 4px',
        }}
      >
        <StarIcon size={16} filled={true} />
        <span
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--color-text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.4px',
          }}
        >
          Favourite Trains ({favourites.length})
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '12px',
        }}
      >
        {favourites.map((fav) => {
          const liveInfo = statuses[fav.trainNumber]
          const isOfflineAvailable = liveInfo?.isOffline || fav.isOfflineAvailable || storage.isOfflineSaved(fav.trainNumber)

          return (
            <div
              key={fav.trainNumber}
              onClick={() => onSelectTrain(fav.trainNumber)}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-base)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s var(--ease-spring)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                e.currentTarget.style.borderColor = 'var(--color-border-strong)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                e.currentTarget.style.borderColor = 'var(--color-border)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--color-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-accent)',
                    }}
                  >
                    <TrainIcon size={18} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {fav.trainName}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 600,
                          color: 'var(--color-accent)',
                          letterSpacing: '0.4px',
                        }}
                      >
                        #{fav.trainNumber}
                      </span>
                      {isOfflineAvailable && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#059669',
                            backgroundColor: '#D1FAE5',
                            padding: '1px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          <BoltIcon size={10} />
                          Offline Ready
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveFavourite(fav.trainNumber)
                  }}
                  title="Remove from favourites"
                  style={{
                    padding: '4px',
                    color: '#FFB800',
                    display: 'flex',
                    borderRadius: '50%',
                    cursor: 'pointer',
                  }}
                >
                  <StarIcon size={18} filled={true} />
                </button>
              </div>

              <div
                style={{
                  fontSize: '13px',
                  color: 'var(--color-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{fav.source}</span>
                <span>→</span>
                <span>{fav.destination}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--color-surface)',
                }}
              >
                {liveInfo ? (
                  <StatusBadge status={liveInfo.status} delayMinutes={liveInfo.delayMinutes} />
                ) : (
                  <span style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}>Ready to track</span>
                )}

                <span style={{ color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '13px', fontWeight: 500 }}>
                  Track <ChevronRightIcon size={14} />
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
