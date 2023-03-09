<template>
  <div>
    <el-row :gutter="20" style="margin-top: 20px;">
      <!-- 汇总 -->
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <el-card class="box-card" style="height:555px ;">
            <div slot="header" class="clearfix">
              <span>赔付金额排行榜(按申请日期统计)</span>
            </div>
            <el-skeleton style="width: 100%" :loading="loading" :rows="12" animated>
              <el-table :data="list0" border>
                <el-table-column prop="CorpName" label="公司名称" min-width="160" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="PsnName" label="姓名">
                </el-table-column>
                <el-table-column prop="Pay" label="医疗费总额" sortable>
                  <template slot-scope="scope">
                    <span v-format="'¥#,##0.00'">{{ scope.row.Pay }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="SPay" label="赔付总金额" sortable>
                  <template slot-scope="scope">
                    <span v-format="'¥#,##0.00'">{{ scope.row.SPay }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-skeleton>
          </el-card>
        </div>
      </el-col>
      <!-- 以下数据按照医疗发票日期统计 -->
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <el-card class="box-card" style="height:555px ;">
            <div slot="header" class="clearfix">
              <span>申请件数排行榜(按申请日期统计)</span>
            </div>
            <el-skeleton style="width: 100%" :loading="loading" :rows="12" animated>
              <el-table :data="list1" border>
                <el-table-column prop="CorpName" label="公司名称" min-width="160" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="PsnName" label="姓名" min-width="80">
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="Acount" min-width="180" label="申请件数（包括进行中、获赔、退单）" sortable>
                </el-table-column>
              </el-table>
            </el-skeleton>
          </el-card>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px;">
      <!-- 汇总 -->
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <el-card class="box-card" style="height:308px ;">
            <div slot="header" class="clearfix">
              <span>汇总</span>
            </div>
            <el-skeleton style="width: 100%" :loading="loading" :rows="6" animated>
              <el-col :span="24" v-for="item in ListNewAll">
                <el-table :data="item.objlist" border>
                  <el-table-column prop="FieldName" label="月份">
                  </el-table-column>
                  <el-table-column prop="AllCount" label="申请报销数量（件）">
                  </el-table-column>
                  <el-table-column prop="Pay" label="报销数量（件）">
                  </el-table-column>
                  <el-table-column prop="Reject" label="退单数量（件）">
                  </el-table-column>
                </el-table>
              </el-col>
            </el-skeleton>
          </el-card>
        </div>
      </el-col>
      <!-- 以下数据按照医疗发票日期统计 -->
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <el-card class="box-card" style="height:308px ;">
            <div slot="header" class="clearfix">
              <span>以下数据按照医疗发票日期统计</span>
            </div>
            <el-skeleton style="width: 100%" :loading="loading" :rows="3" animated>
              <el-table :data="ExtendData" border>
                <el-table-column prop="ExtendType" label="理赔类型">
                </el-table-column>
                <el-table-column prop="LipeiCount" label="获赔件数">
                </el-table-column>
                <el-table-column prop="CountZhanBi" label="件数占比">
                </el-table-column>
                <el-table-column prop="PeiKuan" label="理赔金额">
                </el-table-column>
                <el-table-column prop="JunJian" label="件均理赔">
                </el-table-column>
              </el-table>
            </el-skeleton>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  GetDataBriefs,
} from "@/api/hrstatistics";
export default {
  data() {
    return {
      IfClearableEnterprise: this.$store.getters.ParentCode ? false : true,
      loading: false,
      BriefsList: [],
      Objlist: [],
      ExtendData: [],
      flag1: false,
      Total_LiPeiCount: null,
      UnFinish_LipeiCount: null,
      ExtendData: [],
      UnFinish_ClmAmount: null,
      Rln_ClmaimsAmount: null,
      Psn_ClmaimsAmount: null,
      OnLineLipeiCount: 0,
      Total_OnLinePeiKuan: 0,
      OnLineJunJian: 0,
      OnLineCountZhanBi: 0,
      OffLineLipeiCount: 0,
      OffLineCountZhanBi: 0,
      Total_OffLinePeiKuan: 0,
      OffLineJunJian: 0,
      list0: [],
      list1: [],
      ListNewAll: [],
    };
  },
  methods: {
    //根据分公司获取改公司下所有公司配置数据
    GetReportData() {
      this.loading = true;
      var parameter = {
        ParentEnterPriseCode: this.WhereParameter.ParentEnterPriseCode,
        EnterPriseCode: this.WhereParameter.EnterPriseCode,
        Menu: "DashBoard",
      }
      if (!this.IfClearableEnterprise) {
        if (!this.WhereParameter.EnterPriseCode)
          return;
      }

      GetDataBriefs(parameter).then((res) => {
        this.loading = false;
        if (res.success) {
          this.BriefsList = res.result;
          this.ListNewAll = this.WhereParameter.EnterPriseCode ? this.BriefsList.ListNewAll : this.BriefsList.ListNewAll.filter((item) => {
            return item.CorpName == "汇总"
          })
          this.list0 = this.BriefsList.dataobj.lists0.lists;
          this.list1 = this.BriefsList.dataobj.lists1.lists;
          this.Total_LiPeiCount = this.BriefsList.resultThree.Total_LiPeiCount;
          this.UnFinish_LipeiCount = this.BriefsList.resultThree.UnFinish_LipeiCount;
          this.UnFinish_ClmAmount = this.BriefsList.resultThree.UnFinish_ClmAmount.toFixed(2);
          this.Rln_ClmaimsAmount = this.BriefsList.resultThree.Total_ClaimsAmount == 0 ? "0%" : (parseFloat(this.BriefsList.resultThree.Rln_ClaimsAmount / this.BriefsList.resultThree.Total_ClaimsAmount * 100).toFixed(2) + "%");
          this.Psn_ClmaimsAmount = this.BriefsList.resultThree.Total_ClaimsAmount == 0 ? "0%" : ((100 - (this.BriefsList.resultThree.Rln_ClaimsAmount / this.BriefsList.resultThree.Total_ClaimsAmount * 100).toFixed(2)).toFixed(2) + "%");
          if (this.BriefsList.resultThree.HasOnLIne > 0) {
            this.OnLineLipeiCount = (this.BriefsList.resultThree.OnLineLipeiCount);
            this.Total_OnLinePeiKuan = (this.BriefsList.resultThree.Total_OnLinePeiKuan);
            this.OnLineJunJian = this.BriefsList.resultThree.OnLineLipeiCount == 0 ? "0" : (parseFloat(this.BriefsList.resultThree.Total_OnLinePeiKuan / this.BriefsList.resultThree.OnLineLipeiCount).toFixed(2));
            this.OnLineCountZhanBi = this.BriefsList.resultThree.Total_LiPeiCount == 0 ? "0%" : (parseFloat(this.BriefsList.resultThree.OnLineLipeiCount / this.BriefsList.resultThree.Total_LiPeiCount * 100).toFixed(2) + "%");
            this.OffLineLipeiCount = (this.BriefsList.resultThree.Total_LiPeiCount - this.BriefsList.resultThree.OnLineLipeiCount);
            this.OffLineCountZhanBi = this.BriefsList.resultThree.Total_LiPeiCount == 0 ? "0%" : (parseFloat(100 - (this.BriefsList.resultThree.OnLineLipeiCount / this.BriefsList.resultThree.Total_LiPeiCount * 100).toFixed(2)).toFixed(2) + "%");
            this.Total_OffLinePeiKuan = (parseFloat(this.BriefsList.resultThree.Total_ClaimsAmount - this.BriefsList.resultThree.Total_OnLinePeiKuan).toFixed(2));
            this.OffLineJunJian = (this.BriefsList.resultThree.Total_LiPeiCount - this.BriefsList.resultThree.OnLineLipeiCount) == 0 ? "0" : ((parseFloat(this.BriefsList.resultThree.Total_ClaimsAmount - this.BriefsList.resultThree.Total_OnLinePeiKuan) / (this.BriefsList.resultThree.Total_LiPeiCount - this.BriefsList.resultThree.OnLineLipeiCount)).toFixed(2));
          }
          else {
            this.OnLineLipeiCount = 0;
            this.Total_OnLinePeiKuan = 0;
            this.OnLineCountZhanBi = 0;
            this.OffLineLipeiCount = 0;
            this.OffLineCountZhanBi = 0;
            this.Total_OffLinePeiKuan = 0;
            this.OffLineJunJian = 0;
          }
          this.ExtendData = [];
          var parameter1 = {
            ExtendType: '线上理赔',
            LipeiCount: this.OnLineLipeiCount,
            CountZhanBi: this.OnLineCountZhanBi,
            PeiKuan: this.Total_OnLinePeiKuan,
            JunJian: this.OnLineJunJian,
          }
          var parameter2 = {
            ExtendType: '线下理赔',
            LipeiCount: this.OffLineLipeiCount,
            CountZhanBi: this.OffLineCountZhanBi,
            PeiKuan: this.Total_OffLinePeiKuan,
            JunJian: this.OffLineJunJian,
          }
          this.ExtendData.push(parameter1);
          this.ExtendData.push(parameter2);
        }
        else {
          this.BriefsList = [];
          this.ListNewAll = [];
          this.list0 = [];
          this.list1 = [];
          this.Total_LiPeiCount = null;
          this.UnFinish_LipeiCount = null;
          this.UnFinish_ClmAmount = null;
          this.Rln_ClmaimsAmount = null;
          this.Psn_ClmaimsAmount = null;
          this.OnLineLipeiCount = null;
          this.Total_OnLinePeiKuan = null;
          this.OnLineJunJian = null;
          this.OnLineCountZhanBi = null;
          this.OffLineLipeiCount = null;
          this.OffLineCountZhanBi = null;
          this.Total_OffLinePeiKuan = null;
          this.OffLineJunJian = null;
          this.ExtendData = [];
          this.$message.error(res.resultMessage);
        }
      });
    },
  },
  //父组件传过来的数据
  props: {
    WhereParameter: {
      type: Object
    },
  },

  watch: {
    WhereParameter: {
      handler() {
        this.GetReportData();
      },
      deep: true,  // 可以深度检测到 obj 对象的属性值的变化
    },
  },
  created() {

  },
};
</script>
  
<style  scoped></style>