<template>
  <el-card style="width: 100%;height: 520px;margin-top: 20px;">
    <div slot="header" class="clearfix">
      <span style="float: left;margin: 0;line-height: 2.2rem;">每月在保统计</span>
    </div>
    <div ref="chart" style="width:100%;height:450px" />
  </el-card>
</template>
<script>
import echarts from 'echarts'
import {
    GetMonthStaffStatistics,
} from "@/api/dashboard";
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
            myChart: null,
            MonthList: [],
            StaffUnderInsurance: [],
            RelationUnderInsurance: [],
            AllUnderInsurance: [],
        }
    },
    watch: {
        whereParameter: {
            handler() {
                this.GetMonthStaffStatistics();
            },
            deep: true,  // 可以深度检测到 obj 对象的属性值的变化
        },
    },
    mounted() {

    },
    created() {
    },
    methods: {
        // 根据分公司获取改公司下所有公司配置数据
        GetMonthStaffStatistics() {
            this.loading = true;
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
            GetMonthStaffStatistics(parameter).then((res) => {
                this.loading = false;
                if (res.success) {
                    this.MonthList = res.result.MonthList;
                    this.StaffUnderInsurance = res.result.StaffUnderInsurance;
                    this.RelationUnderInsurance = res.result.RelationUnderInsurance;
                    this.AllUnderInsurance = res.result.AllUnderInsurance;

                    this.getEchartData()
                } else {
                    this.$message.error("获取失败");
                }
            });
        },
        getEchartData() {
            var option = {
                // title: {
                //     text: "每月在保统计",
                //     // subtext: '来自报销理赔系统',
                // },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        dataView: { readOnly: false },
                        magicType: { type: ['line', 'bar'] },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '5%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: this.MonthList,
                    axisTick: {
                        alignWithLabel: true
                    }
                },
                yAxis: {
                    type: 'value'
                },
                legend: {
                    top: 10,
                    data: ['员工在保', '关联人在保', '总在保']
                },
                series: [
                    {
                        name: '员工在保',
                        type: 'bar',
                        itemStyle: {
                            normal: { color: '#1890FF' }
                        },
                        data: this.StaffUnderInsurance,
                    }, {
                        name: '关联人在保',
                        type: 'bar',
                        itemStyle: {
                            normal: { color: '#13CE66' }
                        },
                        data: this.RelationUnderInsurance,
                    }, {
                        name: '总在保',
                        type: 'line',
                        itemStyle: {
                            normal: { color: '#FFC833' }
                        },
                        data: this.AllUnderInsurance,
                    },
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
    }
}
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
</style>
