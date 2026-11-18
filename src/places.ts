export const categories = {
  library: { label: 'Biblioteki', singular: 'Biblioteka' },
  cafe: { label: 'Kawiarnie', singular: 'Kawiarnia' },
  cowork: { label: 'Coworking', singular: 'Coworking' },
} as const

export type Category = keyof typeof categories

export const amenities = {
  wifi: 'Wi-Fi',
  quiet: 'Cicha strefa',
  outlets: 'Gniazdka',
  coffee: 'Kawa',
  group: 'Praca w grupie',
} as const

export type Amenity = keyof typeof amenities

export interface Place {
  id: string
  name: string
  category: Category
  district: string
  image: string
  summary: string
  description: string
  access: string
  amenities: readonly Amenity[]
}

export const places: readonly Place[] = [
  {
    id: 'pod-arkadami',
    name: 'Czytelnia Pod Arkadami',
    category: 'library',
    district: 'Stare Miasto',
    image: 'library.webp',
    summary: 'Spokojna czytelnia z dużymi stołami i światłem dziennym.',
    description: 'Długie drewniane stoły pod sklepieniami dają miejsce na laptopa, książki i notatki. To przestrzeń do samodzielnej pracy, czytania i przygotowania się do egzaminu.',
    access: 'Bezpłatny wstęp',
    amenities: ['quiet', 'wifi', 'outlets'],
  },
  {
    id: 'miedzy-stronami',
    name: 'Między Stronami',
    category: 'cafe',
    district: 'Kazimierz',
    image: 'cafe.webp',
    summary: 'Kameralna kawiarnia na krótką sesję nauki przy dobrej kawie.',
    description: 'Stoliki przy oknie mają dostęp do gniazdek. W tle słychać rozmowy i ekspres do kawy, więc miejsce sprawdzi się przy pisaniu lub czytaniu materiałów do zajęć.',
    access: 'Obowiązuje zamówienie',
    amenities: ['coffee', 'wifi', 'outlets'],
  },
  {
    id: 'pracownia-zablocie',
    name: 'Pracownia Zabłocie',
    category: 'cowork',
    district: 'Zabłocie',
    image: 'cowork.webp',
    summary: 'Jasny coworking do wspólnej pracy nad projektem.',
    description: 'W otwartej sali znajdują się duże stoły, przy których można spotkać się z zespołem. Przestrzeń sprawdzi się przy wspólnej pracy na laptopach i omawianiu projektu.',
    access: 'Płatny wstęp',
    amenities: ['group', 'wifi', 'outlets'],
  },
]

function normalizeSearch(value: string) {
  return value.toLocaleLowerCase('pl')
    .normalize('NFD')
    .replace(/[\p{M}\p{Dash_Punctuation}]/gu, '')
    .replaceAll('ł', 'l')
}

export function findPlaces(query: string, category: Category | 'all') {
  const terms = normalizeSearch(query).trim().split(/\s+/).filter(Boolean)

  return places.filter((place) => {
    if (category !== 'all' && place.category !== category) return false
    const searchableText = normalizeSearch([
      place.name,
      place.district,
      categories[place.category].label,
      categories[place.category].singular,
      ...place.amenities.map((amenity) => amenities[amenity]),
    ].join(' '))
    return terms.every((term) => searchableText.includes(term))
  })
}
