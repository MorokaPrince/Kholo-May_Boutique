#!/bin/bash
# Azure Web App startup script for Next.js

echo "Starting Kholo-May Boutique..."

# Set environment
export NODE_ENV=production
export PORT=${PORT:-3000}
export HOSTNAME=${HOSTNAME:-0.0.0.0}

# Navigate to app directory
cd /home/site/wwwroot

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install --production
fi

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Run database migrations (optional - comment out if not needed)
# npx prisma migrate deploy

# Start the application
echo "Starting Next.js server..."
exec node server.js
