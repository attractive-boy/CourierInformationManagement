/**
 * 启动模块，只负责启动
 */
const app = require('./route/www')
const {serverConfig} = require('./util/config')
// 启动服务
app.listen(serverConfig.port)