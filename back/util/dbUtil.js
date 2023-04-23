/**
 * dbUtil 工具类模块
 */
const mysql = require('mysql')
const {mysqlConfig} = require('./config')

// 创建 mysql 连接池
const connectionPool = mysql.createPool(mysqlConfig)

module.exports = {
    /**
     * 执行 SQL 语句
     * @param {String} sql 
     * @param {Array} params 
     * @returns SQL 执行结果
     */
    exec: (sql, params) => {
        return new Promise((res, rej) => {
            connectionPool.getConnection((err, conn) => {
                // 获取连接失败
                if (err) {
                    rej(err)
                } else {
                    conn.query(sql, params, (err, results) => {
                        conn.release()
                        if (err) {
                            rej(err)
                        } else {
                            res(results)
                        }
                    })
                }
            })
        })
    },
    /**
     * 关闭连接池
     */
    close: () => {
        connectionPool.end()
    }
}