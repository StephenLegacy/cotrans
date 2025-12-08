#!/bin/bash

echo "🚀 Starting Cotrans deployment..."

# Load environment variables (optional)
export NODE_ENV=production

# BACKEND
echo "📦 Updating backend..."
cd /var/www/cotrans/Backend
git pull origin main
npm install
pm2 restart cotrans-backend

# FRONTEND
echo "🌐 Updating frontend..."
cd /var/www/cotrans/Frontend
git pull origin main
npm install
npm run build

echo "🔁 Reloading Nginx..."
sudo systemctl reload nginx

echo "✨ Deployment completed successfully!"
