import React, { useEffect, useRef, useState, useMemo } from 'react'
import type { StationStatus, CurrentPosition } from '../../types'
import { MapPinIcon } from '../common/Icons'

// Leaflet type declaration for global window.L loaded via CDN
declare const L: any

interface TrainMapProps {
  currentPosition: CurrentPosition
  stations: StationStatus[]
  sourceCode: string
  destinationCode: string
}

export const TrainMap: React.FC<TrainMapProps> = ({
  currentPosition,
  stations,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const layersGroupRef = useRef<any>(null)
  const tileGroupRef = useRef<any>(null)
  const hasFittedInitialRef = useRef(false)
  const stationsRef = useRef(stations)
  const currentPositionRef = useRef(currentPosition)

  useEffect(() => {
    stationsRef.current = stations
    currentPositionRef.current = currentPosition
  }, [stations, currentPosition])

  const [viewMode, setViewMode] = useState<'india' | 'route'>('india')
  const [mapStyle, setMapStyle] = useState<'apple' | 'osm'>('apple')
  const [isLeafletReady, setIsLeafletReady] = useState(
    () => typeof window !== 'undefined' && !!(window as any).L
  )

  // Check if Leaflet is loaded in browser
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).L) {
      return
    }

    const interval = setInterval(() => {
      if (typeof window !== 'undefined' && (window as any).L) {
        setIsLeafletReady(true)
        clearInterval(interval)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [])

  // Find index of last passed station
  const lastDepartedIndex = useMemo(() => {
    let idx = 0
    stations.forEach((s, i) => {
      if (s.status === 'DEPARTED' || s.status === 'AT_STATION') {
        idx = i
      }
    })
    return idx
  }, [stations])

  // Initialize Leaflet Map
  useEffect(() => {
    if (!isLeafletReady || !containerRef.current || mapInstanceRef.current) return

    try {
      // Center on India
      const map = L.map(containerRef.current, {
        center: [22.5, 79.5],
        zoom: 5,
        minZoom: 4,
        maxZoom: 18,
        zoomControl: false,
        attributionControl: false,
      })

      const tileGroup = L.layerGroup().addTo(map)
      tileGroupRef.current = tileGroup

      const layersGroup = L.layerGroup().addTo(map)
      layersGroupRef.current = layersGroup
      mapInstanceRef.current = map

      setTimeout(() => {
        map.invalidateSize()
      }, 200)
    } catch {
      // Leaflet init fallback
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [isLeafletReady])

  // Switch Tile Basemap (Esri Apple Light vs OpenStreetMap) - 100% Free, NO API KEY, No Watermarks
  useEffect(() => {
    const tileGroup = tileGroupRef.current
    if (!tileGroup || !isLeafletReady) return

    tileGroup.clearLayers()

    if (mapStyle === 'apple') {
      // 1. Esri World Light Gray Base - Clean White/Light Grey Apple Maps aesthetic
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 16,
          attribution: 'Esri, OpenStreetMap',
        }
      ).addTo(tileGroup)

      // 2. Esri World Light Gray Reference - Real state borders, cities & geography
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 16,
        }
      ).addTo(tileGroup)
    } else {
      // OpenStreetMap Standard - Full details & railway corridors
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors',
      }).addTo(tileGroup)
    }
  }, [mapStyle, isLeafletReady])

  // Render Routes, Stations & Train Pin on Leaflet Map
  useEffect(() => {
    const map = mapInstanceRef.current
    const layers = layersGroupRef.current
    if (!map || !layers || !isLeafletReady) return

    layers.clearLayers()

    const validStations = stations.filter(
      (s) => s.coordinates && s.coordinates.lat > 0 && s.coordinates.lng > 0
    )

    if (validStations.length === 0) return

    // Partition points into passed and upcoming
    const passedLatLngs: [number, number][] = []
    const upcomingLatLngs: [number, number][] = []

    validStations.forEach((s, i) => {
      if (i <= lastDepartedIndex) {
        passedLatLngs.push([s.coordinates.lat, s.coordinates.lng])
      } else {
        if (upcomingLatLngs.length === 0) {
          // Connect train position to first upcoming station
          upcomingLatLngs.push([currentPosition.lat, currentPosition.lng])
        }
        upcomingLatLngs.push([s.coordinates.lat, s.coordinates.lng])
      }
    })

    if (passedLatLngs.length > 0) {
      // Connect last passed station to current train location
      passedLatLngs.push([currentPosition.lat, currentPosition.lng])
    }

    // 1. Glow Polyline under upcoming path
    if (upcomingLatLngs.length > 1) {
      L.polyline(upcomingLatLngs, {
        color: '#0071E3',
        weight: 10,
        opacity: 0.22,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(layers)
    }

    // 2. Passed Track (Slate grey, dashed)
    if (passedLatLngs.length > 1) {
      L.polyline(passedLatLngs, {
        color: '#64748B',
        weight: 4,
        dashArray: '6, 6',
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(layers)
    }

    // 3. Upcoming Track (Apple Blue, solid)
    if (upcomingLatLngs.length > 1) {
      L.polyline(upcomingLatLngs, {
        color: '#0071E3',
        weight: 5,
        opacity: 1,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(layers)
    }

    // 4. Station Markers
    validStations.forEach((s, idx) => {
      const isPassed = idx <= lastDepartedIndex
      const isNext = idx === lastDepartedIndex + 1

      const dotBg = isNext ? '#0071E3' : isPassed ? '#64748B' : '#FFFFFF'
      const dotBorder = isNext ? '#0071E3' : isPassed ? '#64748B' : '#0071E3'
      const badgeColor = isNext ? '#0071E3' : '#1E293B'

      const customHtml = `
        <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer; transform: translate(-50%, -50%);">
          <div style="width: ${isNext ? '14px' : '10px'}; height: ${isNext ? '14px' : '10px'}; border-radius: 50%; background-color: ${dotBg}; border: 2px solid #FFFFFF; box-shadow: 0 0 0 1.5px ${dotBorder}, 0 2px 5px rgba(0,0,0,0.25);"></div>
          <span style="margin-top: 3px; font-size: 10px; font-weight: 700; color: ${badgeColor}; background: rgba(255,255,255,0.95); padding: 1px 5px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.12); border: 1px solid rgba(203,213,225,0.8); white-space: nowrap;">
            ${s.code}
          </span>
        </div>
      `

      const icon = L.divIcon({
        className: 'station-marker-icon',
        html: customHtml,
        iconSize: [40, 36],
        iconAnchor: [20, 18],
      })

      const popupHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; line-height: 1.4;">
          <div style="font-weight: 700; font-size: 13px; color: #FFFFFF;">${s.name} (${s.code})</div>
          <div style="color: #94A3B8; margin-top: 2px;">Platform ${s.platformNumber} • ${s.distanceFromSourceKm} km from source</div>
          <div style="color: #E2E8F0; margin-top: 2px;">Dep: ${s.actualDeparture || s.scheduledDeparture || 'N/A'}</div>
        </div>
      `

      L.marker([s.coordinates.lat, s.coordinates.lng], { icon })
        .bindPopup(popupHtml)
        .addTo(layers)
    })

    // 5. Pulsing Live Train Marker
    const trainHtml = `
      <div style="position: relative; width: 44px; height: 44px; transform: translate(-50%, -50%); pointer-events: none;">
        <div style="position: absolute; top: 50%; left: 50%; width: 48px; height: 48px; border-radius: 50%; border: 2px solid rgba(0, 113, 227, 0.7); animation: radar-pulse 2.2s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;"></div>
        <div style="position: absolute; top: 50%; left: 50%; width: 72px; height: 72px; border-radius: 50%; border: 1px solid rgba(0, 113, 227, 0.4); animation: radar-pulse 2.2s cubic-bezier(0.2, 0.8, 0.2, 1) infinite 0.7s;"></div>
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 34px; height: 34px; border-radius: 50%; background: #0071E3; border: 3px solid #FFFFFF; box-shadow: 0 4px 14px rgba(0, 113, 227, 0.5); display: flex; align-items: center; justify-content: center; color: white;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15V8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v7"/><rect x="2" y="15" width="20" height="4" rx="2"/><circle cx="7" cy="19" r="1"/><circle cx="17" cy="19" r="1"/></svg>
        </div>
        <div style="position: absolute; bottom: -18px; left: 50%; transform: translateX(-50%); background: #0F172A; color: #FFFFFF; font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 999px; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.3); letter-spacing: 0.5px;">
          LIVE TRAIN
        </div>
      </div>
    `

    const trainIcon = L.divIcon({
      className: 'live-train-icon',
      html: trainHtml,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    })

    L.marker([currentPosition.lat, currentPosition.lng], { icon: trainIcon, zIndexOffset: 1000 }).addTo(layers)
  }, [stations, currentPosition, lastDepartedIndex, isLeafletReady])

  // Adjust camera view ONLY when viewMode changes or on initial route load
  // (NEVER on currentPosition updates, so user's manual zoom & pan is preserved!)
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !isLeafletReady) return

    const validStations = stationsRef.current.filter(
      (s) => s.coordinates && s.coordinates.lat > 0 && s.coordinates.lng > 0
    )
    if (validStations.length === 0) return

    if (viewMode === 'india') {
      map.setView([22.5, 79.5], 5)
    } else {
      const pos = currentPositionRef.current
      const allCoords = validStations.map((s) => [s.coordinates.lat, s.coordinates.lng])
      allCoords.push([pos.lat, pos.lng])
      const bounds = L.latLngBounds(allCoords)
      map.fitBounds(bounds, { padding: [50, 50] })
    }
    hasFittedInitialRef.current = true
  }, [viewMode, isLeafletReady])

  // Initial fit when stations first load
  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map || !isLeafletReady || hasFittedInitialRef.current) return
    const validStations = stations.filter(
      (s) => s.coordinates && s.coordinates.lat > 0 && s.coordinates.lng > 0
    )
    if (validStations.length > 0) {
      hasFittedInitialRef.current = true
      if (viewMode === 'india') {
        map.setView([22.5, 79.5], 5)
      } else {
        const allCoords = validStations.map((s) => [s.coordinates.lat, s.coordinates.lng])
        const bounds = L.latLngBounds(allCoords)
        map.fitBounds(bounds, { padding: [50, 50] })
      }
    }
  }, [stations, isLeafletReady, viewMode])

  const handleRecenter = () => {
    if (!mapInstanceRef.current) return
    if (viewMode === 'india') {
      mapInstanceRef.current.setView([22.5, 79.5], 5)
    } else {
      const valid = stations.filter((s) => s.coordinates && s.coordinates.lat > 0)
      const allCoords = valid.map((s) => [s.coordinates.lat, s.coordinates.lng])
      allCoords.push([currentPosition.lat, currentPosition.lng])
      if (allCoords.length > 0) {
        mapInstanceRef.current.fitBounds(L.latLngBounds(allCoords), { padding: [50, 50] })
      }
    }
  }

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut()
    }
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '500px',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: '#F8FAFC',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Real Interactive Leaflet Tile Container */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
        }}
      />

      {/* Top Left View Switcher & Basemap Style */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 500,
        }}
      >
        {/* Camera Bounds Switcher */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(12px)',
            borderRadius: '999px',
            padding: '3px',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            gap: '2px',
          }}
        >
          <button
            type="button"
            onClick={() => setViewMode('india')}
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: viewMode === 'india' ? '#0071E3' : 'transparent',
              color: viewMode === 'india' ? '#FFFFFF' : '#475569',
              boxShadow: viewMode === 'india' ? '0 1px 4px rgba(0, 113, 227, 0.3)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            🇮🇳 Whole India
          </button>

          <button
            type="button"
            onClick={() => setViewMode('route')}
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: viewMode === 'route' ? '#0071E3' : 'transparent',
              color: viewMode === 'route' ? '#FFFFFF' : '#475569',
              boxShadow: viewMode === 'route' ? '0 1px 4px rgba(0, 113, 227, 0.3)' : 'none',
              transition: 'all 0.15s ease',
            }}
          >
            📍 Focus Route
          </button>
        </div>

        {/* Map Layer Theme Switcher */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(12px)',
            borderRadius: '999px',
            padding: '3px',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            gap: '2px',
            width: 'fit-content',
          }}
        >
          <button
            type="button"
            onClick={() => setMapStyle('apple')}
            style={{
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: mapStyle === 'apple' ? '#0F172A' : 'transparent',
              color: mapStyle === 'apple' ? '#FFFFFF' : '#64748B',
              transition: 'all 0.15s ease',
            }}
          >
            Clean Light
          </button>
          <button
            type="button"
            onClick={() => setMapStyle('osm')}
            style={{
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              backgroundColor: mapStyle === 'osm' ? '#0F172A' : 'transparent',
              color: mapStyle === 'osm' ? '#FFFFFF' : '#64748B',
              transition: 'all 0.15s ease',
            }}
          >
            OpenStreetMap
          </button>
        </div>
      </div>

      {/* Floating Map Controls (Top Right) */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          zIndex: 500,
        }}
      >
        <button
          type="button"
          onClick={handleRecenter}
          title="Reset position"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1E293B',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
        >
          <MapPinIcon size={18} />
        </button>

        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom in"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 600,
            color: '#1E293B',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
        >
          +
        </button>

        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom out"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 600,
            color: '#1E293B',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
        >
          −
        </button>
      </div>

      {/* Near Station Overlay Pill (Bottom Left) */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-base)',
          padding: '8px 14px',
          boxShadow: 'var(--shadow-sm)',
          zIndex: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#34C759',
          }}
        />
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>
          Near {currentPosition.nearestStation} ({currentPosition.nearestStationCode})
        </span>
      </div>
    </div>
  )
}
