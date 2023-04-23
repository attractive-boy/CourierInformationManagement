<template>
  <el-container>
    <el-aside width="200px">
      <h2>操作员菜单</h2>
      <el-menu :default-active="$router.currentRoute.value.name">
        <el-sub-menu index="operator-all">
          <template #title>
            <router-link :to="{name:'operator-all'}">
              <el-icon><List /></el-icon>
              <span>货单管理</span>
            </router-link>
          </template>
          <router-link :to="{name:'operator-all'}">
            <el-menu-item index="all">
              <el-icon>
                <CirclePlusFilled/>
              </el-icon>
              <span>我的货单</span>
            </el-menu-item>
          </router-link>
          <router-link :to="{name:'operator-complete'}">
            <el-menu-item index="complete">
              <el-icon>
                <Check/>
              </el-icon>
              <span>验收货单</span>
            </el-menu-item>
          </router-link>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view/>
    </el-main>
  </el-container>
</template>

<script>
import {CirclePlusFilled, Check, List} from '@element-plus/icons-vue'

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

<style scoped>

</style>