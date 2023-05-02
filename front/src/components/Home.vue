<template>
  <!-- --表单-- -->
  <el-form :model="userForm" :rules="rules" ref="userForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="userForm.username" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="userForm.password" type="password" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="用户类型" prop="userTypeName">
      <el-select v-model="userForm.userTypeName" placeholder="请选择用户类型" disabled>
        <el-option v-for="(value, index) in UserType" :key="index" :label="value.name" :value="value.name" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">提交</el-button>
    </el-form-item>
  </el-form>
</template>
  
<script>
import "element-plus/theme-chalk/dark/css-vars.css";
import { getUserInfo, updatemyself } from '../api/userApi';
export default {
  name: "HomeView",
  data() {
    return {
      userForm: {
        username: "",
        password: "",
        email: "",
        userTypeName: "",
        id: ""
      },
      UserType: {
        1: { name: '管理员' },
        2: { name: '用户' }
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: ["blur", "change"] }
        ],
        userTypeName: [
          { required: true, message: "请选择用户类型", trigger: "blur" }
        ]
      }
    };
  },
  // 挂载之后执行
  mounted() {
    // userForm
    getUserInfo().then(res => {
      this.userForm.username = res.data.data.username;
      this.userForm.password = res.data.data.password;
      this.userForm.userTypeName = res.data.data.userTypeName;
      debugger
      this.userForm.id = res.data.data.id;
    });
  },
  methods: {
    onSubmit() {
      debugger
      updatemyself(this.userForm).then(res => {
        if (res.data.code === 2300) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
        } else {
          this.$message({
            message: "修改失败",
            type: "error"
          });
        }
      });
    }
  }
};
</script>

<style scoped></style>
  