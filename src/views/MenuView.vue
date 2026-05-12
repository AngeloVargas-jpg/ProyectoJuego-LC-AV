<template>
  <div class="menu-container">
    <header class="header">
      <h1 class="title">Contrato 21</h1>
      <h2 class="subtitle">El Pacto de Sangre</h2>
    </header>

    <div class="button-group">
      <button @click="iniciarJuego" class="btn btn-primary">
        Comenzar Partida
      </button>
      <button @click="toggleReglas" class="btn btn-secondary">
        {{ mostrarReglas ? 'Ocultar Reglas' : 'Ver Reglas' }}
      </button>
    </div>

    <div v-if="mostrarReglas" class="rules-box">
      <h3>Reglas del Pacto</h3>
      <p>El objetivo es vencer al crupier obteniendo un puntaje cercano a 21 sin pasarte.</p>
      <ul>
        <li><strong>Pedir:</strong> Solicitas una carta extra.</li>
        <li><strong>Quedarse:</strong> Plantas tu mano y cedes el turno al crupier.</li>
        <li>Si te pasas de 21, pierdes. El crupier pide hasta llegar a 17+.</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const mostrarReglas = ref(false)

const iniciarJuego = () => router.push('/juego')
const toggleReglas = () => { mostrarReglas.value = !mostrarReglas.value }
</script>

<style scoped>
.menu-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #1a1a2e;
  color: #ffffff;
  font-family: sans-serif;
  padding: 20px;
  box-sizing: border-box;
}
.title {
  font-size: 4rem;
  font-weight: bold;
  color: #e94560;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0;
}
.subtitle {
  font-size: 1.5rem;
  color: #a2a2bd;
  font-style: italic;
}
.button-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  max-width: 300px;
  margin-top: 40px;
}
.btn {
  padding: 15px 20px;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.btn-primary { background-color: #e94560; color: white; }
.btn-secondary { background-color: transparent; color: #e94560; border: 2px solid #e94560; }
.rules-box {
  margin-top: 30px;
  background-color: rgba(0,0,0,0.4);
  border-left: 4px solid #e94560;
  padding: 20px;
  max-width: 500px;
  border-radius: 0 8px 8px 0;
}
.rules-box h3 { color: #e94560; margin-top: 0; }
.rules-box ul { padding-left: 20px; line-height: 1.6; }
</style>