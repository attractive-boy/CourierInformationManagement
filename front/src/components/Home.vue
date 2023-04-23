<template>
{{ getUserInfo }}
</template>
  
<script>
import "element-plus/theme-chalk/dark/css-vars.css";
import { getUserInfo } from '../api/userApi';
export default {
  name: "HomeView",
  data() {
    return {
    }
  },
  methods() {
    getUserInfo
  }
};
</script>

<style scoped>
</style>
  