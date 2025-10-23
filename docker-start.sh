#!/bin/bash

# Docker Quick Start Script for ERP UI

echo "======================================"
echo "   ERP UI - Docker Quick Start"
echo "======================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Error: Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Parse command line arguments
ACTION=${1:-up}

case $ACTION in
    up)
        echo "Building and starting ERP UI container..."
        docker-compose up -d --build
        echo ""
        echo "Container started successfully!"
        echo "Access the application at: http://localhost:3000"
        echo ""
        echo "To view logs, run: docker-compose logs -f erp-ui"
        ;;
    down)
        echo "Stopping ERP UI container..."
        docker-compose down
        echo "Container stopped successfully!"
        ;;
    restart)
        echo "Restarting ERP UI container..."
        docker-compose restart
        echo "Container restarted successfully!"
        ;;
    logs)
        docker-compose logs -f erp-ui
        ;;
    build)
        echo "Building ERP UI image..."
        docker-compose build --no-cache
        echo "Build completed successfully!"
        ;;
    *)
        echo "Usage: $0 {up|down|restart|logs|build}"
        echo ""
        echo "Commands:"
        echo "  up       - Build and start the container (default)"
        echo "  down     - Stop and remove the container"
        echo "  restart  - Restart the container"
        echo "  logs     - View container logs"
        echo "  build    - Rebuild the Docker image"
        exit 1
        ;;
esac
