# ── Etapa 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

# Instala pnpm globalmente
RUN npm install -g pnpm@10

WORKDIR /app

# Copia manifiestos primero para aprovechar la caché de capas
COPY package.json pnpm-lock.yaml ./

# Instala dependencias (solo producción + devDeps necesarias para el build)
RUN pnpm install --frozen-lockfile

# Copia el resto del código fuente
COPY . .

# Genera el build de producción (salida en /app/dist)
RUN pnpm build

# ── Etapa 2: Servidor ───────────────────────────────────────────────────────
FROM nginx:stable-alpine AS server

# Elimina la config por defecto de nginx
RUN rm /etc/nginx/conf.d/default.conf

# Config mínima para SPA (Vue Router en modo history)
COPY <<'NGINX' /etc/nginx/conf.d/app.conf
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    # Sirve assets estáticos con caché larga
    location ~* \.(?:js|css|png|jpg|jpeg|gif|svg|ico|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Fallback para Vue Router (history mode)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
NGINX

# Copia el build de la etapa anterior
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]