const SITE_TITLE = 'Guest list creator'
const SITE_DESCRIPTION = 'Easily and simply create a list of guests!'
const SITE_URL = 'http://guests.tokyosession.tokyo'
module.exports = {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: SITE_TITLE,
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no'
      },
      {
        hid: 'description',
        name: 'description',
        content: SITE_DESCRIPTION
      },
      { hid: 'og:title', property: 'og:title', content: SITE_TITLE },
      {
        hid: 'og:description',
        property: 'og:description',
        content: SITE_DESCRIPTION
      },
      { hid: 'og:site_name', property: 'og:site_name', content: SITE_TITLE },
      { hid: 'og:type', property: 'og:type', content: 'article' },
      { hid: 'og:url', property: 'og:url', content: SITE_URL },
      {
        hid: 'og:image',
        property: 'og:image',
        content: `${SITE_URL}/ogp.jpg`
      },
      { hid: 'twitter:card', name: 'twitter:card', content: 'summary' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Asap&display=swap'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    'element-ui/lib/theme-chalk/index.css',
    '@/assets/stylesheets/main.scss'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@/plugins/element-ui'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    transpile: [/^element-ui/],
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
