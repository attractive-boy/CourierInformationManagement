<template>
  <el-container>
    <el-main>
      <el-menu :default-openeds="['1']">
        <h2>留言管理</h2>
        <el-button v-if="curUser.userType != 1" size="large" @click="showDialog()">添加留言</el-button>
        <el-table :data="filterOrderList" :default-sort="{ prop: 'id', order: 'ascending' }" :table-layout="fixed" stripe
          ref="orderTable">
          <el-table-column prop="userid" label="用户名" />
          <el-table-column prop="message" label="留言内容" />
          <el-table-column prop="date" label="留言时间">
            <template #default="scope">
              <!-- 时间取年月日时分秒 -->
              {{ scope.row.date.substring(0, 19).replace('T', ' ') }}
            </template>
          </el-table-column>
          <!-- 操作（删除） -->
          <el-table-column :min-width="140" v-if="curUser.userType == 1">
            <template #header>
              操作
            </template>
            <template #default="scope">
              <!-- <el-popover :visible="scope.row.visible" placement="top" :width="120">
                <p>确认删除该留言?</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="small" text @click="scope.row.visible = false">取消</el-button>
                  <el-button size="small" type="primary" text @click="handleDeleteOrder(scope.row)">确认</el-button>
                </div>
              </el-popover> -->
              <el-button size="small" @click="handleDeleteOrder(scope.row)">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
        <el-dialog title="添加留言" width="30%" v-model="dialogAddOrderVisible" center destroy-on-close
          custom-class="dialog-class">
          <!-- 用户名 -->
          <el-form :model="editingOrder">
            <el-form-item label="用户名" label-width="120px">
              <el-input v-model="editingOrder.userid" />
            </el-form-item>
          </el-form>
          <el-form :model="editingOrder">
            <el-form-item label="留言内容" label-width="120px">
              <el-input v-model="editingOrder.receiver" />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogAddOrderVisible = false">Cancel</el-button>
              <el-button type="primary" @click="handleAddOrder(editingOrder)">
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
import { getUserInfo } from "../../api/userApi";
import { ElNotification } from "element-plus";
import { addMessage, getMessageList, getSelfMessageLis, deleteMessage } from "../../api/messageApi";

export default {
  name: "admin-message",
  data() {
    return {
      orderList: [],
      search: "",
      editingOrder: {},
      dialogVisible: false,
      dialogAddOrderVisible: false,
      curUser: {},
    };
  },
  created() {
    this.initOrderList();
  },
  computed: {
    filterOrderList() {
      return this.orderList.filter((row) => {
        return (
          !this.search ||
          row.sender.toLowerCase().includes(this.search.toLowerCase()) ||
          row.sendWarehouse.toLowerCase().includes(this.search.toLowerCase()) ||
          row.receiver.toLowerCase().includes(this.search.toLowerCase()) ||
          row.receiveWarehouse.toLowerCase().includes(this.search.toLowerCase()) ||
          row.id.toString() == this.search.toLowerCase()
        );
      });
    },
  },
  methods: {
    /**
     * 初始化留言列表
     */
    initOrderList() {
      // 初始化 curUser
      getUserInfo()
        .then(res => {
          this.curUser = res.data.data
          // 判断是不是管理员
          if (this.curUser.userType == 1) {
            getMessageList().then((res) => {
              // 接口异常
              if (res.data.code != 3100) {
                ElNotification({
                  title: "Error",
                  message: "接口异常：" + res.data.message,
                  type: "error",
                  duration: 3000,
                });
                return;
              }
              this.orderList = res.data.data;
            });
          } else {
            getSelfMessageList().then((res) => {
              // 接口异常
              if (res.data.code != 3100) {
                ElNotification({
                  title: "Error",
                  message: "接口异常：" + res.data.message,
                  type: "error",
                  duration: 3000,
                });
                return;
              }
              this.orderList = res.data.data;
            });
          }
        })
    },
    /**
     * 订单状态过滤器
     */
    filterOrderStatus(value, row) {
      return row.status == value
    },
    /**
     * 修改订单
     */
    handleEdit(row) {
      updateOrder(row).then((res) => {
        if (res.data.code != 3300) {
          // 修改失败
          ElNotification({
            title: "Error",
            message: "接口异常：" + res.data.message,
            type: "error",
            duration: 2000,
          });
          this.dialogVisible = false;
          return;
        }
        ElNotification({
          title: "success",
          message: res.data.message,
          type: "success",
          duration: 2000,
        });
        this.dialogVisible = false;
        // 当前 orderList 中的 user 信息也要更新
        const index = this.orderList.findIndex(
          (u) => u.id === this.editingOrder.id
        );
        this.orderList.splice(index, 1, this.editingOrder);
        this.$refs.orderTable.doLayout();
      });
    },
    /**
     * 展示修改框
     */
    showDialog(row) {
      // 深拷贝，不然会立马回显
      this.editingOrder = JSON.parse(JSON.stringify(row));
      this.dialogVisible = true;
    },
    /**
     * 复用修改框，用于
     */
    showDialog() {
      this.dialogAddOrderVisible = true;
    },
    handleAddOrder(row) {
      // TODO：请求
      row.operatorId = this.curUser.id;
      addMessage(row)
        .then((res) => {
          if (res.status != 200) {
            // 修改失败
            ElNotification({
              title: "Error",
              message: "接口异常：" + res.data.message,
              type: "error",
              duration: 2000,
            });
            this.dialogAddOrderVisible = false;
            return;
          }
          ElNotification({
            title: "success",
            message: res.data.message,
            type: "success",
            duration: 2000,
          });
          this.dialogAddOrderVisible = false;
          this.editingOrder = {}
          this.orderList[this.orderList.length] = JSON.parse(JSON.stringify(row))
          this.$refs.orderTable.doLayout();
        })
    },
    getTagType(state) {
      if (state == '待分配') {
        return 'danger'
      }
      if (state == '库存中') {
        return 'info'
      }
      if (state === '运输中') {
        return 'default'
      }
      if (state === '等待签收') {
        return 'warning'
      }
      return 'success'
    },
    handleDeleteOrder(row) {
      // TODO：请求
      deleteMessage(row.id)
        .then((res) => {
          if (res.status != 200) {
            // 修改失败
            ElNotification({
              title: "Error",
              message: "接口异常：" + res.data.message,
              type: "error",
              duration: 2000,
            });
            return;
          }
          ElNotification({
            title: "success",
            message: "删除成功",
            type: "success",
            duration: 2000,
          });
        })
    }
  },
};
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