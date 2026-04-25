# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Build Backend
FROM node:20-alpine AS backend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:server

# Stage 3: Production
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY --from=frontend-builder /app/dist ./dist
COPY --from=backend-builder /app/dist-server ./dist-server
ENV PORT=3000
ENV APP_ENV=production
CMD ["npm", "run", "start"]
