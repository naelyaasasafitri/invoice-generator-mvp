<template>
  <div class="max-w-4xl mx-auto">
    <!-- Page header -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900">Create New Invoice</h2>
      <p class="mt-1 text-sm text-gray-600">Fill in the details to create a new invoice.</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Template selection -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Start</h3>
        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label for="templateSelect" class="block text-sm font-medium text-gray-700">
              Load from Template
            </label>
            <select
              id="templateSelect"
              v-model="selectedTemplate"
              @change="loadTemplate"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">-- Select a template (optional) --</option>
              <option v-for="template in templates" :key="template.id" :value="template.id">
                {{ template.name }} {{ template.description ? `- ${template.description}` : '' }}
              </option>
            </select>
            <p class="mt-1 text-xs text-gray-500">
              Start with a pre-configured template to save time
            </p>
          </div>

          <div class="flex items-end">
            <NuxtLink
              to="/templates"
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <LayoutTemplate class="w-4 h-4 mr-2" />
              Manage Templates
            </NuxtLink>
          </div>
        </div>
      </div>
      <!-- Client Information -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Client Information</h3>
        
        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label for="clientName" class="block text-sm font-medium text-gray-700">
              Client Name <span class="text-red-500">*</span>
            </label>
            <input
              id="clientName"
              v-model="form.clientName"
              type="text"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter client name"
            />
          </div>

          <div>
            <label for="clientEmail" class="block text-sm font-medium text-gray-700">
              Client Email <span class="text-red-500">*</span>
            </label>
            <input
              id="clientEmail"
              v-model="form.clientEmail"
              type="email"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="client@example.com"
            />
          </div>

          <div class="sm:col-span-2">
            <label for="clientAddress" class="block text-sm font-medium text-gray-700">
              Client Address <span class="text-red-500">*</span>
            </label>
            <textarea
              id="clientAddress"
              v-model="form.clientAddress"
              rows="2"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter client address"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Invoice Details -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Invoice Details</h3>
        
        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label for="invoiceDate" class="block text-sm font-medium text-gray-700">
              Invoice Date <span class="text-red-500">*</span>
            </label>
            <input
              id="invoiceDate"
              v-model="form.invoiceDate"
              type="date"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label for="dueDate" class="block text-sm font-medium text-gray-700">
              Due Date <span class="text-red-500">*</span>
            </label>
            <input
              id="dueDate"
              v-model="form.dueDate"
              type="date"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status"
              v-model="form.status"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Line Items -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">Line Items</h3>
          <button
            type="button"
            @click="addLineItem"
            class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
          >
            <Plus class="w-3 h-3 mr-1" />
            Add Item
          </button>
        </div>

        <div class="space-y-4">
          <div
            v-for="(item, index) in form.items"
            :key="item.id || index"
            class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-12 items-start"
          >
            <div class="sm:col-span-6">
              <label class="block text-sm font-medium text-gray-700">Description</label>
              <input
                v-model="item.description"
                type="text"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Item description"
              />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Quantity</label>
              <input
                v-model.number="item.quantity"
                type="number"
                min="1"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Price</label>
              <input
                v-model.number="item.price"
                type="number"
                min="0"
                step="0.01"
                required
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="0.00"
              />
            </div>

            <div class="sm:col-span-2 flex items-end">
              <div class="w-full flex items-center justify-between">
                <span class="text-sm font-medium text-gray-900">
                  ${{ (item.quantity * item.price).toFixed(2) }}
                </span>
                <button
                  v-if="form.items.length > 1"
                  type="button"
                  @click="removeLineItem(index)"
                  class="text-red-600 hover:text-red-800"
                >
                  <Trash2 class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Totals -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-end space-y-2">
          <div class="w-64 space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Subtotal</span>
              <span class="font-medium text-gray-900">${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Tax</span>
              <div class="flex items-center">
                <span class="mr-2 font-medium text-gray-900">${{ tax.toFixed(2) }}</span>
                <input
                  v-model.number="form.tax"
                  type="number"
                  min="0"
                  step="0.01"
                  class="w-20 border border-gray-300 rounded-md shadow-sm py-1 px-2 text-right text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Discount</span>
              <div class="flex items-center">
                <span class="mr-2 font-medium text-gray-900">${{ discount.toFixed(2) }}</span>
                <input
                  v-model.number="form.discount"
                  type="number"
                  min="0"
                  step="0.01"
                  class="w-20 border border-gray-300 rounded-md shadow-sm py-1 px-2 text-right text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div class="border-t border-gray-200 pt-2">
              <div class="flex justify-between text-lg font-bold">
                <span class="text-gray-900">Total</span>
                <span class="text-blue-600">${{ total.toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Notes</h3>
        <textarea
          v-model="form.notes"
          rows="3"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Add any notes for the client (optional)"
        ></textarea>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-3">
        <NuxtLink
          to="/"
          class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </NuxtLink>
        <button
          type="submit"
          :disabled="loading"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save v-if="!loading" class="w-4 h-4 mr-2" />
          <div v-else class="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          {{ loading ? 'Saving...' : 'Create Invoice' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Plus, Trash2, Save, LayoutTemplate } from 'lucide-vue-next';

const router = useRouter();
const loading = ref(false);
const templates = ref<any[]>([]);
const selectedTemplate = ref('');

// Load template from URL query parameter
const route = useRoute();
if (route.query.template) {
  selectedTemplate.value = route.query.template as string;
}

const fetchTemplates = async () => {
  try {
    const response = await fetch('/api/templates');
    const result = await response.json();

    if (result.success) {
      templates.value = result.data;
    }
  } catch (error) {
    console.error('Error fetching templates:', error);
  }
};

const loadTemplate = async () => {
  if (!selectedTemplate.value) {
    return;
  }

  try {
    const response = await fetch(`/api/templates/${selectedTemplate.value}`);
    const result = await response.json();

    if (result.success) {
      const template = result.data;

      // Load template data into form
      form.value.notes = template.defaultNotes || '';
      form.value.tax = template.defaultTax || 0;
      form.value.discount = template.defaultDiscount || 0;

      // Calculate due date based on template default due days
      if (template.defaultDueDays) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + template.defaultDueDays);
        form.value.dueDate = dueDate.toISOString().split('T')[0];
      }

      // Load items
      form.value.items = template.items.map((item: any) => ({
        id: crypto.randomUUID(),
        description: item.description,
        quantity: item.quantity,
        price: item.price,
      }));
    }
  } catch (error) {
    console.error('Error loading template:', error);
  }
};

onMounted(() => {
  fetchTemplates();
});

const form = ref({
  clientName: '',
  clientEmail: '',
  clientAddress: '',
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  status: 'draft' as 'draft' | 'sent' | 'paid' | 'overdue',
  notes: '',
  items: [
    {
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      price: 0,
    },
  ],
  tax: 0,
  discount: 0,
});

const subtotal = computed(() => {
  return form.value.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
});

const tax = computed(() => form.value.tax || 0);
const discount = computed(() => form.value.discount || 0);

const total = computed(() => {
  return subtotal.value + tax.value - discount.value;
});

const addLineItem = () => {
  form.value.items.push({
    id: crypto.randomUUID(),
    description: '',
    quantity: 1,
    price: 0,
  });
};

const removeLineItem = (index: number) => {
  form.value.items.splice(index, 1);
};

const handleSubmit = async () => {
  try {
    loading.value = true;

    const response = await fetch('/api/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.value),
    });

    const result = await response.json();

    if (result.success) {
      router.push(`/invoice/${result.data.id}`);
    } else {
      alert('Failed to create invoice: ' + result.error);
    }
  } catch (error) {
    console.error('Error creating invoice:', error);
    alert('An error occurred while creating the invoice.');
  } finally {
    loading.value = false;
  }
};
</script>
