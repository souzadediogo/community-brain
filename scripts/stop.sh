#!/bin/bash

# Community Brain - Stop Development Environment

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}===========================================
Community Brain - Stopping Services
===========================================${NC}\n"

cd infrastructure/docker

case "$1" in
    "")
        # Stop all services
        docker compose down
        echo -e "\n${GREEN}✓ All services stopped${NC}"
        ;;
    "--clean"|"-c")
        # Stop and remove volumes (clean slate)
        echo -e "${BLUE}This will remove all data (database, vector store, etc.)${NC}"
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker compose down -v
            echo -e "\n${GREEN}✓ All services stopped and data volumes removed${NC}"
        else
            echo -e "\n${BLUE}Cancelled.${NC}"
        fi
        ;;
    *)
        echo -e "${BLUE}Usage: $0 [option]${NC}"
        echo -e "  (no option)     Stop all services"
        echo -e "  -c, --clean     Stop all services and remove volumes (clean slate)"
        exit 1
        ;;
esac
