import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { db, invoices, invoiceItems, invoiceTemplates, templateItems, generateInvoiceNumber, calculateInvoiceTotals } from './db/index';
import { eq } from 'drizzle-orm';

const app = new Hono();

// Validation schemas
const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  price: z.number().min(0, 'Price must be positive'),
});

const createInvoiceSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  clientEmail: z.string().email('Invalid email'),
  clientAddress: z.string().min(1, 'Address is required'),
  invoiceDate: z.string(),
  dueDate: z.string(),
  status: z.enum(['draft', 'sent', 'paid', 'overdue']).default('draft'),
  notes: z.string().optional(),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  tax: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
});

const updateInvoiceSchema = createInvoiceSchema.partial();

// Get all invoices
app.get('/invoices', async (c) => {
  try {
    const allInvoices = await db
      .select()
      .from(invoices)
      .orderBy(invoices.createdAt);

    // Get items for each invoice
    const invoicesWithItems = await Promise.all(
      allInvoices.map(async (invoice) => {
        const items = await db
          .select()
          .from(invoiceItems)
          .where(eq(invoiceItems.invoiceId, invoice.id));
        return {
          ...invoice,
          items,
        };
      })
    );

    return c.json({
      success: true,
      data: invoicesWithItems,
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to fetch invoices',
      },
      500
    );
  }
});

// Get single invoice
app.get('/invoices/:id', async (c) => {
  const id = c.req.param('id');
  
  try {
    const [invoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.id, id));

    if (!invoice) {
      return c.json(
        {
          success: false,
          error: 'Invoice not found',
        },
        404
      );
    }

    const items = await db
      .select()
      .from(invoiceItems)
      .where(eq(invoiceItems.invoiceId, invoice.id));

    return c.json({
      success: true,
      data: {
        ...invoice,
        items,
      },
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to fetch invoice',
      },
      500
    );
  }
});

// Create invoice
app.post('/invoices', zValidator('json', createInvoiceSchema), async (c) => {
  const data = c.req.valid('json');

  try {
    const { subtotal, total } = calculateInvoiceTotals(data.items, data.tax, data.discount);
    const invoiceNumber = generateInvoiceNumber();
    const invoiceId = crypto.randomUUID();

    // Insert invoice
    await db.insert(invoices).values({
      id: invoiceId,
      invoiceNumber,
      clientName: data.clientName,
      clientEmail: data.clientEmail,
      clientAddress: data.clientAddress,
      invoiceDate: data.invoiceDate,
      dueDate: data.dueDate,
      status: data.status,
      notes: data.notes,
      tax: data.tax,
      discount: data.discount,
      subtotal,
      total,
    });

    // Insert items
    await Promise.all(
      data.items.map((item) =>
        db.insert(invoiceItems).values({
          id: crypto.randomUUID(),
          invoiceId,
          description: item.description,
          quantity: item.quantity,
          price: item.price,
          total: item.quantity * item.price,
        })
      )
    );

    // Fetch the created invoice with items
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, invoiceId));
    const items = await db.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, invoiceId));

    return c.json(
      {
        success: true,
        data: {
          ...invoice,
          items,
        },
      },
      201
    );
  } catch (error) {
    console.error('Error creating invoice:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to create invoice',
      },
      500
    );
  }
});

// Update invoice
app.put('/invoices/:id', zValidator('json', updateInvoiceSchema), async (c) => {
  const id = c.req.param('id');
  const data = c.req.valid('json');

  try {
    // Check if invoice exists
    const [existingInvoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    
    if (!existingInvoice) {
      return c.json(
        {
          success: false,
          error: 'Invoice not found',
        },
        404
      );
    }

    // If items are provided, update them
    if (data.items) {
      const { subtotal, total } = calculateInvoiceTotals(data.items, data.tax, data.discount);
      
      // Delete existing items
      await db.delete(invoiceItems).where(eq(invoiceItems.invoiceId, id));
      
      // Insert new items
      await Promise.all(
        data.items.map((item) =>
          db.insert(invoiceItems).values({
            id: crypto.randomUUID(),
            invoiceId: id,
            description: item.description,
            quantity: item.quantity,
            price: item.price,
            total: item.quantity * item.price,
          })
        )
      );

      // Update invoice totals
      await db
        .update(invoices)
        .set({
          subtotal,
          total,
          tax: data.tax,
          discount: data.discount,
        })
        .where(eq(invoices.id, id));
    }

    // Update other fields
    const updateData: any = {};
    if (data.clientName) updateData.clientName = data.clientName;
    if (data.clientEmail) updateData.clientEmail = data.clientEmail;
    if (data.clientAddress) updateData.clientAddress = data.clientAddress;
    if (data.invoiceDate) updateData.invoiceDate = data.invoiceDate;
    if (data.dueDate) updateData.dueDate = data.dueDate;
    if (data.status) updateData.status = data.status;
    if (data.notes !== undefined) updateData.notes = data.notes;
    updateData.updatedAt = new Date().toISOString();

    await db.update(invoices).set(updateData).where(eq(invoices.id, id));

    // Fetch updated invoice
    const [updatedInvoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    const items = await db.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, id));

    return c.json({
      success: true,
      data: {
        ...updatedInvoice,
        items,
      },
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to update invoice',
      },
      500
    );
  }
});

// Delete invoice
app.delete('/invoices/:id', async (c) => {
  const id = c.req.param('id');

  try {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));

    if (!invoice) {
      return c.json(
        {
          success: false,
          error: 'Invoice not found',
        },
        404
      );
    }

    // Delete invoice (cascade will delete items)
    await db.delete(invoices).where(eq(invoices.id, id));

    return c.json({
      success: true,
      message: 'Invoice deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to delete invoice',
      },
      500
    );
  }
});

// Generate PDF endpoint
app.get('/invoices/:id/pdf', async (c) => {
  const id = c.req.param('id');

  try {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    
    if (!invoice) {
      return c.json(
        {
          success: false,
          error: 'Invoice not found',
        },
        404
      );
    }

    const items = await db.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, id));

    // Generate HTML for PDF
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${invoice.invoiceNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .invoice-title { font-size: 32px; color: #333; font-weight: bold; }
    .invoice-number { font-size: 18px; color: #666; }
    .section { margin-bottom: 30px; }
    .section-title { font-size: 14px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
    .section-content { font-size: 16px; color: #333; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th { text-align: left; padding: 12px; background: #f5f5f5; font-size: 14px; color: #666; }
    td { padding: 12px; border-bottom: 1px solid #eee; }
    .amount { text-align: right; }
    .totals { margin-top: 30px; text-align: right; }
    .totals-row { display: flex; justify-content: flex-end; padding: 8px 0; }
    .totals-label { width: 150px; color: #666; }
    .totals-value { width: 100px; font-weight: bold; }
    .total-row { font-size: 20px; color: #333; border-top: 2px solid #333; padding-top: 15px; margin-top: 10px; }
    .status { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
    .status-draft { background: #e0e0e0; color: #666; }
    .status-sent { background: #fff3cd; color: #856404; }
    .status-paid { background: #d4edda; color: #155724; }
    .status-overdue { background: #f8d7da; color: #721c24; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="invoice-title">INVOICE</div>
      <div class="invoice-number">${invoice.invoiceNumber}</div>
    </div>
    <div>
      <span class="status status-${invoice.status}">${invoice.status}</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Bill To</div>
    <div class="section-content">
      <strong>${invoice.clientName}</strong><br>
      ${invoice.clientEmail}<br>
      ${invoice.clientAddress.replace(/\n/g, '<br>')}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Invoice Details</div>
    <div class="section-content">
      Invoice Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}<br>
      Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th style="width: 80px;">Quantity</th>
        <th style="width: 120px;">Price</th>
        <th style="width: 120px;" class="amount">Total</th>
      </tr>
    </thead>
    <tbody>
      ${items.map(item => `
        <tr>
          <td>${item.description}</td>
          <td>${item.quantity}</td>
          <td>$${item.price.toFixed(2)}</td>
          <td class="amount">$${(item.quantity * item.price).toFixed(2)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row">
      <div class="totals-label">Subtotal</div>
      <div class="totals-value">$${invoice.subtotal.toFixed(2)}</div>
    </div>
    ${invoice.tax > 0 ? `
      <div class="totals-row">
        <div class="totals-label">Tax</div>
        <div class="totals-value">$${invoice.tax.toFixed(2)}</div>
      </div>
    ` : ''}
    ${invoice.discount > 0 ? `
      <div class="totals-row">
        <div class="totals-label">Discount</div>
        <div class="totals-value">-$${invoice.discount.toFixed(2)}</div>
      </div>
    ` : ''}
    <div class="totals-row total-row">
      <div class="totals-label">Total</div>
      <div class="totals-value">$${invoice.total.toFixed(2)}</div>
    </div>
  </div>

  ${invoice.notes ? `
    <div class="section">
      <div class="section-title">Notes</div>
      <div class="section-content">${invoice.notes.replace(/\n/g, '<br>')}</div>
    </div>
  ` : ''}
</body>
</html>`;

    // Return HTML
    return c.html(html);
  } catch (error) {
    console.error('Error generating PDF:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to generate PDF',
      },
      500
    );
  }
});

// ============================================================================
// TEMPLATE ENDPOINTS
// ============================================================================

// Template validation schemas
const templateItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  price: z.number().min(0, 'Price must be positive'),
});

const createTemplateSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  description: z.string().optional(),
  defaultTax: z.number().min(0).default(0),
  defaultDiscount: z.number().min(0).default(0),
  defaultNotes: z.string().optional(),
  defaultDueDays: z.number().min(0).default(30),
  items: z.array(templateItemSchema).min(1, 'At least one item is required'),
});

const updateTemplateSchema = createTemplateSchema.partial();

// Get all templates
app.get('/templates', async (c) => {
  try {
    const allTemplates = await db
      .select()
      .from(invoiceTemplates)
      .orderBy(invoiceTemplates.createdAt);

    // Get items for each template
    const templatesWithItems = await Promise.all(
      allTemplates.map(async (template) => {
        const items = await db
          .select()
          .from(templateItems)
          .where(eq(templateItems.templateId, template.id));
        return {
          ...template,
          items,
        };
      })
    );

    return c.json({
      success: true,
      data: templatesWithItems,
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to fetch templates',
      },
      500
    );
  }
});

// Get single template
app.get('/templates/:id', async (c) => {
  const id = c.req.param('id');

  try {
    const [template] = await db
      .select()
      .from(invoiceTemplates)
      .where(eq(invoiceTemplates.id, id));

    if (!template) {
      return c.json(
        {
          success: false,
          error: 'Template not found',
        },
        404
      );
    }

    const items = await db
      .select()
      .from(templateItems)
      .where(eq(templateItems.templateId, template.id));

    return c.json({
      success: true,
      data: {
        ...template,
        items,
      },
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to fetch template',
      },
      500
    );
  }
});

// Create template
app.post('/templates', zValidator('json', createTemplateSchema), async (c) => {
  const data = c.req.valid('json');

  try {
    const templateId = crypto.randomUUID();

    // Insert template
    await db.insert(invoiceTemplates).values({
      id: templateId,
      name: data.name,
      description: data.description,
      defaultTax: data.defaultTax,
      defaultDiscount: data.defaultDiscount,
      defaultNotes: data.defaultNotes,
      defaultDueDays: data.defaultDueDays,
    });

    // Insert items
    await Promise.all(
      data.items.map((item) =>
        db.insert(templateItems).values({
          id: crypto.randomUUID(),
          templateId,
          description: item.description,
          quantity: item.quantity,
          price: item.price,
        })
      )
    );

    // Fetch the created template with items
    const [template] = await db.select().from(invoiceTemplates).where(eq(invoiceTemplates.id, templateId));
    const items = await db.select().from(templateItems).where(eq(templateItems.templateId, templateId));

    return c.json(
      {
        success: true,
        data: {
          ...template,
          items,
        },
      },
      201
    );
  } catch (error) {
    console.error('Error creating template:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to create template',
      },
      500
    );
  }
});

// Update template
app.put('/templates/:id', zValidator('json', updateTemplateSchema), async (c) => {
  const id = c.req.param('id');
  const data = c.req.valid('json');

  try {
    // Check if template exists
    const [existingTemplate] = await db.select().from(invoiceTemplates).where(eq(invoiceTemplates.id, id));

    if (!existingTemplate) {
      return c.json(
        {
          success: false,
          error: 'Template not found',
        },
        404
      );
    }

    // If items are provided, update them
    if (data.items) {
      // Delete existing items
      await db.delete(templateItems).where(eq(templateItems.templateId, id));

      // Insert new items
      await Promise.all(
        data.items.map((item) =>
          db.insert(templateItems).values({
            id: crypto.randomUUID(),
            templateId: id,
            description: item.description,
            quantity: item.quantity,
            price: item.price,
          })
        )
      );
    }

    // Update other fields
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.defaultTax !== undefined) updateData.defaultTax = data.defaultTax;
    if (data.defaultDiscount !== undefined) updateData.defaultDiscount = data.defaultDiscount;
    if (data.defaultNotes !== undefined) updateData.defaultNotes = data.defaultNotes;
    if (data.defaultDueDays !== undefined) updateData.defaultDueDays = data.defaultDueDays;
    updateData.updatedAt = new Date().toISOString();

    await db.update(invoiceTemplates).set(updateData).where(eq(invoiceTemplates.id, id));

    // Fetch updated template
    const [updatedTemplate] = await db.select().from(invoiceTemplates).where(eq(invoiceTemplates.id, id));
    const items = await db.select().from(templateItems).where(eq(templateItems.templateId, id));

    return c.json({
      success: true,
      data: {
        ...updatedTemplate,
        items,
      },
    });
  } catch (error) {
    console.error('Error updating template:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to update template',
      },
      500
    );
  }
});

// Delete template
app.delete('/templates/:id', async (c) => {
  const id = c.req.param('id');

  try {
    const [template] = await db.select().from(invoiceTemplates).where(eq(invoiceTemplates.id, id));

    if (!template) {
      return c.json(
        {
          success: false,
          error: 'Template not found',
        },
        404
      );
    }

    // Delete template (cascade will delete items)
    await db.delete(invoiceTemplates).where(eq(invoiceTemplates.id, id));

    return c.json({
      success: true,
      message: 'Template deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting template:', error);
    return c.json(
      {
        success: false,
        error: 'Failed to delete template',
      },
      500
    );
  }
});

export default app;
