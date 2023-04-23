/**
 * config 模块，配置一些信息
 */
module.exports = {
    // 配置 mysql 数据库
    mysqlConfig: {
        host: '47.115.206.168',
        port: 3306,
        database: 'Logistics',
        user: 'wuliu',
        password: 'wuliu',
    },
    // 配置服务端口
    serverConfig: {
        port: 8080,
    },
    // JWT 配置
    jwtConfig: {
        secret: 'oUELRNxBGyaSrend++MzLhPNgwC+Q6+sjn7vHEt/o0KJJAcR7+Z6',
        expiresIn: {
            expiresIn: '1h',
        },
    }
}