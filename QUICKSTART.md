# Quick Start Guide

Get Invoice Generator MVP up and running in 5 minutes.

## Step 1: Install Dependencies

```bash
npm install
```

Or if using pnpm:
```bash
pnpm install
```

## Step 2: Initialize Database

The database will be automatically created on first run, but you can run migrations explicitly:

```bash
npm run migrate
```

## Step 3: Start Development Server

```bash
npm run dev
```

## Step 4: Open in Browser

Visit [http://localhost:3000](http://localhost:3000)

## What's Next?

1. **Create your first invoice** - Click "New Invoice" button
2. **Fill in client details** - Name, email, address
3. **Add line items** - Description, quantity, price
4. **Set totals** - Adjust tax and discount
5. **Save invoice** - Click "Create Invoice"
6. **Download PDF** - Open invoice and click "Download PDF"

## Troubleshooting

### Port already in use?

Change port in nuxt.config.ts or use:
```bash
npm run dev -- -p 3001
```

### Database errors?

Delete `invoices.db` and run `npm run migrate` again.

### Module not found?

Run `npm install` or `pnpm install` again.

## Need Help?

- Check [README.md](README.md) for detailed documentation
- Open an issue on GitHub
- Email support@example.com

---

Happy invoicing! 🧾
