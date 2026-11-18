import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import {
  ArrowDownRight, ArrowRight, BookOpen, Coffee, Compass, Grid2X2,
  Heart, LibraryBig, MapPin, Plug, Search, UsersRound, VolumeX, Wifi, X,
} from 'lucide-react'
import { amenities, categories, findPlaces, places } from './places'
import type { Category, Place } from './places'

const storageKey = 'studyspot:saved-places'
const assetBase = import.meta.env.BASE_URL + 'images/'
const categoryIcons = { library: LibraryBig, cafe: Coffee, cowork: UsersRound }
const amenityIcons = { wifi: Wifi, quiet: VolumeX, outlets: Plug, coffee: Coffee, group: UsersRound }

function readSavedPlaces(): string[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
    if (Array.isArray(stored)) {
      return places.filter((place) => stored.includes(place.id)).map((place) => place.id)
    }
  } catch {
    // Katalog działa także wtedy, gdy zapis lokalny jest niedostępny lub uszkodzony.
  }
  return []
}

function CategoryLabel({ category }: { category: Category }) {
  const Icon = categoryIcons[category]
  return (
    <span className={`category-label category-label--${category}`}>
      <Icon size={15} aria-hidden="true" />
      {categories[category].singular}
    </span>
  )
}

function PlaceAmenities({ place }: { place: Place }) {
  return (
    <ul className="amenities" aria-label="Udogodnienia">
      {place.amenities.map((amenity) => {
        const Icon = amenityIcons[amenity]
        return (
          <li key={amenity}>
            <Icon size={15} aria-hidden="true" />
            {amenities[amenity]}
          </li>
        )
      })}
    </ul>
  )
}

function PlaceCard({ place, saved, onSave, onOpen }: {
  place: Place
  saved: boolean
  onSave: () => void
  onOpen: (trigger: HTMLButtonElement) => void
}) {
  return (
    <article className="place-card">
      <div className="card-photo">
        <img src={assetBase + place.image} alt="" width="768" height="512" />
        <CategoryLabel category={place.category} />
        <button
          type="button"
          className="icon-button card-save"
          aria-label={`Zapisz miejsce: ${place.name}`}
          aria-pressed={saved}
          onClick={onSave}
        >
          <Heart size={20} aria-hidden="true" />
        </button>
      </div>
      <div className="card-body">
        <p className="district"><MapPin size={15} aria-hidden="true" /> {place.district}</p>
        <h3>{place.name}</h3>
        <p className="card-summary">{place.summary}</p>
        <PlaceAmenities place={place} />
        <button type="button" className="card-link" onClick={(event) => onOpen(event.currentTarget)} aria-label={`Zobacz szczegóły: ${place.name}`}>
          Zobacz szczegóły <ArrowRight size={17} aria-hidden="true" />
        </button>
      </div>
    </article>
  )
}

function PlaceDialog({ place, saved, onSave, onClose }: {
  place: Place
  saved: boolean
  onSave: () => void
  onClose: () => void
}) {
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const element = dialog.current!
    element.showModal()
    return () => {
      if (element.open) element.close()
    }
  }, [])

  return (
    <dialog
      ref={dialog}
      className="place-dialog"
      aria-labelledby="place-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
    >
      <div className="dialog-photo">
        <img src={assetBase + place.image} alt="" />
        <button type="button" autoFocus className="icon-button dialog-close" aria-label="Zamknij szczegóły" onClick={onClose}>
          <X size={22} aria-hidden="true" />
        </button>
      </div>
      <div className="dialog-body">
        <CategoryLabel category={place.category} />
        <h2 id="place-title">{place.name}</h2>
        <p className="district"><MapPin size={15} aria-hidden="true" /> {place.district}, Kraków</p>
        <p>{place.description}</p>
        <dl className="access"><dt>Wstęp</dt><dd>{place.access}</dd></dl>
        <PlaceAmenities place={place} />
        <button type="button" className="primary-button" onClick={onSave}>
          <Heart size={18} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
          {saved ? 'Usuń z zapisanych' : 'Zapisz miejsce'}
        </button>
      </div>
    </dialog>
  )
}

function BrandIcon() {
  return <BookOpen size={20} strokeWidth={2} aria-hidden="true" />
}

export default function App() {
  const [view, setView] = useState<'discover' | 'saved'>('discover')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [savedIds, setSavedIds] = useState(readSavedPlaces)
  const [storageError, setStorageError] = useState(false)
  const [activePlace, setActivePlace] = useState<Place | null>(null)
  const resultHeading = useRef<HTMLHeadingElement>(null)
  const dialogTrigger = useRef<HTMLButtonElement | null>(null)
  const discover = view === 'discover'
  const visiblePlaces = discover
    ? findPlaces(query, category)
    : places.filter((place) => savedIds.includes(place.id))

  function toggleSaved(id: string) {
    const next = savedIds.includes(id) ? savedIds.filter((savedId) => savedId !== id) : [...savedIds, id]
    setSavedIds(next)
    try {
      localStorage.setItem(storageKey, JSON.stringify(next))
      setStorageError(false)
    } catch {
      setStorageError(true)
    }
  }

  function resetFilters() {
    setQuery('')
    setCategory('all')
  }

  function focusResults() {
    resultHeading.current?.focus({ preventScroll: true })
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    focusResults()
    resultHeading.current?.scrollIntoView()
  }

  function closeDetails() {
    setActivePlace(null)
    requestAnimationFrame(() => {
      const trigger = dialogTrigger.current
      if (trigger?.isConnected) {
        trigger.focus()
      } else {
        focusResults()
      }
    })
  }

  return (
    <>
      <a className="skip-link" href="#main">Przejdź do treści</a>
      <header className="site-header">
        <div className="container header-inner">
          <button type="button" className="brand" onClick={() => setView('discover')}>
            <span className="brand-icon"><BrandIcon /></span>
            StudySpot
          </button>
          <nav className="site-nav" aria-label="Nawigacja główna">
            <button type="button" aria-current={discover ? 'page' : undefined} onClick={() => setView('discover')}>
              <Compass size={18} aria-hidden="true" /> Odkrywaj
            </button>
            <button type="button" aria-current={discover ? undefined : 'page'} onClick={() => setView('saved')}>
              <Heart size={18} aria-hidden="true" /> Zapisane
              {savedIds.length > 0 && <span className="nav-count">{savedIds.length}</span>}
            </button>
          </nav>
        </div>
      </header>
      <main id="main" className="container">
        {discover && (
          <section className="hero" aria-labelledby="hero-heading">
            <div className="hero-content">
              <p className="hero-location"><MapPin size={17} aria-hidden="true" /> Kraków, Polska</p>
              <h1 id="hero-heading">Znajdź swoje<br /><em>miejsce do nauki.</em></h1>
              <p className="hero-description">Ciche czytelnie, przytulne kawiarnie i miejsca na wspólną pracę w Krakowie.</p>
              <form className="search-form" role="search" onSubmit={submitSearch}>
                <Search size={20} aria-hidden="true" />
                <label className="sr-only" htmlFor="place-search">Szukaj miejsca, dzielnicy lub udogodnienia</label>
                <input id="place-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nazwa, dzielnica, Wi-Fi…" />
                <button type="submit">Szukaj <ArrowDownRight size={17} aria-hidden="true" /></button>
              </form>
            </div>
            <img className="hero-photo" src={assetBase + 'hero.webp'} alt="" width="1120" height="747" fetchPriority="high" />
          </section>
        )}

        <section className={discover ? 'catalog' : 'catalog catalog--saved'} aria-labelledby="results-title">
          <div className="catalog-heading">
            <div>
              {discover ? <h2 id="results-title" tabIndex={-1} ref={resultHeading}>Odkrywaj miejsca</h2>
                : <h1 id="results-title" tabIndex={-1} ref={resultHeading}>Zapisane miejsca</h1>}
              <p>{discover ? 'Wybierz przestrzeń do samodzielnej nauki lub pracy w grupie.' : 'Wróć do miejsc, które chcesz odwiedzić.'}</p>
            </div>
            <p className="result-count" role="status">{visiblePlaces.length === 1 ? '1 miejsce' : `${visiblePlaces.length} ${visiblePlaces.length > 1 ? 'miejsca' : 'miejsc'}`}</p>
          </div>

          {discover && (
            <div className="filter-row" role="group" aria-label="Rodzaj miejsca">
              <button type="button" aria-pressed={category === 'all'} onClick={() => setCategory('all')}>
                <Grid2X2 size={17} aria-hidden="true" /> Wszystkie
              </button>
              {(Object.keys(categories) as Category[]).map((key) => {
                const Icon = categoryIcons[key]
                return (
                  <button type="button" key={key} aria-pressed={category === key} onClick={() => setCategory(key)}>
                    <Icon size={17} aria-hidden="true" /> {categories[key].label}
                  </button>
                )
              })}
            </div>
          )}
          {storageError && <p className="storage-error" role="status">Przeglądarka nie może zapisać zmian. Będą dostępne do odświeżenia strony.</p>}

          {visiblePlaces.length > 0 ? (
            <div className="place-grid">
              {visiblePlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  saved={savedIds.includes(place.id)}
                  onSave={() => {
                    toggleSaved(place.id)
                    if (!discover) focusResults()
                  }}
                  onOpen={(trigger) => {
                    dialogTrigger.current = trigger
                    setActivePlace(place)
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              {discover ? <Search size={27} aria-hidden="true" /> : <Heart size={27} aria-hidden="true" />}
              <h2>{discover ? 'Brak pasujących miejsc' : 'Nie masz zapisanych miejsc'}</h2>
              <p>{discover ? 'Zmień wyszukiwaną frazę lub wybierz inną kategorię.' : 'Użyj przycisku z sercem na karcie miejsca, żeby je tutaj dodać.'}</p>
              <button type="button" className="primary-button" onClick={discover ? resetFilters : () => setView('discover')}>
                {discover ? 'Wyczyść filtry' : 'Odkrywaj miejsca'} <ArrowRight size={17} aria-hidden="true" />
              </button>
            </div>
          )}
        </section>
      </main>
      <footer className="container site-footer">
        <span className="footer-brand"><BrandIcon /> StudySpot</span>
        <p>Projekt studencki · Dane i zdjęcia demonstracyjne</p>
      </footer>
      {activePlace && <PlaceDialog place={activePlace} saved={savedIds.includes(activePlace.id)} onSave={() => toggleSaved(activePlace.id)} onClose={closeDetails} />}
    </>
  )
}
