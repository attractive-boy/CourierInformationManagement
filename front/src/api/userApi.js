/**
 * 跟用户有关的操作
 */
import request from '@/util/request'
import { UserTypeMap } from '@/util/constant'
import { getToken, removeToken } from '@/util/auth'

const api_name = '/user'

/**
 * 用户登录，需要包含字段：username、password、userTypeName
 * @param {Object} loginUserInfo 登录用户的信息 
 */
export const submitLogin = (username, password, userTypeName) => {
    return request({
        url: `${api_name}/login`,
        method: 'post',
        data: {
            username: username,
            password: password,
            userType: UserTypeMap[userTypeName],
        },
    })
}
    
/**
 * 用户注册，需要包含字段：username、password、userTypeName, email
 */
export const submitRegister = (username, password, userTypeName, email) => {
    return request({
        url: `${api_name}/register`,
        method: 'put',
        data: {
            username: username,
            password: password,
            userType: UserTypeMap[userTypeName],
            email: email
        },
    })
}
/**
 * 简化一下，不搞分页查询了
 * @returns 
 */
export const getUserList = () => {
    return request({
        url: `${api_name}/getUserList`,
        method: 'get',
    })
}
/**
 * 根据用户名删除删除用户
 */
export const deleteUser = (user) => {
    return request({
        url: `${api_name}/delete/${user.username}`,
        method: 'delete'
    })
}

/**
 * 更新用户信息
 */
export const updateUser = (user) => {
    return request({
        url: `${api_name}/update`,
        method: 'put',
        data: user
    })
}

/**
 * 根据 token 拿到用户信息
 */
export const getUserInfo = () => {
    return request({
        url: `${api_name}/getUserInfo`,
        method: 'get'
    })
}

// 退出登录，本地扔掉 token 即可
export const logout = () => {
    removeToken()
}

// 当前会话是否过期（token 没过期就没过期）
export const isActive = () => {
    const token = getToken()
    if (!token) {
        return false
    }
    let payload;
    try {
        // 产生异常说明解码失败，token 过期
        payload = JSON.parse(atob(token.split('.')[1]))
    } catch(err) {
        removeToken()
        return false
    }
    // token 没有过期并且全局存储中有用户的信息
    return payload.exp > Date.now() / 1000
}

export const getTokenUserInfo = () => {
    const token = getToken()
    if (!token) {
        return false
    }
    let payload;
    try {
        // 产生异常说明解码失败，token 过期
        payload = JSON.parse(atob(token.split('.')[1]))
    } catch(err) {
        removeToken()
        return false
    }
    // token 没有过期并且全局存储中有用户的信息
    return payload
}