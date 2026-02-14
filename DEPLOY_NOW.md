# 🚀 Deploy NOW - Quick Guide

Deploy Invoice Generator MVP to Cloudflare Pages in 5 minutes!

---

## Method 1: GitHub Integration (RECOMMENDED)

This is the easiest way - auto-deploy on every push!

### Step 1: Authorize Cloudflare on GitHub

1. Go to https://dash.cloudflare.com/
2. Click **Workers & Pages** → **Create application**
3. Click **Connect to Git**
4. Click **Authorize Cloudflare** (or "Continue to GitHub")
5. Authorize Cloudflare to access your GitHub repositories

### Step 2: Create D1 Database

1. In Cloudflare Dashboard, go to **Workers & Pages** → **D1**
2. Click **Create database**
3. Name: `invoice_db`
4. Click **Create**

### Step 3: Run Database Migration

**Option A: Via Wrangler CLI** (Need npm)
```bash
npx wrangler d1 execute invoice_db --remote --file=./api/db/d1-migrations/0001_initial.sql
```

**Option B: Via Cloudflare Dashboard**
1. Go to **Workers & Pages** → **D1** → `invoice_db`
2. Click **Console**
3. Copy contents of file: `api/db/d1-migrations/0001_initial.sql`
4. Paste into console
5. Click **Execute**

### Step 4: Connect Repository to Pages

1. Go to **Workers & Pages** → **Create application**
2. Click **Pages** → **Connect to Git**
3. Select: `naelyaasasafitri/invoice-generator-mvp`
4. Click **Begin setup**

### Step 5: Configure Build Settings

Fill in these values:

```
Project name: invoice-generator-mvp
Production branch: main
Root directory: /                    (empty)
Build command: npm run build
Build output directory: .output
```

### Step 6: Configure D1 Database Binding

Scroll down to **D1 database bindings**:

```
Variable name: DB
D1 database: invoice_db
```

### Step 7: Save and Deploy

Click **Save and Deploy**

Wait for deployment to complete (1-2 minutes).

### Step 8: Access Your App!

Visit: `https://invoice-generator-mvp.pages.dev`

✅ **Done!** Your app is now live!

---

## Method 2: Manual Deploy (With Wrangler)

Use this if you prefer manual control.

### Step 1: Install Dependencies

```bash
cd invoice-generator-mvp
npm install
```

### Step 2: Login to Cloudflare

```bash
npx wrangler login
```

### Step 3: Create D1 Database

```bash
npx wrangler d1 create invoice_db
```

Copy `database_id` from output.

### Step 4: Update wrangler.toml

Open `wrangler.toml`, replace:
```toml
database_id = "your-database-id"  # Paste ID here
```

### Step 5: Run Migration

```bash
npx wrangler d1 execute invoice_db --remote --file=./api/db/d1-migrations/0001_initial.sql
```

### Step 6: Build

```bash
npm run build
```

### Step 7: Deploy

```bash
npx wrangler pages deploy .output
```

---

## Testing Deployment

After deployment:

1. Visit your URL: `https://invoice-generator-mvp.pages.dev`
2. Test:
   - [ ] Create invoice
   - [ ] View invoice list
   - [ ] Delete invoice
   - [ ] Create template
   - [ ] Use template

---

## Updating Deployment

With GitHub Integration (Method 1):

Just push changes!
```bash
git add .
git commit -m "Update features"
git push origin main
```

Auto-deploy will trigger.

With Manual Deploy (Method 2):

```bash
npm run build
npx wrangler pages deploy .output
```

---

## Troubleshooting

### "D1 binding not found"

- Go to project settings → D1 database bindings
- Add binding: Variable name `DB`, Database `invoice_db`

### "Build failed"

- Check build logs in Cloudflare Dashboard
- Ensure `npm run build` works locally

### "Migration failed"

- Ensure D1 database exists
- Run migration manually via Dashboard console

---

## Custom Domain (Optional)

1. Cloudflare Dashboard → Workers & Pages → invoice-generator-mvp
2. **Custom domains** → **Set up a custom domain**
3. Enter: `invoice.yourdomain.com`
4. Add DNS records as instructed

---

## Need Help?

- **Full Guide**: See `GITHUB_DEPLOY.md`
- **Manual Setup**: See `MANUAL_SETUP.md`
- **Cloudflare Docs**: https://developers.cloudflare.com/pages/

---

**Good luck! 🚀**
