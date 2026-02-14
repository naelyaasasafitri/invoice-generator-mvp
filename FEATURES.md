# Invoice Templates Feature

## Overview
Invoice templates allow you to create reusable invoice configurations, saving time when creating similar invoices.

## Features

### Create Template
- Define template name and description
- Set default tax and discount rates
- Configure default due date (in days)
- Add default notes
- Pre-define line items with descriptions, quantities, and prices

### Manage Templates
- View all templates in a card-based layout
- See quick summary of each template
- Delete templates you no longer need
- "Use" button to quickly create invoice from template

### Quick Invoice Creation
- Select template when creating new invoice
- Automatically populate:
  - Line items
  - Tax rate
  - Discount rate
  - Default notes
  - Due date (based on default due days)

## API Endpoints

### Templates
- `GET /api/templates` - Get all templates
- `GET /api/templates/:id` - Get single template
- `POST /api/templates` - Create template
- `PUT /api/templates/:id` - Update template
- `DELETE /api/templates/:id` - Delete template

## Database Schema

### invoice_templates Table
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Unique identifier |
| name | TEXT | Template name |
| description | TEXT | Template description |
| default_tax | INTEGER | Default tax amount |
| default_discount | INTEGER | Default discount amount |
| default_notes | TEXT | Default notes |
| default_due_days | INTEGER | Default payment terms in days |
| created_at | TEXT | Creation timestamp |
| updated_at | TEXT | Last update timestamp |

### template_items Table
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Unique identifier |
| template_id | TEXT | Reference to template |
| description | TEXT | Item description |
| quantity | INTEGER | Item quantity |
| price | INTEGER | Item price |
| created_at | TEXT | Creation timestamp |

## Usage Example

### 1. Create a Template
Go to `/templates/new` and fill in:
- Template name: "Web Development Package"
- Description: "Standard web development services"
- Default tax: $80
- Default due days: 30
- Items:
  - Frontend Development (10 hours @ $100/hr)
  - Backend Development (10 hours @ $100/hr)

### 2. Create Invoice from Template
Go to `/new` and:
1. Select "Web Development Package" from template dropdown
2. Fill in client information
3. Adjust quantities or prices if needed
4. Add or remove items as necessary
5. Save invoice

### 3. Reuse Template
The template remains available for future invoices with the same structure.

## Benefits

1. **Time Saving**: Create invoices in seconds instead of minutes
2. **Consistency**: Ensure similar invoices have the same structure
3. **Flexibility**: Templates are starting points, can be modified per invoice
4. **Scalability**: Create as many templates as needed for different services

## Tips

- Create templates for your most common services
- Use descriptive names to easily identify templates
- Include standard terms in default notes
- Update templates when prices or services change
- Use templates for recurring client relationships
