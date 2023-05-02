<template>
    <el-container>
      <el-main>
        <el-menu :default-openeds="['1']">
          <h2>公告信息管理</h2>
          <el-button size="large" @click="showDialog()">添加公告</el-button>
          <el-table :data="filterOrderList" :default-sort="{ prop: 'id', order: 'ascending' }" :table-layout="fixed" stripe
            ref="orderTable">
            <!-- 公告标题 -->
            <el-table-column prop="title" label="公告标题" />
            <!-- 公告类型 -->
            <el-table-column prop="type" label="公告类型" />
            <!-- 公告图片 -->
            <el-table-column prop="img" label="公告图片" >
                <template #default="scope">
                    <img :src="scope.row.img" alt="" style="width: 100px; height: 100px;">
                </template>
            </el-table-column>
            <el-table-column prop="date" label="发布时间">
              <template #default="scope">
                <!-- 时间取年月日时分秒 -->
                {{ scope.row.date.substring(0, 19).replace('T', ' ') }}
              </template>
            </el-table-column>
            <!-- 操作（删除） -->
            <el-table-column :min-width="140">
              <template #header>
                操作
              </template>
              <template #default="scope">
                <!-- 编辑 -->
                <el-button size="small" @click="handleEditOrder(scope.row)">编辑</el-button>
                <!-- 删除 -->
                <el-button size="small" type="danger" @click="handleDeleteOrder(scope.row)">删除</el-button>
              </template>
            </el-table-column>
  
          </el-table>
          <el-dialog :title="公告" width="30%" v-model="dialogAddOrderVisible" center destroy-on-close
            custom-class="dialog-class">
            <el-form :model="editingOrder" :rules="rules" ref="orderForm" label-width="80px">
              <el-form-item label="公告标题" prop="title">
                <el-input v-model="editingOrder.title" placeholder="请输入公告标题"></el-input>
              </el-form-item>
              <el-form-item label="公告类型" prop="type">
                <el-input v-model="editingOrder.type" placeholder="请输入公告类型"></el-input>
              </el-form-item>
              <el-form-item label="公告图片" prop="img">
                <!-- 上传图片,解析成base64存到img中 -->
                <el-upload
                  class="avatar-uploader"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                    <img v-if="editingOrder.img" :src="editingOrder.img" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
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
  import { addannouncement, deleteannouncement, getannouncement, updateannouncement } from "../../api/announcement";
  
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
                getannouncement().then((res) => {
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
        updateannouncement(row).then((res) => {
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
        addannouncement(row)
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
        deleteannouncement(row.id)
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
      },
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
        beforeAvatarUpload(file) {
            const isJPG = file.type === "image/jpeg";
            const isLt2M = file.size / 1024 / 1024 < 2;
    
            if (!isJPG) {
            this.$message.error("上传头像图片只能是 JPG 格式!");
            }
            if (!isLt2M) {
            this.$message.error("上传头像图片大小不能超过 2MB!");
            }
            return isJPG && isLt2M;
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(
            `当前限制选择 3 个文件，本次选择了 ${
                files.length
            } 个文件，共选择了 ${files.length + fileList.length} 个文件`
            );
        },
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