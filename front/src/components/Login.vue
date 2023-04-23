<template>
  <div class="sign">
    <div class="main">
    <!--表单-->
    <div class="title">
      <!-- <a class="active">登录</a> -->
      <router-link class="active" to="/login">登录</router-link>
      <span>·</span>
      <!-- <a :href=$router.>注册</a> -->
      <router-link to="/register">注册</router-link>
    </div>
    <div class="sign-up-container" style="margin: 20px">
          <el-form :model="userForm" label-width="70px" label-position="left">
            <el-form-item label="用户类型">
              <el-select v-model="userForm.userTypeName" placeholder="选择您的用户类型" >
                <el-option v-for="(value, index) in UserTypeNameMap"
                          :key="index" :label="value.name" :value="value.name"/>
              </el-select>
            </el-form-item>
            <el-form-item label="用户名">
              <el-input v-model="userForm.username" placeholder="请输入用户名"/>
            </el-form-item>
            <el-form-item label="密码">
              <el-input v-model="userForm.password" type="password"
                        placeholder="请输入密码" show-password/>
            </el-form-item>
            <!-- <el-form-item> -->
              <el-button type="primary" @click="onSubmit">登录</el-button>
            <!-- </el-form-item> -->
          </el-form>
    </div>
    </div>
  </div>
</template>

<script>
import {reactive} from "vue";
import {UserTypeNameMap, userHomeMap} from "@/util/constant";
import {submitLogin} from '@/api/userApi'
import {ElNotification} from "element-plus";

export default {
  name: "LoginView",
  props: {
    isGoingBack: Boolean
  },
  data() {
    return {
      userForm: reactive({
        userTypeName: '管理员',
        username: 'admin',
        password: 'asd'
      }),
      UserTypeNameMap
    }
  },
  methods: {
    onSubmit() {
      if (this.userForm.userTypeName === '' || this.userForm.username === '' || this.userForm.password === '') {
        ElNotification({
          title: "Error",
          message: "请填写完所有信息！",
          type: "error",
          duration: 1000
        })
        return
      }
      submitLogin(this.userForm.username, this.userForm.password, this.userForm.userTypeName)
      .then((res) => {
        if (res.data.code !== 2000) {
          this.userForm.username = ''
          this.userForm.password = ''
          ElNotification({
            title: '登录失败',
            message: res.data.message,
            type: 'error',
            duration: 1000
          })
          return
        }
        // 登陆成功
        ElNotification({
          title: '登录成功',
          message: '欢迎您，' + this.userForm.username,
          type: 'success',
          duration: 1000
        })
        // 页面跳转
        this.$router.push(userHomeMap[this.userForm.userTypeName])
      })
    }
  }
}
</script>
<style scoped src="../assets/css/sign.css">
</style>
