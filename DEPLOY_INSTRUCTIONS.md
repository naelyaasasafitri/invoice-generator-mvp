# 🚀 DEPLOYMENT INSTRUCTIONS

## ⚠️ Current Status

**GitHub Actions CI/CD is NOT working.**

Setelah 7+ percobaan perbaikan, GitHub Actions terus gagal di step "Install dependencies".

---

## ✅ REKOMENDASI: Cloudflare Pages GitHub Integration

**Ini cara PALING GAMPANG dan PALING ANDAL!** 🌟

---

## 🚀 Cara Deploy (Ikuti Ini):

### Langkah 1: Buat D1 Database

```bash
# Di laptop lu:
git clone https://github.com/naelyaasafitri/invoice-generator-mvp.git
cd invoice-generator-mvp
```

### Langkah 2: Install Dependencies & Build

```bash
pnpm install
pnpm run build
```

### Langkah 3: Buat D1 Database

```bash
# Install wrangler
pnpm add -g wrangler

# Login ke Cloudflare (akan buka browser)
wrangler login

# Buat database
wrangler d1 create invoice_db
```

**COPY** `database_id` dari output!

Contoh:
```
✅ Successfully created DB 'invoice_db'

database_id = "abc123def456ghi789"  ← COPY INI!
```

### Langkah 4: Update wrangler.toml

Buka file `wrangler.toml` di editor, replace:

```toml
database_id = "your-database-id"  # Ganti dengan ID yang tadi
```

Jadi:
```toml
database_id = "abc123def456ghi789"  # Paste ID di sini
```

### Langkah 5: Run Database Migration

```bash
wrangler d1 execute invoice_db --remote --file=./api/db/d1-migrations/0001_initial.sql
```

Expected output:
```
🌀 Executing on remote database invoice_db
✅ Executed 4 commands
```

### Langkah 6: Connect GitHub di Cloudflare Dashboard

Ini bagian PALING PENTING! 🎯

1. **Buka:** https://dash.cloudflare.com/
2. Pilih: **Workers & Pages**
3. Klik: **Create application**
4. Pilih tab: **Pages**
5. Klik: **Connect to Git** (atau "Continue to GitHub")
6. **Authorize Cloudflare** di GitHub (sekali saja)
7. Pilih repository: `invoice-generator-mvp`
8. Klik: **Begin setup**

### Langkah 7: Configure Build Settings

Isi konfigurasi:

```
Project name: invoice-generator-mvp
Production branch: main
Root directory: /                    (kosongin aja)
Build command: pnpm run build
Build output directory: .output
```

### Langkah 8: Configure D1 Database Binding

Scroll ke bawah, cari section: **D1 database bindings**

Isi:

```
Variable name: DB
D1 database: invoice_db
```

### Langkah 9: Save and Deploy

Klik tombol **Save and Deploy**

Tunggu 1-2 menit untuk build selesai.

### Langkah 10: SELESAI! 🎉

Buka URL yang ditampilkan:
```
https://invoice-generator-mvp.pages.dev
```

---

## ✅ Selesai!

App lu udah live! Setiap push ke GitHub = auto-deploy.

---

## 📝 Update Code

Kalau lu edit code:

```bash
# Edit file
git add .
git commit -m "Update features"
git push origin main
```

**Auto-deploy akan jalan sendiri!** 🚀

---

## 💡 Tips

1. **Setiap push** = auto-deploy
2. **Bisa monitor** di Cloudflare Dashboard
3. **Build logs** tersedia untuk debugging
4. **Rollback** mudah kalau ada error

---

## 🔗 Link Penting

- Repository: https://github.com/naelyaasafitri/invoice-generator-mvp
- Cloudflare Dashboard: https://dash.cloudflare.com/
- Documentation lengkap: Lihat FIX_SUMMARY.md

---

**Selamat deploying! 🚀**
