import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { invoices, invoiceItems } from './schema';
import * as schema from './schema';

// Initialize database
const sqlite = new Database('./invoices.db');
const db = drizzle(sqlite, { schema });

// Export database instance
export { db };
export { invoices, invoiceItems, invoiceTemplates, templateItems };

// Helper to generate invoice number
export function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}${month}-${random}`;
}

// Helper to calculate totals
export function calculateInvoiceTotals(
  items: { quantity: number; price: number }[],
  tax: number = 0,
  discount: number = 0
) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const total = subtotal + tax - discount;
  return { subtotal, total };
}
