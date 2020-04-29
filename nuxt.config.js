import pkg from './package'
require('dotenv').config()

export default {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: 'Birthdays',
    titleTemplate: '%s - Birthdays App',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: ['~/assets/css/custom.css'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/vue-flatpickr', '~/plugins/vue-moment', '~/plugins/vue-notification', '~/plugins/axios'],

  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/axios', '@nuxtjs/auth', '@nuxtjs/dotenv', '@nuxtjs/pwa',
    ['nuxt-fontawesome', {
      component: 'fa',
      imports: [
        //import whole set
        {
          set: '@fortawesome/free-brands-svg-icons',
          icons: ['faGoogle', 'faFacebookF']
        },
      ]
    }]
  ],

  purgeCSS: {
    whitelistPatterns: [/svg.*/, /fa.*/]
  },

  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    // baseURL: process.env.BASE_API_URL,
    baseURL: process.env.BASE_API_URL
  },

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: 'login',
            method: 'post',
            propertyName: 'access_token'
          },
          user: { url: 'me', method: 'get', propertyName: 'user' },
          logout: false
        }
      }
    },
    cookie: {
      options: {
        secure: process.env.APP_ENV == 'production',
        maxAge: 30 * 24 * 60 * 60
      },
    },
  },

  router: {
    middleware: ['auth']
  },

  buildModules: [
    '@nuxtjs/tailwindcss'
  ],

  /*
   ** Build configuration
   */
  build: {},

  pwa: {
    manifest: {
      "name": "Birthday App",
      "short_name": "Birthdays",
      "description": "App for managingbBirthday reminders and gift lists",
      "theme_color": "#bc0a6f",
      "background_color": "#ffffff",
      "display": "standalone",
      "orientation": "portrait",
      "scope": "/",
      "start_url": "/"
    },
    workbox: {
      runtimeCaching: [
        {
          urlPattern: process.env.BASE_API_URL + '/.+',
          handler: 'networkFirst',
          method: 'GET',
          strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
        }
      ]
    }
  }
}
