/**
 * user 相关的路由操作
 */
const express = require('express')
const jwtUtil = require('../util/jwtUtil')
const dbUtil = require('../util/dbUtil')

const userRouter = express.Router()

/**
 * 登录路由
 */
userRouter.post('/login', (req, res) => {
    const {username, password} = req.body
    dbUtil.exec('select * from tb_user where username = ? limit 1', [username])
        .then((data) => {
            if (data.length == 0 || data[0].password != password) {
                return res.json({
                    code: 2003,
                    message: '用户名或密码错误',
                })
            }
            res.setHeader('authorization', jwtUtil.getJwtToken({
                id: data[0].id,
                username: data[0].username,
            }))
            return res.json({
                code: 2000,
                message: '登陆成功',
            })
        })
})

/**
 * 注册路由
 */
userRouter.put('/register', (req, res) => {
    const {username, password, avator_id} = req.body
    dbUtil.exec('insert tb_user(username, password, avator_id) values(?, ?, ?)', [username, password, avator_id])
        .then((data) => {
            if (data.length == 0 || data[0].password != password) {
                return res.json({
                    code: 2003,
                    message: '用户名或密码错误',
                })
            }
            res.setHeader('authorization', jwtUtil.getJwtToken({
                id: data[0].id,
                username: data[0].username,
            }))
            return res.json({
                code: 2000,
                message: '登陆成功',
            })
        })
})
module.exports = userRouter