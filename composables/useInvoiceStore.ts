// Composable for invoice operations
export function useInvoiceStore() {
  const invoices = useState<Invoice[]>('invoices', () => [])
  const templates = useState<InvoiceTemplate[]>('templates', () [])
  const loading = useState<boolean>('loading', () => false)

  // Load data from localStorage
  const loadInvoices = () => {
    if (import.meta.client) {
      invoices.value = getInvoices()
      templates.value = getTemplates()
    }
  }

  // Save invoice
  const saveInvoice = (invoice: Invoice) => {
    saveInvoiceStore(invoice)
    loadInvoices()
  }

  // Delete invoice
  const deleteInvoice = (id: string) => {
    deleteInvoiceStore(id)
    loadInvoices()
  }

  // Save template
  const saveTemplate = (template: InvoiceTemplate) => {
    saveTemplateStore(template)
    loadInvoices()
  }

  // Delete template
  const deleteTemplate = (id: string) => {
    deleteTemplateStore(id)
    loadInvoices()
  }

  return {
    invoices,
    templates,
    loading,
    loadInvoices,
    saveInvoice,
    deleteInvoice,
    saveTemplate,
    deleteTemplate,
  }
}
