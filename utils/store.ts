// Simplified invoice data store (client-side for now)
// In production, this would connect to a real database

import { type InjectionKey } from 'nuxt/app'

interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  clientEmail: string
  clientAddress: string
  invoiceDate: string
  dueDate: string
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  subtotal: number
  tax: number
  discount: number
  total: number
  notes?: string
  items: InvoiceItem[]
  templateId?: string
  createdAt: string
  updatedAt: string
}

interface InvoiceItem {
  id: string
  invoiceId: string
  description: string
  quantity: number
  price: number
  total: number
}

interface InvoiceTemplate {
  id: string
  name: string
  description?: string
  defaultTax?: number
  defaultDiscount?: number
  defaultNotes?: string
  defaultDueDays?: number
  items: TemplateItem[]
  createdAt: string
  updatedAt: string
}

interface TemplateItem {
  id: string
  templateId: string
  description: string
  quantity: number
  price: number
  createdAt: string
}

const INVOICE_STORE_KEY = 'invoices_store'
const TEMPLATES_STORE_KEY = 'templates_store'

// Helper functions for localStorage
function getFromStore<T>(key: string): T[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}

function saveToStore<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(data))
}

// Invoice operations
export function getInvoices(): Invoice[] {
  return getFromStore<Invoice>(INVOICE_STORE_KEY)
}

export function getInvoiceById(id: string): Invoice | undefined {
  const invoices = getFromStore<Invoice>(INVOICE_STORE_KEY)
  return invoices.find(inv => inv.id === id)
}

export function saveInvoice(invoice: Invoice): void {
  const invoices = getFromStore<Invoice>(INVOICE_STORE_KEY)
  const index = invoices.findIndex(inv => inv.id === invoice.id)
  
  if (index >= 0) {
    invoices[index] = { ...invoice, updatedAt: new Date().toISOString() }
  } else {
    invoices.push(invoice)
  }
  
  saveToStore(INVOICE_STORE_KEY, invoices)
}

export function deleteInvoice(id: string): void {
  const invoices = getFromStore<Invoice>(INVOICE_STORE_KEY)
  const filtered = invoices.filter(inv => inv.id !== id)
  saveToStore(INVOICE_STORE_KEY, filtered)
}

// Template operations
export function getTemplates(): InvoiceTemplate[] {
  return getFromStore<InvoiceTemplate>(TEMPLATES_STORE_KEY)
}

export function getTemplateById(id: string): InvoiceTemplate | undefined {
  const templates = getFromStore<InvoiceTemplate>(TEMPLATES_STORE_KEY)
  return templates.find(tmpl => tmpl.id === id)
}

export function saveTemplate(template: InvoiceTemplate): void {
  const templates = getFromStore<InvoiceTemplate>(TEMPLATES_STORE_KEY)
  const index = templates.findIndex(tmpl => tmpl.id === template.id)
  
  if (index >= 0) {
    templates[index] = { ...template, updatedAt: new Date().toISOString() }
  } else {
    templates.push(template)
  }
  
  saveToStore(TEMPLATES_STORE_KEY, templates)
}

export function deleteTemplate(id: string): void {
  const templates = getFromStore<InvoiceTemplate>(TEMPLATES_STORE_KEY)
  const filtered = templates.filter(tmpl => tmpl.id !== id)
  saveToStore(TEMPLATES_STORE_KEY, filtered)
}

// Helper to generate invoice number
export function generateInvoiceNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `INV-${year}${month}-${random}`
}

// Helper to calculate totals
export function calculateInvoiceTotals(
  items: { quantity: number; price: number }[],
  tax: number = 0,
  discount: number = 0
) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  const total = subtotal + tax - discount
  return { subtotal, total }
}

export const StoreKey: InjectionKey<string> = Symbol('store')
