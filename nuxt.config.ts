import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
// Force restart
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    '@vueuse/nuxt',
    'nuxt-og-image',
    '@nuxthub/core',
    'nuxt-auth-utils',
    'nuxt-authorization',
    'nuxt-nodemailer',
    'nuxt-auto-crud',
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
    oauth: {
      github: {
        clientId: process.env.NUXT_OAUTH_GITHUB_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_GITHUB_CLIENT_SECRET
      },
      google: {
        clientId: process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID,
        clientSecret: process.env.NUXT_OAUTH_GOOGLE_CLIENT_SECRET
      }
    },
    resendApiKey: process.env.NUXT_RESEND_API_KEY,
  },

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: '2024-11-27',

  hub: {
    db: 'sqlite',
  },

  nitro: {
    // preset: 'firebase_app_hosting',
    preset: 'cloudflare_module',
    compressPublicAssets: true,

    experimental: {
      tasks: true,
      openAPI: true,
    },
    // Prevent bundling of these on the server as they are browser-only
    alias: {
      'jspdf': 'unenv/runtime/mock/proxy',
      'xlsx': 'unenv/runtime/mock/proxy',
      'jspdf-autotable': 'unenv/runtime/mock/proxy',
    }
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
  build: {
    transpile: ['jspdf', 'xlsx', 'jspdf-autotable']
  },
  nodemailer: {
    from: process.env.NUXT_NODEMAILER_FROM || '"Cliford Pereira" <cliford.pereira@gmail.com>',
    host: process.env.NUXT_NODEMAILER_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.NUXT_NODEMAILER_PORT || '465'),
    secure: process.env.NUXT_NODEMAILER_SECURE !== 'false', // Default to true
    auth: {
      user: process.env.NUXT_NODEMAILER_USER || 'cliford.pereira@gmail.com',
      pass: process.env.NUXT_NODEMAILER_AUTH_PASS || '',
    },
  },
})
