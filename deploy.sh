#!/bin/bash
# scripts/deploy.sh

set -e

echo "🚀 Starting deployment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    echo "Please create a .env file based on .env.example"
    exit 1
fi

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

echo -e "${BLUE}📦 Pulling latest Docker images...${NC}"
docker compose pull

echo -e "${BLUE}🛑 Stopping old containers...${NC}"
docker compose down

echo -e "${BLUE}🗑️  Removing old images...${NC}"
docker image prune -af

echo -e "${BLUE}🔨 Building and starting containers...${NC}"
docker compose up -d --build

echo -e "${BLUE}⏳ Waiting for services to be healthy...${NC}"
sleep 30

echo -e "${BLUE}🔍 Checking container status...${NC}"
docker compose ps

echo -e "${BLUE}🏥 Running health checks...${NC}"

# Check backend health
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is healthy${NC}"
else
    echo -e "${RED}❌ Backend health check failed${NC}"
    docker compose logs backend
    exit 1
fi

# Check frontend health
if curl -f http://localhost > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is healthy${NC}"
else
    echo -e "${RED}❌ Frontend health check failed${NC}"
    docker compose logs frontend
    exit 1
fi

# Check MongoDB health
if docker compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ MongoDB is healthy${NC}"
else
    echo -e "${RED}❌ MongoDB health check failed${NC}"
    docker compose logs mongodb
    exit 1
fi

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${BLUE}📊 Application is running at:${NC}"
echo -e "   Frontend: http://localhost"
echo -e "   Backend:  http://localhost:5000"
echo -e "   MongoDB:  mongodb://localhost:27017"

# Show logs
echo -e "\n${BLUE}📝 Recent logs:${NC}"
docker compose logs --tail=20