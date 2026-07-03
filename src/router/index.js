import { createRouter, createWebHashHistory } from 'vue-router'

// Definición de las rutas del proyecto
// Se utiliza la carga perezosa (dynamic imports) para mejorar el rendimiento inicial
const routes = [
  {
    path: '/',
    name: 'Menu',
    // Esta ruta carga la vista principal del menú
    component: () => import('../views/MenuView.vue'),
  },
  {
    path: '/juego',
    name: 'Juego',
    // Esta ruta carga la mesa de juego donde ocurre el "pacto"
    component: () => import('../views/GameView.vue'),
  },
]

// Creación de la instancia del router
const router = createRouter({
  /**
   * createWebHashHistory:
   * Añade un '#' antes de la ruta (ej. index.html#/juego).
   * Es ideal para proyectos que no tienen un servidor configurado para
   * manejar Single Page Applications (SPA), evitando errores 404 al recargar.
   */
  history: createWebHashHistory(),
  routes,
})

export default router
