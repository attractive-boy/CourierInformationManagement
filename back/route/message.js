/**
 * message 相关的路由操作
 */
const express = require('express')
const dbUtil = require('../util/dbUtil')
const { STATUS, userTypeNameMap } = require('../util/constant')
const orderStatus = STATUS.ORDER_STATUS
const orderRouter = express.Router()
// 导入uuid
const uuid = require('uuid')

/**
 * 获取所有订单
 */
orderRouter.get('/getAllMessage', (req, res) => {
    const curUser = req.user
    // 管理员才有的权限
    if (curUser.userType != userTypeNameMap.ADMIN) {
        res.json(STATUS.ILLEGAL_OPERATION)
    } else {
        // 获取未删除的订单
        dbUtil.exec("select * from tb_message", [])
            .then(results => {
                const ret = JSON.parse(JSON.stringify(orderStatus.ORDER_LIST))
                ret.data = results
                return res.json(ret)
            })
    }

})

/**
 * 获取自己的订单
 */
orderRouter.get('/getSelfMessage', (req, res) => {
    const curUser = req.user
    // 用户的权限
    if (curUser.userType != userTypeNameMap.OPERATOR) {
        return res.json(STATUS.ILLEGAL_OPERATION)
    }
    // 获取未删除的订单
    dbUtil.exec("select * from tb_message where userid = ?", [curUser.id])
        .then(results => {
            const ret = JSON.parse(JSON.stringify(orderStatus.ORDER_LIST))
            ret.data = results
            return res.json(ret)
        })
})

/**
 * 删除订单
 */
orderRouter.delete('/delete/:id', (req, res) => {
    const curUser = req.user
    // 管理员才有的权限
    if (curUser.userType != userTypeNameMap.ADMIN) {
        res.json(STATUS.ILLEGAL_OPERATION)
    }
    dbUtil.exec('Delete From tb_message where id = ?', req.params.id)
        .then(result => {
            if (result.affectedRows == 1) {
                return res.json(orderStatus.ORDER_DELETE_ERROR)
            }
            return res.json(orderStatus.ORDER_DELETE_SUCCESS)
        })
})

/**
 * 添加货单
 */
orderRouter.post('/addMessage', (req, res) => {
    const curUser = req.user
    // 用户的权限
    if (curUser.userType != userTypeNameMap.OPERATOR) {
        res.json(STATUS.ILLEGAL_OPERATION)
    }
    const { receiver, userid } = req.body
    console.log(req.body)
    dbUtil.exec(`insert tb_message
        (userid, message, date,id) values (?, ?, ?,?)`,
        [userid, receiver, new Date(), uuid.v1()])
        .then(result => {
            return res.json(orderStatus.ORDER_ADD_SUCCESS)
        }).catch(err => {
            console.log('err: ', err)
            return res.json(orderStatus.PENDING_ORDER_ADD_ERROR)
        })
})

module.exports = orderRouter