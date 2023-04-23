import {createApp} from 'vue'
import App from '@/App.vue'
import {router} from "@/router/index";

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from "axios"

// axios配置
axios.defaults.baseURL = 'http://localhost:8080/'

// 根实例配置
const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.config.globalProperties.$http = axios

app.mount('#app')
