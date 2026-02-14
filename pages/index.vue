<template>
  <div>
    <!-- Page header -->
    <div class="md:flex md:items-center md:justify-between mb-8">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Invoices
        </h2>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">Loading invoices...</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="invoices.length === 0" class="text-center py-12">
      <FileText class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-semibold text-gray-900">No invoices</h3>
      <p class="mt-1 text-sm text-gray-500">
        Get started by creating a new invoice.
      </p>
      <div class="mt-6">
        <NuxtLink
          to="/new"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus class="w-4 h-4 mr-2" />
          Create Invoice
        </NuxtLink>
      </div>
    </div>

    <!-- Invoice list -->
    <div v-else class="bg-white shadow overflow-hidden sm:rounded-md">
      <ul role="list" class="divide-y divide-gray-200">
        <li v-for="invoice in invoices" :key="invoice.id">
          <NuxtLink :to="`/invoice/${invoice.id}`" class="block hover:bg-gray-50">
            <div class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-blue-600 truncate">
                    {{ invoice.invoiceNumber }}
                  </p>
                  <p class="mt-1 text-sm text-gray-600">
                    {{ invoice.clientName }}
                  </p>
                </div>
                <div class="ml-4 flex items-center space-x-4">
                  <p class="text-sm font-semibold text-gray-900">
                    ${{ invoice.total.toFixed(2) }}
                  </p>
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      statusClasses[invoice.status]
                    ]"
                  >
                    {{ invoice.status }}
                  </span>
                </div>
              </div>
              <div class="mt-2 sm:flex sm:justify-between">
                <div class="sm:flex">
                  <p class="flex items-center text-sm text-gray-500">
                    <Calendar class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    Due: {{ formatDate(invoice.dueDate) }}
                  </p>
                </div>
              </div>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { FileText, Plus, Calendar } from 'lucide-vue-next';

const loading = ref(true);
const invoices = ref<any[]>([]);

const statusClasses: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  overdue: 'bg-red-100 text-red-800',
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const fetchInvoices = async () => {
  try {
    const response = await fetch('/api/invoices');
    const result = await response.json();
    
    if (result.success) {
      invoices.value = result.data;
    } else {
      console.error('Failed to fetch invoices:', result.error);
    }
  } catch (error) {
    console.error('Error fetching invoices:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchInvoices();
});
</script>
