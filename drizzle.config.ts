import type { Config } from 'drizzle-kit';

export default {
  schema: './api/db/schema.ts',
  out: './api/db/migrations',
  driver: 'better-sqlite',
  dbCredentials: {
    url: './invoices.db',
  },
} satisfies Config;
