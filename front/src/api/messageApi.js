/**
 * 跟留言有关的操作
 */
import request from '@/util/request'

const api_name = '/message'

/**
 * 简化一下，不搞分页查询了 
 */
export const getMessageList = () => {
    return request({
        url: `${api_name}/getAllMessage`,
        method: 'get',
    })
}

/**
 * 这个权限低点的也能查（只能查跟自己相关的） 
 */
export const getSelfMessageList = () => {
    return request({
        url: `${api_name}/getSelfMessage`,
        method: 'get',
    })
}

/**
 * 根据订单号删除订单（软删除，订单很重要）
 */
export const deleteMessage = (id) => {
    return request({
        url: `${api_name}/delete/${id}`,
        method: 'delete'
    })
}

export const addMessage = (order) => {
    return request({
        url: `${api_name}/addMessage`,
        method: 'post',
        data: order
    })
}

