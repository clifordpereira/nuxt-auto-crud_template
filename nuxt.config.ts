// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxt/scripts',
    '@nuxt/fonts',
    "nuxt-security",
    '@vueuse/nuxt',
    'nuxt-og-image',
    '@nuxthub/core',
    'nuxt-delay-hydration',
    'nuxt-auth-utils',
    'nuxt-authorization',
    'nuxt-nodemailer',
    'nuxt-auto-crud',
  ],

  ssr: true,

  devtools: {
    enabled: true,
  },

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

  routeRules: {
    '/docs': { redirect: '/docs/auto-crud', prerender: false },
    '/_ipx/**': { headers: { 'cache-control': 'max-age=31536000, public, immutable' } },
    '/blog/**': { swr: true },
    '/changelog/**': { swr: true },
  },

  compatibilityDate: '2024-07-11',

  nitro: {
    // preset: 'cloudflare_module',
    prerender: {
      routes: [
        '/',
      ],
      crawlLinks: true,
    },
    experimental: {
      tasks: true,
    },
  },

  experimental: {
    payloadExtraction: true,
    sharedPrerenderData: true,
    renderJsonPayloads: true,
  },

  hub: {
    db: 'sqlite',
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
  fonts: {
    families: [
      { name: 'Public Sans', provider: 'google' }
    ],
    experimental: {
      processCSSVariables: true
    }
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
  delayHydration: {
    mode: 'mount',
    debug: process.env.NODE_ENV === 'development'
  },
  security: {
    headers: {
      crossOriginEmbedderPolicy: process.env.NODE_ENV === 'development' ? 'unsafe-none' : 'require-corp',
    },
  },
})
