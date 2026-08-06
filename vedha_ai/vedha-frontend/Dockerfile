# ── Build stage ──────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app

# Copy package descriptors
COPY package*.json ./
RUN npm ci

# Copy code and compile production assets
COPY . .
RUN npm run build

# ── Runtime stage ────────────────────────────────────────────
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy local Nginx configuration mapping router fallbacks
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
