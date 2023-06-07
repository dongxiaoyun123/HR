<template>
  <div style="margin:20px">
    <el-card>
      <el-form label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item class="formClass" label="合同方">
              <el-select class="whereClass" v-model="WhereParameter.ParentEnterPriseCode" filterable placeholder="合同方"
                @change="GetChildUser">
                <el-option v-for="item in EnterpriseList" :key="item.ParentEnterPriseCode"
                  :label="item.ParentEnterPriseName" :value="item.ParentEnterPriseCode">
                  <span style="float: left">{{ item.ParentEnterPriseName }}</span>
                  <span v-if="item.MenuPermissions == 1" style="float: right; color: #1890FF; font-size: 13px">在线增减</span>
                  <span v-if="item.MenuPermissions == 2" style="float: right; color: #909399; font-size: 13px">健康数据</span>
                  <span v-if="item.MenuPermissions == 3" style="float: right; color: #13CE66; font-size: 13px">全部显示</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item class="formClass" label="付款方">
              <el-select class="whereClass" v-model="WhereParameter.EnterPriseCode" filterable placeholder="付款方"
                :clearable='IfClearableEnterprise'>
                <el-option v-for="item in ChildEnterpriseList" :key="item.EnterPriseCode" :label="item.EnterPriseName"
                  :value="item.EnterPriseCode">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 人数统计 -->
    <PersonnelStatistics v-show="MenuPermissions != 2" :WhereParameter="WhereParameter" />
    <!-- 每月在保统计 -->
    <el-row v-show="MenuPermissions != 2">
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="chart-wrapper">
          <MonthStaffAdd :WhereParameter="WhereParameter" />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" v-show="MenuPermissions != 2">
      <!-- 方案统计 -->
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <ProgramStatistics :WhereParameter="WhereParameter" />
        </div>
      </el-col>
      <!-- 账单统计 -->
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <BillingStatistics :WhereParameter="WhereParameter" />
        </div>
      </el-col>
    </el-row>
    <el-row v-show="MenuPermissions != 1">
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="chart-wrapper">
          <ReportSummary v-show="MenuPermissions != 1" :WhereParameter="WhereParameter" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="chart-wrapper">
          <RankingVisits v-show="MenuPermissions != 1" :WhereParameter="WhereParameter" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PersonnelStatistics from './PersonnelStatistics/index.vue'
import MonthStaffAdd from './MonthStaffAdd/index.vue'
import ProgramStatistics from './ProgramStatistics/index.vue'
import BillingStatistics from './BillingStatistics/index.vue'
import ReportSummary from './ReportSummary/index.vue'
import RankingVisits from './RankingVisits/index.vue'

import {
  GetEnterpriseList,
  GetChildUser,
} from "@/api/hrmain";
export default {
  name: 'Dashboard',
  components: { PersonnelStatistics, MonthStaffAdd, ProgramStatistics, BillingStatistics, ReportSummary, RankingVisits },
  data() {
    return {
      IfClearableEnterprise: this.$store.getters.ParentCode ? false : true,
      WhereParameter: {
        ParentEnterPriseCode: '',
        EnterPriseCode: '',
      },
      ReadOnly: false,
      EnterpriseList: [],
      ChildEnterpriseList: [],
      MenuPermissions: null,
    }
  },
  // computed: {
  //   ...mapGetters([
  //     'roles'
  //   ])
  // },
  methods: {
    GetEnterpriseList() {
      // 传入vuex存储的值
      GetEnterpriseList().then((res) => {
        if (res.success) {
          //过滤掉自主增减的公司
          this.EnterpriseList = res.result;
          //如果有数据那么赋个默认的值
          if (this.EnterpriseList.length > 0) {
            this.WhereParameter.ParentEnterPriseCode = this.EnterpriseList[0].ParentEnterPriseCode;
            this.GetChildUser(this.EnterpriseList[0].ParentEnterPriseCode);
          }
        } else {
          this.EnterpriseList = [];
        }
      });
    },
    //根据父级公司获取分公司
    GetChildUser(ParentEnterPriseCode) {
      this.EnterpriseList.forEach(element => {
        if (element.ParentEnterPriseCode == this.WhereParameter.ParentEnterPriseCode) {
          this.MenuPermissions = element.MenuPermissions;
        }
      });
      this.WhereParameter.EnterPriseCode = '';
      GetChildUser(ParentEnterPriseCode).then((res) => {
        if (res.success) {
          this.ChildEnterpriseList = res.result;
          if (this.ChildEnterpriseList.length > 0) {
            //如果是合同方直接查询全部数据
            if (!this.IfClearableEnterprise)
              this.WhereParameter.EnterPriseCode = this.ChildEnterpriseList[0].EnterPriseCode;
          }
        } else {
          this.ChildEnterpriseList = [];
        }
      });
    },
  },
  created() {
  },
  mounted() {

    this.GetEnterpriseList();
  },
}
</script>
<style scoped >
.whereClass {
  width: 100%;
}

.cardClass {
  margin-top: 8px;
}

.formClass {
  margin-bottom: 0;
}
</style>
