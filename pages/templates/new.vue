<template>
  <div class="max-w-4xl mx-auto">
    <!-- Page header -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-gray-900">Create New Template</h2>
      <p class="mt-1 text-sm text-gray-600">Create a reusable invoice template.</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Template Information -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Template Information</h3>

        <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <label for="name" class="block text-sm font-medium text-gray-700">
              Template Name <span class="text-red-500">*</span>
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="e.g., Web Development Services"
            />
          </div>

          <div class="sm:col-span-2">
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              v-model="form.description"
              rows="2"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Brief description of this template (optional)"
            ></textarea>
          </div>

          <div>
            <label for="defaultTax" class="block text-sm font-medium text-gray-700">Default Tax</label>
            <input
              id="defaultTax"
              v-model.number="form.defaultTax"
              type="number"
              min="0"
              step="0.01"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="0.00"
            />
          </div>

          <div>
            <label for="defaultDiscount" class="block text-sm font-medium text-gray-700">Default Discount</label>
            <input
              id="defaultDiscount"
              v-model.number="form.defaultDiscount"
              type="number"
              min="0"
              step="0.01"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="0.00"
            />
          </div>

          <div>
            <label for="defaultDueDays" class="block text-sm font-medium text-gray-700">Default Due Days</label>
            <input
              id="defaultDueDays"
              v-model.number="form.defaultDueDays"
              type="number"
              min="0"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="30"
            />
            <p class="mt-1 text-xs text-gray-500">
              Number of days after invoice date
            </p>
          </div>
        </div>
      </div>

      <!-- Default Notes -->
      <div class="bg-white shadow rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Default Notes</h3>
        <textarea
          v-model="form.defaultNotes"
          rows="3"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Default notes to include in invoices (optional)"
        ></textarea>
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

      <!-- Preview -->
      <div class="bg-gray-50 rounded-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Template Preview</h3>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">Total Items:</span>
            <span class="font-medium">{{ form.items.length }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Subtotal:</span>
            <span class="font-medium">${{ subtotal.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Default Tax:</span>
            <span class="font-medium">${{ form.defaultTax.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Default Discount:</span>
            <span class="font-medium">${{ form.defaultDiscount.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between border-t border-gray-300 pt-2">
            <span class="text-gray-900 font-bold">Estimated Total:</span>
            <span class="font-bold text-blue-600">${{{ form.defaultTax - form.defaultDiscount + subtotal).toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-3">
        <NuxtLink
          to="/templates"
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
          {{ loading ? 'Saving...' : 'Create Template' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { Plus, Trash2, Save } from 'lucide-vue-next';

const router = useRouter();
const loading = ref(false);

const form = ref({
  name: '',
  description: '',
  defaultTax: 0,
  defaultDiscount: 0,
  defaultDueDays: 30,
  defaultNotes: '',
  items: [
    {
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      price: 0,
    },
  ],
});

const subtotal = computed(() => {
  return form.value.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
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

    const response = await fetch('/api/templates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.value),
    });

    const result = await response.json();

    if (result.success) {
      router.push('/templates');
    } else {
      alert('Failed to create template: ' + result.error);
    }
  } catch (error) {
    console.error('Error creating template:', error);
    alert('An error occurred while creating template.');
  } finally {
    loading.value = false;
  }
};
</script>
