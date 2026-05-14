import { useEffect, useState } from "react";
import "./card.css";

function getStatValue(stats, statName) {
  const found = stats.find((stat) => stat.stat.name === statName);
  return found ? found.base_stat : "N/A";
}

export default function Card() {
  const [query, setQuery] = useState("ditto");
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function fetchPokemon(searchTerm) {
    const cleanSearch = searchTerm.trim().toLowerCase();

    if (!cleanSearch) {
      setError("Enter a Pokemon name or ID.");
      setPokemon(null);
      return;
    }

    setLoading(true);
    setError("");

    fetch(`https://pokeapi.co/api/v2/pokemon/${cleanSearch}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Pokemon not found");
        }
        return response.json();
      })
      .then((data) => {
        setPokemon(data);
      })
      .catch(() => {
        setPokemon(null);
        setError("Pokemon not found. Try a valid name or ID.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchPokemon("ditto");
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    fetchPokemon(query);
  }

  return (
    <div>
      <form className="searchBar" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search by name or ID"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <h2>Loading...</h2>}
      {error && <h3>{error}</h3>}

      {pokemon && !loading && (
        <div className="card">
          <div className="card-image-area">
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          </div>
          <div className="card-body">
            <h2>{pokemon.name}</h2>
            <div className="stats">
              <div className="stat">
                <span className="stat-label">Height</span>
                <span className="stat-value">{pokemon.height / 10} m</span>
              </div>
              <div className="stat">
                <span className="stat-label">HP</span>
                <span className="stat-value">{getStatValue(pokemon.stats, "hp")}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Attack</span>
                <span className="stat-value">{getStatValue(pokemon.stats, "attack")}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Defense</span>
                <span className="stat-value">{getStatValue(pokemon.stats, "defense")}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
