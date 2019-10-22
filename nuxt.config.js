import pkg from './package'
require('dotenv').config()

export default {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: 'Birthdays',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
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
  css: ['~/assets/css/tailwind.css', '~/assets/css/custom.scss'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/vue-flatpickr', '~/plugins/vue-moment'],

  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/axios', '@nuxtjs/auth', '@nuxtjs/dotenv'],

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
    }
  },

  router: {
    middleware: ['auth']
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
          options: {
            fix: true
          }
        })
      }
    }
  },

  workbox: {
    runtimeCaching: [
      {
        urlPattern: new RegExp('http://api.birthday-list.test/api/.*'),
        handler: 'cacheFirst',
        options: {
          cacheName: 'api',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 72 * 60 * 60
          },
          cacheableResponse: { statuses: [0, 200] }
        }
      }
    ]
  }
}
