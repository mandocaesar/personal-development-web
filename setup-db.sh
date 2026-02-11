#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Setting up Personal Development Web Database${NC}\n"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running!${NC}"
    echo "Please start Docker Desktop and try again."
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}"

# Start PostgreSQL container
echo -e "\n${YELLOW}📦 Starting PostgreSQL container...${NC}"
docker compose up -d

# Wait for PostgreSQL to be ready
echo -e "\n${YELLOW}⏳ Waiting for PostgreSQL to be ready...${NC}"
timeout=30
counter=0
until docker compose exec postgres pg_isready -U devuser -d personal_dev_db > /dev/null 2>&1; do
    counter=$((counter + 1))
    if [ $counter -gt $timeout ]; then
        echo -e "${RED}❌ PostgreSQL failed to start within $timeout seconds${NC}"
        exit 1
    fi
    echo -n "."
    sleep 1
done

echo -e "\n${GREEN}✅ PostgreSQL is ready!${NC}"

# Generate Prisma Client
echo -e "\n${YELLOW}🔧 Generating Prisma Client...${NC}"
npm run db:generate

# Push database schema
echo -e "\n${YELLOW}📋 Pushing database schema...${NC}"
npm run db:push

# Seed database
echo -e "\n${YELLOW}🌱 Seeding database...${NC}"
npm run db:seed

echo -e "\n${GREEN}✨ Database setup complete!${NC}\n"
echo -e "${YELLOW}Login credentials:${NC}"
echo "  Admin:   admin@company.com / admin123"
echo "  Manager: manager@company.com / manager123"
echo -e "\n${YELLOW}Start the app:${NC}"
echo "  npm run dev"
echo -e "\n${YELLOW}View database:${NC}"
echo "  npm run db:studio"
