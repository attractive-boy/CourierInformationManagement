<template>
    <el-container>
        <el-main>
            <el-menu :default-openeds="['1']">
                <h2>公告信息管理</h2>
                <el-button size="large" @click="showDialog()">添加公告</el-button>
                <el-table :data="filterOrderList" :default-sort="{ prop: 'id', order: 'ascending' }" :table-layout="fixed"
                    stripe ref="orderTable">
                    <!-- 公告标题 -->
                    <el-table-column prop="title" label="公告标题" />
                    <!-- 公告类型 -->
                    <el-table-column prop="type" label="公告类型" />
                    <!-- 公告图片 -->
                    <el-table-column prop="img" label="公告图片">
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
                            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
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
                            <el-upload :on-change="handleChange(fileList)" :file-list="fileList" :show-file-list="false"
                                class="avatar-uploader" action="http://localhost:8080/posts/">
                                <img v-if="editingOrder.img" :src="editingOrder.img" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon">
                                    +
                                </i>
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
            fileList: [],
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
                        debugger
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
            // 打开编辑框
            this.showDialog(row);
        },
        /**
         * 展示修改框
         */
        showDialog(row) {
            // 深拷贝，不然会立马回显
            if(row){
                this.editingOrder = JSON.parse(JSON.stringify(row));
            }
            this.dialogAddOrderVisible = true;
        },
        handleAddOrder(row) {
            // TODO：请求
            row.operatorId = this.curUser.id;
            // 如果是编辑
            if (row.id) {
                updateannouncement(row)
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
                            type: "success",
                            duration: 2000,
                        });
                        this.dialogAddOrderVisible = false;
                        this.editingOrder = {}
                        this.orderList.forEach((item, index) => {
                            if (item.id == row.id) {
                                this.orderList[index] = JSON.parse(JSON.stringify(row))
                            }
                        })
                        this.$refs.orderTable.doLayout();
                    })
                return;
            }else{
                updateannouncement(row)
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
                            type: "success",
                            duration: 2000,
                        });
                        this.dialogAddOrderVisible = false;
                        this.editingOrder = {}
                        this.orderList.push(JSON.parse(JSON.stringify(row)))
                        this.$refs.orderTable.doLayout();
                    })
            }
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
        beforeAvatarUpload(file) {
            const isJPG = file.type === "image/jpeg";
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error("上传图片只能是 JPG 格式!");
            }
            if (!isLt2M) {
                this.$message.error("上传图片大小不能超过 2MB!");
            }
            return isJPG && isLt2M;
        },
        handleChange(fileList) {
            let imgFiles = fileList.filter(file => {
                return file.raw.type === 'image/jpeg' ||
                    file.raw.type === 'image/png' ||
                    file.raw.type === 'image/gif';
            });
            debugger
            if (imgFiles.length === 0) {
                return;
            }
            let base64Str = '';
            let reader = new FileReader();
            reader.readAsDataURL(imgFiles[0].raw);
            reader.onload = function () {
                base64Str = reader.result;
                this.editingOrder.img = base64Str;
            }.bind(this);

            this.fileList = [];
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

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    border: 1px dashed #d9d9d9;
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>