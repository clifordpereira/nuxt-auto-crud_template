import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
// Force restart
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxthub/core',
    'nuxt-auth-utils',
    '@vueuse/nuxt',
    'nuxt-authorization',
    'nuxt-auto-crud',
    '@nuxt/content',
    '@nuxt/image',
    'nuxt-og-image',
    '@nuxt/scripts',
    '@nuxt/fonts',
  ],

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    adminEmail: 'admin@example.com',
    adminPassword: '$1Password',
    public: {
      crudBaseUrl: '/api',
    },
  },

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: '2024-11-27',

  hub: {
    db: 'sqlite',
  },

  nitro: {
    preset: 'cloudflare_module',
    compressPublicAssets: true,

    experimental: {
      tasks: true,
      openAPI: true,
    },
  },

  image: {
    domains: ['img.youtube.com', 'i.ytimg.com'],
  },

  routeRules: {
    '/': { isr: 3600 },
    '/docs/**': { isr: 86400 },
  },

  autoCrud: {
    schemaPath: 'server/db/schema',
    auth: {
      type: 'session',
      authentication: true,
      authorization: true,
    },
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs',
      },
    },
  },
  scripts: {
    registry: {
      googleAnalytics: {
        id: process.env.NUXT_PUBLIC_GA_ID || '',
      },
    },
  },
})
