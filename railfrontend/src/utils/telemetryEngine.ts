import type {
  LiveStatusResponse,
  StationStatus,
  StopStatus,
  CurrentPosition,
  RunningStatus,
} from '../types'

/**
 * Converts a "HH:mm" 24-hour time string to total minutes from midnight.
 */
export function timeToMinutes(timeStr: string | null): number | null {
  if (!timeStr) return null
  try {
    const parts = timeStr.trim().split(':')
    if (parts.length < 2) return null
    const h = parseInt(parts[0], 10)
    const m = parseInt(parts[1], 10)
    if (isNaN(h) || isNaN(m)) return null
    return h * 60 + m
  } catch {
    return null
  }
}

/**
 * Converts minutes from midnight back to "HH:mm".
 */
export function minutesToTime(minutes: number): string {
  const norm = ((minutes % 1440) + 1440) % 1440
  const h = Math.floor(norm / 60)
  const m = norm % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/**
 * Adds delay minutes to a "HH:mm" time string.
 */
export function addDelay(timeStr: string | null, delayMinutes: number): string | null {
  if (!timeStr) return null
  const mins = timeToMinutes(timeStr)
  if (mins === null) return timeStr
  return minutesToTime(mins + delayMinutes)
}

/**
 * Calculates a complete live train status (position, station timeline, ETAs)
 * using only the stored timetable snapshot, known delay, and the device's current clock.
 * ZERO API calls are required!
 */
export function interpolateLiveStatusFromTime(
  baseSnapshot: LiveStatusResponse,
  now: Date = new Date()
): LiveStatusResponse {
  const stations = baseSnapshot.stations
  if (!stations || stations.length === 0) {
    return baseSnapshot
  }

  const delayMinutes = baseSnapshot.runningStatus.delayMinutes || 0
  const totalStops = stations.length

  // Current clock in minutes from midnight
  const nowMins = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60.0

  // 1. Build an array of expected departure/arrival timeline minutes from origin
  // Handling midnight crossing across multi-day journeys
  const timeline: Array<{
    arrMins: number
    depMins: number
  }> = []

  let dayOffset = 0
  let prevRawMins = 0

  for (let i = 0; i < totalStops; i++) {
    const s = stations[i]
    const rawArr = timeToMinutes(s.scheduledArrival)
    const rawDep = timeToMinutes(s.scheduledDeparture)

    // Primary time anchor for this station
    const baseTime = rawArr !== null ? rawArr : (rawDep !== null ? rawDep : 0)

    // Check if day rollover occurred (e.g. 23:45 -> 01:10)
    if (i > 0 && baseTime < prevRawMins - 180) {
      dayOffset += 1440
    }
    prevRawMins = baseTime

    const arrWithDay = (rawArr !== null ? rawArr : baseTime) + dayOffset + delayMinutes
    const depWithDay = (rawDep !== null ? rawDep : baseTime + 5) + dayOffset + delayMinutes

    timeline.push({
      arrMins: arrWithDay,
      depMins: Math.max(arrWithDay, depWithDay),
    })
  }

  // Normalize current time to match the journey window
  const originDep = timeline[0].depMins
  const destArr = timeline[totalStops - 1].arrMins

  let effectiveNow = nowMins
  // If the train spans multiple days, align current time to the active cycle
  while (effectiveNow < originDep - 180) {
    effectiveNow += 1440
  }
  while (effectiveNow > destArr + 180 && effectiveNow - 1440 >= originDep - 60) {
    effectiveNow -= 1440
  }

  // 2. Identify current station index and next station index
  let currentIndex = 0
  let isAtStation = false

  for (let i = 0; i < totalStops; i++) {
    const stopTimes = timeline[i]

    if (effectiveNow >= stopTimes.depMins) {
      currentIndex = i
    } else if (effectiveNow >= stopTimes.arrMins && effectiveNow < stopTimes.depMins) {
      currentIndex = i
      isAtStation = true
      break
    } else {
      break
    }
  }

  const nextIndex = Math.min(currentIndex + (isAtStation ? 1 : 1), totalStops - 1)

  const curStop = stations[currentIndex]
  const nextStop = stations[nextIndex]

  // 3. Interpolate current geographic coordinates and distance covered
  let curLat = curStop.coordinates.lat
  let curLng = curStop.coordinates.lng
  let distanceCovered = curStop.distanceFromSourceKm
  let speed = 0

  if (isAtStation) {
    // Train is halted at the station platform
    curLat = curStop.coordinates.lat
    curLng = curStop.coordinates.lng
    distanceCovered = curStop.distanceFromSourceKm
    speed = 0
  } else if (nextIndex > currentIndex) {
    // Train is in transit between currentIndex and nextIndex
    const segDep = timeline[currentIndex].depMins
    const segArr = timeline[nextIndex].arrMins
    const segDuration = Math.max(2, segArr - segDep)
    const elapsed = Math.max(0, effectiveNow - segDep)

    let progressFraction = elapsed / segDuration
    progressFraction = Math.max(0.05, Math.min(0.95, progressFraction))

    // Interpolate coordinates
    curLat = curStop.coordinates.lat + progressFraction * (nextStop.coordinates.lat - curStop.coordinates.lat)
    curLng = curStop.coordinates.lng + progressFraction * (nextStop.coordinates.lng - curStop.coordinates.lng)

    // Interpolate distance
    const segDistance = Math.max(1, nextStop.distanceFromSourceKm - curStop.distanceFromSourceKm)
    distanceCovered = Math.round(curStop.distanceFromSourceKm + progressFraction * segDistance)

    // Calculate approximate speed
    speed = Math.min(130, Math.max(65, Math.round((segDistance / (segDuration / 60.0)))))
  } else {
    // Reached destination
    curLat = nextStop.coordinates.lat
    curLng = nextStop.coordinates.lng
    distanceCovered = nextStop.distanceFromSourceKm
    speed = 0
  }

  // 4. Update status and minutes away for every station in timeline
  const updatedStations: StationStatus[] = stations.map((s, idx) => {
    const t = timeline[idx]
    let status: StopStatus = 'UPCOMING'
    let minAway: number | null = null

    if (idx < currentIndex) {
      status = 'DEPARTED'
    } else if (idx === currentIndex) {
      status = isAtStation ? 'AT_STATION' : 'DEPARTED'
    } else {
      status = 'UPCOMING'
      minAway = Math.max(1, Math.round(t.arrMins - effectiveNow))
    }

    const actualArr = s.actualArrival || addDelay(s.scheduledArrival, delayMinutes)
    const actualDep = s.actualDeparture || addDelay(s.scheduledDeparture, delayMinutes)

    return {
      ...s,
      actualArrival: actualArr,
      actualDeparture: actualDep,
      status,
      minutesAway: minAway,
    }
  })

  const currentStationStatus = updatedStations[currentIndex]
  const nextStationStatus = updatedStations[Math.min(currentIndex + 1, totalStops - 1)]

  const pos: CurrentPosition = {
    lat: curLat,
    lng: curLng,
    nearestStation: isAtStation ? curStop.name : (effectiveNow - timeline[currentIndex].depMins < timeline[nextIndex].arrMins - effectiveNow ? curStop.name : nextStop.name),
    nearestStationCode: isAtStation ? curStop.code : (effectiveNow - timeline[currentIndex].depMins < timeline[nextIndex].arrMins - effectiveNow ? curStop.code : nextStop.code),
  }

  const runningStatus: RunningStatus = {
    ...baseSnapshot.runningStatus,
    distanceCoveredKm: distanceCovered,
    speedKmh: speed,
    status: delayMinutes > 0 ? 'DELAYED' : 'ON_TIME',
  }

  return {
    ...baseSnapshot,
    currentPosition: pos,
    runningStatus,
    currentStation: currentStationStatus,
    nextStation: nextStationStatus,
    stations: updatedStations,
  }
}
