<template>
  <el-container>
    <el-aside width="200px">
      <h2>管理员菜单</h2>
      <el-menu :default-active="$router.currentRoute.value.name">
        <el-sub-menu index="admin-user-all">
          <template #title>
            <router-link :to="{name:'admin-user-all'}">
              <el-icon>
                <Avatar />
              </el-icon>
              <span>用户管理</span>
            </router-link>
          </template>
          <router-link :to="{name:'admin-user-all'}">
            <el-menu-item index="admin-user-all">
              <el-icon>
                <User/>
              </el-icon>
              <span>统一管理</span>
            </el-menu-item>
          </router-link>
        </el-sub-menu>
        <router-link :to="{name:'admin-order'}">
          <el-menu-item index="admin-order">
            <el-icon>
              <Checked/>
            </el-icon>
            <span>订单管理</span>
          </el-menu-item>
        </router-link>
        <router-link :to="{name:'admin-home'}">
          <el-menu-item index="admin-home">
            <el-icon><HomeFilled /></el-icon>
            <span>个人中心</span>
          </el-menu-item>
        </router-link>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view/>
    </el-main>
  </el-container>
</template>

<script>
import {Checked, Van, Money, Avatar, User, HomeFilled} from '@element-plus/icons-vue'

export default {
  name: "AdminView",
  data() {
    return {}
  },
  components: {
    Checked, Van, Money, Avatar, User, HomeFilled
  }
}
</script>

<style scoped>

</style>
