/**
 * 常量模块
 */
import { reactive } from "vue";

export const UserType = {
    /**
     * 未知
     */
    UNKNOWN: 0,
    /**
     * 管理员
     */
    ADMIN: 1,
    /**
     * 用户
     */
    OPERATOR: 2,
}

export const UserTypeMap = {
    '管理员': 1,
    '用户': 2,
}

// 用户类型
export const UserTypeNameMap = {
    1: { name: '管理员', url: '/admin' },
    2: { name: '用户', url: '/operator' },
}

export const userHomeMap = {
    '管理员': '/admin',
    '用户': '/operator',
}

// 全部存储用户的登陆状态
export const STORE = {
    userState: reactive({
        type: UserType.UNKNOWN,
        data: {}
    })
}