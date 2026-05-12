import { useEffect, useState } from "react";

export default function Card() {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon/")
      .then((response) => response.json())
      .then((data) => {
        setPokemon(data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.log("no pokemon found", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <h1> ... loading </h1>;
  }

  return (
    <div>
      <h1> Pokemon </h1>

      {pokemon.map((poke) => (
        <div key={poke.name}>
          <h2>{poke.name}</h2>
        </div>
      ))}
    </div>
  );
}
