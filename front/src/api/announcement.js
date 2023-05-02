/**
 * 跟公告有关的操作
 */
import request from '@/util/request'

const api_name = '/announcement'

/**
 * 简化一下，不搞分页查询了 
 */
export const getannouncement = () => {
    return request({
        url: `${api_name}/getannouncement`,
        method: 'get',
    })
}


/**
 * 根据订单号删除订单（软删除，订单很重要）
 */
export const deleteannouncement = (id) => {
    return request({
        url: `${api_name}/delete/${id}`,
        method: 'delete'
    })
}

export const addannouncement = (order) => {
    return request({
        url: `${api_name}/add`,
        method: 'post',
        data: order
    })
}

export const updateannouncement = (order) => {
    return request({
        url: `${api_name}/update`,
        method: 'post',
        data: order
    })
}

