# Deploy to Cloudflare Pages via GitHub Integration

Deploy Invoice Generator MVP to Cloudflare Pages with automatic deployments on every push.

## Prerequisites

- [ ] GitHub account (already have access to repository)
- [ ] Cloudflare account (free tier is sufficient)
- [ ] Cloudflare account with Workers/Pages enabled

---

## Step 1: Create Cloudflare Project

### 1.1 Go to Cloudflare Dashboard
Visit: https://dash.cloudflare.com/

### 1.2 Create Pages Project
1. Click **Workers & Pages** → **Create application**
2. Select **Pages** tab
3. Click **Connect to Git**
4. Choose **Connect to an existing project** (later)
   OR
   Click **Continue to GitHub** to authorize

### 1.3 Authorize Cloudflare
1. Click **Connect to GitHub**
2. Authorize Cloudflare to access your repositories
3. Select repositories: All repositories or Select specific repositories
4. Click **Install & Authorize**

---

## Step 2: Setup D1 Database

### 2.1 Create D1 Database

**Option A: Via Wrangler CLI**
```bash
npx wrangler d1 create invoice_db
```

**Option B: Via Cloudflare Dashboard**
1. Go to **Workers & Pages** → **D1**
2. Click **Create database**
3. Database name: `invoice_db`
4. Click **Create**

### 2.2 Get Database ID

**Option A: Via Wrangler CLI**
```bash
npx wrangler d1 list
```

**Option B: Via Cloudflare Dashboard**
1. Go to **Workers & Pages** → **D1**
2. Click on `invoice_db`
3. Copy **Database ID** from right panel

### 2.3 Run Initial Migration

**Option A: Via Wrangler CLI**
```bash
npx wrangler d1 execute invoice_db --remote --file=./api/db/d1-migrations/0001_initial.sql
```

**Option B: Via Cloudflare Dashboard**
1. Go to **Workers & Pages** → **D1** → `invoice_db`
2. Click **Console**
3. Paste contents of `api/db/d1-migrations/0001_initial.sql`
4. Click **Execute**

---

## Step 3: Configure Cloudflare Pages Project

### 3.1 Connect Repository to Pages

1. Go to **Workers & Pages** → **Create application**
2. Click **Pages** → **Connect to Git**
3. Select repository: `naelyaasasafitri/invoice-generator-mvp`
4. Click **Begin setup**

### 3.2 Configure Build Settings

```
Project name: invoice-generator-mvp
Production branch: main
Root directory: /                    (leave empty)
Build command: npm run build
Build output directory: .output
```

### 3.3 Configure D1 Binding

Scroll down to **D1 database bindings**:

```
Variable name: DB
D1 database: invoice_db
```

### 3.4 Save and Deploy

Click **Save and Deploy**

Cloudflare will:
1. Clone your repository
2. Install dependencies
3. Build the project
4. Deploy to Cloudflare Pages
5. Bind D1 database

---

## Step 4: Add Cloudflare Secrets for GitHub Actions (Optional)

If you want to deploy via GitHub Actions instead:

### 4.1 Get Cloudflare Credentials

1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click **Create Token**
3. Use template: **Edit Cloudflare Workers**
4. Permissions:
   - Account - Cloudflare Pages: Edit
   - Account - Workers Scripts: Edit
   - Account - D1: Edit
5. Click **Continue to summary**
6. Click **Create Token**
7. Copy the token

### 4.2 Get Account ID

1. Go to Cloudflare Dashboard
2. Right panel → Click your email
3. Scroll down to **Account ID**
4. Copy the ID

### 4.3 Add Secrets to GitHub Repository

1. Go to repository: https://github.com/naelyaasasafitri/invoice-generator-mvp
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add secrets:
   - `CLOUDFLARE_API_TOKEN`: Your API token
   - `CLOUDFLARE_ACCOUNT_ID`: Your account ID

---

## Step 5: Trigger Deployment

### Option A: Automatic (Git Push)

Push changes to `main` branch:
```bash
git add .
git commit -m "Update deployment"
git push origin main
```

Deployment will trigger automatically.

### Option B: Manual (GitHub Actions)

1. Go to **Actions** tab in repository
2. Select **Deploy to Cloudflare Pages** workflow
3. Click **Run workflow**
4. Select branch: `main`
5. Click **Run workflow**

---

## Step 6: Access Your Application

After successful deployment, visit:
```
https://invoice-generator-mvp.pages.dev
```

Or go to Cloudflare Dashboard → Workers & Pages → invoice-generator-mvp

---

## Verify Deployment

1. Check deployment status in Cloudflare Dashboard
2. Click **View deployment** to see logs
3. Visit your Pages URL
4. Test the application:
   - [ ] Create a new invoice
   - [ ] List all invoices
   - [ ] Create a template
   - [ ] Delete an invoice
   - [ ] Download PDF

---

## Troubleshooting

### Deployment Failed

**Error**: "Build failed"

**Solution**:
1. Check build logs in Cloudflare Dashboard
2. Ensure `npm run build` works locally
3. Check Node.js version (must be 18+)
4. Check dependencies in package.json

**Error**: "DB binding not found"

**Solution**:
1. Go to project settings in Cloudflare Dashboard
2. Functions → D1 database bindings
3. Ensure DB binding is configured
4. Variable name: `DB`
5. D1 database: `invoice_db`

**Error**: "Migration failed"

**Solution**:
1. Ensure D1 database exists
2. Run migration manually via Wrangler or Dashboard
3. Check migration file path is correct

### GitHub Actions Failed

**Error**: "CLOUDFLARE_API_TOKEN not found"

**Solution**:
1. Go to repository Settings → Secrets
2. Add `CLOUDFLARE_API_TOKEN` secret
3. Ensure token has correct permissions

**Error**: "Permission denied"

**Solution**:
1. Check token permissions in Cloudflare
2. Ensure token has: Pages Edit, Workers Edit, D1 Edit
3. Regenerate token if needed

### Application Not Working

**Error**: "Cannot connect to database"

**Solution**:
1. Check D1 database exists
2. Verify DB binding in project settings
3. Check deployment logs for errors

**Error**: "Page not found"

**Solution**:
1. Check deployment completed successfully
2. Verify URL is correct
3. Check project name in Cloudflare

---

## Custom Domain (Optional)

### 1. Add Custom Domain

1. Go to Cloudflare Dashboard → Workers & Pages → invoice-generator-mvp
2. **Custom domains** → **Set up a custom domain**
3. Enter domain: `invoice.yourdomain.com`
4. Click **Activate domain**

### 2. Update DNS

Cloudflare will provide DNS records:
```
Type: CNAME
Name: invoice (or your subdomain)
Target: invoice-generator-mvp.pages.dev
```

Add these records in your domain's DNS settings.

### 3. Update Application

No changes needed! Cloudflare will handle SSL and routing automatically.

---

## Monitoring

### View Deployment Logs

1. Cloudflare Dashboard → Workers & Pages → invoice-generator-mvp
2. Click **View deployment**
3. Check build logs and runtime logs

### View Analytics

1. Cloudflare Dashboard → Workers & Pages → invoice-generator-mvp
2. **Analytics** tab
3. View:
   - Requests
   - Bandwidth
   - Errors
   - Geographic distribution

### Set up Alerts

1. Cloudflare Dashboard → Workers & Pages → invoice-generator-mvp
2. **Alerts** → **Create alert**
3. Configure:
   - Error rate threshold
   - Response time threshold
   - Notifications (email/webhook)

---

## Update Deployment

When you make changes to the code:

### Option 1: Git Push (Recommended)

```bash
git add .
git commit -m "Update features"
git push origin main
```

Deployment will trigger automatically.

### Option 2: Manual Deploy

1. Go to repository **Actions** tab
2. Select **Deploy to Cloudflare Pages**
3. Click **Run workflow**

---

## Rollback Deployment

### Option A: Previous Deployment

1. Cloudflare Dashboard → Workers & Pages → invoice-generator-mvp
2. **Deployments** tab
3. Find previous deployment
4. Click **Rollback**

### Option B: Git Revert

```bash
git revert HEAD
git push origin main
```

---

## Clean Up

To delete the deployment:

1. Cloudflare Dashboard → Workers & Pages → invoice-generator-mvp
2. **Settings** → **Delete**
3. Confirm deletion

---

## Support

- Cloudflare Pages Docs: https://developers.cloudflare.com/pages/
- Cloudflare D1 Docs: https://developers.cloudflare.com/d1/
- GitHub Actions Docs: https://docs.github.com/en/actions

---

**Happy deploying! 🚀**
