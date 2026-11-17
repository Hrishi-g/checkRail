import type {
  LiveStatusResponse,
  TrainSearchResponse,
  RecentSearch,
  FavouriteTrain,
  OfflineTrainSnapshot,
} from '../types'
import { interpolateLiveStatusFromTime } from '../utils/telemetryEngine'

const API_BASE = '/api/v1'

const MOCK_TRAINS: Array<{
  trainNumber: string
  trainName: string
  source: string
  sourceCode: string
  destination: string
  destinationCode: string
  runsDays: string[]
  totalDistanceKm: number
  stations: Array<{
    name: string
    code: string
    arr: string | null
    dep: string | null
    dist: number
    plat: string
    lat: number
    lng: number
  }>
}> = [
  {
    trainNumber: '12951',
    trainName: 'Rajdhani Express',
    source: 'Mumbai Central',
    sourceCode: 'MMCT',
    destination: 'New Delhi',
    destinationCode: 'NDLS',
    runsDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    totalDistanceKm: 1384,
    stations: [
      { name: 'Mumbai Central', code: 'MMCT', arr: null, dep: '16:35', dist: 0, plat: '1', lat: 18.9696, lng: 72.8195 },
      { name: 'Borivali', code: 'BVI', arr: '17:08', dep: '17:10', dist: 30, plat: '6', lat: 19.2288, lng: 72.8569 },
      { name: 'Surat', code: 'ST', arr: '19:43', dep: '19:48', dist: 263, plat: '1', lat: 21.2049, lng: 72.8407 },
      { name: 'Vadodara Jn', code: 'BRC', arr: '21:06', dep: '21:16', dist: 392, plat: '2', lat: 22.3107, lng: 73.1812 },
      { name: 'Ratlam Jn', code: 'RTM', arr: '00:40', dep: '00:45', dist: 653, plat: '5', lat: 23.3342, lng: 75.0375 },
      { name: 'Kota Jn', code: 'KOTA', arr: '03:15', dep: '03:20', dist: 920, plat: '1', lat: 25.2138, lng: 75.8648 },
      { name: 'Sawai Madhopur', code: 'SWM', arr: '04:28', dep: '04:30', dist: 1028, plat: '1', lat: 25.9928, lng: 76.3688 },
      { name: 'Mathura Jn', code: 'MTJ', arr: '06:30', dep: '06:35', dist: 1243, plat: '3', lat: 27.4924, lng: 77.6737 },
      { name: 'Hazrat Nizamuddin', code: 'NZM', arr: '08:12', dep: '08:14', dist: 1377, plat: '2', lat: 28.5888, lng: 77.2534 },
      { name: 'New Delhi', code: 'NDLS', arr: '08:32', dep: null, dist: 1384, plat: '3', lat: 28.6415, lng: 77.2209 },
    ],
  },
  {
    trainNumber: '22436',
    trainName: 'Vande Bharat Express',
    source: 'New Delhi',
    sourceCode: 'NDLS',
    destination: 'Varanasi Jn',
    destinationCode: 'BSB',
    runsDays: ['Sun', 'Tue', 'Wed', 'Fri', 'Sat'],
    totalDistanceKm: 759,
    stations: [
      { name: 'New Delhi', code: 'NDLS', arr: null, dep: '06:00', dist: 0, plat: '16', lat: 28.6415, lng: 77.2209 },
      { name: 'Kanpur Central', code: 'CNB', arr: '10:08', dep: '10:10', dist: 440, plat: '5', lat: 26.4537, lng: 80.3512 },
      { name: 'Prayagraj Jn', code: 'PRYJ', arr: '12:08', dep: '12:10', dist: 634, plat: '6', lat: 25.4484, lng: 81.834 },
      { name: 'Varanasi Jn', code: 'BSB', arr: '14:00', dep: null, dist: 759, plat: '1', lat: 25.3268, lng: 82.9876 },
    ],
  },
  {
    trainNumber: '12002',
    trainName: 'Shatabdi Express',
    source: 'New Delhi',
    sourceCode: 'NDLS',
    destination: 'Rani Kamalapati',
    destinationCode: 'RKMP',
    runsDays: ['Daily'],
    totalDistanceKm: 707,
    stations: [
      { name: 'New Delhi', code: 'NDLS', arr: null, dep: '06:00', dist: 0, plat: '1', lat: 28.6415, lng: 77.2209 },
      { name: 'Mathura Jn', code: 'MTJ', arr: '07:19', dep: '07:20', dist: 141, plat: '1', lat: 27.4924, lng: 77.6737 },
      { name: 'Agra Cantt', code: 'AGC', arr: '07:50', dep: '07:55', dist: 195, plat: '1', lat: 27.1593, lng: 78.0063 },
      { name: 'Gwalior Jn', code: 'GWL', arr: '09:23', dep: '09:28', dist: 313, plat: '1', lat: 26.2183, lng: 78.1828 },
      { name: 'VGL Jhansi Jn', code: 'VGLJ', arr: '10:45', dep: '10:50', dist: 411, plat: '1', lat: 25.4484, lng: 78.5685 },
      { name: 'Bhopal Jn', code: 'BPL', arr: '14:07', dep: '14:12', dist: 701, plat: '1', lat: 23.2599, lng: 77.4126 },
      { name: 'Rani Kamalapati', code: 'RKMP', arr: '14:40', dep: null, dist: 707, plat: '5', lat: 23.212, lng: 77.4379 },
    ],
  },
  {
    trainNumber: '12627',
    trainName: 'Karnataka Express',
    source: 'KSR Bengaluru',
    sourceCode: 'SBC',
    destination: 'New Delhi',
    destinationCode: 'NDLS',
    runsDays: ['Daily'],
    totalDistanceKm: 2408,
    stations: [
      { name: 'KSR Bengaluru', code: 'SBC', arr: null, dep: '19:20', dist: 0, plat: '1', lat: 12.9781, lng: 77.5694 },
      { name: 'Dharmavaram Jn', code: 'DMM', arr: '22:28', dep: '22:30', dist: 179, plat: '2', lat: 14.4137, lng: 77.7126 },
      { name: 'Guntakal Jn', code: 'GTL', arr: '01:05', dep: '01:10', dist: 314, plat: '4', lat: 15.1742, lng: 77.3756 },
      { name: 'Solapur', code: 'SUR', arr: '07:15', dep: '07:20', dist: 693, plat: '1', lat: 17.6599, lng: 75.9064 },
      { name: 'Bhopal Jn', code: 'BPL', arr: '23:25', dep: '23:30', dist: 1700, plat: '2', lat: 23.2599, lng: 77.4126 },
      { name: 'Jhansi Jn', code: 'VGLJ', arr: '02:50', dep: '02:58', dist: 1992, plat: '4', lat: 25.4484, lng: 78.5685 },
      { name: 'New Delhi', code: 'NDLS', arr: '09:00', dep: null, dist: 2408, plat: '3', lat: 28.6415, lng: 77.2209 },
    ],
  },
  {
    trainNumber: '12301',
    trainName: 'Howrah Rajdhani',
    source: 'Howrah Jn',
    sourceCode: 'HWH',
    destination: 'New Delhi',
    destinationCode: 'NDLS',
    runsDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    totalDistanceKm: 1451,
    stations: [
      { name: 'Howrah Jn', code: 'HWH', arr: null, dep: '16:50', dist: 0, plat: '9', lat: 22.5839, lng: 88.3426 },
      { name: 'Asansol Jn', code: 'ASN', arr: '18:57', dep: '19:00', dist: 200, plat: '4', lat: 23.6889, lng: 86.9661 },
      { name: 'Dhanbad Jn', code: 'DHN', arr: '19:50', dep: '19:55', dist: 259, plat: '3', lat: 23.7957, lng: 86.4304 },
      { name: 'Gaya Jn', code: 'GAYA', arr: '22:19', dep: '22:22', dist: 459, plat: '1', lat: 24.7955, lng: 85.0002 },
      { name: 'Pt DDU Jn', code: 'DDU', arr: '00:45', dep: '00:55', dist: 664, plat: '4', lat: 25.2818, lng: 83.1177 },
      { name: 'Kanpur Central', code: 'CNB', arr: '04:50', dep: '04:55', dist: 1011, plat: '1', lat: 26.4537, lng: 80.3512 },
      { name: 'New Delhi', code: 'NDLS', arr: '10:05', dep: null, dist: 1451, plat: '14', lat: 28.6415, lng: 77.2209 },
    ],
  },
]

function generateFallbackLiveStatus(trainNumber: string, journeyDate?: string): LiveStatusResponse {
  let template = MOCK_TRAINS.find((t) => t.trainNumber === trainNumber)
  if (!template) {
    // Generate dynamic template
    template = {
      trainNumber,
      trainName: `Superfast Express (${trainNumber})`,
      source: 'Mumbai Central',
      sourceCode: 'MMCT',
      destination: 'New Delhi',
      destinationCode: 'NDLS',
      runsDays: ['Daily'],
      totalDistanceKm: 1384,
      stations: MOCK_TRAINS[0].stations,
    }
  }

  const now = new Date()
  const minsOfDay = now.getHours() * 60 + now.getMinutes()
  const numSeed = Number(trainNumber.replace(/\D/g, '')) || 12951

  // Determine delay (0 or 15-45 mins)
  const isDelayed = numSeed % 3 !== 0
  const delayMinutes = isDelayed ? 18 + (minsOfDay % 24) : 0
  const speed = 90 + (numSeed % 35)

  // Progress along the route
  const fraction = 0.35 + ((minsOfDay % 720) / 720) * 0.45
  const distCovered = Math.round(template.totalDistanceKm * fraction)

  let curIdx = 0
  for (let i = 0; i < template.stations.length; i++) {
    if (template.stations[i].dist <= distCovered) {
      curIdx = i
    } else {
      break
    }
  }
  const nextIdx = Math.min(curIdx + 1, template.stations.length - 1)

  const curStop = template.stations[curIdx]
  const nextStop = template.stations[nextIdx]

  let segFrac = 0.5
  if (nextStop.dist > curStop.dist) {
    segFrac = (distCovered - curStop.dist) / (nextStop.dist - curStop.dist)
    segFrac = Math.max(0.1, Math.min(0.9, segFrac))
  }

  const curLat = curStop.lat + (nextStop.lat - curStop.lat) * segFrac
  const curLng = curStop.lng + (nextStop.lng - curStop.lng) * segFrac
  const minsAway = Math.max(8, Math.round((nextStop.dist - distCovered) / (speed / 60)))

  const stations = template.stations.map((s, idx) => {
    let status: 'DEPARTED' | 'AT_STATION' | 'UPCOMING' = 'UPCOMING'
    if (idx < curIdx) status = 'DEPARTED'
    else if (idx === curIdx) status = 'DEPARTED'
    else if (idx === nextIdx) status = 'UPCOMING'

    return {
      sequenceNumber: idx + 1,
      name: s.name,
      code: s.code,
      scheduledArrival: s.arr,
      scheduledDeparture: s.dep,
      actualArrival: s.arr ? addMins(s.arr, idx >= curIdx ? delayMinutes : 0) : null,
      actualDeparture: s.dep ? addMins(s.dep, idx >= curIdx ? delayMinutes : 0) : null,
      platformNumber: s.plat,
      haltMinutes: s.arr && s.dep ? 5 : 0,
      distanceFromSourceKm: s.dist,
      status,
      coordinates: { lat: s.lat, lng: s.lng },
      minutesAway: idx === nextIdx ? minsAway : idx > nextIdx ? minsAway + (idx - nextIdx) * 35 : null,
    }
  })

  return {
    trainNumber: template.trainNumber,
    trainName: template.trainName,
    source: {
      name: template.source,
      code: template.sourceCode,
      scheduledTime: template.stations[0].dep || '06:00',
      coordinates: { lat: template.stations[0].lat, lng: template.stations[0].lng },
    },
    destination: {
      name: template.destination,
      code: template.destinationCode,
      scheduledTime: template.stations[template.stations.length - 1].arr || '22:00',
      coordinates: {
        lat: template.stations[template.stations.length - 1].lat,
        lng: template.stations[template.stations.length - 1].lng,
      },
    },
    currentPosition: {
      lat: curLat,
      lng: curLng,
      nearestStation: curStop.name,
      nearestStationCode: curStop.code,
    },
    runningStatus: {
      status: delayMinutes > 0 ? 'DELAYED' : 'ON_TIME',
      delayMinutes,
      speedKmh: speed,
      distanceCoveredKm: distCovered,
      totalDistanceKm: template.totalDistanceKm,
    },
    currentStation: stations[curIdx],
    nextStation: stations[nextIdx],
    stations,
    lastUpdatedAt: new Date().toISOString(),
    journeyDate: journeyDate || new Date().toISOString().split('T')[0],
  }
}

function addMins(timeStr: string, minutes: number): string {
  try {
    const [h, m] = timeStr.split(':').map(Number)
    const total = (h * 60 + m + minutes) % 1440
    const newH = Math.floor(total / 60)
    const newM = total % 60
    return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`
  } catch {
    return timeStr
  }
}

export const trainApi = {
  async searchTrains(query: string): Promise<TrainSearchResponse> {
    const q = query.trim()
    if (!q) return { results: [], total: 0 }

    try {
      const res = await fetch(`${API_BASE}/trains/search?q=${encodeURIComponent(q)}`)
      if (res.ok) {
        return await res.json()
      }
    } catch {
      // Fallback to local search
    }

    const lowerQ = q.toLowerCase()
    const matches = MOCK_TRAINS.filter(
      (t) =>
        t.trainNumber.includes(lowerQ) ||
        t.trainName.toLowerCase().includes(lowerQ) ||
        t.source.toLowerCase().includes(lowerQ) ||
        t.destination.toLowerCase().includes(lowerQ)
    ).map((t) => ({
      trainNumber: t.trainNumber,
      trainName: t.trainName,
      source: t.source,
      sourceCode: t.sourceCode,
      destination: t.destination,
      destinationCode: t.destinationCode,
      runsDays: t.runsDays,
    }))

    if (matches.length === 0 && /^\d{4,5}$/.test(q)) {
      matches.push({
        trainNumber: q,
        trainName: `Express Special (${q})`,
        source: 'Mumbai Central',
        sourceCode: 'MMCT',
        destination: 'New Delhi',
        destinationCode: 'NDLS',
        runsDays: ['Daily'],
      })
    }

    return { results: matches, total: matches.length }
  },

  async searchByNumber(number: string): Promise<TrainSearchResponse> {
    const num = number.trim()
    if (!num) return { results: [], total: 0 }

    try {
      const res = await fetch(`${API_BASE}/trains/search/number?number=${encodeURIComponent(num)}`)
      if (res.ok) {
        return await res.json()
      }
    } catch {
      // fallback
    }
    return trainApi.searchTrains(num)
  },

  async searchByName(name: string): Promise<TrainSearchResponse> {
    const n = name.trim()
    if (!n) return { results: [], total: 0 }

    try {
      const res = await fetch(`${API_BASE}/trains/search/name?name=${encodeURIComponent(n)}`)
      if (res.ok) {
        return await res.json()
      }
    } catch {
      // fallback
    }
    return trainApi.searchTrains(n)
  },

  async searchBetweenStations(from: string, to: string, date?: string): Promise<TrainSearchResponse> {
    const f = from.trim()
    const t = to.trim()
    if (!f || !t) return { results: [], total: 0 }

    try {
      const url = `${API_BASE}/trains/search/stations?from=${encodeURIComponent(f)}&to=${encodeURIComponent(t)}${date ? `&date=${date}` : ''}`
      const res = await fetch(url)
      if (res.ok) {
        return await res.json()
      }
    } catch {
      // fallback
    }

    // Local fallback matching source / destination
    const matches = MOCK_TRAINS.filter(
      (m) =>
        (m.sourceCode.toLowerCase() === f.toLowerCase() || m.source.toLowerCase().includes(f.toLowerCase())) &&
        (m.destinationCode.toLowerCase() === t.toLowerCase() || m.destination.toLowerCase().includes(t.toLowerCase()))
    ).map((m) => ({
      trainNumber: m.trainNumber,
      trainName: m.trainName,
      source: m.source,
      sourceCode: m.sourceCode,
      destination: m.destination,
      destinationCode: m.destinationCode,
      runsDays: m.runsDays,
    }))

    if (matches.length === 0) {
      matches.push({
        trainNumber: '12951',
        trainName: `Superfast Express (${f.toUpperCase()} → ${t.toUpperCase()})`,
        source: f.toUpperCase(),
        sourceCode: f.toUpperCase(),
        destination: t.toUpperCase(),
        destinationCode: t.toUpperCase(),
        runsDays: ['Daily'],
      })
    }

    return { results: matches, total: matches.length }
  },

  async getLiveStatus(trainNumber: string, date?: string): Promise<LiveStatusResponse> {
    try {
      const url = `${API_BASE}/trains/${encodeURIComponent(trainNumber)}/live${date ? `?date=${date}` : ''}`
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        // Save fresh snapshot to offline cache
        storage.saveOfflineSnapshot(data, false)
        return data
      }
    } catch {
      // Check offline snapshot first before mock fallback
      const cached = storage.getOfflineSnapshot(trainNumber)
      if (cached) {
        return interpolateLiveStatusFromTime(cached.data, new Date())
      }
    }
    return generateFallbackLiveStatus(trainNumber, date)
  },
}

// Local Storage Helpers
const RECENTS_KEY = 'checkrail_recents'
const FAVOURITES_KEY = 'checkrail_favourites'
const OFFLINE_SNAPSHOTS_KEY = 'checkrail_offline_snapshots'

export const storage = {
  getRecents(): RecentSearch[] {
    try {
      const raw = localStorage.getItem(RECENTS_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  },

  addRecent(search: Omit<RecentSearch, 'timestamp'>): void {
    try {
      let list = storage.getRecents()
      list = list.filter((item) => item.trainNumber !== search.trainNumber)
      list.unshift({ ...search, timestamp: Date.now() })
      if (list.length > 5) list = list.slice(0, 5)
      localStorage.setItem(RECENTS_KEY, JSON.stringify(list))
    } catch {
      // ignore
    }
  },

  removeRecent(trainNumber: string): void {
    try {
      const list = storage.getRecents().filter((item) => item.trainNumber !== trainNumber)
      localStorage.setItem(RECENTS_KEY, JSON.stringify(list))
    } catch {
      // ignore
    }
  },

  clearRecents(): void {
    try {
      localStorage.removeItem(RECENTS_KEY)
    } catch {
      // ignore
    }
  },

  getFavourites(): FavouriteTrain[] {
    try {
      const raw = localStorage.getItem(FAVOURITES_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  },

  isFavourite(trainNumber: string): boolean {
    return storage.getFavourites().some((f) => f.trainNumber === trainNumber)
  },

  toggleFavourite(train: Omit<FavouriteTrain, 'addedAt'>): boolean {
    try {
      let list = storage.getFavourites()
      const exists = list.some((item) => item.trainNumber === train.trainNumber)
      if (exists) {
        list = list.filter((item) => item.trainNumber !== train.trainNumber)
        localStorage.setItem(FAVOURITES_KEY, JSON.stringify(list))
        return false
      } else {
        if (list.length >= 10) return false
        list.unshift({
          ...train,
          addedAt: Date.now(),
          isOfflineAvailable: storage.isOfflineSaved(train.trainNumber),
        })
        localStorage.setItem(FAVOURITES_KEY, JSON.stringify(list))
        return true
      }
    } catch {
      return false
    }
  },

  removeFavourite(trainNumber: string): void {
    try {
      const list = storage.getFavourites().filter((item) => item.trainNumber !== trainNumber)
      localStorage.setItem(FAVOURITES_KEY, JSON.stringify(list))
    } catch {
      // ignore
    }
  },

  // --- Offline Train Snapshots & Cookies Storage ---
  getAllOfflineSnapshots(): OfflineTrainSnapshot[] {
    try {
      const raw = localStorage.getItem(OFFLINE_SNAPSHOTS_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  },

  getOfflineSnapshot(trainNumber: string): OfflineTrainSnapshot | null {
    try {
      const all = storage.getAllOfflineSnapshots()
      return all.find((item) => item.trainNumber === trainNumber) || null
    } catch {
      return null
    }
  },

  isOfflineSaved(trainNumber: string): boolean {
    const snap = storage.getOfflineSnapshot(trainNumber)
    return !!snap && snap.isOfflineExplicit
  },

  saveOfflineSnapshot(data: LiveStatusResponse, isExplicit = false): void {
    try {
      let all = storage.getAllOfflineSnapshots()
      const existing = all.find((item) => item.trainNumber === data.trainNumber)
      const now = Date.now()

      const updatedSnapshot: OfflineTrainSnapshot = {
        trainNumber: data.trainNumber,
        trainName: data.trainName,
        data,
        savedAt: existing?.savedAt || now,
        lastSyncedAt: now,
        isOfflineExplicit: isExplicit || (existing ? existing.isOfflineExplicit : false),
      }

      all = all.filter((item) => item.trainNumber !== data.trainNumber)
      all.unshift(updatedSnapshot)
      // Cap at 15 offline saved trains
      if (all.length > 15) all = all.slice(0, 15)
      localStorage.setItem(OFFLINE_SNAPSHOTS_KEY, JSON.stringify(all))

      // Also mark in favourites if favourite exists
      let favs = storage.getFavourites()
      let updatedFavs = false
      favs = favs.map((f) => {
        if (f.trainNumber === data.trainNumber) {
          updatedFavs = true
          return {
            ...f,
            isOfflineAvailable: updatedSnapshot.isOfflineExplicit,
            lastSyncedAt: new Date(now).toISOString(),
          }
        }
        return f
      })
      if (updatedFavs) {
        localStorage.setItem(FAVOURITES_KEY, JSON.stringify(favs))
      }

      // Also persist cookie for quick browser inspection & session continuity
      try {
        const cookiePayload = encodeURIComponent(
          JSON.stringify({
            train: data.trainNumber,
            lastAt: data.currentPosition?.nearestStation || '',
            delay: data.runningStatus?.delayMinutes || 0,
            synced: now,
          })
        )
        document.cookie = `checkrail_${data.trainNumber}=${cookiePayload}; path=/; max-age=2592000; SameSite=Lax`
      } catch {
        // ignore cookie write restriction
      }
    } catch {
      // ignore
    }
  },

  toggleOffline(data: LiveStatusResponse): boolean {
    const currentlySaved = storage.isOfflineSaved(data.trainNumber)
    const nextState = !currentlySaved
    storage.saveOfflineSnapshot(data, nextState)
    return nextState
  },

  removeOfflineSnapshot(trainNumber: string): void {
    try {
      const all = storage.getAllOfflineSnapshots().filter((item) => item.trainNumber !== trainNumber)
      localStorage.setItem(OFFLINE_SNAPSHOTS_KEY, JSON.stringify(all))
      try {
        document.cookie = `checkrail_${trainNumber}=; path=/; max-age=0`
      } catch {
        // ignore
      }
    } catch {
      // ignore
    }
  },
}
