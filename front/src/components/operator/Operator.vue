<template>
  <el-container>
    <el-aside width="200px">
      <h2>用户菜单</h2>
      <el-menu :default-active="$router.currentRoute.value.name">
        <el-sub-menu index="operator-all">
          <template #title>
            <router-link :to="{ name: 'operator-all' }">
              <el-icon>
                <List />
              </el-icon>
              <span>货单管理</span>
            </router-link>
          </template>
          <router-link :to="{ name: 'operator-all' }">
            <el-menu-item index="all">
              <el-icon>
                <CirclePlusFilled />
              </el-icon>
              <span>我的货单</span>
            </el-menu-item>
          </router-link>
          <router-link :to="{ name: 'operator-complete' }">
            <el-menu-item index="complete">
              <el-icon>
                <Check />
              </el-icon>
              <span>验收货单</span>
            </el-menu-item>
          </router-link>
        </el-sub-menu>
        <el-menu-item index="EnterpriseinfoView">
          <router-link :to="{ name: 'EnterpriseinfoView' }">
            <el-icon><icon-menu /></el-icon>
            <span>企业信息</span>
          </router-link>
        </el-menu-item>
        <el-menu-item index="EnterpriseinfoView">
          <router-link :to="{ name: 'EnterpriseinfoView' }">
            <el-icon><icon-menu /></el-icon>
            <span>用户留言</span>
          </router-link>
        </el-menu-item>
        <el-menu-item index="adminn-home">
          <router-link :to="{ name: 'adminn-home' }">
              <el-icon>
                <HomeFilled />
              </el-icon>
              <span>个人中心</span>
          </router-link>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view />
    </el-main>
  </el-container>
</template>

<script>
import { CirclePlusFilled, Check, List } from '@element-plus/icons-vue'

export default {
  name: "OperatorView",
  data() {
    return {}
  },
  components: {
    CirclePlusFilled, Check, List
  }
}
</script>

<style scoped></style>