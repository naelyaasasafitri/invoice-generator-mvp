# Invoice Generator MVP

A simple, full-stack invoice generator application built with Nuxt 3, Hono, and SQLite.

## Features

- ✅ Create invoices with multiple line items
- ✅ List and view all invoices
- ✅ Edit existing invoices
- ✅ Delete invoices
- ✅ Invoice status management (Draft, Sent, Paid, Overdue)
- ✅ Tax and discount support
- ✅ PDF generation (HTML-based, print-ready)
- ✅ SQLite database for data persistence
- ✅ Type-safe API with Zod validation
- ✅ Responsive UI with Tailwind CSS
- ✅ **Invoice templates** - Save time with reusable templates
- ✅ **Template management** - Create, edit, delete templates
- ✅ **Quick invoice creation** - Load from template to create invoices faster

## Tech Stack

### Frontend
- **Nuxt 3** - Vue 3 framework with SSR support
- **Vue 3 Composition API** - Modern reactive programming
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide Vue Next** - Icon library

### Backend
- **Hono** - Fast, lightweight web framework
- **Drizzle ORM** - Type-safe SQL toolkit
- **Better-SQLite3** - Synchronous SQLite driver
- **Zod** - TypeScript-first schema validation

## Project Structure

```
invoice-mvp/
├── api/
│   ├── db/
│   │   ├── index.ts       # Database connection & helpers
│   │   └── schema.ts      # Database schema definitions
│   ├── index.ts           # API routes (Hono)
│   └── drizzle.config.ts  # Drizzle ORM config
├── pages/
│   ├── index.vue          # Invoice list page
│   ├── new.vue            # Create invoice page
│   └── invoice/
│       └── [id].vue       # Invoice detail page
├── types/
│   └── index.ts           # TypeScript type definitions
├── app.vue                # Root component
├── nuxt.config.ts         # Nuxt configuration
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ or Bun runtime
- pnpm, npm, or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd invoice-mvp
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
# or
yarn install
```

3. Generate database migration (if needed):
```bash
npx drizzle-kit generate
```

4. Run the development server:
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Development

Run the development server:
```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## API Endpoints

### Invoices

- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get single invoice by ID
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `GET /api/invoices/:id/pdf` - Generate PDF (HTML)

### Templates

- `GET /api/templates` - Get all templates
- `GET /api/templates/:id` - Get single template by ID
- `POST /api/templates` - Create new template
- `PUT /api/templates/:id` - Update template
- `DELETE /api/templates/:id` - Delete template

### Request/Response Examples

#### Create Invoice

**Request:**
```json
POST /api/invoices
{
  "clientName": "John Doe",
  "clientEmail": "john@example.com",
  "clientAddress": "123 Main St, City, Country",
  "invoiceDate": "2024-02-14",
  "dueDate": "2024-03-14",
  "status": "draft",
  "notes": "Thank you for your business!",
  "items": [
    {
      "description": "Web Development Services",
      "quantity": 10,
      "price": 100
    }
  ],
  "tax": 80,
  "discount": 0
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "invoiceNumber": "INV-202402-1234",
    "clientName": "John Doe",
    "clientEmail": "john@example.com",
    "clientAddress": "123 Main St, City, Country",
    "invoiceDate": "2024-02-14",
    "dueDate": "2024-03-14",
    "status": "draft",
    "notes": "Thank you for your business!",
    "subtotal": 1000,
    "tax": 80,
    "discount": 0,
    "total": 1080,
    "items": [...],
    "createdAt": "2024-02-14T10:00:00.000Z",
    "updatedAt": "2024-02-14T10:00:00.000Z"
  }
}
```

#### Create Template

**Request:**
```json
POST /api/templates
{
  "name": "Web Development Services",
  "description": "Standard web development package",
  "defaultTax": 80,
  "defaultDiscount": 0,
  "defaultNotes": "Thank you for your business!",
  "defaultDueDays": 30,
  "items": [
    {
      "description": "Frontend Development",
      "quantity": 10,
      "price": 100
    },
    {
      "description": "Backend Development",
      "quantity": 10,
      "price": 100
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Web Development Services",
    "description": "Standard web development package",
    "defaultTax": 80,
    "defaultDiscount": 0,
    "defaultNotes": "Thank you for your business!",
    "defaultDueDays": 30,
    "items": [...],
    "createdAt": "2024-02-14T10:00:00.000Z",
    "updatedAt": "2024-02-14T10:00:00.000Z"
  }
}
```

## Database Schema

### Invoices Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PRIMARY KEY |
| invoice_number | TEXT | UNIQUE, NOT NULL |
| client_name | TEXT | NOT NULL |
| client_email | TEXT | NOT NULL |
| client_address | TEXT | NOT NULL |
| invoice_date | TEXT | NOT NULL |
| due_date | TEXT | NOT NULL |
| status | TEXT | NOT NULL (enum) |
| notes | TEXT | NULLABLE |
| tax | INTEGER | NOT NULL |
| discount | INTEGER | NOT NULL |
| subtotal | INTEGER | NOT NULL |
| total | INTEGER | NOT NULL |
| created_at | TEXT | NOT NULL |
| updated_at | TEXT | NOT NULL |

### Invoice Templates Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PRIMARY KEY |
| name | TEXT | NOT NULL |
| description | TEXT | NULLABLE |
| default_tax | INTEGER | NOT NULL |
| default_discount | INTEGER | NOT NULL |
| default_notes | TEXT | NULLABLE |
| default_due_days | INTEGER | NOT NULL |
| created_at | TEXT | NOT NULL |
| updated_at | TEXT | NOT NULL |

### Template Items Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PRIMARY KEY |
| template_id | TEXT | FOREIGN KEY |
| description | TEXT | NOT NULL |
| quantity | INTEGER | NOT NULL |
| price | INTEGER | NOT NULL |
| created_at | TEXT | NOT NULL |

### Invoice Items Table

| Column | Type | Constraints |
|--------|------|-------------|
| id | TEXT | PRIMARY KEY |
| invoice_id | TEXT | FOREIGN KEY |
| description | TEXT | NOT NULL |
| quantity | INTEGER | NOT NULL |
| price | INTEGER | NOT NULL |
| total | INTEGER | NOT NULL |
| created_at | TEXT | NOT NULL |

## Future Enhancements

- [ ] User authentication
- [ ] Client management (save/reuse clients)
- [ ] Email invoices directly
- [ ] Recurring invoices
- [ ] Multi-currency support
- [ ] Payment tracking
- [ ] Reporting & analytics
- [ ] Export to different formats (Excel, CSV)
- [ ] Dark mode
- [ ] Mobile app

## Deployment

### 🚀 Quick Deploy to Cloudflare

Want to deploy now? See **[DEPLOY_NOW.md](DEPLOY_NOW.md)** for a 5-minute deployment guide!

### Cloudflare Pages (Recommended with D1)

**Option A: GitHub Integration (Easiest)**
- ✅ Automatic deployment on every push
- ✅ No manual steps needed
- ✅ CI/CD included
- See **[DEPLOY_NOW.md](DEPLOY_NOW.md)** for setup

**Option B: Manual Deploy**
- ✅ Full control over deployment
- ✅ Use Wrangler CLI
- See **[GITHUB_DEPLOY.md](GITHUB_DEPLOY.md)** for guide
- See **[MANUAL_SETUP.md](MANUAL_SETUP.md)** for manual setup

For deployment to Cloudflare Pages with D1 database, see [CLOUDFLARE_DEPLOY.md](CLOUDFLARE_DEPLOY.md) for detailed instructions.

**Quick Start:**
```bash
# Install Wrangler
npm install -g wrangler

# Login
wrangler login

# Create D1 database
wrangler d1 create invoice_db

# Update wrangler.toml with database_id

# Run migrations
wrangler d1 execute invoice_db --remote --file=./api/db/d1-migrations/0001_initial.sql

# Deploy
wrangler pages deploy .output
```

**Benefits:**
- ✅ Free tier with generous limits
- ✅ Global CDN
- ✅ D1 database (SQLite-compatible)
- ✅ Edge functions
- ✅ Auto SSL
- ✅ Zero cold start for static assets

### Netlify

1. Push your code to GitHub
2. Connect repository to Netlify
3. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.output/public`

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Configure build settings (similar to Netlify)

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.output ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["node", "server/index.mjs"]
```

## Contributing

Contributions, issues, and feature requests are welcome!

## License

MIT License - feel free to use this project for your own purposes.

## Support

For support, email support@example.com or open an issue in the repository.

---

Built with ❤️ using Nuxt 3 and Hono
