import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const invoices = sqliteTable('invoices', {
  id: text('id').primaryKey(),
  invoiceNumber: text('invoice_number').notNull().unique(),
  clientName: text('client_name').notNull(),
  clientEmail: text('client_email').notNull(),
  clientAddress: text('client_address').notNull(),
  invoiceDate: text('invoice_date').notNull(),
  dueDate: text('due_date').notNull(),
  status: text('status', { enum: ['draft', 'sent', 'paid', 'overdue'] }).notNull().default('draft'),
  notes: text('notes'),
  tax: integer('tax').notNull().default(0),
  discount: integer('discount').notNull().default(0),
  subtotal: integer('subtotal').notNull().default(0),
  total: integer('total').notNull().default(0),
  templateId: text('template_id').references(() => invoiceTemplates.id),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const invoiceItems = sqliteTable('invoice_items', {
  id: text('id').primaryKey(),
  invoiceId: text('invoice_id').notNull().references(() => invoices.id, { onDelete: 'cascade' }),
  description: text('description').notNull(),
  quantity: integer('quantity').notNull().default(1),
  price: integer('price').notNull().default(0),
  total: integer('total').notNull().default(0),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const invoiceTemplates = sqliteTable('invoice_templates', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  defaultTax: integer('default_tax').notNull().default(0),
  defaultDiscount: integer('default_discount').notNull().default(0),
  defaultNotes: text('default_notes'),
  defaultDueDays: integer('default_due_days').notNull().default(30),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const templateItems = sqliteTable('template_items', {
  id: text('id').primaryKey(),
  templateId: text('template_id').notNull().references(() => invoiceTemplates.id, { onDelete: 'cascade' }),
  description: text('description').notNull(),
  quantity: integer('quantity').notNull().default(1),
  price: integer('price').notNull().default(0),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export type Invoice = typeof invoices.$inferSelect;
export type InvoiceItem = typeof invoiceItems.$inferSelect;
export type InvoiceTemplate = typeof invoiceTemplates.$inferSelect;
export type TemplateItem = typeof templateItems.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
export type NewInvoiceItem = typeof invoiceItems.$inferInsert;
export type NewInvoiceTemplate = typeof invoiceTemplates.$inferInsert;
export type NewTemplateItem = typeof templateItems.$inferInsert;
