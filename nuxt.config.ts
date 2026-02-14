// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
  ],

  tailwindcss: {
    viewer: false,
  },

  app: {
    head: {
      title: 'Invoice Generator MVP',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Simple invoice generator tool' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  nitro: {
    experimental: {
      openAPI: true,
    },
  },

  runtimeConfig: {
    public: {
      apiBase: '/api',
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },
})
