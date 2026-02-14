# Manual Cloudflare Setup & Deployment

Ikuti langkah-langkah ini untuk deploy Invoice Generator MVP ke Cloudflare Pages.

## Prerequisites

- [ ] Node.js 18+ terinstall
- [ ] npm, pnpm, atau yarn terinstall
- [ ] Akun Cloudflare ( gratis )
- [ ] Terminal / Command prompt

---

## 📋 Langkah 1: Install Dependencies

Buka terminal di folder project, jalankan:

```bash
npm install
```

Atau kalau pakai pnpm:
```bash
pnpm install
```

---

## 🔐 Langkah 2: Login ke Cloudflare

```bash
npx wrangler login
```

Ini akan buka browser. Login ke akun Cloudflare lu dan berikan akses.

**Expected output:**
```
✅ Successfully logged in with your Cloudflare account
```

---

## 🗄️  Langkah 3: Buat D1 Database

```bash
npx wrangler d1 create invoice_db
```

**Expected output:**
```
✅ Successfully created DB 'invoice_db'

[[d1_databases]]
binding = "DB"
database_name = "invoice_db"
database_id = "abc123def456ghi789jkl012mno345pqrs"  ← Copy ini!
```

**Copy `database_id`** dan paste ke file `wrangler.toml`.

---

## 📝 Langkah 4: Update wrangler.toml

Buka file `wrangler.toml`, ganti:

```toml
database_id = "your-database-id"  # Ganti dengan ID yang lu copy
```

Jadi:

```toml
database_id = "abc123def456ghi789jkl012mno345pqrs"  # Paste di sini
```

---

## 🔄 Langkah 5: Run Database Migrations

```bash
npx wrangler d1 execute invoice_db --remote --file=./api/db/d1-migrations/0001_initial.sql
```

**Expected output:**
```
🌀 Executing on remote database invoice_db
✅ Executed 4 commands in 0.123456ms
```

---

## 🔨 Langkah 6: Build Project

```bash
npm run build
```

**Expected output:**
```
✔ Client built successfully
✔ Server built successfully
✔ Generated public .output
```

---

## 🚀 Langkah 7: Deploy ke Cloudflare Pages

```bash
npx wrangler pages deploy .output
```

Ini akan upload project ke Cloudflare Pages.

**Expected output:**
```
✨ Built successfully
📦 Deploying...
✅ Successfully deployed! 🎉
   Project: invoice-mvp
   URL: https://invoice-mvp.pages.dev    ← Ini URL app lu!
```

---

## ✅ Testing Deployment

1. Buka URL yang ditampilkan (contoh: `https://invoice-mvp.pages.dev`)
2. Test fitur-fitur:
   - [ ] Bisa buka halaman home
   - [ ] Bisa create invoice baru
   - [ ] Bisa list semua invoice
   - [ ] Bisa view invoice detail
   - [ ] Bisa create template
   - [ ] Bisa delete invoice

---

## 📝 Langkah Lanjutan (Opsional)

### Setup Custom Domain

1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Pilih **Pages** → Pilih project lu
3. Klik **Custom domains** → **Set up a custom domain**
4. Masukkan domain lu (misal: `invoice.yourdomain.com`)
5. Follow instruksi DNS

### Add Environment Variables

Di Cloudflare Dashboard:
1. Pages → Project lu → **Settings** → **Environment variables**
2. Add variables jika diperlukan

### Update Deployment

Kalau lu edit code, deploy lagi dengan:

```bash
npm run build
npx wrangler pages deploy .output
```

---

## 🔧 Commands Berguna

```bash
# List semua Pages project
npx wrangler pages list

# List semua D1 database
npx wrangler d1 list

# Query database
npx wrangler d1 execute invoice_db --remote --command="SELECT * FROM invoices LIMIT 5"

# Backup database
npx wrangler d1 export invoice_db --remote --output=backup.sql

# Check deployment status
npx wrangler pages deployment list --project-name=invoice-mvp
```

---

## ❌ Troubleshooting

### "npm: command not found"

Install Node.js: https://nodejs.org/

### "Login required"

Jalankan:
```bash
npx wrangler login
```

### "Database not found"

Cek D1 database:
```bash
npx wrangler d1 list
```

Kalau ngga ada, create lagi:
```bash
npx wrangler d1 create invoice_db
```

### "database_id is required"

Update `wrangler.toml` dengan `database_id` yang benar.

### "Migration failed"

Cek file migration ada:
```bash
ls -la api/db/d1-migrations/
```

Run lagi:
```bash
npx wrangler d1 execute invoice_db --remote --file=./api/db/d1-migrations/0001_initial.sql
```

### "Build failed"

Cek Node.js version:
```bash
node --version
```

Harus v18+. Kalau kurang, install versi terbaru.

### "Deployment failed"

Cek output errornya, biasanya:
- Missing files → cek `ls .output`
- Build errors → cek `npm run build` lagi
- Size limit → hapus `node_modules` sebelum build

---

## 📊 Monitoring & Analytics

Buka Cloudflare Dashboard:
1. Pages → Project lu → **Analytics**
2. Lihat:
   - Request count
   - Bandwidth usage
   - Error rate
   - Geographic distribution

---

## 🔄 Automatic Deployment (GitHub Integration)

Untuk auto-deploy setiap push ke GitHub:

1. Push code ke GitHub
2. Cloudflare Dashboard → **Pages** → **Create a project**
3. **Connect to Git** → Pilih repo
4. Configure:
   - **Build command**: `npm run build`
   - **Build output directory**: `.output`
5. Add D1 binding di project settings
6. Done! Setiap push ke main branch = auto deploy

---

## 💡 Tips

- **First deployment** makan waktu ±1-2 menit
- **Update deployment** cuma ±30 detik
- **D1 database** punya limit 5GB (free tier)
- **Requests limit**: 5M reads/day (free tier)
- **Global CDN**: App lu jalan cepat di seluruh dunia

---

## 🆘 Support

Kalau masih error:
1. Cek [Cloudflare Pages docs](https://developers.cloudflare.com/pages/)
2. Cek [D1 docs](https://developers.cloudflare.com/d1/)
3. Buka issue di GitHub repo lu

---

**Selamat deploying! 🚀**
