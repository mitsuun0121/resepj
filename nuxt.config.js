import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - resepj',
    title: 'resepj',
    htmlAttrs: {
      lang: 'ja'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
      {
        name: 'Content-Security-Policy',
        content: "default-src 'self' https://js.stripe.com; style-src 'self' 'unsafe-inline'; script-src 'self' https://js.stripe.com 'unsafe-inline' 'sha256-MhJXriqz7P/nM/kr2Yx1NMDOvpWN8q2Gj8Kfm89ipjk=' 'sha256-M9GTWVAjmmod8xte6DeLdclRILIyoY6VQNBeumuPR6M=' 'sha256-0GFh/pGrvo5lj8HIdblYT2HwkwSJ0vlehXd07I/yN8c=';"
      }
    ],
    script: [
      {
        src: 'https://js.stripe.com',
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@mdi/font/css/materialdesignicons.css',
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '@/plugins/vee-validate.js', },
    { src: '~/plugins/stripe.js', mode: 'all' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/dotenv',
  ],

  auth: {
    redirect: {
      login: '/users/login',
      logout: '/',
      home: '/',
    },
    strategies: {
      'laravelUser': {
        provider: 'laravel/jwt', // Laravel JWTトークンプロバイダーを指定
        url: 'http://localhost',

        endpoints: {
          login: { url: '/api/auth/user/login', method: 'post', propertyName: 'access_token' },
          logout: { url: '/api/auth/user/logout', method: 'post' },
          refresh: { url: '/api/auth/user/refresh', method: 'post', propertyName: 'access_token' },
          user: { url: '/api/auth/user/user', method: 'get' },
        },

        token: {
          property: 'access_token',
          maxAge: 60 * 60,
        },

        refreshToken: {
          property: 'access_token',
          maxAge: 20160 * 60,
        },
      },

      'laravelAdmin': {
        provider: 'laravel/jwt', // Laravel JWTトークンプロバイダーを指定
        url: 'http://localhost',

        endpoints: {
          login: { url: '/api/auth/admin/login', method: 'post', propertyName: 'access_token' },
          logout: { url: '/api/auth/admin/logout', method: 'post' },
          refresh: { url: '/api/auth/admin/refresh', method: 'post', propertyName: 'access_token' },
          user: { url: '/api/auth/admin/user', method: 'get' },
        },

        token: {
          property: 'access_token',
          maxAge: 60 * 60,
        },

        refreshToken: {
          property: 'access_token',
          maxAge: 20160 * 60,
        },
      },

      'laravelOwner': {
        provider: 'laravel/jwt', // Laravel JWTトークンプロバイダーを指定
        url: 'http://localhost',

        endpoints: {
          login: { url: '/api/auth/owner/login', method: 'post', propertyName: 'access_token' },
          logout: { url: '/api/auth/owner/logout', method: 'post' },
          refresh: { url: '/api/auth/owner/refresh', method: 'post', propertyName: 'access_token' },
          user: { url: '/api/auth/owner/user', method: 'get' },
        },

        token: {
          property: 'access_token',
          maxAge: 60 * 60,
        },

        refreshToken: {
          property: 'access_token',
          maxAge: 20160 * 60,
        },
      },
    },
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: `${process.env.API_URL}`,
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    lang: {
      current: 'ja'
    },
    customVariables: ['~/assets/variables.scss'],
    theme: {
      light: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        light: {
          primary: '#3A4EFE',
          accent: colors.grey.lighten4,
          secondary: colors.blue.darken2,
          info: colors.yellow.darken3,
          warning: colors.amber.darken2,
          error: colors.deepOrange.darken3,
          success: colors.green.darken3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  env: {
    apiUrl: process.env.API_URL || 'http://localhost'
  },

  test: {
    testEnvironment: 'jsdom'
  },

}
