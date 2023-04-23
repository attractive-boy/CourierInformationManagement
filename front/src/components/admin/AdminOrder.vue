<template>
  <el-container>
    <el-main>
      <el-menu :default-openeds="['1']">
        <h2>订单管理</h2>
        <el-table
          :data="filterOrderList"
          :default-sort="{ prop: 'id', order: 'ascending' }"
          :table-layout="fixed"
          stripe
          ref="orderTable"
        >
          <el-table-column prop="id" label="订单号" :min-width="70" sortable />
          <el-table-column prop="operatorId" label="操作员id" />
          <el-table-column prop="sender" label="发货客户" />
          <el-table-column prop="receiver" label="收货客户" />
          <el-table-column prop="sendWarehouse" label="发货仓" />
          <el-table-column prop="receiveWarehouse" label="收获仓"/>
          <el-table-column prop="money" label="运费" sortable />
          <el-table-column prop="orderStatus" label="订单状态"
            :filters="[
                {text:'库存中', value:'库存中'},
                {text:'运输中', value:'运输中'},
                {text:'等待签收', value:'等待签收'},
                {text:'已签收', value:'已签收'},
                {text: '待分配', value: '待分配'}
            ]"
            :filter-method="filterOrderStatus"
          >
          <template #default="scope">
            <el-tag
              :type="getTagType(scope.row.orderStatus)">
                {{ scope.row.orderStatus }}
            </el-tag>
          </template>
          </el-table-column>
          <el-table-column :min-width="140">
            <template #header>
              <el-input
                v-model="search"
                size="small"
                placeholder="搜索订单"
              />
            </template>
            <template #default="scope">
              <el-button size="small" @click="showDialog(scope.row)"
                >Edit</el-button
              >
              <el-popover
                :visible="scope.row.visible"
                placement="top"
                :width="120"
              >
                <p>确认删除该订单（软删除）?</p>
                <div style="text-align: right; margin: 0">
                  <el-button
                    size="small"
                    text
                    @click="scope.row.visible = false"
                    >取消</el-button
                  >
                  <el-button
                    size="small"
                    type="primary"
                    @click="handleDelete(scope.$index, scope.row)"
                    >确定</el-button
                  >
                </div>
                <template #reference>
                  <el-button
                    @click="scope.row.visible = true"
                    size="small"
                    type="danger"
                    >Delete</el-button
                  >
                </template>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          title="修改订单信息"
          width="30%"
          v-model="dialogVisible"
          center
          destroy-on-close
          custom-class="dialog-class"
        >
          <el-form :model="editingOrder">
            <el-form-item label="订单号" :label-width="'100px'">
              <el-input v-model="editingOrder.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="发货客户" :label-width="'100px'">
              <el-input v-model="editingOrder.sender" disabled></el-input>
            </el-form-item>
            <el-form-item label="收获客户" :label-width="'100px'">
              <el-input v-model="editingOrder.receiver" disabled></el-input>
            </el-form-item>
            <el-form-item label="发货仓" :label-width="'100px'">
              <el-input v-model="editingOrder.sendWarehouse" disabled></el-input>
            </el-form-item>
            <el-form-item label="收获仓" :label-width="'100px'">
              <el-input v-model="editingOrder.receiveWarehouse"></el-input>
            </el-form-item>
            <el-form-item label="运费" :label-width="'100px'">
              <el-input v-model="editingOrder.money"></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible = false">Cancel</el-button>
              <el-button type="primary" @click="handleEdit(editingOrder)">
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
import { getOrderList, deleteOrder, updateOrder } from "@/api/orderApi";
import { ElNotification } from "element-plus";

export default {
  data() {
    return {
      orderList: [],
      search: "",
      editingOrder: {},
      dialogVisible: false,
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
          row.receiveWarehouse.toLowerCase().includes(this.search.toLowerCase())
        );
      });
    },
  },
  methods: {
    /**
     * 初始化用户列表
     */
    initOrderList() {
      getOrderList().then((res) => {
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
    },
    /**
     * 订单状态过滤器
     */
    filterOrderStatus(value, row) {
        return row.status == value
    },
    /**
     * 修改用户
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
     * 根据 index 删除第 row 行
     */
    handleDelete(index, row) {
      row.visible = false;
      const delOrder = row;
      deleteOrder(delOrder).then((res) => {
        // 删除失败
        if (res.data.code != 3200) {
          ElNotification({
            title: "Error",
            message: "接口异常：" + res.data.message,
            type: "error",
            duration: 2000,
          });
          return;
        }
        // 删除成功，更新 orderList
        this.orderList.splice(index, 1);
        ElNotification({
          title: "success",
          message: res.data.message,
          type: "success",
          duration: 2000,
        });
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