<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-3">
            <FileText class="w-8 h-8 text-blue-600" />
            <h1 class="text-xl font-bold text-gray-900">Invoice Generator</h1>
          </div>
          <div class="flex items-center space-x-3">
            <NuxtLink
              to="/templates"
              class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <LayoutTemplate class="w-4 h-4 mr-2" />
              Templates
            </NuxtLink>
            <NuxtLink
              to="/"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus class="w-4 h-4 mr-2" />
              New Invoice
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
import { FileText, Plus, LayoutTemplate } from 'lucide-vue-next';
</script>
