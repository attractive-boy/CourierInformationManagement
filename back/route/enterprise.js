/**
 * enterprise 相关的路由操作
 */
const express = require('express')
const jwtUtil = require('../util/jwtUtil')
const dbUtil = require('../util/dbUtil')

const enterpriseRouter = express.Router()

enterpriseRouter.post('*', (req, res) => {
    const i = null
    console.log(i.Router);
    return res.json({
        code: 2000,
        message: '访问成功',
        user: req.user
    })
})

module.exports = enterpriseRouter