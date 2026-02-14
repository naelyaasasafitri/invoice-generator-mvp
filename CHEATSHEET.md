# 🚀 Deployment Cheat Sheet

Copy-paste these commands in your terminal!

---

## 📦 Step 1: Clone & Setup

```bash
# Clone repo
git clone git@github.com:naelyaasasafitri/invoice-generator-mvp.git
cd invoice-generator-mvp

# Install dependencies
npm install
```

---

## 🔐 Step 2: Login Cloudflare

```bash
npx wrangler login
```
*This will open browser - login to your Cloudflare account*

---

## 🗄️ Step 3: Create D1 Database

```bash
npx wrangler d1 create invoice_db
```

**Copy the `database_id` from output!**

Example output:
```
✅ Successfully created DB 'invoice_db'

[[d1_databases]]
binding = "DB"
database_name = "invoice_db"
database_id = "abc123def456ghi789jkl012mno345pqrs"  ← COPY THIS!
```

---

## 📝 Step 4: Update wrangler.toml

```bash
# Open wrangler.toml in your editor
# Replace "your-database-id" with the actual ID from Step 3

# Example:
# database_id = "abc123def456ghi789jkl012mno345pqrs"
```

---

## 🔄 Step 5: Run Database Migration

```bash
npx wrangler d1 execute invoice_db --remote --file=./api/db/d1-migrations/0001_initial.sql
```

Expected output:
```
🌀 Executing on remote database invoice_db
✅ Executed 4 commands in 0.123456ms
```

---

## 🔨 Step 6: Build Project

```bash
npm run build
```

Expected output:
```
✔ Client built successfully
✔ Server built successfully
✔ Generated public .output
```

---

## 🚀 Step 7: Deploy to Cloudflare Pages

```bash
npx wrangler pages deploy .output
```

Expected output:
```
✨ Built successfully
📦 Deploying...
✅ Successfully deployed! 🎉
   Project: invoice-generator-mvp
   URL: https://invoice-generator-mvp.pages.dev
```

---

## ✅ Step 8: Test Deployment

Visit: `https://invoice-generator-mvp.pages.dev`

Test these:
- [ ] Create new invoice
- [ ] View invoice list
- [ ] Create template
- [ ] Delete invoice
- [ ] Download PDF

---

## 📝 Alternative: GitHub Integration (Recommended)

### 1. Create D1 Database
```bash
npx wrangler d1 create invoice_db
```
Copy database_id and update `wrangler.toml`.

### 2. Run Migration
```bash
npx wrangler d1 execute invoice_db --remote --file=./api/db/d1-migrations/0001_initial.sql
```

### 3. Connect GitHub to Cloudflare

1. Go to https://dash.cloudflare.com/
2. Workers & Pages → Create application → Pages
3. Connect to Git → Select repo
4. Configure:
   ```
   Build command: npm run build
   Output directory: .output
   D1 binding: DB = invoice_db
   ```
5. Save and Deploy

✅ **Done!** Auto-deploy on every push!

---

## 🔄 Update Deployment

### After Code Changes:

```bash
# Commit changes
git add .
git commit -m "Update features"
git push origin main
```

**With GitHub Integration:** Auto-deploy! 🎉
**Without GitHub Integration:** Run Step 6-7 above.

---

## 🛠️ Useful Commands

```bash
# List your Pages projects
npx wrangler pages list

# List D1 databases
npx wrangler d1 list

# Query database
npx wrangler d1 execute invoice_db --remote --command="SELECT * FROM invoices LIMIT 5"

# Export database
npx wrangler d1 export invoice_db --remote --output=backup.sql

# Check deployment status
npx wrangler pages deployment list --project-name=invoice-generator-mvp

# Preview locally
npm run dev
```

---

## ❌ Troubleshooting

### "npx: command not found"
```bash
# Install Node.js first: https://nodejs.org/
# Or use npm instead of npx:
npm install -g wrangler
wrangler login
```

### "Login required"
```bash
npx wrangler login
```

### "Database not found"
```bash
npx wrangler d1 list
# If empty, create again:
npx wrangler d1 create invoice_db
```

### "database_id is required"
```bash
# Update wrangler.toml with actual database_id from:
npx wrangler d1 list
```

### "Migration failed"
```bash
# Check file exists:
ls -la api/db/d1-migrations/0001_initial.sql

# Run again:
npx wrangler d1 execute invoice_db --remote --file=./api/db/d1-migrations/0001_initial.sql
```

### "Build failed"
```bash
# Check Node version:
node --version  # Must be 18+

# Clean and rebuild:
rm -rf .output node_modules
npm install
npm run build
```

### "Deployment failed"
```bash
# Check output directory exists:
ls -la .output

# Rebuild:
npm run build

# Deploy again:
npx wrangler pages deploy .output
```

---

## 📊 Deployment Status

### Check Deployment:
1. Cloudflare Dashboard → Workers & Pages
2. Click on `invoice-generator-mvp`
3. View deployment history

### View Logs:
1. Click on latest deployment
2. Check build logs and runtime logs

### Analytics:
1. Workers & Pages → invoice-generator-mvp
2. Analytics tab
3. View: Requests, Bandwidth, Errors

---

## 🎯 Quick Checklist

Before deploying:
- [ ] Node.js 18+ installed
- [ ] npm installed
- [ ] Git cloned repo
- [ ] npm install completed
- [ ] Logged into Cloudflare
- [ ] D1 database created
- [ ] wrangler.toml updated with database_id
- [ ] Migration executed
- [ ] Build successful
- [ ] Deployed successfully

After deploying:
- [ ] Visit your URL
- [ ] Test invoice creation
- [ ] Test all features
- [ ] Set custom domain (optional)

---

## 🌐 Custom Domain (Optional)

```bash
# 1. Go to Cloudflare Dashboard → Workers & Pages → invoice-generator-mvp
# 2. Custom domains → Set up a custom domain
# 3. Enter: invoice.yourdomain.com
# 4. Add DNS records as instructed
```

---

**Happy deploying! 🚀**
