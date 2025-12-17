# Cotrans Global - Docker CI/CD Setup

Complete guide to set up and deploy the Cotrans Global application using Docker and CI/CD.

## 📋 Prerequisites

- Docker Engine 24.0+ and Docker Compose v2.20+
- Node.js 18+ (for local development)
- Git
- A server with SSH access (for deployment)
- GitHub account (for CI/CD)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/cotrans-global.git
cd cotrans-global
```

### 2. Setup Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env with your actual values
nano .env
```

### 3. Create Required Files

Create the following file structure:

```
cotrans-global/
├── Backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── src/
│       └── routes/
│           └── healthRoutes.js
├── Frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── nginx.conf
├── nginx/
│   └── nginx.conf
├── scripts/
│   └── deploy.sh
├── .github/
│   └── workflows/
│       └── deploy.yml
├── docker-compose.yml
└── .env
```

### 4. Build and Run Locally

```bash
# Build and start all services
docker compose up -d --build

# View logs
docker compose logs -f

# Check status
docker compose ps
```

### 5. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017
- **Health Check**: http://localhost:5000/api/health

## 🔧 Development Workflow

### Local Development

```bash
# Start services in development mode
docker compose up

# Rebuild a specific service
docker compose up -d --build backend

# View logs for a specific service
docker compose logs -f frontend

# Execute commands in a container
docker compose exec backend npm run seed
docker compose exec mongodb mongosh
```

### Testing

```bash
# Run backend tests
cd Backend && npm test

# Run frontend tests
cd Frontend && npm test
```

## 🌐 Production Deployment

### Server Setup

1. **Install Docker on your server**:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER
```

2. **Clone repository on server**:

```bash
cd /opt
sudo git clone https://github.com/yourusername/cotrans-global.git
cd cotrans-global
```

3. **Setup environment**:

```bash
sudo cp .env.example .env
sudo nano .env  # Edit with production values
```

### GitHub Secrets Setup

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

```
SERVER_HOST=your.server.ip
SERVER_USERNAME=ubuntu
SSH_PRIVATE_KEY=<your-ssh-private-key>
SERVER_PORT=22
PRODUCTION_URL=https://cotransglobal.com
VITE_API_URL=https://api.cotransglobal.com/api
MONGO_ROOT_PASSWORD=<secure-password>
JWT_SECRET=<secure-jwt-secret>
RESEND_API_KEY=<your-resend-api-key>
```

### Manual Deployment

```bash
# Make deploy script executable
chmod +x scripts/deploy.sh

# Run deployment
./scripts/deploy.sh
```

### Automated Deployment

Push to main branch triggers automatic deployment:

```bash
git add .
git commit -m "Deploy new features"
git push origin main
```

## 📊 Monitoring & Maintenance

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend

# Last 100 lines
docker compose logs --tail=100
```

### Container Management

```bash
# Stop all services
docker compose down

# Stop and remove volumes
docker compose down -v

# Restart a service
docker compose restart backend

# Scale a service
docker compose up -d --scale backend=3
```

### Database Backup

```bash
# Backup MongoDB
docker compose exec mongodb mongodump --out=/data/backup

# Copy backup to host
docker cp cotrans-mongodb:/data/backup ./mongodb-backup-$(date +%Y%m%d)

# Restore MongoDB
docker compose exec -T mongodb mongorestore /data/backup
```

### Health Checks

```bash
# Check all container health
docker compose ps

# Test API health
curl http://localhost:5000/api/health

# Test frontend
curl http://localhost
```

## 🔐 Security Best Practices

1. **Use strong passwords** for MongoDB and JWT secrets
2. **Enable HTTPS** in production with Let's Encrypt
3. **Set up firewall** rules on your server
4. **Regularly update** Docker images and dependencies
5. **Use secrets management** for sensitive data
6. **Enable rate limiting** in production
7. **Monitor logs** for suspicious activity

### SSL/TLS Setup (Production)

```bash
# Install Certbot
sudo apt install certbot

# Get SSL certificate
sudo certbot certonly --standalone -d cotransglobal.com -d www.cotransglobal.com

# Copy certificates to nginx directory
sudo cp /etc/letsencrypt/live/cotransglobal.com/fullchain.pem ./nginx/ssl/
sudo cp /etc/letsencrypt/live/cotransglobal.com/privkey.pem ./nginx/ssl/

# Enable production nginx
docker compose --profile production up -d
```

## 🐛 Troubleshooting

### Container won't start

```bash
# Check logs
docker compose logs backend

# Verify environment variables
docker compose config

# Remove and rebuild
docker compose down -v
docker compose up -d --build
```

### Database connection issues

```bash
# Check MongoDB logs
docker compose logs mongodb

# Test MongoDB connection
docker compose exec mongodb mongosh --eval "db.adminCommand('ping')"

# Verify network
docker network ls
docker network inspect cotrans-network
```

### Port conflicts

```bash
# Check what's using the port
sudo lsof -i :5000
sudo lsof -i :80

# Stop conflicting service
sudo systemctl stop nginx  # if nginx is running outside Docker
```

### Out of disk space

```bash
# Clean up Docker
docker system prune -a --volumes

# Check disk usage
df -h
docker system df
```

## 📈 Performance Optimization

### Production Optimizations

1. **Enable Gzip compression** (already configured in nginx)
2. **Use CDN** for static assets
3. **Implement caching** strategies
4. **Monitor resource usage**
5. **Scale horizontally** when needed

### Resource Limits

```yaml
# Add to docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

## 🔄 Update Workflow

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker compose up -d --build

# Or use the deploy script
./scripts/deploy.sh
```

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Email: admin@cotransglobal.com

## 📝 License

Copyright © 2025 Cotrans Global. All rights reserved.