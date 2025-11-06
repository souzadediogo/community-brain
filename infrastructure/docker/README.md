# Docker Infrastructure

Docker Compose configurations for running the entire application stack locally.

## Files
- `docker-compose.yml` - Main compose file with all services and infrastructure

## Services Included

### Application Services
- **Frontend** - Next.js 14 (port 3000)
- **API Gateway** - Node.js/Express (port 4000)
- **Community Service** - Node.js/Express (port 4001)
- **Assistant Service** - Python/FastAPI (port 5000)
- **Evaluation Service** - Python/FastAPI (port 5001)

### Infrastructure Services
- **PostgreSQL 15** - Database (port 5432)
- **Qdrant** - Vector database (port 6333)
- **RabbitMQ** - Message queue (port 5672, management UI 15672)

## Usage

```bash
# Start all services
docker-compose up

# Start in detached mode
docker-compose up -d

# Start specific services
docker-compose up postgres qdrant rabbitmq

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```
