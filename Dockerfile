# 1) Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build static web export (Expo SDK 54)
RUN npx expo export --platform web

# 2) Runtime stage
FROM nginx:stable-alpine AS runner

# Copy exported files to Nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: custom nginx.conf (for SPA routing)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
