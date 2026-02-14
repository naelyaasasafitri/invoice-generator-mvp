<template>
  <div>
    <!-- Page header -->
    <div class="md:flex md:items-center md:justify-between mb-8">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          Invoice Templates
        </h2>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4 space-x-3">
        <NuxtLink
          to="/templates/new"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus class="w-4 h-4 mr-2" />
          New Template
        </NuxtLink>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">Loading templates...</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="templates.length === 0" class="text-center py-12">
      <LayoutTemplate class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-2 text-sm font-semibold text-gray-900">No templates</h3>
      <p class="mt-1 text-sm text-gray-500">
        Create templates to save time when creating invoices.
      </p>
      <div class="mt-6">
        <NuxtLink
          to="/templates/new"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus class="w-4 h-4 mr-2" />
          Create Template
        </NuxtLink>
      </div>
    </div>

    <!-- Template list -->
    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="template in templates"
        :key="template.id"
        class="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div class="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-medium text-gray-900">{{ template.name }}</h3>
              <p v-if="template.description" class="mt-1 text-sm text-gray-500">
                {{ template.description }}
              </p>
            </div>
            <div class="flex space-x-2">
              <button
                @click="useTemplate(template.id)"
                class="text-blue-600 hover:text-blue-800 p-1"
                title="Use this template"
              >
                <Check class="w-5 h-5" />
              </button>
              <button
                @click="deleteTemplate(template.id)"
                class="text-red-600 hover:text-red-800 p-1"
                title="Delete template"
              >
                <Trash2 class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <div class="px-4 py-5 sm:px-6">
          <dl class="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            <div>
              <dt class="text-xs font-medium text-gray-500">Default Tax</dt>
              <dd class="mt-1 text-sm text-gray-900">${{ template.defaultTax.toFixed(2) }}</dd>
            </div>
            <div>
              <dt class="text-xs font-medium text-gray-500">Default Discount</dt>
              <dd class="mt-1 text-sm text-gray-900">${{ template.defaultDiscount.toFixed(2) }}</dd>
            </div>
            <div>
              <dt class="text-xs font-medium text-gray-500">Default Due Days</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ template.defaultDueDays }} days</dd>
            </div>
            <div>
              <dt class="text-xs font-medium text-gray-500">Line Items</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ template.items.length }}</dd>
            </div>
          </dl>

          <div class="mt-4">
            <p class="text-xs font-medium text-gray-500 mb-2">Items:</p>
            <ul class="space-y-1">
              <li
                v-for="item in template.items.slice(0, 3)"
                :key="item.id"
                class="text-xs text-gray-600"
              >
                • {{ item.description }} (x{{ item.quantity }})
              </li>
              <li v-if="template.items.length > 3" class="text-xs text-gray-500">
                ...and {{ template.items.length - 3 }} more
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { LayoutTemplate, Plus, Check, Trash2 } from 'lucide-vue-next';

const router = useRouter();
const loading = ref(true);
const templates = ref<any[]>([]);

const fetchTemplates = async () => {
  try {
    const response = await fetch('/api/templates');
    const result = await response.json();

    if (result.success) {
      templates.value = result.data;
    } else {
      console.error('Failed to fetch templates:', result.error);
    }
  } catch (error) {
    console.error('Error fetching templates:', error);
  } finally {
    loading.value = false;
  }
};

const useTemplate = (templateId: string) => {
  router.push(`/new?template=${templateId}`);
};

const deleteTemplate = async (templateId: string) => {
  if (!confirm('Are you sure you want to delete this template?')) {
    return;
  }

  try {
    const response = await fetch(`/api/templates/${templateId}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (result.success) {
      templates.value = templates.value.filter((t) => t.id !== templateId);
    } else {
      alert('Failed to delete template: ' + result.error);
    }
  } catch (error) {
    console.error('Error deleting template:', error);
    alert('An error occurred while deleting template.');
  }
};

onMounted(() => {
  fetchTemplates();
});
</script>
