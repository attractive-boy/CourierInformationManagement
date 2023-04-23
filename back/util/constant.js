/**
 * 常量模块
 */
module.exports = {
    /**
     * 用户默认状态（0，代表未激活）
     */
    defaultUserStatus: 0,
    /**
     * 用户类型哈希表
     */
    userTypeMap: {
        1: '管理员',
        2: '操作员',
        3: '司机',
    },
    userTypeNameMap: {
        ADMIN: 1,
        OPERATOR: 2,
        DRIVER: 3,
    },
    STATUS: {
        /**
         * 非法操作
         */
        ILLEGAL_OPERATION: {
            code: -1000,
            message: '非法操作'
        },
        /**
         * 用户接口相关的状态
         */
        USER_STATUS: {
            USER_LOGIN_SUCCESS: {
                code: 2000,
                message: '登陆成功'
            },
            USER_LOGIN_ERROR: {
                code: -2000,
                message: '登陆失败，请检查用户名、密码或用户类型'
            },
            USER_REGISTER_SUCCESS: {
                code: 2001,
                message: '用户注册成功'
            },
            USER_REGISTER_ERROR: {
                code: -2001,
                message: '用户注册失败，可能是用户名冲突，请更换后重试'
            },
            USER_LIST: {
                code: 2100,
                message: 'success'
            },
            USER_INFO: {
                code: 2100,
                message: 'success'
            },
            USER_DELETE_SUCCESS: {
                code: 2200,
                message: '删除成功'
            },
            USER_DELETE_ERROR: {
                code: -2200,
                message: '删除失败，你删你自己，泰库拉'
            },
            USER_UPDATE_SUCCESS: {
                code: 2300,
                message: '用户信息更新成功'
            }
        },
        /**
         * 订单接口相关状态
         */
        ORDER_STATUS: {
            PENDING_ORDER_ADD_SUCCESS: {
                code: 3000,
                message: '添加订单成功'
            },
            ORDER_LIST: {
                code: 3100,
                message: '查询成功'
            },
            ORDER_DELETE_SUCCESS: {
                code: 3200,
                message: '删除成功'
            },
            ORDER_DELETE_ERROR: {
                code: -3200,
                message: '删除失败'
            },
            ORDER_UPDATE_SUCCESS: {
                code: 3300,
                message: '用户信息更新成功'
            }
        }
    }
}