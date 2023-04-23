import {getToken, removeToken, setToken, TokenKey} from '@/util/auth'
import axios from "axios"
const BASE_URL = 'http://localhost:8080'

// 创建 axios 实例
const service = axios.create({
    baseURL: BASE_URL,
    timeout: 20000,
})

// http request 拦截器
service.interceptors.request.use((config) => {
    // 存在 token
    const token = getToken()
    if (token) {
        // token 过期
        try {
            // 产生异常说明解码失败，token 过期
            JSON.parse(atob(token.split('.')[1])).exp < Date.now() / 1000
        } catch(err) {
            removeToken()
            return
        }
        // 未过期，加入 header 
        config.headers[TokenKey] = token;
    }
    return config
}, (err) => {
    return Promise.reject(err)
})

// http response 拦截器
service.interceptors.response.use((res) => {
    // 响应头中有 token 则设置 token
    if (res.headers[TokenKey]) {
        setToken(res.headers[TokenKey])
    }
    return res;
}, (err) => {
    return Promise.reject(err)
})

export default service