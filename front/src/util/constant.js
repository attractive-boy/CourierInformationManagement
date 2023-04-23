/**
 * 常量模块
 */
import {reactive} from "vue";

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
     * 操作员
     */
    OPERATOR: 2,
    /**
     * 司机
     */
    DRIVER: 3,
}

export const UserTypeMap = {
    '管理员': 1,
    '操作员': 2,
    '司机': 3
}

// 用户类型
export const UserTypeNameMap = {
    1: {name: '管理员', url: '/admin'},
    2: {name: '操作员', url: '/operator'},
    3: {name: '司机', url: '/driver'},
}

export const userHomeMap = {
    '管理员': '/admin',
    '操作员': '/operator',
    '司机': '/driver'
}

// 全部存储用户的登陆状态
export const STORE = {
    userState: reactive({
        type: UserType.UNKNOWN,
        data: {}
    })
}