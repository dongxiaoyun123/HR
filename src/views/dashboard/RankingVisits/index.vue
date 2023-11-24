<template>
  <div style="width:100%">
    <el-card style="width:100% ;height:550px;margin-top: 20px;">
      <div slot="header" class="clearfix">
        <span style="float: left;margin: 0;line-height: 2.2rem;">就诊次数排行</span>
      </div>
      <el-row :gutter="8">
        <el-col :span="24">
          <div class="grid-content">
            <div ref="chart" class="ContentClass" />
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import echarts from 'echarts'
import {
  GetChartData,
} from "@/api/dashboard";
import { mapState } from "vuex";
export default {
  // 父组件传过来的数据
  props: {
    whereParameter: {
      type: Object,
      default() {
        return '';
      }
    },
  },
  data() {
    return {
      IfClearableEnterprise: !this.$store.getters.ParentCode,
      NumberOfVisits: [],
    };
  },
  watch: {
    whereParameter: {
      handler() {
        this.GetChartData();
      },
      deep: true,  // 可以深度检测到 obj 对象的属性值的变化
    },
    opened(val) {
      setTimeout(() => {
        //点击折叠按钮时图标不渲染问题（缩放浏览器自适应的方法写在了渲染图表时和页面点击不一样）
        this.myChart.resize();
      }, 300);
    },
  },
  computed: {
    ...mapState({
      opened: (state) => state.app.sidebar.opened,
    }),
  },
  created() {

  },
  methods: {
    // 根据分公司获取改公司下所有公司配置数据
    GetChartData() {
      var parameter = {
        ParentEnterPriseCode: this.whereParameter.ParentEnterPriseCode,
        EnterPriseCode: this.whereParameter.EnterPriseCode,
      }
      if (!this.IfClearableEnterprise) {
        if (!this.whereParameter.EnterPriseCode) { return; }
      }
      var chart = this.$refs.chart
      this.myChart = echarts.init(chart);
      this.myChart.clear();
      this.myChart.showLoading({
        text: 'loading',
        color: this.$store.state.settings.theme,
        textColor: '#000',
        maskColor: 'rgba(255, 255, 255, 0.8)',
        zlevel: 0,
      });
      GetChartData(parameter).then((res) => {
        if (res.success) {
          this.NumberOfVisits = res.result;
          this.PercentNumberOfVisits();
        } else {
          this.$message.error("获取失败");
        }
      });
    },
    // 就诊次数分布
    PercentNumberOfVisits() {
      var illness_IllnessTypeListArr = [];

      var titalData = this.NumberOfVisits.Illness_IllnessTypeList;
      for (var i = 0; i < titalData.length; i++) {
        illness_IllnessTypeListArr.push(
          titalData[i]
        );
      }
      var personCaseInfoListArr = [];
      var contentData = this.NumberOfVisits.PersonCaseInfoList;
      for (var s = 0; s < contentData.length; s++) {
        personCaseInfoListArr.push(
          contentData[s]
        );
      }
      var option = {
        grid: {
          left: '3%',
          right: '3%',
          bottom: '10%',
          containLabel: true
        },
        title: {
          text: this.NumberOfVisits.Title,
          top: 20,
          left: 'center',
        },
        xAxis: {
          data: illness_IllnessTypeListArr,
          axisLabel: {
            interval: 0,
            rotate: -40
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#999'
            }
          }
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        series: [
          {
            type: 'bar',
            itemStyle: {
              color: 'rgba(0,0,0,0.05)'
            },
            barGap: '-100%',
            barCategoryGap: '40%',
            animation: false
          },
          {
            type: 'bar',
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#83bff6' },
                    { offset: 0.5, color: '#188df0' },
                    { offset: 1, color: '#188df0' }
                  ]
                ),
                label: {
                  show: true,
                  position: 'top',
                  formatter: item => {
                    const curr = item.data / this.NumberOfVisits.Max * 100

                    return this.NumberOfVisits.Max == 0 ? '0%' : parseInt(curr) + '%'
                  }
                }
              }
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(
                  0, 0, 0, 1,
                  [
                    { offset: 0, color: '#2378f7' },
                    { offset: 0.7, color: '#2378f7' },
                    { offset: 1, color: '#83bff6' }
                  ]
                )
              }
            },
            data: personCaseInfoListArr
          }
        ]
      };
      this.myChart.setOption(option);
      this.myChart.hideLoading();
      window.addEventListener("resize", () => {
        this.myChart.resize()
      })
      this.$on('hook:destroyed', () => {
        window.removeEventListener("resize", () => {
          this.myChart.resize();
        });
      })
    },
  },
};
</script>

<style  scoped>
::v-deep .el-card__header {
  padding: 10px 20px
}

::v-deep .el-card__body {
  padding: 0 20px 20px 20px;
}

::v-deep .el-table {
  margin-top: 0
}

.ContentClass {
  width: 100%;
  height: 530px;
}
</style>
