<template>
  <div style="margin:8px">
    <el-card>
      <el-form label-width="90px">
        <el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 0;" label="操作时间">
                <el-date-picker v-model="WhereParameter.Times" style="width: 100%;" format="yyyy-MM"
                                type="month" placeholder="选择月" @change="GetData"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
      </el-form>
    </el-card>
    <el-row :gutter="8" style="margin-top: 8px;">
      <el-col :span="16">
        <el-card>
          <div class="grid-content">
            <div ref="chart" v-loading="loading" class="ContentClass" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div class="grid-content">
            <el-table v-loading="TableLoading" highlight-current-row :data="LoginStatisticsList" fit
                      height="calc(100vh - 230px)"
            >
              <el-table-column prop="EnterPriseName" label="公司名称" min-width="180"
                               show-overflow-tooltip
              />
              <el-table-column prop="Count" label="登录次数" min-width="100" />
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
import moment from "moment"; // 导入模块
moment.locale("zh-cn");
import {
    GetLoginStatisticsChart,
    GetLoginStatisticsLog,
} from "@/api/hrmain";
export default {
    name: 'LoginStatistics',
    components: {
    },
    data() {
        return {
            WhereParameter: {
                ParentEnterPriseCode: '',
                Times: '',
                CreateTime: [],
                BeginTime: '',
                EndTime: '',
                PageIndex: 1,
                PageSize: 20,
            },
            loading: false,
            LoginStatisticsList: [],
            TableLoading: false,
            chart: null
        };
    },
    computed: {

    },
    created() {
        this.WhereParameter.Times = this.$moment().format("YYYY-MM");
    },
    // 加载完成后执行调取回款数据接口
    mounted() {
        this.GetData();
    },
    methods: {
        GetData() {
            this.WhereParameter.Times = this.$moment(this.WhereParameter.Times).format("YYYY-MM");
            this.chart = null
            this.GetLoginStatisticsChart();
            this.GetLoginStatisticsLog();
        },
        // 获取列表数据
        GetLoginStatisticsLog() {
            this.TableLoading = true;
            var parameter = {
                Times: this.WhereParameter.Times,
            }
            GetLoginStatisticsLog(parameter).then((res) => {
                if (res.success) {
                    this.LoginStatisticsList = res.result;
                }
                this.TableLoading = false;
            });
        },
        // 获取图表数据
        GetLoginStatisticsChart() {
            this.loading = true;
            var parameter = {
                Times: this.WhereParameter.Times,
            }
            GetLoginStatisticsChart(parameter).then((res) => {
                if (res.success) {
                    var optionChart = {
                        dayList: res.result.dayList,
                        corpList: res.result.corpList,
                        countList: res.result.countList,
                    };
                    this.getEchartData(optionChart);
                }
                this.loading = false;
            });
        },
        getEchartData(optionChart) {
            this.chart = this.$refs.chart
            if (this.chart) {
                const myChart = echarts.init(this.chart)
                const option = {
                    title: {
                        text: this.WhereParameter.Times + "登陆统计数据"
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        left: '1%',
                        right: '1%',
                        bottom: '1%',
                        containLabel: true
                    },
                    legend: {},
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
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: optionChart.dayList,
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    series: [
                        {
                            name: '当日公司登陆个数',
                            type: 'line',
                            data: optionChart.corpList,
                            markPoint: {
                                data: [
                                    { type: 'max', name: 'Max' },
                                    { type: 'min', name: 'Min' }
                                ]
                            },
                            markLine: {
                                data: [{ type: 'average', name: 'Avg' }]
                            },
                            color: '#5470c6',
                        },
                        {
                            name: '当日系统登录次数',
                            type: 'line',
                            data: optionChart.countList,
                            markPoint: {
                                data: [
                                    { type: 'max', name: 'Max' },
                                    { type: 'min', name: 'Min' }
                                ]
                            },
                            markLine: {
                                data: [
                                    { type: 'average', name: 'Avg' },
                                ]
                            },
                            color: '#91cc75',
                        }
                    ]
                };
                myChart.setOption(option)
                window.addEventListener("resize", function () {
                    myChart.resize()
                })
            }
            // this.$on('hook:destroyed', () => {
            //     window.removeEventListener("resize", function () {
            //         myChart.resize();
            //     });
            // })
        },
    }
};
</script>
<style scoped>
.whereClass {
    width: 100%;
    margin-bottom: 0;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
}

.ContentClass {
    width: 100%;
    height: calc(100vh - 230px);
}
</style>
