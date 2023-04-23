/**
 * 测试模块，用以测试 jwtUtil 模块
 */
const { log } = require('console')
const jwtUtil = require('../util/jwtUtil')

// 测试数据
const user = {
    username: 'zhangsan',
    nickname: '小张',
}
/**
 * 测试生成 token
 */
const token = jwtUtil.getJwtToken(user)
log('getJwtToken: ' + token)

/**
 * 有效 token 验证测试
 */
jwtUtil.verifyToken(token)
    .then((data) => {
        log('验证成功:', data)
    })
    .catch((err) => {
        log('验证失败: ', err)
    })

/**
 * 无效 token 验证测试
 */
jwtUtil.verifyToken('token')
    .then((data) => {
        log('验证成功:', data)
    })
    .catch((err) => {
        log('验证失败: ', err)
    })
