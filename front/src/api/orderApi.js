/**
 * 跟订单有关的操作
 */
import request from '@/util/request'

const api_name = '/order'

/**
 * 简化一下，不搞分页查询了 
 */
export const getOrderList = () => {
    return request({
        url: `${api_name}/getOrderList`,
        method: 'get',
    })
}

/**
 * 这个权限低点的也能查（只能查跟自己相关的） 
 */
export const getSelfOrderList = () => {
    return request({
        url: `${api_name}/getSelfOrderList`,
        method: 'get',
    })
}

/**
 * 根据订单号删除订单（软删除，订单很重要）
 */
export const deleteOrder = (order) => {
    return request({
        url: `${api_name}/delete/${order.id}`,
        method: 'delete'
    })
}

/**
 * 更新用户信息（只允许更新：发货仓、收获仓、运费）
 */
export const updateOrder = (order) => {
    return request({
        url: `${api_name}/update`,
        method: 'put',
        data: order
    })
}

export const addOrder = (order) => {
    return request({
        url: `${api_name}/addOrder`,
        method: 'post',
        data: order
    })
}

