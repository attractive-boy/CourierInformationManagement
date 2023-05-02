const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8000,
    proxy: {
      '/chn': {
        target: 'https://www.sf-express.com/chn/',
        changeOrigin: true,
        pathRewrite: {'^/chn':''},
      },
      '/_nuxt':{
        target: 'https://www.sf-express.com/_nuxt/',
        changeOrigin: true,
        pathRewrite: {'^/_nuxt':''},
      },
      '/uploads':{
        target: 'https://www.sf-express.com/uploads/',
        changeOrigin: true,
        pathRewrite: {'^/uploads':''},
      },
      '/strapi':{
        target: 'https://www.sf-express.com/strapi/',
        changeOrigin: true,
        pathRewrite: {'^/strapi':''},
      }
    }
  }
})
