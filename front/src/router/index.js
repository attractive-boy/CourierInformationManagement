import {createRouter, createWebHashHistory} from 'vue-router'
import {UserTypeNameMap, UserType} from '@/util/constant'
// 引入页面组件
import Home from "@/components/Home";
import Login from "@/components/Login";
import Register from '@/components/Register'

import Admin from "@/components/admin/Admin";
import AdminUser from "@/components/admin/AdminUser";
import AdminUserAll from "@/components/admin/AdminUserAll";
import AdminOrder from "@/components/admin/AdminOrder"

import Operator from "@/components/operator/Operator";
import OperatorOrder from "@/components/operator/OperatorOrder";
import OperatorCompleteOrder from "@/components/operator/OperatorCompleteOrder";
import EnterpriseinfoView from "@/components/operator/Enterpriseinfo";
import message from "@/components/admin/Message";



// 路由配置
const routes = [
    {name: 'home', path: '/', redirect: {name: 'login'}},
    {name: 'login', path: '/login', component: Login},
    {name: 'register', path: '/register', component: Register},
    {
        name: 'admin',
        path: UserTypeNameMap[UserType.ADMIN].url,
        redirect: {name: 'admin-user'},
        component: Admin,
        children: [
            {
                name: 'admin-user',
                path: 'user',
                redirect: {name: 'admin-user-all'},
                component: AdminUser,
                children: [
                    {name: 'admin-user-all', path: '', component: AdminUserAll},
                ]
            },
            {name: 'admin-order', path: 'order', component: AdminOrder},
            // {name: 'admin-transport', path: 'transport', component: Transport},
            {name: 'admin-home', path: 'home', component: Home},
            {name: 'admin-message', path: 'message', component: message},
            {name: 'addannouncement', path: 'addannouncement', component: () => import('@/components/admin/Announcement')},
        ]
    },
    {
        name: 'operator',
        path: UserTypeNameMap[UserType.OPERATOR].url,
        redirect: {name: 'operator-all'},
        component: Operator,
        children: [
            {name: 'operator-all', path: 'order', component: OperatorOrder},
            {name: 'operator-complete', path: 'complete', component: OperatorCompleteOrder},
            {name: 'operator-home', path: 'home', component: Home},
            {name: 'EnterpriseinfoView', path: 'EnterpriseinfoView', component: EnterpriseinfoView},
            {name: 'adminn-home', path: 'home', component: Home},
            {name: 'operator-message', path: 'message', component: message},
        ]
    }
]

// 创建路由
export const router = createRouter({
    history: createWebHashHistory(),
    routes
})