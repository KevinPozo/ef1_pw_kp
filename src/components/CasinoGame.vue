<template>
  <div class="container">
    <h1>Juega CASINO</h1>
    <div class="estadisticas">
      <p>
        <b>Puntaje: {{ puntos }}</b>
      </p>
      <p>
        <b>Intentos: {{ intentos }}</b>
      </p>
    </div>
    <div class="imagenes">
      <div
        v-for="(pokemon, index) in pokemons"
        :key="index"
        class="imagen-container"
      >
        <img
          :src="pokemon.imagen"
          alt="Imagen Pokemon"
          class="imagen-pokemon"
        />
        <div class="nombre-pokemon">
          <b>{{ mostrarNombres ? pokemon.nombre : "XXXXXXXXX" }}</b>
        </div>
      </div>
    </div>
    <button
      @click="jugar()"
      class="btn-jugar"
      :disabled="jugando || juegoTerminado"
    >
      Jugar
    </button>
    <div v-if="juegoTerminado" :class="['mensaje', tipoMensaje]">
      <h1>{{ mensajeTitulo }}</h1>
      <p>{{ mensajeTexto }}</p>
      <button @click="reiniciar()" class="btn-nuevo">Nuevo Juego</button>
    </div>
  </div>
</template>

<script>
import {
  obtenerPokemonFacade,
  obtenerImagenFacade,
} from "../client/pokemon.js";

export default {
  data() {
    return {
      pokemons: Array(3).fill({ imagen: "https://via.placeholder.com/250" }),
      mostrarNombres: false,
      puntos: 0,
      intentos: 0,
      jugando: false,
      juegoTerminado: false,
      tipoMensaje: "",
      mensajeTitulo: "",
      mensajeTexto: "",
    };
  },
  methods: {
    async jugar() {
      if (this.juegoTerminado) return;
      this.jugando = true;
      this.mostrarNombres = false;
      const ids = [1, 2, 3, 4, 5];
      const nuevos = [];
      for (let i = 0; i < 3; i++) {
        const id = ids[Math.floor(Math.random() * ids.length)];
        const data = await obtenerPokemonFacade(id);
        nuevos.push({
          id: data.id,
          nombre: data.name,
          imagen: await obtenerImagenFacade(id),
        });
      }
      this.pokemons = nuevos;
      this.mostrarNombres = true;
      this.intentos++;
      let coincidencias = 0;
      if (nuevos[0].id === nuevos[1].id && nuevos[1].id === nuevos[2].id) {
        coincidencias = 3;
      } else if (
        nuevos[0].id === nuevos[1].id ||
        nuevos[0].id === nuevos[2].id ||
        nuevos[1].id === nuevos[2].id
      ) {
        coincidencias = 2;
      } else {
        coincidencias = 0;
      }
      if (coincidencias === 3) {
        this.puntos += 5;
      } else if (coincidencias === 2) {
        this.puntos += 2;
      } else {
        this.puntos += 0;
      }
      if (this.puntos >= 10) {
        this.juegoTerminado = true;
        this.tipoMensaje = "ganador";
        this.mensajeTitulo = "Puntaje: " + this.puntos;
        this.mensajeTexto = "Felicitaciones has ganado $10.000,00";
      } else if (this.intentos >= 5) {
        this.juegoTerminado = true;
        this.tipoMensaje = "perdedor";
        this.mensajeTitulo = "Haz utilizado tus " + this.intentos + " intentos";
        this.mensajeTexto = "El juego ha termindo, intentalo nuevamente";
      }
      this.jugando = false;
    },
    reiniciar() {
      this.pokemons = Array(3).fill({
        imagen: "https://via.placeholder.com/250",
      });
      this.mostrarNombres = false;
      this.puntos = 0;
      this.intentos = 0;
      this.jugando = false;
      this.juegoTerminado = false;
      this.tipoMensaje = "";
      this.mensajeTitulo = "";
      this.mensajeTexto = "";
    },
  },
};
</script>

<style scoped>
.container {
  text-align: center;
}
.estadisticas {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin: 20px 0;
}
.imagenes {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
}

.imagen-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.imagen-pokemon {
  width: 250px;
  height: 250px;
  background-color: rgba(158, 156, 156, 0.158);
  border: 2px solid black;
}
.btn-jugar,
.btn-nuevo {
  padding: 10px 30px;
  margin-top: 15px;
  cursor: pointer;
  border: 4px solid black;
  font-size: 20px;
  width: 200px;
}

.mensaje {
  margin-top: 20px;
  padding: 15px;
}

.ganador {
  color: blue;
  border: 2px solid black;
  font-size: 20px;
}

.perdedor {
  color: red;
  border: 2px solid black;
  font-size: 20px;
}
</style>
