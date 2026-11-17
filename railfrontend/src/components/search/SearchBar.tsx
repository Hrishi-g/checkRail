import React, { useState } from 'react'
import type { TrainSummary } from '../../types'
import { SearchIcon, TrainIcon, CloseIcon, ChevronRightIcon, MapPinIcon } from '../common/Icons'
import { trainApi } from '../../services/api'

type SearchMode = 'number' | 'name' | 'stations'

interface SearchBarProps {
  onSelectTrain: (train: TrainSummary) => void
  initialQuery?: string
  autoFocus?: boolean
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectTrain,
  initialQuery = '',
}) => {
  const [mode, setMode] = useState<SearchMode>('number')
  const [trainNumberInput, setTrainNumberInput] = useState(initialQuery)
  const [trainNameInput, setTrainNameInput] = useState('')
  const [fromStationInput, setFromStationInput] = useState('')
  const [toStationInput, setToStationInput] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [results, setResults] = useState<TrainSummary[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Trigger search on explicit click or Enter
  const handleExecuteSearch = async () => {
    setErrorMessage(null)
    setIsLoading(true)
    setHasSearched(true)

    try {
      if (mode === 'number') {
        const num = trainNumberInput.trim()
        if (!num) {
          setErrorMessage('Please enter a train number (e.g. 12951)')
          setIsLoading(false)
          return
        }
        const res = await trainApi.searchByNumber(num)
        setResults(res.results || [])
      } else if (mode === 'name') {
        const name = trainNameInput.trim()
        if (name.length < 2) {
          setErrorMessage('Please enter at least 2 characters (e.g. Rajdhani)')
          setIsLoading(false)
          return
        }
        const res = await trainApi.searchByName(name)
        setResults(res.results || [])
      } else if (mode === 'stations') {
        const from = fromStationInput.trim().toUpperCase()
        const to = toStationInput.trim().toUpperCase()
        if (!from || !to) {
          setErrorMessage('Please enter both From and To stations (e.g. NDLS to MMCT)')
          setIsLoading(false)
          return
        }
        const res = await trainApi.searchBetweenStations(from, to)
        setResults(res.results || [])
      }
    } catch {
      setErrorMessage('Search failed. Please try again.')
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleExecuteSearch()
    }
  }

  const handleClear = () => {
    setTrainNumberInput('')
    setTrainNameInput('')
    setFromStationInput('')
    setToStationInput('')
    setResults([])
    setHasSearched(false)
    setErrorMessage(null)
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '720px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      {/* Search Mode Options Bar (Below/Above options) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <button
          type="button"
          onClick={() => {
            setMode('number')
            setErrorMessage(null)
          }}
          style={{
            padding: '8px 18px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: 600,
            border: '1px solid',
            borderColor: mode === 'number' ? 'var(--color-accent)' : 'var(--color-border)',
            backgroundColor: mode === 'number' ? 'var(--color-accent)' : '#FFFFFF',
            color: mode === 'number' ? '#FFFFFF' : 'var(--color-text-secondary)',
            boxShadow: mode === 'number' ? '0 2px 8px rgba(0, 113, 227, 0.25)' : 'var(--shadow-xs)',
            transition: 'all 0.18s ease',
            cursor: 'pointer',
          }}
        >
          Train Number
        </button>

        <button
          type="button"
          onClick={() => {
            setMode('name')
            setErrorMessage(null)
          }}
          style={{
            padding: '8px 18px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: 600,
            border: '1px solid',
            borderColor: mode === 'name' ? 'var(--color-accent)' : 'var(--color-border)',
            backgroundColor: mode === 'name' ? 'var(--color-accent)' : '#FFFFFF',
            color: mode === 'name' ? '#FFFFFF' : 'var(--color-text-secondary)',
            boxShadow: mode === 'name' ? '0 2px 8px rgba(0, 113, 227, 0.25)' : 'var(--shadow-xs)',
            transition: 'all 0.18s ease',
            cursor: 'pointer',
          }}
        >
          Train Name
        </button>

        <button
          type="button"
          onClick={() => {
            setMode('stations')
            setErrorMessage(null)
          }}
          style={{
            padding: '8px 18px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: 600,
            border: '1px solid',
            borderColor: mode === 'stations' ? 'var(--color-accent)' : 'var(--color-border)',
            backgroundColor: mode === 'stations' ? 'var(--color-accent)' : '#FFFFFF',
            color: mode === 'stations' ? '#FFFFFF' : 'var(--color-text-secondary)',
            boxShadow: mode === 'stations' ? '0 2px 8px rgba(0, 113, 227, 0.25)' : 'var(--shadow-xs)',
            transition: 'all 0.18s ease',
            cursor: 'pointer',
          }}
        >
          Between Stations
        </button>
      </div>

      {/* Main Search Input Container */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          border: '1.5px solid var(--color-border)',
          boxShadow: 'var(--shadow-md)',
          padding: mode === 'stations' ? '12px 16px' : '6px 8px 6px 20px',
          display: 'flex',
          flexDirection: mode === 'stations' ? 'column' : 'row',
          alignItems: 'center',
          gap: '12px',
          transition: 'all 0.2s ease',
        }}
      >
        {/* Mode 1: Search by Train Number */}
        {mode === 'number' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, width: '100%' }}>
            <span style={{ color: 'var(--color-accent)', display: 'flex' }}>
              <TrainIcon size={22} />
            </span>
            <input
              type="text"
              value={trainNumberInput}
              onChange={(e) => setTrainNumberInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter 5-digit Train Number (e.g. 12951, 22436, 12002)..."
              style={{
                flex: 1,
                height: '46px',
                fontSize: '16px',
                fontWeight: 500,
                border: 'none',
                outline: 'none',
                color: 'var(--color-text-primary)',
                backgroundColor: 'transparent',
              }}
            />
            {trainNumberInput && (
              <button
                type="button"
                onClick={handleClear}
                style={{ color: 'var(--color-text-tertiary)', padding: '6px' }}
              >
                <CloseIcon size={18} />
              </button>
            )}
            <button
              type="button"
              onClick={handleExecuteSearch}
              disabled={isLoading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                height: '46px',
                padding: '0 24px',
                borderRadius: '999px',
                backgroundColor: 'var(--color-accent)',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 113, 227, 0.3)',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {isLoading ? (
                <div
                  className="animate-spin"
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.4)',
                    borderTopColor: '#fff',
                  }}
                />
              ) : (
                <SearchIcon size={18} />
              )}
              <span>{isLoading ? 'Searching...' : 'Search Train'}</span>
            </button>
          </div>
        )}

        {/* Mode 2: Search by Train Name */}
        {mode === 'name' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, width: '100%' }}>
            <span style={{ color: 'var(--color-accent)', display: 'flex' }}>
              <SearchIcon size={22} />
            </span>
            <input
              type="text"
              value={trainNameInput}
              onChange={(e) => setTrainNameInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter Train Name (e.g. Rajdhani, Vande Bharat, Shatabdi)..."
              style={{
                flex: 1,
                height: '46px',
                fontSize: '16px',
                fontWeight: 500,
                border: 'none',
                outline: 'none',
                color: 'var(--color-text-primary)',
                backgroundColor: 'transparent',
              }}
            />
            {trainNameInput && (
              <button
                type="button"
                onClick={handleClear}
                style={{ color: 'var(--color-text-tertiary)', padding: '6px' }}
              >
                <CloseIcon size={18} />
              </button>
            )}
            <button
              type="button"
              onClick={handleExecuteSearch}
              disabled={isLoading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                height: '46px',
                padding: '0 24px',
                borderRadius: '999px',
                backgroundColor: 'var(--color-accent)',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 113, 227, 0.3)',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {isLoading ? (
                <div
                  className="animate-spin"
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.4)',
                    borderTopColor: '#fff',
                  }}
                />
              ) : (
                <SearchIcon size={18} />
              )}
              <span>{isLoading ? 'Searching...' : 'Search by Name'}</span>
            </button>
          </div>
        )}

        {/* Mode 3: Search Between Stations */}
        {mode === 'stations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '10px',
                width: '100%',
              }}
            >
              {/* From Station */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-base)',
                  padding: '8px 14px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <MapPinIcon size={18} style={{ color: 'var(--color-accent)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>
                    From Station
                  </div>
                  <input
                    type="text"
                    value={fromStationInput}
                    onChange={(e) => setFromStationInput(e.target.value.toUpperCase())}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. NDLS or Delhi"
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      backgroundColor: 'transparent',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                    }}
                  />
                </div>
              </div>

              {/* To Station */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--color-surface)',
                  borderRadius: 'var(--radius-base)',
                  padding: '8px 14px',
                  border: '1px solid var(--color-border)',
                }}
              >
                <MapPinIcon size={18} style={{ color: '#10b981' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>
                    To Station
                  </div>
                  <input
                    type="text"
                    value={toStationInput}
                    onChange={(e) => setToStationInput(e.target.value.toUpperCase())}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. MMCT or Mumbai"
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 'none',
                      backgroundColor: 'transparent',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              {(fromStationInput || toStationInput) && (
                <button
                  type="button"
                  onClick={handleClear}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '999px',
                    fontSize: '13px',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={handleExecuteSearch}
                disabled={isLoading}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  height: '42px',
                  padding: '0 24px',
                  borderRadius: '999px',
                  backgroundColor: 'var(--color-accent)',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0, 113, 227, 0.3)',
                }}
              >
                {isLoading ? (
                  <div
                    className="animate-spin"
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      border: '2px solid rgba(255,255,255,0.4)',
                      borderTopColor: '#fff',
                    }}
                  />
                ) : (
                  <SearchIcon size={16} />
                )}
                <span>{isLoading ? 'Finding Trains...' : 'Find Trains'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Inline Error Message */}
      {errorMessage && (
        <div
          style={{
            backgroundColor: 'var(--color-danger-soft)',
            color: '#b91c1c',
            padding: '10px 16px',
            borderRadius: 'var(--radius-base)',
            fontSize: '13px',
            fontWeight: 500,
            border: '1px solid rgba(255, 59, 48, 0.25)',
            textAlign: 'center',
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* Search Results Display Section */}
      {hasSearched && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-md)',
            padding: '16px',
            animation: 'fadeSlideUp 0.2s var(--ease-spring)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 4px 6px',
              borderBottom: '1px solid var(--color-surface)',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              Search Results ({results.length})
            </span>
            <button
              onClick={() => {
                setHasSearched(false)
                setResults([])
              }}
              style={{ fontSize: '12px', color: 'var(--color-text-tertiary)' }}
            >
              Dismiss
            </button>
          </div>

          {results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 16px', color: 'var(--color-text-secondary)' }}>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                No trains found
              </div>
              <div style={{ fontSize: '13px', marginTop: '4px' }}>
                Please verify the train number or station code and try again.
              </div>
            </div>
          ) : (
            results.map((train) => (
              <div
                key={train.trainNumber}
                onClick={() => onSelectTrain(train)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-base)',
                  backgroundColor: 'var(--color-surface)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  border: '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF'
                  e.currentTarget.style.borderColor = 'var(--color-accent)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-surface)'
                  e.currentTarget.style.borderColor = 'transparent'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      backgroundColor: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-accent)',
                      boxShadow: 'var(--shadow-xs)',
                    }}
                  >
                    <TrainIcon size={19} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                        {train.trainName}
                      </span>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          backgroundColor: 'var(--color-accent-soft)',
                          color: 'var(--color-accent)',
                          padding: '1px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        #{train.trainNumber}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      {train.source} ({train.sourceCode}) → {train.destination} ({train.destinationCode})
                      {train.runsDays && train.runsDays.length > 0 && (
                        <span style={{ color: 'var(--color-text-tertiary)', marginLeft: '8px' }}>
                          • Runs: {train.runsDays.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--color-accent)',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  <span>Track Live</span>
                  <ChevronRightIcon size={16} />
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
