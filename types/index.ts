// Invoice and related types
export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  invoiceDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes?: string;
  items: InvoiceItem[];
  templateId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
}

export interface CreateInvoiceInput {
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  invoiceDate: string;
  dueDate: string;
  status?: 'draft' | 'sent' | 'paid' | 'overdue';
  notes?: string;
  items: {
    description: string;
    quantity: number;
    price: number;
  }[];
  tax?: number;
  discount?: number;
  templateId?: string;
}

export interface UpdateInvoiceInput extends Partial<CreateInvoiceInput> {
  id: string;
}

export interface InvoiceFormData {
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  invoiceDate: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes: string;
  items: {
    id?: string;
    description: string;
    quantity: number;
    price: number;
  }[];
  tax: number;
  discount: number;
  templateId?: string;
}

// Invoice Template types
export interface InvoiceTemplate {
  id: string;
  name: string;
  description?: string;
  defaultTax?: number;
  defaultDiscount?: number;
  defaultNotes?: string;
  defaultDueDays?: number;
  items: TemplateItem[];
  createdAt: string;
  updatedAt: string;
}

export interface TemplateItem {
  id: string;
  templateId: string;
  description: string;
  quantity: number;
  price: number;
  createdAt: string;
}

export interface CreateTemplateInput {
  name: string;
  description?: string;
  defaultTax?: number;
  defaultDiscount?: number;
  defaultNotes?: string;
  defaultDueDays?: number;
  items: {
    description: string;
    quantity: number;
    price: number;
  }[];
}

export interface UpdateTemplateInput extends Partial<CreateTemplateInput> {
  id: string;
}
