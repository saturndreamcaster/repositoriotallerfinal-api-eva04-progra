import { useState, useEffect } from 'react'
import './App.css'
import PokemonList from './components/PokemonList'

function App() {
  const [pokemons, setPokemons] = useState([])
  const [filteredPokemons, setFilteredPokemons] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState([])
  const [blocked, setBlocked] = useState([])
  const [filterMode, setFilterMode] = useState('all') // all | favorites | blocked
  const [typeFilter, setTypeFilter] = useState('all')
  const [availableTypes, setAvailableTypes] = useState([])

  // Cargar datos guardados del localStorage
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('pokemonFavorites')) || []
    const savedBlocked = JSON.parse(localStorage.getItem('pokemonBlocked')) || []
    setFavorites(savedFavorites)
    setBlocked(savedBlocked)
  }, [])

  // Cargar Pokémon desde la API
  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=50&offset=0')
        const data = await response.json()
        
        const pokemonDetails = await Promise.all(
          data.results.map(pokemon =>
            fetch(pokemon.url).then(res => res.json())
          )
        )
        
        setPokemons(pokemonDetails)
        setFilteredPokemons(pokemonDetails)
        const types = Array.from(new Set(pokemonDetails.flatMap(p => p.types.map(t => t.type.name))))
        setAvailableTypes(types.sort())
      } catch (error) {
        console.error('Error al cargar Pokémon:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPokemons()
  }, [])

  // Filtrar Pokémon según búsqueda
  useEffect(() => {
    const filtered = pokemons.filter(pokemon => {
      // Excluir bloqueados salvo que estemos viendo "blocked"
      if (filterMode !== 'blocked' && blocked.includes(pokemon.id)) return false

      // Si pedimos sólo favoritos
      if (filterMode === 'favorites' && !favorites.includes(pokemon.id)) return false

      // Si pedimos sólo bloqueados
      if (filterMode === 'blocked' && !blocked.includes(pokemon.id)) return false

      // Filtrar por tipo si se seleccionó uno
      if (typeFilter !== 'all' && !pokemon.types.some(t => t.type.name === typeFilter)) return false

      // Filtrar por búsqueda de nombre
      if (!pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())) return false

      return true
    })

    setFilteredPokemons(filtered)
  }, [searchTerm, pokemons, blocked, favorites, filterMode, typeFilter])

  // Guardar cambios en localStorage
  useEffect(() => {
    localStorage.setItem('pokemonFavorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('pokemonBlocked', JSON.stringify(blocked))
  }, [blocked])

  const toggleFavorite = (pokemonId) => {
    setFavorites(prev =>
      prev.includes(pokemonId)
        ? prev.filter(id => id !== pokemonId)
        : [...prev, pokemonId]
    )
  }

  const toggleBlocked = (pokemonId) => {
    setBlocked(prev =>
      prev.includes(pokemonId)
        ? prev.filter(id => id !== pokemonId)
        : [...prev, pokemonId]
    )
  }

  const handleSearch = (value) => {
    setSearchTerm(value)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔴 PokéDex Manager</h1>
        <p>Gestiona tus Pokémon favoritos</p>
      </header>

      <main className="app-main">
        <div className="content-area">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar Pokémon..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />

            <div className="filter-controls">
              <select
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value)}
                className="filter-select"
              >
                <option value="all">Todos</option>
                <option value="favorites">Favoritos</option>
                <option value="blocked">Bloqueados</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">Todos los tipos</option>
                {availableTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <span className="result-count">
              {filteredPokemons.length} Pokémon encontrados
            </span>
          </div>

          {loading ? (
            <div className="loading">
              <p>Cargando Pokémon...</p>
            </div>
          ) : (
            <PokemonList
              pokemons={filteredPokemons}
              favorites={favorites}
              blocked={blocked}
              onToggleFavorite={toggleFavorite}
              onToggleBlocked={toggleBlocked}
            />
          )}
        </div>

        <aside className="favorites-panel">
          <h2>Favoritos</h2>
          <div className="favorites-list">
            {favorites.length === 0 && (
              <p className="no-favs">No tienes Pokémon favoritos.</p>
            )}

            {favorites.map(id => {
              const p = pokemons.find(x => x.id === id)
              if (!p) return null
              const imageUrl = p.sprites?.other?.['official-artwork']?.front_default || p.sprites?.front_default || 'https://via.placeholder.com/80'
              return (
                <div key={id} className="favorite-item">
                  <img src={imageUrl} alt={p.name} className="fav-thumb" />
                  <div className="fav-meta">
                    <span className="fav-name">{p.name}</span>
                    <button className="fav-remove" onClick={() => toggleFavorite(id)} title="Quitar favorito">✖</button>
                  </div>
                </div>
              )
            })}
          </div>
        </aside>
      </main>
    </div>
  )
}

export default App
