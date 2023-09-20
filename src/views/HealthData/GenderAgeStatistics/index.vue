<template>
  <div style="margin:8px">
    <el-card>
      <el-form label-width="90px">
        <el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 0;" label="合同方">
                <el-select v-model="WhereParameter.ConID" class="whereClass" filterable placeholder="合同方"
                           @change="GetChildUser"
                >
                  <el-option v-for="item in EnterpriseList" :key="item.ConID"
                             :label="item.ParentEnterPriseName" :value="item.ConID"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 0;" label="付款方">
                <el-select v-model="WhereParameter.CorpID" class="whereClass"
                           filterable placeholder="付款方" :clearable="IfClearableEnterprise"
                           @change="GenderAgeStatisticsData"
                >
                  <el-option v-for="item in ChildEnterpriseList" :key="item.CorpID"
                             :label="item.EnterPriseName" :value="item.CorpID"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 0;" label="操作时间">
                <el-date-picker v-model="WhereParameter.CreateTime" :clearable="false" style="width: 100%;"
                                type="daterange" range-separator="至" start-placeholder="开始时间"
                                end-placeholder="结束时间" :picker-options="pickerOptions" @input="datetimeChange"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-button style="margin-left:2rem ;" type="primary" icon="el-icon-search"
                         @click="GenderAgeStatisticsData"
              >查
                询
              </el-button>
            </el-col>
          </el-row>
        </el-row>
      </el-form>
    </el-card>

    <el-row :gutter="8" style="margin-top: 8px;">
      <el-col :span="12">
        <el-card>
          <div class="grid-content">
            <div ref="chart1" class="ContentClass" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div class="grid-content">
            <div ref="chart2" class="ContentClass" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
import moment from "moment"; // 导入模块
import { getDateByTimes } from "@/utils"; // 时间日期格式化成字符串
moment.locale("zh-cn");
import {
    GetEnterpriseList,
    GetChildUserConId,
} from "@/api/hrmain";
import {
    GenderAgeStatisticsData
} from "@/api/hrstatistics";

export default {
    name:'GenderAgeStatistics',
    components: {
    },
    data() {
        return {
            IfClearableEnterprise: !this.$store.getters.ParentCode,
            EnterpriseList: [],
            WhereParameter: {
                ConID: '',
                CorpID: null,
                CreateTime: [],
                BeginTime: '',
                EndTime: '',
            },
            ChartData: [],
            loading: false,
            pickerOptions: {
                shortcuts: [
                    {
                        text: "本月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date(new Date().setTime(new Date().setDate(1)));
                            picker.$emit("pick", [start, end]);
                        },
                    },
                    {
                        text: "上月",
                        onClick(picker) {
                            var range = getDateByTimes()
                            const start = range[0];
                            const end = range[1];
                            picker.$emit("pick", [new Date(start), new Date(end)]);
                        },
                    },
                    {
                        text: "本年",
                        onClick(picker) {
                            const end = new Date();
                            var y = end.getFullYear(); // 年

                            var startStr = y + "-01-01";

                            const start = new Date(startStr);
                            picker.$emit("pick", [start, end]);
                        },
                    },
                    {
                        text: "最近一周",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit("pick", [start, end]);
                        },
                    },
                    {
                        text: "最近一个月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit("pick", [start, end]);
                        },
                    },
                    {
                        text: "最近三个月",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit("pick", [start, end]);
                        },
                    },
                    {
                        text: "最近半年",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
                            picker.$emit("pick", [start, end]);
                        },
                    },
                    {
                        text: "最近一年",
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 360);
                            picker.$emit("pick", [start, end]);
                        },
                    },
                ],
            },
            myChart1: null,
            myChart2: null,
            ChildEnterpriseList: [],
        };
    },
    computed: {

    },
    created() {

    },
    // 加载完成后执行调取回款数据接口
    mounted() {
        var now = new Date();
        var year = now.getFullYear(); // 得到年份
        this.WhereParameter.CreateTime = [moment(`${year}-01-01`), moment(now)];
        this.GetEnterpriseList();
    },
    methods: {
        datetimeChange(time) {
            // 强制刷新
            this.$forceUpdate();
        },
        // 如果登陆人是客服，那么获取公司列表
        GetEnterpriseList() {
            // 传入vuex存储的值
            GetEnterpriseList().then((res) => {
                if (res.success) {
                    this.EnterpriseList = res.result.filter((item) => { return item.MenuPermissions != 1 });
                    // 如果有数据那么赋个默认的值
                    if (this.EnterpriseList.length > 0) {
                        this.WhereParameter.ConID = this.EnterpriseList[0].ConID;
                        this.GetChildUser();
                    }
                } else {
                    this.EnterpriseList = [];
                }
            });
        },
        // 根据父级公司获取分公司
        GetChildUser() {
            this.WhereParameter.CorpID = null;
            GetChildUserConId(this.WhereParameter.ConID).then((res) => {
                if (res.success) {
                    this.ChildEnterpriseList = res.result;
                    if (this.ChildEnterpriseList.length > 0) {
                        // 如果是合同方直接查询全部数据
                        if (!this.IfClearableEnterprise) { this.WhereParameter.CorpID = this.ChildEnterpriseList[0].CorpID; }
                        this.GenderAgeStatisticsData();
                    }
                } else {
                    this.ChildEnterpriseList = [];
                }
            });
        },
        // 获取列表数据
        GenderAgeStatisticsData() {
            this.loading = true;
            if (this.WhereParameter.CreateTime && this.WhereParameter.CreateTime.length > 0) {
                this.WhereParameter.BeginTime = this.$moment(this.WhereParameter.CreateTime[0]).format("YYYY-MM-DD");
                this.WhereParameter.EndTime = this.$moment(this.WhereParameter.CreateTime[1]).format("YYYY-MM-DD");
            } else {
                this.WhereParameter.BeginTime = '';
                this.WhereParameter.EndTime = '';
            }
            var parameter = {
                ConID: this.WhereParameter.ConID,
                CorpID: this.WhereParameter.CorpID,
                BeginTime: this.WhereParameter.BeginTime,
                EndTime: this.WhereParameter.EndTime,
            }
            var chart1 = this.$refs.chart1
            this.myChart1 = echarts.init(chart1);
            this.myChart1.clear();
            this.myChart1.showLoading({
                text: 'loading',
                color: this.$store.state.settings.theme,
                textColor: '#000',
                maskColor: 'rgba(255, 255, 255, 0.8)',
                zlevel: 0,
            });
            var chart2 = this.$refs.chart2
            this.myChart2 = echarts.init(chart2);
            this.myChart2.clear();
            this.myChart2.showLoading({
                text: 'loading',
                color: this.$store.state.settings.theme,
                textColor: '#000',
                maskColor: 'rgba(255, 255, 255, 0.8)',
                zlevel: 0,
            });
            GenderAgeStatisticsData(parameter).then((res) => {
                this.loading = false;
                if (res.success) {
                    this.ChartData = res.result;
                    this.GetCropTypeG();
                    this.GetCropTypeY();
                } else { this.ChartData = []; }
            });
        },
        // 获取疾病统计数据
        GetCropTypeG() {
            var option = {
                title: {
                    text: '男女比例统计',
                    subtext: '',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                color: ['#5470c6', '#ee6666'],
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ["男", "女"]
                },
                series: [
                    {
                        name: '男女比例统计',
                        type: 'pie',
                        radius: ['35%', '50%'],
                        data: [{ value: this.ChartData.GetCropTypeGData.P1, name: "男" }, { value: this.ChartData.GetCropTypeGData.P1, name: "女" }],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            this.myChart1.setOption(option);
            this.myChart1.hideLoading();
            window.addEventListener("resize", () => {
                this.myChart1.resize()
            })

            this.$on('hook:destroyed', () => {
                window.removeEventListener("resize", () => {
                    this.myChart1.resize();
                });
            })
        },
        // 获取看诊统计数据
        GetCropTypeY() {
            var option = {
                title: {
                    text: '看诊-年龄比例',
                    subtext: '',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['20岁以下', '20-25岁', '25-30岁', '30-35岁', '35-40岁', '40岁及以上']
                },
                color: ['#BBC6E8', '#A1B8FC', '#6CDAFE', '#00bfff', '#6495ed', '#3377FF'],
                series: [
                    {
                        name: '年龄比例统计',
                        type: 'pie',
                        radius: ['35%', '50%'],
                        label: {
                            normal: {
                                formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                                backgroundColor: '#F6F8FC',
                                borderColor: '#8C8D8E',
                                borderWidth: 1,
                                rich: {
                                    a: {
                                        color: '#6E7079',
                                        lineHeight: 22,
                                        align: 'center'
                                    },
                                    hr: {
                                        borderColor: '#8C8D8E',
                                        width: '100%',
                                        borderWidth: 1,
                                        height: 0
                                    },
                                    b: {
                                        color: '#4C5058',
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                        lineHeight: 33
                                    },
                                    per: {
                                        color: '#fff',
                                        backgroundColor: '#4C5058',
                                        padding: [3, 4],
                                        borderRadius: 4
                                    }
                                }
                            }
                        },
                        data: [
                            { value: this.ChartData.GetCropTypeYData.peoplecount0, name: "20岁以下" },
                            { value: this.ChartData.GetCropTypeYData.peoplecount1, name: "20-25岁" },
                            { value: this.ChartData.GetCropTypeYData.peoplecount2, name: "25-30岁" },
                            { value: this.ChartData.GetCropTypeYData.peoplecount3, name: "30-35岁" },
                            { value: this.ChartData.GetCropTypeYData.peoplecount4, name: "35-40岁" },
                            { value: this.ChartData.GetCropTypeYData.peoplecount5, name: "40岁及以上" }
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            this.myChart2.setOption(option);
            this.myChart2.hideLoading();
            window.addEventListener("resize", () => {
                this.myChart2.resize()
            })
            this.$on('hook:destroyed', () => {
                window.removeEventListener("resize", () => {
                    this.myChart2.resize();
                });
            })
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
    height: calc(100vh - 230px);
}

.ContentClass {
    width: 100%;
    height: 100%;
}

.rangeTimeClass {
    width: 100%;
}
</style>
