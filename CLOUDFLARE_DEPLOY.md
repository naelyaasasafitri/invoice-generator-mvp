# Deploy to Cloudflare Pages

This guide will help you deploy the Invoice Generator MVP to Cloudflare Pages using D1 database.

## Prerequisites

1. Cloudflare account (free tier is sufficient)
2. Wrangler CLI installed
3. GitHub repository with your code

## Step 1: Install Wrangler CLI

```bash
npm install -g wrangler
```

## Step 2: Login to Cloudflare

```bash
wrangler login
```

This will open your browser to authenticate with Cloudflare.

## Step 3: Create D1 Database

```bash
# Create the database
wrangler d1 create invoice_db

# Copy the database_id from the output
```

Update `wrangler.toml` with the database_id:
```toml
[[d1_databases]]
binding = "DB"
database_name = "invoice_db"
database_id = "your-actual-database-id-here"  # Paste the ID here
```

## Step 4: Run Database Migrations

```bash
# Apply the migration to your D1 database
wrangler d1 execute invoice_db --remote --file=./api/db/d1-migrations/0001_initial.sql
```

## Step 5: Update Nuxt Config for Cloudflare

Update `nuxt.config.ts` to support Cloudflare Pages:

```typescript
export default defineNuxtConfig({
  // ... existing config ...

  nitro: {
    experimental: {
      openAPI: true,
    },
    cloudflare: {
      // Enable Cloudflare Pages support
      bindings: {
        DB: {
          type: 'd1',
          databaseId: 'your-database-id',
        },
      },
    },
  },
})
```

## Step 6: Deploy to Cloudflare Pages

### Option A: Using Wrangler (Recommended)

```bash
# Build the project
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy .output
```

### Option B: Using GitHub Integration

1. Push your code to GitHub
2. Go to Cloudflare Dashboard → Pages
3. Click "Create a project"
4. Select "Connect to Git"
5. Choose your repository
6. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `.output`
   - **Root directory**: `/`
7. In "Environment variables", add:
   - `NODE_VERSION`: `18`
8. In "Functions" → "D1 database bindings", add:
   - **Variable name**: `DB`
   - **D1 database**: Select `invoice_db`
9. Click "Save and Deploy"

## Step 7: Test Your Deployment

Once deployed, visit your Cloudflare Pages URL:
```
https://your-project.pages.dev
```

Test:
- Create a new invoice
- List all invoices
- Create and use templates
- Delete invoices

## Local Development with D1

To test locally with D1 before deploying:

```bash
# Create a local D1 database
wrangler d1 execute invoice_db --local --file=./api/db/d1-migrations/0001_initial.sql

# Start local development server with D1 binding
wrangler pages dev .output --d1=invoice_db:DB
```

## Environment Variables

You can add environment variables in Cloudflare Pages:

1. Go to your Pages project
2. Settings → Environment variables
3. Add any needed variables

Common variables:
- `NODE_VERSION`: `18`

## Database Management

### Query D1 database locally:
```bash
wrangler d1 execute invoice_db --local --command="SELECT * FROM invoices LIMIT 5"
```

### Query D1 database remotely:
```bash
wrangler d1 execute invoice_db --remote --command="SELECT * FROM invoices LIMIT 5"
```

### Export data:
```bash
wrangler d1 export invoice_db --remote --output=backup.sql
```

### Import data:
```bash
wrangler d1 execute invoice_db --remote --file=backup.sql
```

## Troubleshooting

### Build errors

**Error**: "Module not found: better-sqlite3"

**Solution**: D1 uses its own SQLite driver. Remove `better-sqlite3` from dependencies for Cloudflare deployment.

### Database connection errors

**Error**: "DB binding not found"

**Solution**: Make sure:
1. D1 database is created
2. Binding is configured in wrangler.toml
3. Binding is added in Cloudflare Pages settings

### CORS issues

If you encounter CORS errors, update your API to include proper CORS headers.

### Cold start delays

Cloudflare Workers may have cold starts (initial request takes longer). This is normal and should improve after the first request.

## Performance Tips

1. **Use Cloudflare KV** for caching frequently accessed data
2. **Enable Cloudflare caching** for static assets
3. **Use Cloudflare Images** if you add image uploads
4. **Optimize bundle size** by removing unused dependencies

## Scaling

Cloudflare Pages free tier includes:
- 500 builds per month
- 100,000 requests per day
- Unlimited bandwidth
- 5GB D1 storage (beta)
- 5M D1 reads/day (beta)

Paid plans available for higher limits.

## Updating Deployments

To update your deployment:

1. Make changes locally
2. Test with `wrangler pages dev`
3. Deploy with `wrangler pages deploy .output`

Or if using GitHub integration, just push to your repository and Cloudflare will auto-deploy.

## Monitoring

View logs and metrics in:
- Cloudflare Dashboard → Pages → Your Project → Analytics
- Real-time logs: Deployment → View logs

## Security Tips

1. **Enable Cloudflare Access** for password protection
2. **Use WAF rules** to block malicious requests
3. **Enable HTTPS** (automatically enabled by Cloudflare)
4. **Rate limiting** via Cloudflare Workers
5. **Secrets management**: Use Cloudflare Secrets for sensitive data

## Backup Strategy

Automate backups with cron job or manual exports:
```bash
# Create backup script
wrangler d1 export invoice_db --remote --output=backup-$(date +%Y%m%d).sql
```

Set up GitHub Actions or cron to run this regularly.

## Next Steps

After deployment:
1. Set up custom domain
2. Configure analytics
3. Set up error monitoring (Sentry, LogRocket)
4. Set up uptime monitoring
5. Configure email notifications for failures

## Support

- Cloudflare Docs: https://developers.cloudflare.com/pages/
- D1 Docs: https://developers.cloudflare.com/d1/
- Wrangler Docs: https://developers.cloudflare.com/workers/wrangler/

---

Happy deploying! 🚀
