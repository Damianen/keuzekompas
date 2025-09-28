#!/bin/bash

# Deploy Keuzekompas with Traefik Load Balancer
set -e

echo "🚀 Deploying Keuzekompas with Traefik..."

# Check if environment file exists
if [ ! -f .env ]; then
    echo "❌ Environment file (.env) not found!"
    echo "📝 Please copy .env.traefik.example to .env and configure your settings:"
    echo "   cp .env.traefik.example .env"
    echo "   # Edit .env with your configuration"
    exit 1
fi

# Check if required environment variables are set
source .env
required_vars=("DOMAIN_NAME" "GITHUB_REPOSITORY" "MONGO_URI" "JWT_SECRET")

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Required environment variable $var is not set in .env file"
        exit 1
    fi
done

# Update email in traefik.yml if ACME_EMAIL is set
if [ ! -z "$ACME_EMAIL" ]; then
    sed -i "s/your-email@example.com/$ACME_EMAIL/g" traefik.yml
    echo "✅ Updated Let's Encrypt email to: $ACME_EMAIL"
fi

# Pull latest images
echo "📦 Pulling latest Docker images..."
docker-compose -f docker-compose.vps.yml pull

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.vps.yml down

# Start services
echo "🚀 Starting services with Traefik..."
docker-compose -f docker-compose.vps.yml up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Check service status
echo "📊 Service Status:"
docker-compose -f docker-compose.vps.yml ps

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your application should be available at:"
echo "   - Main site: https://$DOMAIN_NAME"
echo "   - Traefik dashboard: https://traefik.$DOMAIN_NAME (admin:admin - change this!)"
echo ""
echo "📈 Load balancing is configured with 2 API instances"
echo "🔒 SSL certificates will be automatically provisioned by Let's Encrypt"
echo ""
echo "💡 To scale API instances:"
echo "   docker-compose -f docker-compose.vps.yml up -d --scale api-1=3 --scale api-2=3"