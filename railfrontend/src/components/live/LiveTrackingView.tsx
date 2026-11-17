import React, { useState, useEffect, useCallback } from 'react'
import type { LiveStatusResponse } from '../../types'
import { trainApi, storage } from '../../services/api'
import { interpolateLiveStatusFromTime } from '../../utils/telemetryEngine'
import { TrainHeaderCard } from './TrainHeaderCard'
import { TrainMap } from './TrainMap'
import { JourneyProgressBar } from './JourneyProgressBar'
import { StatCardGrid } from './StatCardGrid'
import { CurrentNextStation } from './CurrentNextStation'
import { StationTimeline } from './StationTimeline'
import { ShareModal } from './ShareModal'
import { Skeleton } from '../common/Skeleton'

interface LiveTrackingViewProps {
  trainNumber: string
  onFavouritesChanged?: () => void
}

export const LiveTrackingView: React.FC<LiveTrackingViewProps> = ({
  trainNumber,
  onFavouritesChanged,
}) => {
  // Load any existing cached snapshot immediately for zero-delay offline rendering
  const [baseSnapshot, setBaseSnapshot] = useState<LiveStatusResponse | null>(() => {
    const cached = storage.getOfflineSnapshot(trainNumber)
    return cached ? cached.data : null
  })

  const [liveData, setLiveData] = useState<LiveStatusResponse | null>(() => {
    const cached = storage.getOfflineSnapshot(trainNumber)
    return cached ? interpolateLiveStatusFromTime(cached.data, new Date()) : null
  })

  const [isLoading, setIsLoading] = useState(() => !baseSnapshot)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isFavourite, setIsFavourite] = useState(() => storage.isFavourite(trainNumber))
  const [isOfflineSaved, setIsOfflineSaved] = useState(() => storage.isOfflineSaved(trainNumber))
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [lastSyncedAt, setLastSyncedAt] = useState<number>(() => {
    const cached = storage.getOfflineSnapshot(trainNumber)
    return cached ? cached.lastSyncedAt : Date.now()
  })
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date())

  const fetchLiveStatus = useCallback(
    async (isManual = false) => {
      if (isManual) {
        setIsRefreshing(true)
      }
      try {
        const data = await trainApi.getLiveStatus(trainNumber)
        setBaseSnapshot(data)
        setLiveData(interpolateLiveStatusFromTime(data, new Date()))
        setLastSyncedAt(Date.now())
        setIsFavourite(storage.isFavourite(trainNumber))
        setIsOfflineSaved(storage.isOfflineSaved(trainNumber))

        // Save to recents
        storage.addRecent({
          trainNumber: data.trainNumber,
          trainName: data.trainName,
          source: data.source.name,
          destination: data.destination.name,
        })
      } catch {
        // Fall back gracefully to cached data if already loaded
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    },
    [trainNumber]
  )

  // Initial fetch on mount (single network call, no 30s auto-polling)
  useEffect(() => {
    let cancelled = false
    queueMicrotask(() => {
      if (!cancelled) {
        void fetchLiveStatus(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [fetchLiveStatus])

  // Real-time local clock telemetry:
  // Every 1 second, re-interpolate train location & station times using device clock.
  // 0 API calls are consumed!
  useEffect(() => {
    if (!baseSnapshot) return

    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)
      setLiveData(interpolateLiveStatusFromTime(baseSnapshot, now))
    }, 1000)

    return () => clearInterval(timer)
  }, [baseSnapshot])

  const handleToggleFavourite = () => {
    if (!liveData) return
    const newState = storage.toggleFavourite({
      trainNumber: liveData.trainNumber,
      trainName: liveData.trainName,
      source: liveData.source.name,
      destination: liveData.destination.name,
    })
    setIsFavourite(newState)
    onFavouritesChanged?.()
  }

  const handleToggleOffline = () => {
    if (!baseSnapshot) return
    const newState = storage.toggleOffline(baseSnapshot)
    setIsOfflineSaved(newState)
    onFavouritesChanged?.()
  }

  // Format the last sync time
  const formatLastSync = (): string => {
    if (!lastSyncedAt) {
      return liveData?.lastUpdatedAt || 'Just now'
    }
    const diffSec = Math.floor((currentTime.getTime() - lastSyncedAt) / 1000)
    if (diffSec < 60) return 'Just now'
    const diffMin = Math.floor(diffSec / 60)
    if (diffMin < 60) return `${diffMin}m ago`
    const d = new Date(lastSyncedAt)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (isLoading || !liveData) {
    return (
      <div
        style={{
          width: '100%',
          maxWidth: '1040px',
          margin: '28px auto',
          padding: '0 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          animation: 'fadeSlideUp 0.3s ease',
        }}
      >
        <Skeleton height="140px" borderRadius="var(--radius-xl)" />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)',
            gap: '20px',
          }}
        >
          <Skeleton height="420px" borderRadius="var(--radius-xl)" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Skeleton height="90px" borderRadius="var(--radius-xl)" />
            <Skeleton height="110px" borderRadius="var(--radius-xl)" />
            <Skeleton height="180px" borderRadius="var(--radius-xl)" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1080px',
        margin: '24px auto',
        padding: '0 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        animation: 'fadeSlideUp 0.3s var(--ease-spring)',
      }}
    >
      {/* Train Header Info & Actions */}
      <TrainHeaderCard
        liveData={liveData}
        isFavourite={isFavourite}
        onToggleFavourite={handleToggleFavourite}
        onRefresh={() => fetchLiveStatus(true)}
        isRefreshing={isRefreshing}
        isOfflineSaved={isOfflineSaved}
        onToggleOffline={handleToggleOffline}
        lastSyncedText={formatLastSync()}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* Main Grid: Map on left, Live Stats on right */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '20px',
          alignItems: 'start',
        }}
      >
        {/* Left column: Interactive Map + Station Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <TrainMap
            currentPosition={liveData.currentPosition}
            stations={liveData.stations}
            sourceCode={liveData.source.code}
            destinationCode={liveData.destination.code}
          />

          <StationTimeline
            stations={liveData.stations}
            currentStationCode={liveData.currentStation.code}
          />
        </div>

        {/* Right column: Journey Progress Bar, 4-Card Stats, Current & Next Station */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <JourneyProgressBar
            source={liveData.source}
            destination={liveData.destination}
            runningStatus={liveData.runningStatus}
          />

          <StatCardGrid
            runningStatus={liveData.runningStatus}
            destination={liveData.destination}
          />

          <CurrentNextStation
            currentStation={liveData.currentStation}
            nextStation={liveData.nextStation}
          />
        </div>
      </div>

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        liveData={liveData}
      />
    </div>
  )
}
