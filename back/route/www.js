/**
 * 主要框架模块
 */
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwtUtil = require('../util/jwtUtil')
const userRouter = require('./user')
const orderRouter = require('./order')

const app = new express()
// 配置跨域问题
app.use(cors())
// body parser 中间件
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// 拦截器，查看是否携带 token
app.use((req, res, next) => {
    const path = req.path
    const token = req.headers['authorization']
    // 无需鉴权
    if (path === '/user/login' || path == '/user/register') {
        return next()
    }
    // 没有携带 token
    if (!token) {
        return res.json({
            code: 2001,
            message: '未登录，请先登录',
        })
    }
    // Jwt 鉴权
    jwtUtil.verifyToken(token)
        .then((data) => {
            // 鉴权成功则交给具体的路由
            req.user = data
            return next()
        })
        .catch((err) => {
            return res.json({
                code: 2002,
                message: 'token 校验失败，请重新登录',
            })
        })
})

// 允许客户端访问其他头文件
app.use((req, res, next) => {
    res.header('Access-Control-Expose-Headers', 'authorization')
    next()
})

// 引入路由
app.use('/user', userRouter)
app.use('/order', orderRouter)

// 统一处理
app.use('*', (req, res) => {
    return res.status(404).json({
        code: 404,
        message: '访问接口不存在',
    })
})

// 异常统一处理
app.use((err, req, res, next) => {
    console.log(err.message);
    console.log(err.stack);
    return res.status(502).json({
        code: 502,
        message: '服务器内部错误, 请联系管理员处理',
    })
})

module.exports = app