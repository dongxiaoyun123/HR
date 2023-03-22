<template>
  <el-card style="width: 100%;height: 515px;margin-top: 20px;">
    <div slot="header" class="clearfix">
      <span style="float: left;margin: 0;line-height: 2.2rem;">账单统计</span>
    </div>
    <!-- <div ref="chart" style="width:100%;height:450px"></div> -->
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="6">
        <div class="grid-content">
          <el-statistic title="总金额">
            <template slot="prefix">
              <div v-if="!AllFlag">
                <svg-icon icon-class="OverViewAll" style="color: #FF4949;font-size: 18px;" />
                <span class="MoneySpanClass" v-format="'#,##0.00'">{{ OrderTotal }}</span>
              </div>
              <div v-else class="MoneySpanClass">暂无</div>
            </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <el-statistic title="计费中">
            <template slot="prefix">
              <div v-if="!AllFlag">
                <svg-icon icon-class="OrderCharging" style="color: #1890FF;font-size: 18px;" />
                <span class="MoneySpanClass" v-format="'#,##0.00'">{{ OrderCharging }}</span>
              </div>
              <div v-else class="MoneySpanClass">暂无</div>
            </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <el-statistic title="已支付">
            <template slot="prefix">
              <div v-if="!AllFlag">
                <svg-icon icon-class="OrderPaid" style="color: #13CE66;font-size: 18px;" />
                <span class="MoneySpanClass" v-format="'#,##0.00'">{{ OrderPaid }}</span>
              </div>
              <div v-else class="MoneySpanClass">暂无</div>
            </template>
          </el-statistic>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <el-statistic title="超时">
            <template slot="prefix">
              <div v-if="!AllFlag">
                <svg-icon icon-class="OrderPaymentTimeout" style="color: #FFBA00;font-size: 18px;" />
                <span class="MoneySpanClass" v-format="'#,##0.00'">{{ OrderPaymentTimeout }}</span>
              </div>
              <div v-else class="MoneySpanClass">暂无</div>
            </template>
          </el-statistic>
        </div>
      </el-col>
    </el-row>
    <el-skeleton style="width: 100%;margin-top:20px ;" :loading="loading" :rows="9" animated>
      <el-table :data="DetailData" size="small" height="325px" border>
        <el-table-column prop="EnterPriseName" show-overflow-tooltip label="公司名称" min-width="190"></el-table-column>
        <el-table-column prop="OrderTotal" show-overflow-tooltip label="总金额" sortable min-width="85">
          <template slot-scope="scope">
            <span v-if="!scope.row.Flag" v-format="'¥#,##0.00'">{{ scope.row.OrderTotal }}</span>
            <span v-else>暂无</span>
          </template>
        </el-table-column>
        <el-table-column prop="OrderCharging" show-overflow-tooltip label="计费中" sortable min-width="85">
          <template slot-scope="scope">
            <span v-if="!scope.row.Flag" v-format="'¥#,##0.00'">{{ scope.row.OrderCharging }}</span>
            <span v-else>暂无</span>
          </template>
        </el-table-column>
        <el-table-column prop="OrderPaid" show-overflow-tooltip label="已支付" sortable min-width="85">
          <template slot-scope="scope"> <span v-if="!scope.row.Flag" v-format="'¥#,##0.00'">{{ scope.row.OrderPaid
          }}</span>
            <span v-else>暂无</span>
          </template>
        </el-table-column>
        <el-table-column prop="OrderPaymentTimeout" show-overflow-tooltip label="超时" sortable min-width="85">
          <template slot-scope="scope"> <span v-if="!scope.row.Flag" v-format="'¥#,##0.00'">{{
            scope.row.OrderPaymentTimeout }}</span>
            <span v-else>暂无</span>
          </template>
        </el-table-column>
      </el-table>
    </el-skeleton>
  </el-card>
</template>
<script>
// import echarts from 'echarts'
import {
  GetAmountDue,
} from "@/api/dashboard";
export default {
  data() {
    return {
      IfClearableEnterprise: this.$store.getters.ParentCode ? false : true,
      myChart: null,
      loading: false,
      OrderCharging: 0,
      OrderPaid: 0,
      OrderPaymentTimeout: 0,
      OrderTotal: 0,
      DetailData: [],
      AllFlag: false,
    }
  },
  mounted() {
  },
  methods: {
    //根据分公司获取改公司下所有公司配置数据
    GetAmountDue() {
      this.loading = true;
      var parameter = {
        ParentEnterPriseCode: this.WhereParameter.ParentEnterPriseCode,
        EnterPriseCode: this.WhereParameter.EnterPriseCode,
      }
      if (!this.IfClearableEnterprise) {
        if (!this.WhereParameter.EnterPriseCode)
          return;
      }
      GetAmountDue(parameter).then((res) => {
        this.loading = false;
        if (res.success) {
          this.OrderCharging = res.result.TotalData.OrderCharging;
          this.OrderPaid = res.result.TotalData.OrderPaid;
          this.OrderPaymentTimeout = res.result.TotalData.OrderPaymentTimeout;
          this.OrderTotal = res.result.TotalData.OrderTotal;
          this.DetailData = res.result.ChildEnterpriseGroupBy;
          this.AllFlag = res.result.TotalData.Flag;
        }
        else {
          this.$message.error("获取失败");
        }
      });
    },
    // getEchartData() {
    //   var that = this;
    //   var option = {
    //     tooltip: {
    //       trigger: 'item',
    //       formatter: '{a} <br/>{b}: {c} ({d}%)'
    //     },
    //     legend: {
    //       orient: 'vertical',
    //       top: 10,
    //       left: 0,
    //       data: ['计费中', '已支付', '支付超时']
    //     },
    //     color: ['#1890FF', '#13CE66', '#FFBA00'],
    //     series: [
    //       {
    //         name: '账单类型',
    //         type: 'pie',
    //         center: ['50%', '47%'],
    //         radius: ['40%', '60%'],
    //         avoidLabelOverlap: false,
    //         label: {
    //           show: false,
    //           position: 'center'
    //         },
    //         labelLine: {
    //           show: false
    //         },
    //         data: [
    //           { value: this.OrderCharging, name: '计费中' },
    //           { value: this.OrderPaid, name: '已支付' },
    //           { value: this.OrderPaymentTimeout, name: '支付超时' },
    //         ],
    //         label: {
    //           normal: {
    //             show: true,
    //             position: 'center',
    //             formatter: function () {
    //               return ' 账单总金额\r\n ' + that.OrderTotal
    //             },
    //             textStyle: {
    //               fontSize: 20,
    //               color: "#FF5E5E"
    //             }
    //           },
    //           emphasis: {
    //             show: false,
    //             textStyle: {
    //               fontSize: '30',
    //               fontWeight: 'bold'
    //             }
    //           }
    //         },
    //       }
    //     ]
    //   };
    //   this.myChart.setOption(option);
    //   this.myChart.hideLoading();
    //   window.addEventListener("resize", () => {
    //     this.myChart.resize()
    //   })

    //   this.$on('hook:destroyed', () => {
    //     window.removeEventListener("resize", () => {
    //       this.myChart.resize();
    //     });
    //   })
    // },
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
        this.GetAmountDue();
      },
      deep: true,  // 可以深度检测到 obj 对象的属性值的变化
    },
  },
  created() {
  }
}
</script>

<style  scoped>
::v-deep .el-card__header {
  padding: 10px 20px
}


.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

::v-deep .el-statistic .con .number {
  font-size: 18px;
}

::v-deep .el-statistic .head {
  color: #606266;
}

::v-deep .el-statistic .con {
  margin-top: 6px;
}

.MoneySpanClass {
  font-size: 18px;
  padding: 0 4px;
  display: inline-block;
  margin: 0;
  line-height: 100%;
}
</style>