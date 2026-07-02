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
    const filtered = pokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !blocked.includes(pokemon.id)
    )
    setFilteredPokemons(filtered)
  }, [searchTerm, pokemons, blocked])

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
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar Pokémon..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
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
      </main>
    </div>
  )
}

export default App
