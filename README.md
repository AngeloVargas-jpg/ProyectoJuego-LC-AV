# Contrato 21: El Pacto de Sangre 🃏💀

Juego de cartas basado en el Blackjack 21 con estética tenebrosa/industrial. Te enfrentás al **Crupier**, una calavera robótica, en rondas de apuestas usando cartas y objetos especiales. Gana quien primero logre 5 rondas consecutivas.

Desarrollado con **Vue 3 + Vite** como proyecto académico.

---

## 🐳 Jugar con Docker (recomendado)

No se necesita instalar Node.js ni dependencias. Solo Docker.

### 1. Instalar Docker Desktop

Descargar e instalar [Docker Desktop](https://www.docker.com/products/docker-desktop/) según su sistema operativo (Windows, macOS o Linux).

Verificar que esté funcionando:

```bash
docker --version
```

### 2. Clonar el repositorio

```bash
git clone https://github.com/AngeloVargas-jpg/ProyectoJuego-LC-AV.git
cd ProyectoJuego-LC-AV
```

### 3. Construir la imagen

```bash
docker build -t proyectojuego-lc-av .
```

> Este paso descarga las dependencias y genera el build de producción. Puede tardar unos minutos la primera vez.

### 4. Ejecutar el contenedor

```bash
docker run -p 8080:80 proyectojuego-lc-av
```

### 5. Abrir el juego

Abrir el navegador y entrar a:

```
http://localhost:8080
```

¡Listo! No se requiere ningún paso adicional.

---

## 💻 Jugar sin Docker (desarrollo local)

Si se prefiere correr el proyecto directamente con Node.js:

### Requisitos previos

- [Node.js LTS (v20 o superior)](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

Instalar pnpm con:

```bash
npm install -g pnpm
```

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/AngeloVargas-jpg/ProyectoJuego-LC-AV.git
cd ProyectoJuego-LC-AV

# 2. Instalar dependencias
pnpm install

# 3. Levantar el servidor de desarrollo
pnpm dev
```

Luego abrir el navegador en `http://localhost:5173`.

---

## 🎮 Cómo jugar

1. **Iniciar el juego** desde el menú principal.
2. **Realizar tu apuesta** (mínimo 50 fichas). Puedes subir la apuesta o negarla (al negar, pierdes el uso de objetos ese turno).
3. **Pedir carta** (`Pedir`) o conservar las que tienes (`Quedarse`). El objetivo es acercarte lo más posible a 21 sin pasarte.
4. **Usar objetos especiales** antes de pedir o quedarse para obtener ventajas sobre el Crupier.
5. **Comprar en la tienda** entre turnos usando tus fichas ganadas.
6. **Gana quien logre 5 victorias en el marcador** sobre el otro (ej: 4-5, 5-0).
7. Al terminar la partida completa, el marcador, el dinero y los objetos se reinician.

### Objetos especiales

| Objeto | Efecto |
|---|---|
| 🔫 Pistola | 50% de sumar o restar 5 al total propio o del Crupier |
| 🚬 Puro | 50% de elegir un nuevo límite que reemplaza el 21 |
| 💉 Jeringa | Ver la siguiente carta que saldrá de la baraja |
| 🃏 Comodín | Suma o resta una cantidad aleatoria entre 1 y 13 |
| 🍷 Copa de Vino | Devuelve la última carta que pediste |
| 🔥 Encendedor | 70% de ver la carta oculta del Crupier por el resto de la partida |

Cada objeto se puede cargar parcialmente por turno (probabilidad aleatoria) o comprar recargas en la tienda.

---

## 🛠️ Tecnologías

| Categoría | Tecnología |
|---|---|
| Framework | [Vue 3](https://vuejs.org/) |
| Bundler | [Vite](https://vitejs.dev/) |
| Estado global | [Pinia](https://pinia.vuejs.org/) |
| Ruteo | [Vue Router](https://router.vuejs.org/) |
| Animaciones | [GSAP](https://gsap.com/) |
| Audio | [Howler.js](https://howlerjs.com/) |
| Gestor de paquetes | [pnpm](https://pnpm.io/) |
| Tests | [Vitest](https://vitest.dev/) |
| Linter / Formato | [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) |
| Contenedor | Docker (multi-stage: Node build + Nginx) |
| CI/CD | [GitHub Actions](https://github.com/features/actions) |

---

## ⚙️ CI/CD

El pipeline de GitHub Actions corre automáticamente en cada push a `main` o `develop`:

```
Push → ESLint → Prettier → Vitest → Vite Build → Docker Build → Push a Docker Hub
```

El deploy a Docker Hub solo ocurre en pushes a `main`.

---

## 🧪 Scripts de desarrollo

```bash
pnpm dev          # Servidor de desarrollo (localhost:5173)
pnpm build        # Build de producción (genera /dist)
pnpm test         # Corre los tests con Vitest
pnpm lint         # Revisa el código con ESLint
pnpm format       # Formatea el código con Prettier
```

---

## 👥 Integrantes

- Luis Cea
- Angelo Vargas