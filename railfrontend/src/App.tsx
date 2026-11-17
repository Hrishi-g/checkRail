import { useState, useEffect } from 'react'
import { TopNav } from './components/layout/TopNav'
import { BottomNav } from './components/layout/BottomNav'
import { SearchBar } from './components/search/SearchBar'
import { RecentSearches } from './components/dashboard/RecentSearches'
import { FavouriteSection } from './components/dashboard/FavouriteSection'
import { EmptyHero } from './components/dashboard/EmptyHero'
import { LiveTrackingView } from './components/live/LiveTrackingView'
import type { TrainSummary, RecentSearch, FavouriteTrain } from './types'
import { storage } from './services/api'

export default function App() {
  const [activeTrainNumber, setActiveTrainNumber] = useState<string | null>(() => {
    return new URLSearchParams(window.location.search).get('train')
  })
  const [recents, setRecents] = useState<RecentSearch[]>(() => storage.getRecents())
  const [favourites, setFavourites] = useState<FavouriteTrain[]>(() => storage.getFavourites())
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'favourites'>('home')

  useEffect(() => {
    const handlePopState = () => {
      const train = new URLSearchParams(window.location.search).get('train')
      setActiveTrainNumber(train)
      setRecents(storage.getRecents())
      setFavourites(storage.getFavourites())
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const reloadStorage = () => {
    setRecents(storage.getRecents())
    setFavourites(storage.getFavourites())
  }

  const handleSelectTrain = (train: TrainSummary) => {
    setActiveTrainNumber(train.trainNumber)
    // Update URL query without full page reload
    window.history.pushState({}, '', `/?train=${train.trainNumber}`)
    reloadStorage()
  }

  const handleSelectTrainNumber = (num: string) => {
    setActiveTrainNumber(num)
    window.history.pushState({}, '', `/?train=${num}`)
    reloadStorage()
  }

  const handleBackToHome = () => {
    setActiveTrainNumber(null)
    window.history.pushState({}, '', window.location.pathname)
    reloadStorage()
  }

  const handleRemoveRecent = (trainNumber: string) => {
    storage.removeRecent(trainNumber)
    setRecents(storage.getRecents())
  }

  const handleClearAllRecents = () => {
    storage.clearRecents()
    setRecents([])
  }

  const handleRemoveFavourite = (trainNumber: string) => {
    storage.removeFavourite(trainNumber)
    setFavourites(storage.getFavourites())
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: '80px',
      }}
    >
      {/* Top Header */}
      <TopNav
        onBackToHome={handleBackToHome}
        showBackButton={activeTrainNumber !== null}
        favouriteCount={favourites.length}
        onFavouritesClick={() => {
          setActiveTrainNumber(null)
          setActiveTab('favourites')
        }}
      />

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          width: '100%',
          padding: '24px 16px',
          boxSizing: 'border-box',
        }}
      >
        {activeTrainNumber ? (
          <LiveTrackingView
            trainNumber={activeTrainNumber}
            onFavouritesChanged={reloadStorage}
          />
        ) : (
          <div style={{ maxWidth: '820px', margin: '0 auto', width: '100%' }}>
            {/* Search Bar */}
            <SearchBar
              onSelectTrain={handleSelectTrain}
              autoFocus={true}
            />

            {/* Recent Searches Chips */}
            <RecentSearches
              recents={recents}
              onSelectRecent={(item) => handleSelectTrainNumber(item.trainNumber)}
              onRemoveRecent={handleRemoveRecent}
              onClearAll={handleClearAllRecents}
            />

            {/* Favourites Section */}
            <FavouriteSection
              favourites={favourites}
              onSelectTrain={handleSelectTrainNumber}
              onRemoveFavourite={handleRemoveFavourite}
            />

            {/* Landing Hero (when user hasn't searched or as clean welcome) */}
            <EmptyHero
              onSelectQuickTrain={handleSelectTrainNumber}
            />
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        favouriteCount={favourites.length}
        onSelectTab={(tab) => {
          setActiveTab(tab)
          if (tab === 'home') {
            handleBackToHome()
          } else if (tab === 'search') {
            handleBackToHome()
          } else if (tab === 'favourites') {
            setActiveTrainNumber(null)
          }
        }}
      />
    </div>
  )
}
