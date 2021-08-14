module.exports = {
  lintOnSave: false,
  // 服務器不再同一個之上
  devServer: {
    host: "localhost",
    port: 8080,
    https: false,
    open: true,
    proxy: {
      '/admin': {
        // 代理api
        target: 'http://ceshi5.dishait.cn/admin',  //服務器api
        ws: true,  //proxy websockets
        changeOrigin: true, //是否跨域
        pathRewrite: { //重寫路徑
          '^/admin':'',
        }

      },
    }
  }
}