/**
 * announcement 相关的路由操作
 */
const express = require('express')
const dbUtil = require('../util/dbUtil')
const { STATUS, userTypeNameMap } = require('../util/constant')
const orderStatus = STATUS.ORDER_STATUS
const orderRouter = express.Router()
// 导入uuid
const uuid = require('uuid')

/**
 * 获取所有公告
 */
orderRouter.get('/getannouncement', (req, res) => {
    dbUtil.exec("select * from tb_announcement", [])
        .then(results => {
            const ret = JSON.parse(JSON.stringify(orderStatus.ORDER_LIST))
            ret.data = results
            return res.json(ret)
        }
        )
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
    dbUtil.exec('Delete From tb_announcement where id = ?', req.params.id)
        .then(result => {
            return res.json(orderStatus.ORDER_DELETE_SUCCESS)
        }).catch(err => {
            console.log('err: ', err)
            return res.json(orderStatus.ORDER_DELETE_ERROR)
        })
})

/**
 * 添加货单
 */
orderRouter.post('/add', (req, res) => {
    const { title, img,type } = req.body
    const id = uuid.v1()
    const createTime = new Date()
    const updateTime = new Date()
    console.log('createTime: ', createTime)
    dbUtil.exec('insert into tb_announcement(id, title ,img, date,type) values (?, ?, ?, ?,?)',
        [id, title, img, createTime, type])
        .then(result => {
            return res.json(orderStatus.ORDER_ADD_SUCCESS)
        }).catch(err => {
            console.log('err: ', err)
            return res.json(orderStatus.ORDER_ADD_ERROR)
        })
})

// 修改
orderRouter.put('/update', (req, res) => {
    const curUser = req.user
    // 用户的权限
    const { title, img, id,type } = req.body
    const updateTime = new Date()
    dbUtil.exec('update tb_announcement set title = ?, img = ?, date = ?,type = ? where id = ?',
        [title, img, updateTime,type, id])
        .then(result => {
            return res.json(orderStatus.ORDER_UPDATE_SUCCESS)
        }).catch(err => {
            console.log('err: ', err)
            return res.json(orderStatus.ORDER_UPDATE_ERROR)
        })
})

//图片上传
orderRouter.post('/upload', (req, res) => {
    return res.json(orderStatus.ORDER_UPLOAD_SUCCESS)
})

module.exports = orderRouter