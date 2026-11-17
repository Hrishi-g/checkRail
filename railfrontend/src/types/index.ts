export interface GeoCoordinate {
  lat: number
  lng: number
}

export type RunningStatusType =
  | 'ON_TIME'
  | 'DELAYED'
  | 'EARLY'
  | 'CANCELLED'
  | 'NOT_STARTED'
  | 'COMPLETED'

export type StopStatus = 'DEPARTED' | 'AT_STATION' | 'UPCOMING' | 'SKIPPED'

export interface StationInfo {
  name: string
  code: string
  scheduledTime?: string
  coordinates?: GeoCoordinate
}

export interface RunningStatus {
  status: RunningStatusType
  delayMinutes: number
  speedKmh: number
  distanceCoveredKm: number
  totalDistanceKm: number
}

export interface StationStatus {
  sequenceNumber: number
  name: string
  code: string
  scheduledArrival: string | null
  scheduledDeparture: string | null
  actualArrival: string | null
  actualDeparture: string | null
  platformNumber: string
  haltMinutes: number
  distanceFromSourceKm: number
  status: StopStatus
  coordinates: GeoCoordinate
  minutesAway?: number | null
}

export interface CurrentPosition {
  lat: number
  lng: number
  nearestStation: string
  nearestStationCode: string
}

export interface LiveStatusResponse {
  trainNumber: string
  trainName: string
  source: StationInfo
  destination: StationInfo
  currentPosition: CurrentPosition
  runningStatus: RunningStatus
  currentStation: StationStatus
  nextStation: StationStatus
  stations: StationStatus[]
  lastUpdatedAt: string
  journeyDate: string
}

export interface TrainSummary {
  trainNumber: string
  trainName: string
  source: string
  sourceCode: string
  destination: string
  destinationCode: string
  runsDays: string[]
}

export interface TrainSearchResponse {
  results: TrainSummary[]
  total: number
}

export interface RecentSearch {
  trainNumber: string
  trainName: string
  source: string
  destination: string
  timestamp: number
}

export interface FavouriteTrain {
  trainNumber: string
  trainName: string
  source: string
  destination: string
  addedAt: number
  isOfflineAvailable?: boolean
  lastSyncedAt?: string
}

export interface OfflineTrainSnapshot {
  trainNumber: string
  trainName: string
  data: LiveStatusResponse
  savedAt: number
  lastSyncedAt: number
  isOfflineExplicit: boolean
}
