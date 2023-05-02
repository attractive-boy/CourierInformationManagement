<template>
  <el-container>
    <el-main>
      <el-menu :default-openeds="['1']">
        <h4>统一用户管理</h4>
        <el-table :data="filterUserList" :default-sort="{ prop: 'id', order: 'ascending' }" :table-layout="fixed" stripe
          ref="userTable">
          <el-table-column prop="id" label="用户 id" :min-width="70" sortable />
          <el-table-column prop="username" label="用户名" />
          <el-table-column prop="userType" label="用户类型 id" />
          <el-table-column prop="userTypeName" label="用户类型" :filters="
                          [
                            { text: '管理员', value: '管理员' },
                            { text: '用户', value: '用户' },
                          ]" :filter-method="filterUserTypename" />
          <el-table-column prop="email" label="邮箱" :min-width="180" />
          <el-table-column prop="status" label="账号状态" :filters="[
                          {text: '启用', value: '1'},
                          {text: '禁用', value: '0'},
                        ]" :filter-method="filterUserStatus">
            <template #default="scope">
              <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">{{ scope.row.status === 1 ? '启用':
                              '禁用'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column :min-width="130">
            <template #header>
              <el-input v-model="search" size="small" placeholder="搜索用户名" />
            </template>
            <template #default="scope">
              <el-button size="small" @click="showDialog(scope.row)">Edit</el-button>
              <el-popover :visible="scope.row.visible" placement="top" :width="120">
                <p>确认删除该用户?</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="small" text @click="scope.row.visible = false">取消</el-button>
                  <el-button size="small" type="primary" @click="handleDelete(scope.$index, scope.row)">确定</el-button>
                </div>
                <template #reference>
                  <el-button @click="scope.row.visible = true" size="small" type="danger">Delete</el-button>
                </template>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="修改用户信息" width="30%" v-model="dialogVisible" center destroy-on-close custom-class="dialog-class">
          <el-form :model="editingUser">
            <el-form-item label="用户 id" :label-width="'100px'">
              <el-input v-model="editingUser.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="用户名" :label-width="'100px'">
              <el-input v-model="editingUser.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="用户类型 id" :label-width="'100px'">
              <el-input v-model="editingUser.userType" disabled></el-input>
            </el-form-item>
            <el-form-item label="用户类型" :label-width="'100px'">
              <el-input v-model="editingUser.userTypeName" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="'100px'">
              <el-input v-model="editingUser.email"></el-input>
            </el-form-item>
            <el-form-item label="状态" :label-width="'100px'">
              <el-input v-model="editingUser.status"></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible = false">Cancel</el-button>
              <el-button type="primary" @click="handleEdit(editingUser)">
                Confirm
              </el-button>
            </span>
          </template>
        </el-dialog>
      </el-menu>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>
  
<script>
import { getUserList, deleteUser, updateUser } from '@/api/userApi'
import { ElNotification } from "element-plus"

export default {
  data() {
    return {
      userList: [],
      search: '',
      editingUser: {},
      dialogVisible: false
    }
  },
  created() {
    this.initUserList()
  },
  computed: {
    filterUserList() {
      return this.userList.filter(row => {
        return !this.search || row.username.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  },
  methods: {
    /**
     * 初始化用户列表
     */
    initUserList() {
      getUserList()
        .then((res) => {
          // 接口异常
          if (res.data.code != 2100) {
            ElNotification({
              title: "Error",
              message: "接口异常：" + res.data.message,
              type: "error",
              duration: 3000
            })
            return
          }
          this.userList = res.data.data
        })
    },
    /**
     * 用户类型过滤器
     */
    filterUserTypename(value, row) {
      return row.userTypeName == value;
    },
    /**
     * 用户状态过滤器
     */
    filterUserStatus(value, row) {
      return row.status == value
    },
    /**
     * 修改用户
     */
    handleEdit(row) {
      // updateUser
      updateUser(row)
        .then(res => {
          if (res.data.code != 2300) {
            // 修改失败
            ElNotification({
              title: "Error",
              message: "接口异常：" + res.data.message,
              type: "error",
              duration: 2000
            })
            this.dialogVisible = false
            return
          }
          ElNotification({
            title: "success",
            message: res.data.message,
            type: "success",
            duration: 2000
          })
          this.dialogVisible = false
          // 当前 userList 中的 user 信息也要更新
          const index = this.userList.findIndex(u => u.id === this.editingUser.id)
          this.userList.splice(index, 1, this.editingUser)
          this.$refs.userTable.doLayout()
        })
    },
    /**
     * 根据 index 删除第 row 行
     */
    handleDelete(index, row) {
      row.visible = false;
      const delUser = row;
      deleteUser(delUser)
        .then((res) => {
          // 删除失败
          if (res.data.code != 2200) {
            ElNotification({
              title: "Error",
              message: "接口异常：" + res.data.message,
              type: "error",
              duration: 2000
            })
            return
          }
          // 删除成功，更新 userList
          this.userList.splice(index, 1)
          ElNotification({
            title: "success",
            message: res.data.message,
            type: "success",
            duration: 2000
          })
        })
    },
    /**
     * 展示修改框 
     */
    showDialog(row) {
      // 深拷贝，不然会立马回显
      this.editingUser = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    }
  }
}
</script>
<style scoped>
.el-button--text {
  margin-right: 15px;
}

.el-select {
  width: 300px;
}

.el-input {
  width: 300px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>