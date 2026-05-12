import { useEffect, useState } from "react"

function getStatValue(stats, statName) {
    const found = stats.find((stat) => stat.stat.name === statName)
    return found ? found.base_stat : "N/A"
}

export default function Card() {
    const [query, setQuery] = useState("ditto")
    const [pokemon, setPokemon] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    function fetchPokemon(searchTerm) {
        const cleanSearch = searchTerm.trim().toLowerCase()

        if (!cleanSearch) {
            setError("Enter a Pokemon name or ID.")
            setPokemon(null)
            return
        }

        setLoading(true)
        setError("")

        fetch(`https://pokeapi.co/api/v2/pokemon/${cleanSearch}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Pokemon not found")
                }
                return response.json()
            })
            .then((data) => {
                setPokemon(data) 
            })
            .catch(() => {
                setPokemon(null)
                setError("Pokemon not found. Try a valid name or ID.")
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchPokemon("ditto")
    }, [])

    function handleSubmit(event) {
        event.preventDefault()
        fetchPokemon(query)
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
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
                <div>
                    <h2>{pokemon.name}</h2>
                    <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                    <h4>Height: {pokemon.height / 10}m</h4>
                    <h4>HP: {getStatValue(pokemon.stats, "hp")}</h4>
                    <h4>Attack: {getStatValue(pokemon.stats, "attack")}</h4>
                    <h4>Defense: {getStatValue(pokemon.stats, "defense")}</h4>
                </div>
            )}
        </div>
    )
}