<template>
  <el-container>
    <el-header>
      <div class="logo_container">
        <el-button text @click="this.$router.push({ name: 'home' })">
          <img class="logo" src="/favicon.svg" />
          <h1>物流管理系统</h1>
        </el-button>
      </div>
      <span v-if="this.$route.path != '/login'" class="logout" v-on:click="userSignOut">退出登录</span>
    </el-header>
    <router-view />
  </el-container>
</template>

<script>
import 'element-plus/theme-chalk/dark/css-vars.css'
import { User, CircleClose } from '@element-plus/icons-vue'
import { logout } from '@/api/userApi'
import { ElNotification } from "element-plus";
export default {
  name: 'App',
  data() {
    return {
      User, CircleClose,  // icon
    }
  },
  methods: {
    /**
     * 退出登录
     */
    userSignOut() {
      logout()
      this.$router.push({ name: 'home' })
      ElNotification({
        title: '退出成功',
        message: '欢迎您下次再来😃',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
.el-header {
  display: flex;
  justify-content: space-between;
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}

.logo_container {
  display: flex;
  align-items: center;
}

.logo {
  height: 48px;
}

.content_container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-grow: 1;
}

.content {
  padding-left: 8px;
  padding-right: 8px;
}
.logout{
  height: 100%;
  line-height: 60px;
}
</style>
