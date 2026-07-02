import PokemonCard from './PokemonCard'
import './PokemonList.css'

function PokemonList({ pokemons, favorites, blocked, onToggleFavorite, onToggleBlocked }) {
  if (pokemons.length === 0) {
    return (
      <div className="empty-state">
        <p>No se encontraron Pokémon</p>
      </div>
    )
  }

  return (
    <div className="pokemon-grid">
      {pokemons.map(pokemon => (
        <PokemonCard
          key={pokemon.id}
          pokemon={pokemon}
          isFavorite={favorites.includes(pokemon.id)}
          isBlocked={blocked.includes(pokemon.id)}
          onToggleFavorite={() => onToggleFavorite(pokemon.id)}
          onToggleBlocked={() => onToggleBlocked(pokemon.id)}
        />
      ))}
    </div>
  )
}

export default PokemonList
