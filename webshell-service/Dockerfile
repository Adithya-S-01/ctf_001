FROM node:18-alpine

# Install Docker CLI and required tools
RUN apk add --no-cache \
    docker \
    docker-compose \
    curl \
    bash \
    git \
    openssh-client \
    && rm -rf /var/cache/apk/*

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S webshell -u 1001

# Change ownership of the app directory
RUN chown -R webshell:nodejs /usr/src/app
USER webshell

# Expose port
EXPOSE 6000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:6000/health || exit 1

# Start the application
CMD [ "node", "server.js" ]