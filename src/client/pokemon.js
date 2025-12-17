import axios from "axios";

const consumirApiPokemon = async (idPokemon) => {
  const respuesta = axios
    .get("https://pokeapi.co/api/v2/pokemon/" + idPokemon)
    .then((r) => r.data);
  return respuesta;
};

export async function obtenerPokemonFacade(id) {
  return await consumirApiPokemon(id);
}

export async function obtenerImagenFacade(id) {
  return (
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/" +
    id +
    ".svg"
  );
}
