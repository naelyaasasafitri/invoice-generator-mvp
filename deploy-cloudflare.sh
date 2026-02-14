#!/bin/bash

# Cloudflare Pages Deployment Script
# This script automates deployment to Cloudflare Pages

set -e

echo "🚀 Deploying Invoice Generator MVP to Cloudflare Pages..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Use npx to run wrangler
WRANGLER_CMD="npx wrangler"

# Check if user is logged in
if ! $WRANGLER_CMD whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Cloudflare${NC}"
    echo "Please login:"
    $WRANGLER_CMD login
fi

# Step 1: Install dependencies
echo -e "${GREEN}📦 Installing dependencies...${NC}"
npm install

# Step 2: Build the project
echo -e "${GREEN}🔨 Building project...${NC}"
npm run build

# Step 3: Check if D1 database exists
echo ""
echo -e "${GREEN}🗄️  Checking D1 database...${NC}"
DB_EXISTS=$($WRANGLER_CMD d1 list 2>/dev/null | grep -o "invoice_db" || true)

if [ -z "$DB_EXISTS" ]; then
    echo -e "${YELLOW}⚠️  D1 database not found, creating...${NC}"
    $WRANGLER_CMD d1 create invoice_db
    echo -e "${GREEN}✅ Database created. Please update database_id in wrangler.toml${NC}"
    echo "Run: npx wrangler d1 list"
    echo "Copy the database_id and update wrangler.toml"
    exit 0
fi

# Step 4: Deploy to Cloudflare Pages
echo ""
echo -e "${GREEN}🌐 Deploying to Cloudflare Pages...${NC}"
$WRANGLER_CMD pages deploy .output

echo ""
echo -e "${GREEN}✅ Deployment successful!${NC}"
echo "Visit your site at the URL shown above"
echo ""
echo "📝 Next steps:"
echo "  - Set up custom domain in Cloudflare Dashboard"
echo "  - Configure environment variables if needed"
echo "  - Set up analytics and monitoring"
