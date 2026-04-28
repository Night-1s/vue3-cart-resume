const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
    publicPath: './',  // 关键：改相对路径
    outputDir: 'dist',
    productionSourceMap: false
})