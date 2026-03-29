# Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json .npmrc ./
RUN npm ci
COPY . .
RUN npm run build

# Production
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package*.json .npmrc ./
RUN npm ci --omit=dev
EXPOSE 3000
CMD ["node", "dist/main"]
