<template>
  <div class="sign">
    <div class="main">
      <!--表单-->
      <div class="title">
        <router-link to="/login">登录</router-link>
        <span>·</span>
        <router-link class="active" to="/register">注册</router-link>
      </div>
      <div class="sign-up-container" style="margin: 20px">
        <el-form :model="userForm" label-width="70px" label-position="left">
          <el-form-item label="用户类型">
            <el-select v-model="userForm.userTypeName" placeholder="选择您的用户类型">
              <el-option v-for="(value, index) in UserType" :key="index" :label="value.name" :value="value.name" />
            </el-select>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="userForm.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="userForm.password" type="password" placeholder="请输入密码" show-password />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userForm.email" placeholder="请输入邮箱" />
          </el-form-item>
          <!-- <el-form-item> -->
          <el-button type="primary" @click="onSubmit">注册</el-button>
          <!-- </el-form-item> -->
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive } from "vue";
import { submitRegister } from "../api/userApi";
import {userHomeMap} from "@/util/constant"
import { ElNotification } from "element-plus";

export default {
  name: "Register",
  layout: "sign",
  data() {
    return {
      userForm: reactive({
        userTypeName: '',
        username: '',
        password: '',
        email: ''
      }),
      UserType: {
        1: {name: '管理员'},
        2: {name: '用户'}
      }
    };
  },
  methods: {
    onSubmit() {
      if (
        this.userForm.userTypeName === '' ||
        this.userForm.username === '' ||
        this.userForm.password === '' ||
        this.userForm.email === ''
      ) {
        ElNotification({
            title: "Error",
            message: "请填写完所有信息！" + `${JSON.stringify(this.userForm)}`,
            type: "error",
            duration: 1000
        });
        return;
      }
      submitRegister(
        this.userForm.username,
        this.userForm.password,
        this.userForm.userTypeName,
        this.userForm.email
      )
      .then((res) => {
        if (res.data.code != 2001) {
          this.userForm.username = "";
          this.userForm.password = "";
          this.userForm.email = "";
          this.userForm.userTypeName = "";
          ElNotification({
            title: "注册失败",
            message: res.data.message,
            type: "error"
          });
          return
        }
        ElNotification({
          title: "注册成功",
          type: "success"
        });
        this.$router.push(userHomeMap[this.userForm.userTypeName])
      })
    }
  }
}
</script>
<style scoped src="../assets/css/sign.css" />