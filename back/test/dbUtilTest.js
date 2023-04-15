/**
 * 测试模块，用以测试 dbUtil 模块
 */
const { log } = require('console')
const dbUtil = require('../util/dbUtil')

// -------
let selectTest = null
let updateTest = null
let insertTest = null
let deleteTest = null
// -------


/**
 * 测试查询语句
 */
selectTest = true
const selectSql = 'select * from tb_user where id < ?'
const selectParams = [5]
if (selectTest) {
    dbUtil.exec(selectSql, selectParams)
        .then((data) => {
            log('测试成功：', data)
        })
        .catch((err) => {
            log('测试失败：', err)
        })
        .finally(() => {
            dbUtil.close()
        })
}


/**
 * 测试更新语句
 */
// updateTest = true
const updateSql = 'update tb_user set username = ? where id = ?'
const updateParams = ['admin', 1]
if (updateTest) {
    dbUtil.exec(updateSql, updateParams)
        .then((data) => {
            log('测试成功：', data)
        })
        .catch((err) => {
            log('测试失败：', err)
        })
        .finally(() => {
            dbUtil.close()
        })
}

/**
 * 测试插入语句
 */

// insertTest = true
const insertSql = 'update tb_user set name = ? where id > ?'
const insertParams = ['admin', 1]
if (insertTest) {
    dbUtil.exec(insertSql, insertParams)
    .then((data) => {
        log('测试成功：', data)
    })
    .catch((err) => {
        log('测试失败：', err)
    })
    .finally(() => {
        dbUtil.close()
    })
}

/**
 * 测试删除语句
 */
// deleteTest = true
const deleteSql = 'update tb_user set name = ? where id > ?'
const deleteParams = ['admin', 1]
if (deleteTest) {
    dbUtil.exec(deleteSql, deleteParams)
    .then((data) => {
        log('测试成功：', data)
    })
    .catch((err) => {
        log('测试失败：', err)
    })
    .finally(() => {
        dbUtil.close()
    })
}

