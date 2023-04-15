/**
 * JWT 工具模块
 */
const jwt = require('jsonwebtoken')
const {jwtConfig} = require('./config')

module.exports = {
    /**
     * 生成 JWT token
     * @param {Object} payload 
     * @returns 
     */
    getJwtToken(payload) {
        return jwt.sign(payload, jwtConfig.secret, jwtConfig.expiresIn)
    },
    /**
     * 校验 JWT Token 是否有效，有效则返回解码后的结果
     * @param {String} token jwt token
     */
    verifyToken: (token) => {
        return new Promise((res, rej) => {
            jwt.verify(token, jwtConfig.secret, (err, decoded) => {
                if (err) {
                    rej(err);
                    return;
                }
                res(decoded);
            })
        })
    }
}