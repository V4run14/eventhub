# Build and run the React development server
FROM node:20-alpine

WORKDIR /app

# Install dependencies based on lockfile for reproducible builds
COPY frontend/package*.json ./
RUN npm ci

# Copy the rest of the frontend source
COPY frontend/ ./

# The React dev server listens on 0.0.0.0:3000
EXPOSE 3000

# Enable polling so hot-reload works when running in Docker on all platforms
ENV CHOKIDAR_USEPOLLING=true

CMD ["npm", "start"]
