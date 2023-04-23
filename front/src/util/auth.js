// token 的 key 名
export const TokenKey = 'authorization'

// 获取 token
export function getToken() {
    return localStorage.getItem(TokenKey)
}
// 设置 token
export function setToken(token) {
    return localStorage.setItem(TokenKey, token)
}
// 扔掉 token
export function removeToken() {
    return localStorage.removeItem(TokenKey)
}