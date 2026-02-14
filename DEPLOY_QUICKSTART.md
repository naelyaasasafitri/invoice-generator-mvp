# Quick Cloudflare Deployment

Deploy Invoice Generator MVP to Cloudflare Pages in 5 minutes.

## Prerequisites

- Cloudflare account (free)
- GitHub account
- Node.js 18+

## Method 1: GitHub Integration (Easiest)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/invoice-mvp.git
git push -u origin main
```

### 2. Create D1 Database
```bash
npm install -g wrangler
wrangler login
wrangler d1 create invoice_db
```

Copy the `database_id` from the output and update `wrangler.toml`.

### 3. Run Database Migration
```bash
wrangler d1 execute invoice_db --remote --file=./api/db/d1-migrations/0001_initial.sql
```

### 4. Connect GitHub to Cloudflare Pages

1. Go to [Cloudflare Dashboard → Pages](https://dash.cloudflare.com/)
2. Click "Create a project"
3. Select "Connect to Git"
4. Choose your repository
5. Configure:
   - **Build command**: `npm run build`
   - **Build output directory**: `.output`
6. Add D1 binding:
   - Settings → Functions → D1 database bindings
   - Variable name: `DB`
   - D1 database: `invoice_db`
7. Click "Save and Deploy"

### 5. Done! 🎉

Your app will be available at: `https://your-project.pages.dev`

---

## Method 2: Wrangler CLI

```bash
# 1. Install dependencies
npm install

# 2. Install Wrangler
npm install -g wrangler

# 3. Login to Cloudflare
wrangler login

# 4. Create D1 database
wrangler d1 create invoice_db

# 5. Update wrangler.toml with database_id

# 6. Run migrations
wrangler d1 execute invoice_db --remote --file=./api/db/d1-migrations/0001_initial.sql

# 7. Deploy
npm run deploy:cloudflare
```

---

## Testing Deployment

```bash
# Test locally with D1
npm run cf:migrate:local
npm run cf:dev
```

Visit `http://localhost:8788` to test.

---

## Custom Domain

1. Go to your Pages project in Cloudflare Dashboard
2. Settings → Custom domains
3. Add your domain
4. Update DNS records as instructed

---

## Troubleshooting

**Build failed?**
- Check Node version is 18+
- Run `npm install` before pushing

**Database errors?**
- Make sure D1 database exists
- Run migrations
- Check binding is configured

**Deployment stuck?**
- Check Cloudflare Dashboard for build logs
- Verify GitHub webhook is configured

---

Need help? See [CLOUDFLARE_DEPLOY.md](CLOUDFLARE_DEPLOY.md) for detailed guide.
