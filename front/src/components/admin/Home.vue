<template>
  <div class="intro">
    <el-carousel class="box" :interval="4000" height="400px">
      <el-carousel-item>
        <img class="image" src="../assets/img1.jpg" alt="" />
      </el-carousel-item>
      <el-carousel-item>
        <img class="image" src="../assets/img2.jpg" alt="" />
      </el-carousel-item>
      <el-carousel-item>
        <img class="image" src="../assets/img3.jpg" alt="" />
      </el-carousel-item>
      <el-carousel-item>
        <img class="image" src="../assets/img4.jpg" alt="" />
      </el-carousel-item>
      <el-carousel-item>
        <img class="image" src="../assets/img5.jpg" alt="" />
      </el-carousel-item>
    </el-carousel>

    <div>
      <h1 class="text-center">物流管理系统</h1>
    </div>
    <el-row :gutter="10" class="cells-row">
      <el-col :span="10" class="cell">
        <h2 class="text-center">管理员</h2>
        <p class="text-center">
          管理员拥有最高权限，可以添加用户、用户等信息，也可以查看或修改货单、运单。
        </p>
      </el-col>
      <el-col :span="10" class="cell">
        <h2 class="text-center">用户</h2>
        <p class="text-center">用户可以查看自己的运单。</p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import "element-plus/theme-chalk/dark/css-vars.css";
export default {
  name: "HomeView",
};
</script>

<style scoped>
.el-col {
  margin: 1px;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}

.intro {
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.cells-row {
  margin-bottom: 20px;
}

.cells-row:last-child {
  margin-bottom: 0;
}

.cell {
  position: relative;
  width: 50%;
  flex: 0 0 50%;
  max-width: 33%;
  flex-direction: row;
}

.row {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px;
  -ms-flex-pack: center !important;
  justify-content: center !important;
}

.btn-success {
  display: inline-block;
  color: #212529;
  text-align: center;
  vertical-align: center;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-color: transparent;
  border: 3px solid transparent;
  --el-dialog-font-line-height: v-bind(1.5);
  --el-alert-close-font-size: v-bind(5);
  border-radius: 0.3rem;
  --el-button-font-weight: v-bind(400);
}

.text-center {
  text-align: center !important;
}

.box {
  width: 100%;
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.image {
  width: 100%;
  height: 100%;
  display: block;
}</style>
