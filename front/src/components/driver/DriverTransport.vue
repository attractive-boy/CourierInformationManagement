<template>
  <h2>{{ pageTitle }}</h2>
  <el-table :data="tpList" :default-sort="{prop:'transport.tnum',order:'ascending'}" stripe>
    <el-table-column fixed prop="transport.tnum" label="运单号" sortable />
    <el-table-column prop="driver.name" label="用户姓名" sortable />
    <el-table-column prop="truck.num" label="货车牌号" />
    <el-table-column prop="wfrom.name" label="发货仓库" />
    <el-table-column prop="wto.name" label="收货仓库" />
    <el-table-column prop="status" label="状态" sortable :filters="TransportStatusFilters" :filter-method="filterHandler"
      filter-placement="bottom-end">
      <template #default="scope">
        <el-tag :type="chooseTagType(scope.row.status)">{{ scope.row.status }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作">
      <template #default="scope">
        <el-button link type="primary" size="small" @click="showDetails(scope.row)">详情</el-button>
        <el-button v-if="!adminMod" link type="primary" size="small" @click="driverDepart(scope.row)"
          :disabled="scope.row.status!=='运单创建'">接单
        </el-button>
        <el-button v-if="!adminMod" link type="primary" size="small" @click="driverArrive(scope.row)"
          :disabled="scope.row.status!=='用户接单'">抵达
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <TransportDetail v-if="tpData!==undefined" :tp-data="tpData" :close-dialog="()=>{tpData=undefined}" />
</template>

<script>
import {ElMessageBox, ElNotification} from "element-plus";

export default {
  name: "TransportMain",
  props: ['pageTitle', 'adminMod', 'dataFetchMethod'],
  data() {
    return {
      isDownloading: true,
      tpList: [],
      tpData: undefined,
      TransportStatusFilters,
    }
  },
  methods: {
  }
}
</script>

<style scoped></style>