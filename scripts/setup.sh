#!/bin/bash
# scripts/setup.sh - Initial project setup script

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Cotrans Global - Project Setup      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed!${NC}"
    echo "Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! docker compose version &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed!${NC}"
    echo "Please install Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}"
echo ""

# Create required directories
echo -e "${BLUE}📁 Creating required directories...${NC}"
mkdir -p Backend/src/emails
mkdir -p Backend/uploads
mkdir -p Frontend/nginx
mkdir -p nginx/ssl
mkdir -p nginx/logs
mkdir -p scripts
mkdir -p .github/workflows

echo -e "${GREEN}✅ Directories created${NC}"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    
    if [ -f .env.example ]; then
        echo -e "${BLUE}📝 Creating .env from .env.example...${NC}"
        cp .env.example .env
        echo -e "${GREEN}✅ .env file created${NC}"
        echo -e "${YELLOW}⚠️  Please edit .env file with your actual values${NC}"
        echo ""
    else
        echo -e "${RED}❌ .env.example not found!${NC}"
        echo "Please create .env file manually"
        exit 1
    fi
else
    echo -e "${GREEN}✅ .env file exists${NC}"
    echo ""
fi

# Add health check route to backend
echo -e "${BLUE}🏥 Setting up health check endpoint...${NC}"
if [ ! -f Backend/src/routes/healthRoutes.js ]; then
    echo -e "${YELLOW}⚠️  Health check route not found. Please add it manually.${NC}"
else
    echo -e "${GREEN}✅ Health check endpoint ready${NC}"
fi
echo ""

# Make scripts executable
echo -e "${BLUE}🔧 Making scripts executable...${NC}"
chmod +x scripts/*.sh 2>/dev/null || true
echo -e "${GREEN}✅ Scripts are executable${NC}"
echo ""

# Install backend dependencies (if not using Docker only)
if [ "$1" != "--docker-only" ]; then
    echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
    if [ -f Backend/package.json ]; then
        cd Backend
        npm install
        cd ..
        echo -e "${GREEN}✅ Backend dependencies installed${NC}"
    fi
    echo ""

    echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
    if [ -f Frontend/package.json ]; then
        cd Frontend
        npm install
        cd ..
        echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
    fi
    echo ""
fi

# Build Docker images
echo -e "${BLUE}🐳 Building Docker images...${NC}"
docker compose build

echo -e "${GREEN}✅ Docker images built successfully${NC}"
echo ""

# Start services
echo -e "${BLUE}🚀 Starting services...${NC}"
docker compose up -d

echo -e "${GREEN}✅ Services started${NC}"
echo ""

# Wait for services to be ready
echo -e "${BLUE}⏳ Waiting for services to be healthy (30 seconds)...${NC}"
sleep 30

# Check health
echo -e "${BLUE}🔍 Checking service health...${NC}"
echo ""

# Check backend
if curl -f http://localhost:5000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is healthy${NC}"
else
    echo -e "${YELLOW}⚠️  Backend health check failed (may need more time)${NC}"
fi

# Check frontend
if curl -f http://localhost > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is healthy${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend health check failed (may need more time)${NC}"
fi

# Check MongoDB
if docker compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ MongoDB is healthy${NC}"
else
    echo -e "${YELLOW}⚠️  MongoDB health check failed (may need more time)${NC}"
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     🎉 Setup Complete! 🎉            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📊 Your application is running at:${NC}"
echo -e "   Frontend:  ${GREEN}http://localhost${NC}"
echo -e "   Backend:   ${GREEN}http://localhost:5000${NC}"
echo -e "   Health:    ${GREEN}http://localhost:5000/api/health${NC}"
echo ""
echo -e "${BLUE}📝 Next steps:${NC}"
echo "1. Edit .env file with your production values"
echo "2. Configure GitHub secrets for CI/CD"
echo "3. Set up SSL certificates for production"
echo "4. Review logs: docker compose logs -f"
echo ""
echo -e "${BLUE}🔧 Useful commands:${NC}"
echo "   View logs:     docker compose logs -f"
echo "   Stop services: docker compose down"
echo "   Restart:       docker compose restart"
echo "   Deploy:        ./scripts/deploy.sh"
echo ""
echo -e "${YELLOW}⚠️  Remember to:${NC}"
echo "   - Never commit .env file to Git"
echo "   - Use strong passwords for production"
echo "   - Enable HTTPS in production"
echo "   - Set up regular backups"
echo ""