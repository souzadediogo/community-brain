#!/bin/bash

# Community Brain - Development Environment Starter
# This script starts all services with Docker Compose

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}===========================================
Community Brain - Starting Development Environment
===========================================${NC}\n"

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  No .env file found. Copying from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env file. Please update it with your API keys.${NC}\n"
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Docker is not running. Please start Docker Desktop first.${NC}"
    exit 1
fi

echo -e "${BLUE}Starting services with Docker Compose...${NC}\n"

# Change to docker directory and start services
cd infrastructure/docker

# Start services based on argument
case "$1" in
    "")
        # Start all services in foreground
        docker compose up
        ;;
    "-d"|"--detached")
        # Start all services in background
        docker compose up -d
        echo -e "\n${GREEN}✓ All services started in detached mode${NC}\n"
        echo -e "${BLUE}Access the application:${NC}"
        echo -e "  Frontend:        ${GREEN}http://localhost:3000${NC}"
        echo -e "  API Gateway:     ${GREEN}http://localhost:4000${NC}"
        echo -e "  Community:       ${GREEN}http://localhost:4001${NC}"
        echo -e "  Assistant:       ${GREEN}http://localhost:5000${NC}"
        echo -e "  Evaluation:      ${GREEN}http://localhost:5001${NC}"
        echo -e "  RabbitMQ UI:     ${GREEN}http://localhost:15672${NC} (guest/guest)"
        echo -e "\n${BLUE}View logs:${NC}"
        echo -e "  docker compose logs -f [service-name]"
        echo -e "\n${BLUE}Stop all services:${NC}"
        echo -e "  ./scripts/stop.sh"
        ;;
    "infra"|"--infrastructure")
        # Start only infrastructure services
        docker compose up -d postgres qdrant rabbitmq
        echo -e "\n${GREEN}✓ Infrastructure services started${NC}"
        echo -e "  PostgreSQL: localhost:5432"
        echo -e "  Qdrant:     localhost:6333"
        echo -e "  RabbitMQ:   localhost:5672 (UI: http://localhost:15672)"
        ;;
    "logs")
        # Show logs
        docker compose logs -f
        ;;
    *)
        echo -e "${YELLOW}Usage: $0 [option]${NC}"
        echo -e "  (no option)          Start all services in foreground"
        echo -e "  -d, --detached       Start all services in background"
        echo -e "  infra                Start only infrastructure (postgres, qdrant, rabbitmq)"
        echo -e "  logs                 Show logs for all services"
        exit 1
        ;;
esac
