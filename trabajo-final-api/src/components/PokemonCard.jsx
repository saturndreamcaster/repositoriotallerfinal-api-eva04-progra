import './PokemonCard.css'

function PokemonCard({ pokemon, isFavorite, isBlocked, onToggleFavorite, onToggleBlocked }) {
  const imageUrl = pokemon.sprites?.other?.['official-artwork']?.front_default || 
                   pokemon.sprites?.front_default || 
                   'https://via.placeholder.com/200'

  return (
    <div className={`pokemon-card ${isBlocked ? 'blocked' : ''}`}>
      {isBlocked && <div className="blocked-overlay">🚫</div>}
      
      <div className="pokemon-image-container">
        <img 
          src={imageUrl} 
          alt={pokemon.name}
          className="pokemon-image"
        />
      </div>

      <div className="pokemon-info">
        <h3 className="pokemon-name">{pokemon.name}</h3>
        <p className="pokemon-id">#{pokemon.id.toString().padStart(4, '0')}</p>
        
        <div className="pokemon-types">
          {pokemon.types.map(type => (
            <span key={type.type.name} className={`type-badge type-${type.type.name}`}>
              {type.type.name}
            </span>
          ))}
        </div>
      </div>

      <div className="pokemon-actions">
        <button
          className={`btn-favorite ${isFavorite ? 'active' : ''}`}
          onClick={onToggleFavorite}
          title={isFavorite ? 'Remover de favoritos' : 'Añadir a favoritos'}
        >
          {isFavorite ? '⭐' : '☆'}
        </button>
        <button
          className={`btn-block ${isBlocked ? 'active' : ''}`}
          onClick={onToggleBlocked}
          title={isBlocked ? 'Desbloquear' : 'Bloquear'}
        >
          {isBlocked ? '🔒' : '🔓'}
        </button>
      </div>
    </div>
  )
}

export default PokemonCard
