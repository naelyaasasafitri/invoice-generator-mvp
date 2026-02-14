# Invoice Generator MVP

A simple invoice generator application built with Nuxt 3.

## ⚠️ Important Note

**GitHub Actions CI/CD is currently experiencing persistent failures.**

**Recommended Deployment:** Use **Cloudflare Pages GitHub Integration** instead.

For complete details, see [FIX_SUMMARY.md](https://github.com/naelyaasafitri/invoice-generator-mvp/blob/main/FIX_SUMMARY.md).

---

## Features

- ✅ Create invoices with multiple line items
- ✅ List and view all invoices
- ✅ Delete invoices
- ✅ Invoice status management (Draft, Sent, Paid, Overdue)
- ✅ Tax and discount support
- ✅ PDF generation (HTML-based, print-ready)
- ✅ Responsive UI with Tailwind CSS
- ✅ Client-side storage (localStorage)

> **Note:** Full backend with database coming soon. Current version uses localStorage for demonstration.

---

## Tech Stack

### Frontend
- **Nuxt 3** - Vue 3 framework with SSR support
- **Vue 3 Composition API** - Modern reactive programming
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide Vue Next** - Icon library

---

## Project Structure

```
invoice-mvp/
├── pages/
│   ├── index.vue          # Invoice list page
│   ├── new.vue            # Create invoice page
│   └── invoice/
│       └── [id].vue       # Invoice detail page
├── utils/
│   └── store.ts           # Client-side storage utilities
├── composables/
│   └── useInvoiceStore.ts  # Vue composable for state
├── app.vue                # Root component
├── nuxt.config.ts         # Nuxt configuration
├── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone repository:
```bash
git clone https://github.com/naelyaasasafitri/invoice-generator-mvp.git
cd invoice-generator-mvp
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Run development server:
```bash
pnpm dev
# or
npm run dev
```

4. Open http://localhost:3000 in your browser

---

## Deployment

### 🚀 Cloudflare Pages GitHub Integration (RECOMMENDED) ⭐

**Easiest and most reliable!** Skip GitHub Actions entirely.

1. Go to https://dash.cloudflare.com/
2. Workers & Pages → Create application → Pages
3. Connect to Git → Select this repository
4. Configure:
   ```
   Build command: pnpm run build
   Build output directory: .output
   ```
5. Add D1 database binding:
   ```
   Variable name: DB
   D1 database: invoice_db
   ```
6. Save and Deploy

**Benefits:**
- ✅ No GitHub Actions needed
- ✅ Cloudflare handles builds automatically
- ✅ Auto-deploy on every push
- ✅ Reliable and fast
- ✅ Production-ready

### 📖 Deployment Guides

- **Quick Start:** [DEPLOY_NOW.md](DEPLOY_NOW.md)
- **Manual Deploy:** [CHEATSHEET.md](CHEATSHEET.md)
- **GitHub Integration:** [GITHUB_DEPLOY.md](GITHUB_DEPLOY.md)
- **Fix Summary:** [FIX_SUMMARY.md](FIX_SUMMARY.md)

---

## Usage

### Create Invoice

1. Click "New Invoice" button
2. Fill in client information
3. Add line items (description, quantity, price)
4. Set tax and discount
5. Save invoice

### Manage Templates

1. Click "Templates" button
2. Create reusable templates
3. Load template when creating invoices

### Generate PDF

1. Open invoice detail
2. Click "Download PDF"
3. Print or save the generated PDF

---

## License

MIT License - feel free to use this project for your own purposes.

---

## Support

For support, open an issue in the repository.

---

Built with ❤️ using Nuxt 3
