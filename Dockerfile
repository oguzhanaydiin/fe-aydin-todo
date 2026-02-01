# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Build arguments for environment variables
ARG VUE_APP_AYDIN_TODO_API_URL
ARG VUE_APP_AYDIN_TODO_API_USERNAME
ARG VUE_APP_AYDIN_TODO_API_PASSWORD

# Set environment variables for build
ENV VUE_APP_AYDIN_TODO_API_URL=$VUE_APP_AYDIN_TODO_API_URL
ENV VUE_APP_AYDIN_TODO_API_USERNAME=$VUE_APP_AYDIN_TODO_API_USERNAME
ENV VUE_APP_AYDIN_TODO_API_PASSWORD=$VUE_APP_AYDIN_TODO_API_PASSWORD

# Copy package files
COPY package*.json ./

# Install dependencies (ci is faster and more reliable)
RUN npm ci --ignore-scripts

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage with nginx (very small ~25MB)
FROM nginx:alpine AS production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
