# ── Etapa 1: build ────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependencias primero (mejor caché de Docker)
COPY package*.json ./
RUN npm install

# Copiar código fuente y construir
COPY . .
RUN npm run build

# ── Etapa 2: servidor estático ────────────────────────────────────────
FROM nginx:1.27-alpine

# Copiar el build al directorio de nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx (SPA routing + proxy)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
