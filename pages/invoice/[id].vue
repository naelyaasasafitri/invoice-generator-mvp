<template>
  <div class="max-w-4xl mx-auto">
    <!-- Loading state -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">Loading invoice...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12">
      <AlertCircle class="mx-auto h-12 w-12 text-red-400" />
      <h3 class="mt-2 text-sm font-semibold text-gray-900">Error</h3>
      <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
    </div>

    <!-- Invoice detail -->
    <div v-else-if="invoice">
      <!-- Page header -->
      <div class="md:flex md:items-center md:justify-between mb-8">
        <div class="flex-1 min-w-0">
          <NuxtLink to="/" class="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block">
            ← Back to invoices
          </NuxtLink>
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {{ invoice.invoiceNumber }}
          </h2>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <a
            :href="`/api/invoices/${invoice.id}/pdf`"
            target="_blank"
            class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download class="w-4 h-4 mr-2" />
            Download PDF
          </a>
          <button
            @click="deleteInvoice"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            <Trash2 class="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      <!-- Invoice content -->
      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                {{ invoice.clientName }}
              </h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500">
                {{ invoice.clientEmail }}
              </p>
              <p class="mt-1 text-sm text-gray-600 whitespace-pre-line">
                {{ invoice.clientAddress }}
              </p>
            </div>
            <span
              :class="[
                'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                statusClasses[invoice.status]
              ]"
            >
              {{ invoice.status }}
            </span>
          </div>
        </div>

        <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Invoice Date</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ formatDate(invoice.invoiceDate) }}
              </dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">Due Date</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ formatDate(invoice.dueDate) }}
              </dd>
            </div>
          </dl>
        </div>

        <!-- Items table -->
        <div class="border-t border-gray-200">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="item in invoice.items" :key="item.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ item.description }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ item.quantity }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${{ item.price.toFixed(2) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    ${{ (item.quantity * item.price).toFixed(2) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Totals -->
        <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
          <div class="flex justify-end">
            <div class="w-64 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-medium text-gray-900">${{ invoice.subtotal.toFixed(2) }}</span>
              </div>
              <div v-if="invoice.tax > 0" class="flex justify-between text-sm">
                <span class="text-gray-600">Tax</span>
                <span class="font-medium text-gray-900">${{ invoice.tax.toFixed(2) }}</span>
              </div>
              <div v-if="invoice.discount > 0" class="flex justify-between text-sm">
                <span class="text-gray-600">Discount</span>
                <span class="font-medium text-red-600">-${{ invoice.discount.toFixed(2) }}</span>
              </div>
              <div class="border-t border-gray-200 pt-2">
                <div class="flex justify-between text-lg font-bold">
                  <span class="text-gray-900">Total</span>
                  <span class="text-blue-600">${{ invoice.total.toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div v-if="invoice.notes" class="border-t border-gray-200 px-4 py-5 sm:px-6">
          <h4 class="text-sm font-medium text-gray-900 mb-2">Notes</h4>
          <p class="text-sm text-gray-600 whitespace-pre-line">
            {{ invoice.notes }}
          </p>
        </div>

        <!-- Footer -->
        <div class="border-t border-gray-200 px-4 py-4 sm:px-6 bg-gray-50">
          <div class="text-xs text-gray-500">
            Created: {{ formatDateTime(invoice.createdAt) }}
            <span v-if="invoice.updatedAt !== invoice.createdAt">
              | Updated: {{ formatDateTime(invoice.updatedAt) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { AlertCircle, Download, Trash2 } from 'lucide-vue-next';

const route = useRoute();
const loading = ref(true);
const error = ref<string | null>(null);
const invoice = ref<any>(null);

const statusClasses: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const fetchInvoice = async () => {
  try {
    const response = await fetch(`/api/invoices/${route.params.id}`);
    const result = await response.json();
    
    if (result.success) {
      invoice.value = result.data;
    } else {
      error.value = result.error || 'Failed to load invoice';
    }
  } catch (err) {
    console.error('Error fetching invoice:', err);
    error.value = 'An error occurred while loading the invoice.';
  } finally {
    loading.value = false;
  }
};

const deleteInvoice = async () => {
  if (!confirm('Are you sure you want to delete this invoice?')) {
    return;
  }

  try {
    const response = await fetch(`/api/invoices/${route.params.id}`, {
      method: 'DELETE',
    });
    
    const result = await response.json();

    if (result.success) {
      navigateTo('/');
    } else {
      alert('Failed to delete invoice: ' + result.error);
    }
  } catch (err) {
    console.error('Error deleting invoice:', err);
    alert('An error occurred while deleting the invoice.');
  }
};

onMounted(() => {
  fetchInvoice();
});
</script>
