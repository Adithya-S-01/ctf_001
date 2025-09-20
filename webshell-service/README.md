# Webshell Service

Docker-based webshell terminal service for CTF challenges.

## Components

- **webshell-service**: Node.js service that manages Docker containers
- **kali-webshell**: Kali Linux container with CTF tools and web terminal

## Local Development

```bash
# Build and run all services
docker-compose up --build

# Test the service
curl http://localhost:6000/health
```

## Deployment to Azure

This service requires:
- Azure Container Instances with Docker support
- Or Azure Container Apps
- Access to Docker socket for container management

## Environment Variables

- `JWT_SECRET`: JWT secret for authentication
- `PORT`: Service port (default: 6000)
- `FRONTEND_URL`: Frontend URL for CORS

## API Endpoints

- `GET /health` - Health check
- `POST /api/webshell/start` - Start webshell container
- `POST /api/webshell/stop` - Stop webshell container