/**
 * user 相关的路由操作
 */
const express = require('express')
const jwtUtil = require('../util/jwtUtil')
const dbUtil = require('../util/dbUtil')
const constant = require('../util/constant')
const status = constant.STATUS
const userStatus = status.USER_STATUS
const userRouter = express.Router()

/**
 * 登录路由
 */
userRouter.post('/login', (req, res) => {
    const { username, password, userType } = req.body
    dbUtil.exec('select * from tb_user where username = ? limit 1', [username])
        .then((result) => {
            // 登陆失败
            if (result.length == 0 || result[0].password != password || result[0].user_type != userType) {
                return res.json(userStatus.USER_LOGIN_ERROR)
            }
            res.setHeader('authorization', jwtUtil.getJwtToken({
                id: result[0].id,
                username: result[0].username,
                userType: result[0].user_type,
                userTypeName: result[0].user_type_name,
            }))
            return res.json(userStatus.USER_LOGIN_SUCCESS)
        })
})
/**
 * 根据 token 拿到用户信息
 */
userRouter.get('/getUserInfo', (req, res) => {
    const ret = JSON.parse(JSON.stringify(userStatus.USER_INFO))
    ret.data = req.user
    return res.json(ret)
})

/**
 * 注册路由
 */
userRouter.put('/register', (req, res) => {
    const { username, password, userType, email } = req.body
    const userTypeName = constant.userTypeMap[userType]
    if (!userTypeName) {
        // 非法操作，能进到这里基本上是通过非常规手段（越过前端）
        return res.json(status.ILLEGAL_OPERATION)
    }
    dbUtil.exec('select * from tb_user where username = ?', [username])
        .then(result => {
            if (result.length > 0) {
                // 用户名已存在,返回错误
                return res.json(userStatus.USER_REGISTER_ERROR);
            }
            dbUtil.exec('insert tb_user(username, password, user_type, user_type_name, email, status) values(?, ?, ?, ?, ?, ?)',
                [username, password, userType, userTypeName, email, constant.defaultUserStatus]
            )
                .then((data) => {
                    // 注册成功
                    res.setHeader('authorization', jwtUtil.getJwtToken({
                        id: data.insertId,
                        username: username,
                        userType: userType,
                        userTypeName: userTypeName,
                    }))
                    return res.json(userStatus.USER_REGISTER_SUCCESS)
                })
        })
})
/**
 * 查询用户列表（懒得分页了）
 */
userRouter.get('/getUserList', (req, res) => {
    const curUser = req.user
    // 管理员才有的权限
    if (curUser.userType != constant.userTypeNameMap.ADMIN) {
        res.json(status.ILLEGAL_OPERATION)
    }
    dbUtil.exec('select id,username,user_type,user_type_name,email,status from tb_user')
        .then(results => {
            // 转为驼峰命名法
            for (let row of results) {
                row.userType = row.user_type;
                row.userTypeName = row.user_type_name;
                delete row.user_type;
                delete row.user_type_name;
            }
            const ret = JSON.parse(JSON.stringify(userStatus.USER_LIST))
            ret.data = results
            return res.json(ret)
        })
})

/**
 * 查询所有用户列表
 */
userRouter.get('/getDriverList', (req, res) => {
    const curUser = req.user
    // 管理员才有的权限
    if (curUser.userType != constant.userTypeNameMap.ADMIN) {
        res.json(status.ILLEGAL_OPERATION)
    }
    dbUtil.exec('select id,username,email,status from tb_user where user_type=3')
        .then(results => {
            // 转为驼峰命名法
            for (let row of results) {
                row.userType = row.user_type;
                row.userTypeName = row.user_type_name;
                delete row.user_type;
                delete row.user_type_name;
            }
            const ret = JSON.parse(JSON.stringify(userStatus.USER_LIST))
            ret.data = results
            return res.json(ret)
        })
})

/**
 * 查询所有未激活账户
 */
userRouter.get('/getUnactiveUserList', (req, res) => {
    const curUser = req.user
    // 管理员才有的权限
    if (curUser.userType != constant.userTypeNameMap.ADMIN) {
        res.json(status.ILLEGAL_OPERATION)
    }
    dbUtil.exec('select id,username,email,status from tb_user where status=0')
        .then(results => {
            // 转为驼峰命名法
            for (let row of results) {
                row.userType = row.user_type;
                row.userTypeName = row.user_type_name;
                delete row.user_type;
                delete row.user_type_name;
            }
            const ret = JSON.parse(JSON.stringify(userStatus.USER_LIST))
            ret.data = results
            return res.json(ret)
        })
})

/**
 * 删除用户
 */
userRouter.delete('/delete/:username', (req, res) => {
    const curUser = req.user
    const delUsername = req.params.username
    // 管理员才有的权限
    if (curUser.userType != constant.userTypeNameMap.ADMIN) {
        return res.json(status.ILLEGAL_OPERATION)
    }
    if (delUsername == curUser.username) {
        return res.json(userStatus.USER_DELETE_ERROR)
    }
    dbUtil.exec('delete from tb_user where username = ?', [delUsername])
        .then(result => {
            return res.json(userStatus.USER_DELETE_SUCCESS)
        })
})
/**
 * 更新用户
 */
userRouter.put('/update', (req, res) => {
    const curUser = req.user
    // 管理员才有的权限
    if (curUser.userType != constant.userTypeNameMap.ADMIN) {
        return res.json(status.ILLEGAL_OPERATION)
    }
    const updateUser = req.body
    dbUtil.exec('update tb_user set email=?, status=? where username = ?', [updateUser.email, updateUser.status, updateUser.username])
        .then(result => {
            // TODO: 如果更新用户状态，考虑是否增加邮件模块来通知
            return res.json(userStatus.USER_UPDATE_SUCCESS)
        })
})

userRouter.put('/updatemyself', (req, res) => {
    const curUser = req.user
    const updateUser = req.body
    // 输出sql语句
    console.log('update tb_user set username = ' + updateUser.username + ',password = ' + updateUser.password + ' where id = ' + updateUser.id)
    dbUtil.exec('update tb_user set username = ?,password = ? where id = ?',  [updateUser.username, updateUser.password, updateUser.id])
        .then(result => {
            return res.json(userStatus.USER_UPDATE_SUCCESS)
        })
})

module.exports = userRouter