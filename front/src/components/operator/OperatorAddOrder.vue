<template>
  <el-main>
    <h2 v-if="callback === undefined">添加订单</h2>
    <el-form :model="form" label-width="120px">
      <!-- <h3>发货客户信息</h3> -->
      <el-row>
        <el-form-item label="发货客户姓名">
          <el-autocomplete v-model="form.senderName" class="inline-input w-50"
                           :fetch-suggestions="querySearchC" :trigger-on-focus="false"
                           @select="handleSelectCF"/>
        </el-form-item>
        <el-form-item label="发货客户电话">
          <el-input v-model="form.senderPhone"/>
        </el-form-item>
      </el-row>
      <template v-if="form.ofid==null">
        <!-- <h3>发货仓库</h3> -->
        <el-form-item label="发货仓库名">
          <el-autocomplete v-model="form.sendWarehouse" class="inline-input w-50" :fetch-suggestions="querySearchW"/>
        </el-form-item>
      </template>
      <!-- <h3>收货客户信息</h3> -->
      <el-row>
        <el-form-item label="收货客户姓名">
          <el-autocomplete v-model="form.receiverName" class="inline-input w-50"
                           :fetch-suggestions="querySearchC" :trigger-on-focus="false"
                           @select="handleSelectCT"/>
        </el-form-item>
        <el-form-item label="收货客户电话">
          <el-input v-model="form.receiverPhone"/>
        </el-form-item>
      </el-row>
      <!-- <h3>收货仓库</h3> -->
      <el-form-item label="收货仓库名">
        <el-autocomplete v-model="form.receiveWarehouse" class="inline-input w-50" :fetch-suggestions="querySearchW"/>
      </el-form-item>
      <h3>费用信息</h3>
      <el-row>
        <el-form-item label="重量（kg）">
          <el-input-number v-model="form.weight" :precision="3" :step="0.5" :min="0" @change="calMoney"/>
        </el-form-item>
        <el-form-item label="运费">{{ money }}元</el-form-item>
      </el-row>
      <el-form-item label="货物价值（元）">
        <el-input-number v-model="form.value" :precision="2" :step="0.1" :min="0"/>
      </el-form-item>
    </el-form>
  </el-main>
  <el-footer>
    <el-row justify="end">
      <el-button type="primary" @click="createOrder">提交</el-button>
    </el-row>
  </el-footer>
</template>

<script>
import {reactive} from "vue";
import {STORE, UserType} from "@/scripts/account";
import {findIdByUsername} from "@/scripts/data/operator";
import {findCustomersByName} from "@/scripts/data/customer";
import {findWarehouseNamesByKeyword} from "@/scripts/data/warehouse";
import {createBooking, getMoney} from "@/scripts/data/booking";
import {ElNotification} from "element-plus";

export default {
  name: "BookingCheckIn",
  props: ['callback'],
  data() {
    return {
      money: 0,
      form: reactive({
        cfname: '',
        cfphone: '',
        cfaddr: '',
        ctname: '',
        ctphone: '',
        ctaddr: '',
        payBefore: true,
        weight: 0,
        value: 0,
        wfname: '',
        wtname: '',
        ofid: null,
      }),
    }
  },
  methods: {
    querySearchC(queryString, cb) {
      if (queryString) {
        findCustomersByName(queryString, cb);
      } else {
        cb([])
      }
    },
    handleSelectCF(item) {
      this.form.cfphone = item.phone
      this.form.cfaddr = item.addr
    },
    handleSelectCT(item) {
      this.form.ctphone = item.phone
      this.form.ctaddr = item.addr
    },
    querySearchW(queryString, cb) {
      findWarehouseNamesByKeyword(queryString, cb);
    },
    calMoney() {
      getMoney(this.form.weight, (result) => {
        this.money = result;
      })
    },
    clearForm() {
      this.form.cfname = '';
      this.form.cfphone = '';
      this.form.cfaddr = '';
      this.form.ctname = '';
      this.form.ctphone = '';
      this.form.ctaddr = '';
      this.form.payBefore = true;
      this.form.weight = 0;
      this.form.value = 0;
      this.form.wfname = '';
      this.form.wtname = '';
    },
    cancelCreate() {
      if (this.callback !== undefined) {
        this.callback()
      }
      this.clearForm();
    },
    sureCreateBooking() {
      createBooking(this.form, (result) => {
        if (this.callback !== undefined) {
          this.callback()
        }
        if (result) {
          ElNotification({
            title: '创建成功',
            message: '货单创建成功',
            type: 'success',
          });
        } else {
          ElNotification({
            title: '创建失败',
            message: '货单创建失败',
            type: 'error',
          });
        }
        this.clearForm();
      })
    },
  },
  mounted() {
    this.calMoney();
    if (STORE.userState.type == UserType.OPERATOR) {
      findIdByUsername(STORE.userState.data.username, (result) => {
        this.form.ofid = result;
      })
    }
  }
}
</script>

<style scoped>

</style>