/**
 * order 相关的路由操作
 */
const express = require('express')
const dbUtil = require('../util/dbUtil')
const {STATUS, userTypeNameMap} = require('../util/constant')
const orderStatus = STATUS.ORDER_STATUS
const orderRouter = express.Router()

/**
 * 获取所有订单
 */
orderRouter.get('/getOrderList', (req, res) => {
    const curUser = req.user
    // 管理员才有的权限
    if (curUser.userType != userTypeNameMap.ADMIN) {
        res.json(STATUS.ILLEGAL_OPERATION)
    }
    // 获取未删除的订单
    dbUtil.exec("select * from tb_order where is_deleted = 0", [])
    .then(results => {
        // 转为驼峰命名法
        for (let row of results) {
            row.operatorId = row.operator_id
            row.sendWarehouse = row.send_warehouse;  // 转换为 camelCase
            row.receiveWarehouse = row.receive_warehouse;
            row.orderStatus = row.order_status;
            delete row.send_warehouse;   // 删除原字段
            delete row.receive_warehouse;
            delete row.order_status;
            delete row.is_deleted
            delete row.operator_id
        }
        const ret = JSON.parse(JSON.stringify(orderStatus.ORDER_LIST))
        ret.data = results
        return res.json(ret)
    })
})

/**
 * 获取自己的订单
 */
orderRouter.get('/getSelfOrderList', (req, res) => {
    const curUser = req.user
    // 操作员的权限
    if (curUser.userType != userTypeNameMap.OPERATOR) {
        res.json(STATUS.ILLEGAL_OPERATION)
    }
    // 获取未删除的订单
    dbUtil.exec("select * from tb_order where is_deleted = 0 and operator_id = ?", [curUser.id])
    .then(results => {
        // 转为驼峰命名法
        for (let row of results) {
            row.operatorId = row.operator_id
            row.sendWarehouse = row.send_warehouse;  // 转换为 camelCase
            row.receiveWarehouse = row.receive_warehouse;
            row.orderStatus = row.order_status;
            delete row.send_warehouse;   // 删除原字段
            delete row.receive_warehouse;
            delete row.order_status;
            delete row.is_deleted
            delete row.operator_id
        }
        const ret = JSON.parse(JSON.stringify(orderStatus.ORDER_LIST))
        ret.data = results
        return res.json(ret)
    })
})

/**
 * 删除订单（软删除）
 */
orderRouter.delete('/delete/:orderId', (req, res) => {
    const curUser = req.user
    // 管理员才有的权限
    if (curUser.userType != userTypeNameMap.ADMIN) {
        res.json(STATUS.ILLEGAL_OPERATION)
    }
    dbUtil.exec('update tb_order set is_deleted = 1 where id = ?', req.params.orderId)
    .then(result => {
        if (result.affectedRows == 1) {
            return res.json(orderStatus.ORDER_DELETE_ERROR)
        }
        return res.json(orderStatus.ORDER_DELETE_SUCCESS)
    })
})

/**
 * 更新订单
 */
orderRouter.put('/update', (req, res) => {
    const curUser = req.user
    // 管理员才有的权限
    if (curUser.userType != userTypeNameMap.ADMIN) {
        res.json(STATUS.ILLEGAL_OPERATION)
    }
    const updateOrder = req.body
    dbUtil.exec('update tb_order set receive_warehouse=?, money=?, order_status=? where id=?', 
        [updateOrder.receiveWarehouse, updateOrder.money, updateOrder.orderStatus, updateOrder.id])
    .then(result => {
        // TODO: 如果更新用户状态，考虑是否增加邮件模块来通知
        return res.json(orderStatus.ORDER_UPDATE_SUCCESS)
    })
})

/**
 * 添加货单
 */
orderRouter.post('/addOrder', (req, res) => {
    const curUser = req.user
    // 操作员的权限
    if (curUser.userType != userTypeNameMap.OPERATOR) {
        res.json(STATUS.ILLEGAL_OPERATION)
    }
    const {sender, receiver, sendWarehouse, receiveWarehouse, money, orderStatus} = req.body
    dbUtil.exec(`insert tb_order
        (operator_id, sender, receiver, send_warehouse, receive_warehouse, money, order_status) values(?,?,?,?,?,?,?)`,
        [curUser.id, sender, receiver, sendWarehouse, receiveWarehouse, money, orderStatus])
    .then(result => {
        return res.json(orderStatus.PENDING_ORDER_ADD_SUCCESS)
    })
})

module.exports = orderRouter