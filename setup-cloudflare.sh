#!/bin/bash

# Cloudflare Setup & Deployment Script
# Interactive script to deploy Invoice Generator MVP to Cloudflare Pages

set -e

echo "🚀 Cloudflare Setup & Deployment"
echo "================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Use npx to run wrangler
WRANGLER_CMD="npx wrangler"

# Navigate to project directory
cd "$(dirname "$0")"

echo -e "${BLUE}This script will:${NC}"
echo "1. Install dependencies"
echo "2. Login to Cloudflare"
echo "3. Create D1 database"
echo "4. Run migrations"
echo "5. Build project"
echo "6. Deploy to Cloudflare Pages"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
fi

# Step 1: Install dependencies
echo ""
echo -e "${GREEN}📦 Step 1/6: Installing dependencies...${NC}"
npm install

# Step 2: Login to Cloudflare
echo ""
echo -e "${GREEN}🔐 Step 2/6: Login to Cloudflare${NC}"
if ! $WRANGLER_CMD whoami &> /dev/null; then
    echo "Opening browser for Cloudflare login..."
    $WRANGLER_CMD login
else
    echo -e "${YELLOW}✅ Already logged in${NC}"
fi

# Step 3: Create D1 database
echo ""
echo -e "${GREEN}🗄️  Step 3/6: Setting up D1 database${NC}"
DB_EXISTS=$($WRANGLER_CMD d1 list 2>/dev/null | grep -o "invoice_db" || true)

if [ -z "$DB_EXISTS" ]; then
    echo -e "${YELLOW}⚠️  D1 database not found, creating...${NC}"
    DB_INFO=$($WRANGLER_CMD d1 create invoice_db)
    echo "$DB_INFO"

    # Extract database_id from output
    DB_ID=$(echo "$DB_INFO" | grep -o 'database_id = "[^"]*"' | cut -d'"' -f2)

    if [ -n "$DB_ID" ]; then
        echo ""
        echo -e "${GREEN}✅ Database created with ID: $DB_ID${NC}"

        # Update wrangler.toml
        if [ -f "wrangler.toml" ]; then
            echo "Updating wrangler.toml..."
            sed -i.bak "s/database_id = \"your-database-id\"/database_id = \"$DB_ID\"/" wrangler.toml
            rm wrangler.toml.bak
            echo -e "${GREEN}✅ wrangler.toml updated${NC}"
        fi
    else
        echo -e "${RED}❌ Could not extract database_id${NC}"
        echo "Please update wrangler.toml manually with the database_id shown above"
        read -p "Press Enter to continue after updating wrangler.toml..."
    fi
else
    echo -e "${GREEN}✅ D1 database 'invoice_db' already exists${NC}"
fi

# Step 4: Run migrations
echo ""
echo -e "${GREEN}🔄 Step 4/6: Running database migrations...${NC}"
read -p "Run migrations now? (recommended) (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    $WRANGLER_CMD d1 execute invoice_db --remote --file=./api/db/d1-migrations/0001_initial.sql
    echo -e "${GREEN}✅ Migrations completed${NC}"
else
    echo -e "${YELLOW}⚠️  Skipping migrations${NC}"
    echo "Run manually later with: npx wrangler d1 execute invoice_db --remote --file=./api/db/d1-migrations/0001_initial.sql"
fi

# Step 5: Build project
echo ""
echo -e "${GREEN}🔨 Step 5/6: Building project...${NC}"
npm run build

# Step 6: Deploy
echo ""
echo -e "${GREEN}🌐 Step 6/6: Deploying to Cloudflare Pages...${NC}"
$WRANGLER_CMD pages deploy .output

# Done!
echo ""
echo -e "${GREEN}=================================${NC}"
echo -e "${GREEN}✅ Setup & Deployment Complete!${NC}"
echo -e "${GREEN}=================================${NC}"
echo ""
echo "📝 Next steps:"
echo "  1. Visit your Cloudflare Pages URL (shown above)"
echo "  2. Test the application"
echo "  3. Set up custom domain (optional)"
echo "  4. Configure environment variables if needed"
echo ""
echo "🔧 Useful commands:"
echo "  npx wrangler pages list              # List your Pages projects"
echo "  npx wrangler d1 execute invoice_db --remote --command='SELECT * FROM invoices'  # Query database"
echo "  npm run deploy:cloudflare            # Deploy updates"
echo ""
echo -e "${BLUE}Happy deploying! 🎉${NC}"
