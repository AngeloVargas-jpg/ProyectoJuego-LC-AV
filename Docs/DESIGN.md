# Diseño del Juego

## Mockups

### Menú
![Menú](Mockups/Menu%20Inicial.png)

### Juego
![Juego](Mockups/Durante%20el%20juego.png)
![Juego](Mockups/Tienda.png)

### Resultado
![Resultado](Mockups/Ganar%20juego.png)
![Resultado](Mockups/Perder%20juego.png)

---

## Especificaciones de tecnología

### Framework elegido: Vue
Elegimos este framework descartando React y Angular ya que existe una leve experiencia en el uso de este, encontrando a este framework más sencillo y simple para implementar en nuestro proyecto. React suele ser más tedioso y formal aunque puede lograr el mismo resultado esperado; se inclinó por Vue más por un tema de comodidad.

---

## Stack tecnológico

### Frontend
- **Vue 3** — Framework principal
- **Vite** — Entorno de desarrollo y compilación
- **Pinia** — Manejo del estado global del juego
- **Vue Router** — Navegación entre vistas
- **Socket.io-client** — Comunicación en tiempo real con el servidor

### Backend
- **Node.js** — Entorno de ejecución del servidor
- **Express** — Framework para construir la API REST
- **Socket.io** — Comunicación en tiempo real para el modo multijugador
- **MongoDB** — Base de datos NoSQL para persistir cuentas de usuario, historial de partidas y estadísticas
- **Mongoose** — ODM para modelar los datos de MongoDB en Node.js
- **JWT (JSON Web Token)** — Autenticación stateless del usuario
- **bcrypt** — Encriptación de contraseñas antes de guardarlas en la base de datos
- **cookie-parser** — Manejo de cookies httpOnly para guardar el token JWT de forma segura

### Herramientas de desarrollo
- **pnpm** — Gestor de paquetes
- **Vitest** — Framework de testing
- **ESLint** — Linter de código
- **Prettier** — Formateo de código
- **@vue/test-utils** — Utilidades de testing para Vue

> Nota: Se evaluaron dependencias como GSAP (animaciones) y Howler.js (audio), pero se descartaron por no ser necesarias dado el alcance del proyecto. El audio se implementó con la Web Audio API nativa del navegador.

> **Importante — qué se guarda y qué no:** las fichas (dinero) y los objetos (cargas, desbloqueos premium) son parte del estado de **una partida en curso** y se reinician por completo cada vez que se inicia una partida nueva; nunca se escriben en MongoDB. Lo único que persiste en la cuenta del usuario son sus credenciales y sus estadísticas históricas (victorias y derrotas totales).

---

## Estructura de carpetas

```
ProyectoJuego-LC-AV/
├── index.html
├── package.json
├── pnpm-lock.yaml
├── vite.config.js
├── dockerfile
├── .gitignore
├── .dockerignore
├── .prettierrc
├── eslint.config.js
│
├── .github/
│   └── workflows/
│       └── Main.yml
│
├── Docs/
│   ├── DESIGN.md
│   ├── Planning.md
│   └── Mockups/
│       ├── Menu Inicial.png
│       ├── Durante el juego.png
│       ├── Tienda.png
│       ├── Ganar juego.png
│       └── Perder juego.png
│
├── Test/
│   └── gameStore.test.js
│
├── src/                          ← Frontend (Vue)
│   ├── App.vue
│   ├── main.js
│   │
│   ├── assets/
│   │   ├── Images/
│   │   └── audio/
│   │
│   ├── components/
│   │   ├── Card.vue
│   │   ├── GameTable.vue
│   │   ├── PlayerUI.vue
│   │   ├── ScreenDisplay.vue
│   │   ├── ObjetosModal.vue
│   │   └── TiendaModal.vue
│   │
│   ├── views/
│   │   ├── MenuView.vue
│   │   ├── GameView.vue
│   │   └── LoginView.vue         ← nuevo
│   │
│   ├── store/
│   │   └── gameStore.js
│   │
│   └── router/
│       └── index.js
│
└── server/                       ← Backend (Node.js + Express)
    ├── index.js                  ← entrada del servidor
    ├── socket.js                 ← lógica de Socket.io (salas, turnos, Singleplayer y PvP)
    │
    ├── routes/
    │   ├── auth.routes.js        ← /api/auth/login, /api/auth/register, /api/auth/logout
    │   └── user.routes.js        ← /api/user/profile, /api/user/stats
    │
    ├── controllers/
    │   ├── auth.controller.js    ← lógica de login y registro
    │   └── user.controller.js    ← lógica de perfil y estadísticas
    │
    ├── models/
    │   ├── User.js               ← modelo de usuario en MongoDB (sin fichas ni objetos)
    │   └── Game.js                ← historial de partidas terminadas en MongoDB
    │
    ├── game/                      ← nuevo: lógica de una partida en curso (vive en memoria, no en Mongo)
    │   ├── GameEngine.js          ← reparto, turnos, puntajes, fichas y objetos de la partida actual
    │   ├── CrupierBot.js          ← IA del Crupier para el modo Singleplayer
    │   └── Deck.js                ← mazo de cartas
    │
    ├── data/                      ← nuevo: catálogo estático de objetos (no cambia entre partidas)
    │   └── items.js               ← Pistola, Comodín, Copa de Vino, Jeringa, Encendedor, Puro
    │
    └── middleware/
        └── auth.middleware.js    ← verifica el JWT en cada petición protegida
```

---

## Endpoints de la API

### Autenticación (`/api/auth`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registra un nuevo usuario |
| POST | `/api/auth/login` | Inicia sesión, devuelve JWT en cookie httpOnly |
| POST | `/api/auth/logout` | Cierra sesión, elimina la cookie |

### Usuario (`/api/user`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/user/profile` | Devuelve datos del usuario autenticado |
| GET | `/api/user/stats` | Devuelve victorias y derrotas totales acumuladas en su historial |

> No existen endpoints REST para fichas, objetos ni tienda: todo eso ocurre dentro de una partida en curso a través de Socket.io (ver más abajo), porque es estado temporal que no necesita guardarse.

---

## Autenticación: JWT + Cookie httpOnly

El flujo de autenticación funciona así:

1. El usuario manda usuario y contraseña a `POST /api/auth/login`
2. El servidor verifica la contraseña con **bcrypt**
3. Si es correcta, genera un **JWT** firmado con una clave secreta
4. El JWT se guarda en una **cookie httpOnly** — el navegador la manda automáticamente en cada petición pero el código JS no puede leerla, protegiéndola contra ataques XSS
5. En cada petición protegida, el **middleware** verifica que el JWT sea válido
6. Al hacer logout, el servidor elimina la cookie

---

## Modelos de MongoDB

### User
```js
{
  username: String,      // nombre de usuario único
  password: String,      // contraseña encriptada con bcrypt
  victorias: Number,     // partidas completas ganadas (histórico de la cuenta)
  derrotas: Number,      // partidas completas perdidas (histórico de la cuenta)
  createdAt: Date
}
// dinero y objetos NO se guardan aquí: se reinician en cada partida nueva
```

### Game
```js
{
  modo: String,           // "singleplayer" o "pvp"
  players: [userId],      // jugadores de la partida (1 humano + bot, o 2 humanos)
  winner: userId,         // ganador
  scores: {
    player1: Number,      // rondas ganadas
    player2: Number
  },
  duration: Number,        // duración en segundos
  createdAt: Date
}
// Solo guarda el resultado final. Las fichas y objetos usados durante
// la partida no se incluyen porque desaparecen al terminar.
```

---

## Multijugador con Socket.io

Socket.io maneja toda la partida en curso: tanto Singleplayer como PvP usan el mismo flujo de eventos. En Singleplayer, el servidor crea la sala y simula al segundo "jugador" con `CrupierBot.js` (no hay un segundo socket real); en PvP, ambos lados son jugadores humanos conectados.

```
Cliente A                    Servidor                    Cliente B / CrupierBot
    │                           │                           │
    │── join_room ─────────────>│                           │
    │                           │<────────────── join_room ─│   (o el bot, automático)
    │                           │── room_ready ────────────>│
    │<─────────────── room_ready│                           │
    │                           │                           │
    │                           │ fichas (1000) y objetos   │
    │                           │ se inicializan en memoria │
    │                           │                           │
    │── player_action ─────────>│── game_state ────────────>│
    │<─────────────── game_state│                           │
    │── buy_item ───────────────>│── game_state ────────────>│
```

### Eventos principales
| Evento | Dirección | Descripción |
|--------|-----------|-------------|
| `join_room` | Cliente → Servidor | Jugador entra a una sala (Singleplayer crea una con el bot; PvP empareja con otro jugador) |
| `room_ready` | Servidor → Clientes | Sala lista; el servidor inicializa fichas (1000) y objetos en memoria y comienza la partida |
| `player_action` | Cliente → Servidor | Jugador pide carta, se planta, apuesta o usa un objeto |
| `buy_item` | Cliente → Servidor | Jugador compra una carga de objeto usando las fichas de la partida actual |
| `game_state` | Servidor → Clientes | Estado actualizado del juego (fichas, objetos e inventario vigentes de esa partida) |
| `game_over` | Servidor → Clientes | Fin de partida: resultado final; fichas y objetos de esa partida se descartan |

---

## Entorno de Desarrollo
Visual Studio Code

---

## Descripción del juego

### Nombre: Contrato 21: El pacto de sangre
"Contrato 21: El pacto de sangre" es un juego de cartas basado en el clásico blackjack, con una estética tenebrosa/industrial. En el modo **Singleplayer** te enfrentarás al "Crupier", una calavera robótica que busca eliminarte; en el modo **PvP** te enfrentarás a otro jugador real. En ambos casos apuestas fichas para multiplicar tu dinero durante la partida y comprar los objetos que te proporciona la mesa para sacar ventaja — fichas y objetos son exclusivos de cada partida y comienzan de cero cada vez que juegas.

---

## Mecánica

### Blackjack base
Se reparten dos cartas tanto al jugador como al rival (Crupier en Singleplayer, otro jugador en PvP). Una carta de cada uno permanece oculta para el otro. El objetivo es acercarse lo más posible a 21 sin pasarse.

### Objetos especiales

| Objeto | Tipo | Efecto |
|--------|------|--------|
| Pistola | Estándar | 50% de sumar o restar 5 puntos al total propio o del rival. Parte con 1 bala. |
| Comodín | Estándar | Suma o resta una cantidad aleatoria entre 1 y 13. Se elige la acción. |
| Copa de Vino | Estándar | Devuelve la última carta pedida al mazo. |
| Jeringa | Premium | Congela al rival: no roba carta en su próximo turno. |
| Encendedor | Premium | Quema la carta más perjudicial de tu mano. |
| Puro | Premium | Revela la carta oculta del rival. |

Los objetos estándar están disponibles desde el inicio de cada partida. Los objetos premium requieren un desbloqueo único de 1000 $ antes de poder comprarse o usarse **dentro de esa partida**: como las fichas y objetos no se guardan, este desbloqueo hay que volver a pagarlo cada vez que se empieza una partida nueva.

### Mecánica de apuestas
- Jugador y rival parten con 1000 fichas al iniciar cada partida (sin importar lo que se haya ganado o perdido en partidas anteriores)
- Apuesta mínima por turno: 50 fichas
- El jugador puede apostar la mínima, subir la apuesta o negarla
- Negar la apuesta bloquea el uso de todos los objetos ese turno
- En Singleplayer, el Crupier tiene fondos ilimitados; en PvP ambos jugadores apuestan con sus propias 1000 fichas iniciales, sin fondos ilimitados
- Al inicio de cada nuevo turno de apuestas el jugador recibe +25 fichas

---

## Flujo de juego

```
1. Login / Registro
   └── El usuario se autentica; se cargan solo sus credenciales y estadísticas históricas

2. Selección de modo
   ├── Singleplayer  → el servidor crea una sala con el CrupierBot
   └── PvP           → el servidor empareja con otro jugador

3. Inicio de partida
   └── Se reparten 2 cartas a cada uno (1 oculta, 1 visible)
       y las fichas (1000) y objetos se inicializan desde cero en memoria

4. Fase de apuestas
   ├── Apostar (mínimo 50 $)  →  objetos disponibles, y se puede comprar en la tienda
   └── Negar apuesta          →  objetos bloqueados ese turno

5. Turno del jugador
   ├── Pedir carta
   ├── Plantarse
   └── Usar objeto

6. Turno del rival
   ├── Singleplayer: el CrupierBot pide carta si su puntaje < 17, se planta si ≥ 17
   └── PvP: el otro jugador juega su turno igual que el paso 5

7. Resolución
   └── El más cercano a 21 sin pasarse gana la ronda
       ├── Ganador se lleva el pozo de apuestas (fichas de esa partida)
       └── Se suma 1 victoria al contador de rondas de esa partida

8. Nueva ronda (repite desde el paso 4) hasta que alguien llegue a 5 victorias

9. Fin de partida
   └── Se guarda en MongoDB solo el resultado final (modo, ganador, marcador, duración)
       y se actualizan victorias/derrotas de la cuenta; las fichas y objetos de
       esa partida se descartan por completo
```

---

## Condición de victoria

Gana la partida completa quien llegue primero a 5 victorias de ronda.

- Jugador 5 – Rival 3 → Gana el jugador
- Jugador 5 – Rival 0 → Gana el jugador
- Jugador 4 – Rival 4 → Continúa

En caso de empate en una ronda, la apuesta se anula y no se suma victoria a ninguno. Si ambos jugadores superan 21, gana el más cercano al número.

Al terminar la partida completa, el marcador, las fichas y los desbloqueos de objetos desaparecen junto con la partida — nunca se guardaron en la base de datos. Lo único que queda registrado es el resultado final (modo, ganador, marcador y duración) en la colección `Game`, y el conteo de victorias/derrotas en la cuenta del jugador.
