#!/bin/bash

# Build and push Docker images to Azure Container Registry
# Usage: ./deploy-to-azure.sh your-registry-name

if [ $# -eq 0 ]; then
    echo "Usage: $0 <registry-name>"
    echo "Example: $0 myctfregistry"
    exit 1
fi

REGISTRY_NAME=$1
REGISTRY_URL="${REGISTRY_NAME}.azurecr.io"

echo "Building and pushing Docker images to ${REGISTRY_URL}..."

# Login to Azure Container Registry
az acr login --name $REGISTRY_NAME

# Build and push cookie-challenge
echo "Building cookie-challenge..."
docker build -t ${REGISTRY_URL}/cookie-challenge:latest ./cookie-challenge
docker push ${REGISTRY_URL}/cookie-challenge:latest

# Build and push unfiltered_ping
echo "Building unfiltered-ping..."
docker build -t ${REGISTRY_URL}/unfiltered-ping:latest ./unfiltered_ping
docker push ${REGISTRY_URL}/unfiltered-ping:latest

# Build and push web-challenge-1
echo "Building web-challenge-1..."
docker build -t ${REGISTRY_URL}/web-challenge-1:latest ./web-challenge-1
docker push ${REGISTRY_URL}/web-challenge-1:latest

echo "All images pushed successfully!"
echo ""
echo "Next steps:"
echo "1. Update azure-container-template.yaml with your registry URL: ${REGISTRY_URL}"
echo "2. Deploy using: az container create --resource-group your-rg --file azure-container-template.yaml"