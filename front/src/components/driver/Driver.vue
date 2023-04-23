 <template>
  <el-container>
    <el-aside width="200px">
      <h2>司机菜单</h2>
      <el-menu default-active="1">
        <router-link :to="{name:'driver-transport'}">
          <el-menu-item index="1">
            <el-icon>
              <Van/>
            </el-icon>
            <span>运输任务</span>
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
import {Van} from '@element-plus/icons-vue'

export default {
  name: "DriverView",
  data() {
    return{}

  },
  components: {
    Van
  }
}
  
</script>

<style scoped>

</style>