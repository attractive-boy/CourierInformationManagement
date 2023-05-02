<template>
    <el-container>
      <el-main>
        <el-menu :default-openeds="['1']">
          <h2>货单管理</h2>
          <el-table
            :data="filterOrderList"
            :default-sort="{ prop: 'id', order: 'ascending' }"
            :table-layout="fixed"
            stripe
            ref="orderTable"
          >
            <el-table-column prop="id" label="订单号" :min-width="70" sortable />
            <el-table-column prop="operatorId" label="用户 Id" />
            <el-table-column prop="sender" label="发货客户" />
            <el-table-column prop="receiver" label="收货客户" />
            <el-table-column prop="sendWarehouse" label="发货仓" />
            <el-table-column prop="receiveWarehouse" label="收获仓"/>
            <el-table-column prop="money" label="运费" sortable />
            <el-table-column prop="orderStatus" label="订单状态">
            <template>
              <el-tag
                :type="success">
                  {{ 已完成 }}
              </el-tag>
            </template>
            </el-table-column>
            <el-table-column :min-width="70">
              <template #header>
                <el-input
                  v-model="search"
                  size="small"
                  placeholder="搜索订单"
                />
              </template>
              <el-popover :visible="scope.row.visible" placement="top" :width="120">
                <p>确认验收?</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="small" text @click="scope.row.visible = false">取消</el-button>
                  <el-button size="small" type="primary" @click="handleCompleteOrder(scope.$index, scope.row)"
                    >确定</el-button
                  >
                </div>
                <template #reference>
                  <el-button @click="scope.row.visible = true" size="small" type="default">验收</el-button>
                </template>
              </el-popover>
            </el-table-column>
          </el-table>
        </el-menu>
        <router-view></router-view>
      </el-main>
    </el-container>
  </template>
      
  <script>
  import { getSelfOrderList, updateOrder, addOrder } from "@/api/orderApi";
  import { getUserInfo } from "../../api/userApi";
  import { ElNotification } from "element-plus";
  
  export default {
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
       * 初始化订单列表
       */
      initOrderList() {
        // 初始化 curUser
        getUserInfo()
        .then(res => {
            this.curUser = res.data.data
        })
        getSelfOrderList().then((res) => {
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
        row.orderStatus = '待分配',
        addOrder(row)
        .then((res) => {
            if (res.data.code != 3000) {
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