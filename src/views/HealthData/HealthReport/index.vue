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
                <el-select v-model="WhereParameter.CorpID" class="whereClass" filterable
                           placeholder="付款方" :clearable="IfClearableEnterprise" @change="GetChartData"
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
                         @click="GetChartData"
              >查
                询
              </el-button>
            </el-col>
          </el-row>
        </el-row>
      </el-form>
    </el-card>
    <el-row :gutter="8" style="margin-top: 8px;">
      <el-col :span="6">
        <el-card>
          <div class="grid-content">
            <div ref="chart1" class="ContentClass" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="grid-content">
            <div ref="chart2" class="ContentClass" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="grid-content">
            <div ref="chart3" class="ContentClass" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="grid-content">
            <div ref="chart4" class="ContentClass" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="8" style="margin-top: 8px;">
      <el-col :span="12">
        <el-card>
          <div class="grid-content">
            <div ref="chart5" class="ContentClass" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div class="grid-content">
            <el-row>
              <el-col :span="4" class="SexVisitDeepClass SexVisitDeepClass1">
                <el-statistic :title="VisitMale">
                  <template slot="formatter">
                    {{ VisitMaleProportion }}
                  </template>
                </el-statistic>
              </el-col>
              <el-col :span="16">
                <div ref="chart6" style="height: 215px;" />
              </el-col>
              <el-col :span="4" class="SexVisitDeepClass SexVisitDeepClass2">
                <el-statistic :title="NotVisitMale">
                  <template slot="formatter">
                    {{ NotVisitMaleProportion }}
                  </template>
                </el-statistic>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4" class="SexVisitDeepClass SexVisitDeepClass3">
                <el-statistic :title="VisitFeMale">
                  <template slot="formatter">
                    {{ VisitFeMaleProportion }}
                  </template>
                </el-statistic>
              </el-col>
              <el-col :span="16">
                <div ref="chart7" style="height: 215px;" />
              </el-col>
              <el-col :span="4" class="SexVisitDeepClass SexVisitDeepClass4">
                <el-statistic :title="NotVisitFeMale">
                  <template slot="formatter">
                    {{ NotVisitFeMaleProportion }}
                  </template>
                </el-statistic>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="8" style="margin-top: 8px;">
      <el-col :span="24">
        <el-card>
          <div class="grid-content">
            <div ref="chart8" class="ContentClass" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="8" style="margin-top: 8px;">
      <el-col :span="24">
        <el-card>
          <div class="grid-content">
            <div ref="chart9" class="ContentClass" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="8" style="margin-top: 8px;">
      <el-col :span="12">
        <el-card>
          <div class="grid-content">
            <div ref="chart10" class="ContentClass" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div class="grid-content">
            <div ref="chart11" class="ContentClass" />
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
    GetChartData,
    GetChildUserConId,
} from "@/api/hrmain";
export default {
    name:'HealthReport',
    components: {
    },
    data() {
        return {
            IfClearableEnterprise: !this.$store.getters.ParentCode,
            ChildEnterpriseList: [],
            VisitMale: '',
            VisitMaleProportion: '',
            NotVisitMale: '',
            NotVisitMaleProportion: '',
            VisitFeMale: '',
            VisitFeMaleProportion: '',
            NotVisitFeMale: '',
            NotVisitFeMaleProportion: '',
            EnterpriseList: [],
            WhereParameter: {
                ConID: '',
                CorpID: null,
                CreateTime: [],
                BeginTime: '',
                EndTime: '',
                PageIndex: 1,
                PageSize: 20,
            },
            ChartData: [],
            loading: false,
            LoginStatisticsList: [],
            TableLoading: false,
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
            PercentPieParameter: {
                color: [['#02B4A8', '#CBEDEC'], ['#F9B50C', '#FADB90'], ['#FA5E38', '#F7AFA0']],
                titleTop: '企业健康分数',
                titleBottom: ['员工整体健康状况良好', '员工整体健康状况一般', '员工整体健康状况较差'],
                images: ['/i-mages/aixinyou.png', '/i-mages/aixinliang.png', '/i-mages/aixincha.png'],
                fontsizeColor: ['#02B4A8', '#F9B50C', '#FA5E38']
            },
            PercentPieAverageAgeParameter: {
                color: [['#02B4A8', '#CBEDEC'], ['#F9B50C', '#FADB90'], ['#FA5E38', '#F7AFA0']],
                titleTop: '员工平均年龄',
                titleBottom: ['企业朝气蓬勃', '企业成熟稳重', '企业老当益壮'],
                images: ['/i-mages/shengriyou.png', '/i-mages/shengriliang.png', '/i-mages/shengricha.png'],
                fontsizeColor: ['#02B4A8', '#F9B50C', '#FA5E38']
            },
            PercentPieVisitStatisticsParameter: {
                color: ['#00B8F0', '#FF8DB3'],
                subtext: 'Visiting statistics',
                title: '就诊统计',
            },
            PercentPieSexRatioParameter: {
                color: ['#00B8F0', '#FF8DB3'],
                subtext: 'The ratio of male to famale',
                title: '在保人数男女比例',
            },
            PercentPieGeneralHealthOverviewParameter: {
                color: ['#91cc75', '#fac858'],
                titleTop: '总体健康概览',
            },
            PercentPiemaleParameter: {
                titleTop: '男性就诊比例',
                subtext: "Visiting radio of male employees",
                spirit: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABZUlEQVRYR+1XwVGEQBDs4eOXjUAuA43A86Pw0gw0BI3AIwI1A0M4X9zdxzMCzcA1guXrh7F2Fyi4wroBq84qDz482JlpmumegTD0WppLcHDhwql4xrmaD0lFQ4KQmSmIXlqxzKdI1LpvvqEAZiC62wCQIlGzPQGwMkco6K31tgEf40y974YBWyUzEYDrsuATEqX7Fnf9Kw7yb22/+xRA+ENcDmCNgFMpG3IAmdEgOhQC1ojDieSsHMAiZ0nC+kwcinKLDqGr6bahETalDEDLePgWoPvO+sxp7Q9CY+oPwCbedMEKTfPZCGBk4L8xEIHowzW7XAUTyXyQydAWXpgbEDQK5LUMmT/9RlRatAUXIAQjQqwetnlVv2FUZWuaEvNrCeCkZqfnViRnYAQwMtDFAPgRjBBEV3/VhGmpAr+iC92vKc/fqmAEsO8MwO6HztH9jriTJqwGExDhAP5n9MvdtXQANVXwDZ2QFDBa82N8AAAAAElFTkSuQmCC',
            },
            PercentPiefemaleParameter: {
                titleTop: '女性就诊比例',
                subtext: "Visiting radio of male employees",
                spirit: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB40lEQVRYR+2XsVUbQRCGvyGwnRlXgKjAogKgAlg3YFMBcng44BSgCw0VGBpgTQXIFfhcAXIHcmYRMLzdO0lGT6DZe36IQJtqd+ab//79TycsecmS+9MIQE98G+E4witd+eLKpoMkA2jhWyg/EdZrgCG3bEruhk0gmgDsANczzXYlc/3nAmiBliBvq4b6h5G0nk2B2LLwO6jmsb9I3nT6eDxFNs39Om/4iLI/OacMWaPPXy6aqGAGiM1fcY3QngutlNyymwphB+j5DsLXBYodSObOU1RNALjsI7IN+gvk/YMmqj/q364k+zB9PAYSO0DhNToeCRMeztTugnbCzZDMmWuaTag9v4/gQa9Q2ohsPFSAEtHfIHsoTo7cd8Pw1SWybNTCn9ZTd6GO4NmDyufaI2eSuY6lrh2gdzmopz6bI/+4VwWnlHLktv4bQMx+uKnMxyDKPG8pF4i2a4NuSuYGFoiFjyCmXpX9B8C3R4uGQAp7glfu2LK+IRcCjBtOjfjEXAmNx1XsAFMjPqVsVzJXvSOMyw4wNeLjpRMNaL8FEyMaxhrxLuV9YFZg4oXCB4mPCfEbRwjxTLL0yR5YAawUWCnwchQIf05f6zl3krMWvo60w0g+pYTPv3GWHESGLEzasnSAe/rg4iFdkhUKAAAAAElFTkSuQmCC',
            },
            PercentAmountDistributionParameter: {
                titleTop: '金额分布',
                subtext: 'Distribution of visiting amounts',
            },
            PercentAgeDistributionParameter: {
                titleTop: '就诊年龄分布',
                subtext: 'Distribution of visiting age',
            },
            myChart1: null,
            myChart2: null,
            myChart3: null,
            myChart4: null,
            myChart5: null,
            myChart6: null,
            myChart7: null,
            myChart8: null,
            myChart9: null,
            myChart10: null,
            myChart11: null,
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
                        this.GetChartData();
                    }
                } else {
                    this.ChildEnterpriseList = [];
                }
            });
        },
        // 获取列表数据
        GetChartData() {
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
            // 重置数据
            this.VisitMale = '';
            this.VisitMaleProportion = '';
            this.NotVisitMale = '';
            this.NotVisitMaleProportion = '';
            this.VisitFeMale = '';
            this.VisitFeMaleProportion = '';
            this.NotVisitFeMale = '';
            this.NotVisitFeMaleProportion = '';

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
            var chart3 = this.$refs.chart3
            this.myChart3 = echarts.init(chart3);
            this.myChart3.clear();
            this.myChart3.showLoading({
                text: 'loading',
                color: this.$store.state.settings.theme,
                textColor: '#000',
                maskColor: 'rgba(255, 255, 255, 0.8)',
                zlevel: 0,
            });
            var chart4 = this.$refs.chart4
            this.myChart4 = echarts.init(chart4);
            this.myChart4.clear();
            this.myChart4.showLoading({
                text: 'loading',
                color: this.$store.state.settings.theme,
                textColor: '#000',
                maskColor: 'rgba(255, 255, 255, 0.8)',
                zlevel: 0,
            });
            var chart5 = this.$refs.chart5
            this.myChart5 = echarts.init(chart5);
            this.myChart5.clear();
            this.myChart5.showLoading({
                text: 'loading',
                color: this.$store.state.settings.theme,
                textColor: '#000',
                maskColor: 'rgba(255, 255, 255, 0.8)',
                zlevel: 0,
            });
            var chart6 = this.$refs.chart6
            this.myChart6 = echarts.init(chart6);
            this.myChart6.clear();
            this.myChart6.showLoading({
                text: 'loading',
                color: this.$store.state.settings.theme,
                textColor: '#000',
                maskColor: 'rgba(255, 255, 255, 0.8)',
                zlevel: 0,
            });
            var chart7 = this.$refs.chart7
            this.myChart7 = echarts.init(chart7);
            this.myChart7.clear();
            this.myChart7.showLoading({
                text: 'loading',
                color: this.$store.state.settings.theme,
                textColor: '#000',
                maskColor: 'rgba(255, 255, 255, 0.8)',
                zlevel: 0,
            });
            var chart8 = this.$refs.chart8
            this.myChart8 = echarts.init(chart8);
            this.myChart8.clear();
            this.myChart8.showLoading({
                text: 'loading',
                color: this.$store.state.settings.theme,
                textColor: '#000',
                maskColor: 'rgba(255, 255, 255, 0.8)',
                zlevel: 0,
            });
            var chart9 = this.$refs.chart9
            this.myChart9 = echarts.init(chart9);
            this.myChart9.clear();
            this.myChart9.showLoading({
                text: 'loading',
                color: this.$store.state.settings.theme,
                textColor: '#000',
                maskColor: 'rgba(255, 255, 255, 0.8)',
                zlevel: 0,
            });
            var chart10 = this.$refs.chart10
            this.myChart10 = echarts.init(chart10);
            this.myChart10.clear();
            this.myChart10.showLoading({
                text: 'loading',
                color: this.$store.state.settings.theme,
                textColor: '#000',
                maskColor: 'rgba(255, 255, 255, 0.8)',
                zlevel: 0,
            });
            var chart11 = this.$refs.chart11
            this.myChart11 = echarts.init(chart11);
            this.myChart11.clear();
            this.myChart11.showLoading({
                text: 'loading',
                color: this.$store.state.settings.theme,
                textColor: '#000',
                maskColor: 'rgba(255, 255, 255, 0.8)',
                zlevel: 0,
            });
            GetChartData(parameter).then((res) => {
                if (res.success) {
                    this.ChartData = res.result;
                    this.PercentPie();
                    this.PercentPieAverageAge();
                    this.PercentPieVisitStatistics();
                    this.PercentPieSexRatio();
                    this.PercentPieGeneralHealthOverview();
                    this.PercentPiemale();
                    this.VisitMale = "就诊" + this.ChartData.VisitSexRatio.VisitMale + "人";
                    this.VisitMaleProportion = this.ChartData.VisitSexRatio.VisitMaleProportion + "%";
                    this.NotVisitMale = "未就诊" + this.ChartData.VisitSexRatio.NotVisitMale + "人";
                    this.NotVisitMaleProportion = this.ChartData.VisitSexRatio.NotVisitMaleProportion + "%";

                    this.VisitFeMale = "就诊" + this.ChartData.VisitSexRatio.VisitFeMale + "人";
                    this.VisitFeMaleProportion = this.ChartData.VisitSexRatio.VisitFeMaleProportion + "%";
                    this.NotVisitFeMale = "未就诊" + this.ChartData.VisitSexRatio.NotVisitFeMale + "人";
                    this.NotVisitFeMaleProportion = this.ChartData.VisitSexRatio.NotVisitFeMaleProportion + "%";
                    this.PercentPiefemale();
                    this.PercentDistributionOfPatients();
                    this.PercentNumberOfVisits();
                    this.PercentAmountDistribution();
                    this.PercentAgeDistribution();
                }
                this.loading = false;
            });
        },
        // 企业健康分数
        PercentPie() {
            let titleBottom = '';
            let color = '';
            let image = '';
            let fontsizeColor = '';
            if (this.ChartData.Health >= 80) {
                titleBottom = this.PercentPieParameter.titleBottom[0];
                color = this.PercentPieParameter.color[0];
                image = this.PercentPieParameter.images[0];
                fontsizeColor = this.PercentPieParameter.fontsizeColor[0];
            } else if (this.ChartData.Health < 80 && this.ChartData.Health >= 60) {
                titleBottom = this.PercentPieParameter.titleBottom[1];
                color = this.PercentPieParameter.color[1];
                image = this.PercentPieParameter.images[1];
                fontsizeColor = this.PercentPieParameter.fontsizeColor[1];
            } else {
                titleBottom = this.PercentPieParameter.titleBottom[2];
                color = this.PercentPieParameter.color[2];
                image = this.PercentPieParameter.images[2];
                fontsizeColor = this.PercentPieParameter.fontsizeColor[2];
            }
            var option = {
                backgroundColor: '#fff',
                color: color,
                title: [{
                    text: this.PercentPieParameter.titleTop,
                    subtext: 'Corporate health score',
                    top: '3%',
                    left: 'center',
                    textStyle: {
                        color: '#000000',
                        fontStyle: 'normal',
                        fontWeight: '550',
                        fontFamily: 'sans-serif',
                        fontSize: 16
                    }
                }, {
                    text: titleBottom,
                    right: 'center',
                    bottom: '5%',
                    textStyle: {
                        color: '#71747A',
                        fontStyle: 'normal',
                        fontWeight: '400',
                        fontFamily: 'sans-serif',
                        fontSize: 12
                    }
                }],
                series: [{
                    name: '来源',
                    type: 'pie',
                    radius: ['40%', '55%'],
                    avoidLabelOverlap: false,
                    hoverAnimation: false,
                    label: {
                        show: false,
                        position: 'center',
                        textStyle: {
                            fontSize: 16,
                            fontWeight: 'bold',
                            color: fontsizeColor,
                        },
                        formatter: '{b}\n{c}分',
                    },
                    data: [{
                        value: this.ChartData.Health,
                        label: {
                            normal: {
                                show: true
                            }
                        }
                    },
                    {
                        value: 100 - this.ChartData.Health,
                    }
                    ]
                }],
                graphic: {
                    elements: [
                        {
                            type: 'image',
                            style: {
                                image: require("@/assets" + image),
                                width: 30,
                            },
                            left: 'center',
                            top: '40%'
                        }]
                },
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
        // 员工平均年龄
        PercentPieAverageAge() {
            var titleBottom = '';
            var color = null;
            var image = null;
            var fontsizeColor = null;
            if (this.ChartData.AverageAge <= 30) {
                titleBottom = this.PercentPieAverageAgeParameter.titleBottom[0];
                color = this.PercentPieAverageAgeParameter.color[0];
                image = this.PercentPieAverageAgeParameter.images[0];
                fontsizeColor = this.PercentPieAverageAgeParameter.fontsizeColor[0];
            } else if (this.ChartData.AverageAge <= 40 && this.ChartData.AverageAge > 30) {
                titleBottom = this.PercentPieAverageAgeParameter.titleBottom[1];
                color = this.PercentPieAverageAgeParameter.color[1];
                image = this.PercentPieAverageAgeParameter.images[1];
                fontsizeColor = this.PercentPieAverageAgeParameter.fontsizeColor[1];
            } else {
                titleBottom = this.PercentPieAverageAgeParameter.titleBottom[2];
                color = this.PercentPieAverageAgeParameter.color[2];
                image = this.PercentPieAverageAgeParameter.images[2];
                fontsizeColor = this.PercentPieAverageAgeParameter.fontsizeColor[2];
            }
            var option = {
                backgroundColor: '#fff',
                color: color,
                title: [{
                    text: this.PercentPieAverageAgeParameter.titleTop,
                    subtext: 'Average age of employees',
                    top: '3%',
                    left: 'center',
                    textStyle: {
                        color: '#000000',
                        fontStyle: 'normal',
                        fontWeight: '550',
                        fontFamily: 'sans-serif',
                        fontSize: 16
                    }
                }, {
                    text: titleBottom,
                    right: 'center',
                    bottom: '5%',
                    textStyle: {
                        color: '#71747A',
                        fontStyle: 'normal',
                        fontWeight: '400',
                        fontFamily: 'sans-serif',
                        fontSize: 12
                    }
                }],
                series: [{
                    name: '来源',
                    type: 'pie',
                    radius: ['40%', '55%'],
                    avoidLabelOverlap: false,
                    hoverAnimation: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center',
                            textStyle: {
                                fontSize: 16,
                                fontWeight: 'bold',
                                color: fontsizeColor,
                            },
                            formatter: '{b}\n{c}岁'
                        }
                    },
                    data: [{
                        value: this.ChartData.AverageAge,
                        name: this.PercentPieAverageAgeParameter.name,
                        label: {
                            normal: {
                                show: true
                            }
                        }
                    },
                    {
                        value: 100 - this.ChartData.AverageAge,
                        name: ''
                    }
                    ]
                }],
                graphic: {
                    elements: [
                        {
                            type: 'image',
                            style: {
                                image: require("@/assets" + image),
                                width: 30,
                            },
                            left: 'center',
                            top: '40%'
                        }]
                },
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
        // 就诊统计
        PercentPieVisitStatistics() {
            var option = {
                color: this.PercentPieVisitStatisticsParameter.color,
                title: {
                    text: this.PercentPieVisitStatisticsParameter.title,
                    subtext: this.PercentPieVisitStatisticsParameter.subtext,
                    top: '3%',
                    left: 'center',
                    textStyle: {
                        color: '#000000',
                        fontStyle: 'normal',
                        fontWeight: '550',
                        fontFamily: 'sans-serif',
                        fontSize: 16
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'horizontal',
                    bottom: '5%',
                    data: ['就诊次数', '就诊人数']
                },
                graphic: [{ // 环形图中间添加文字
                    type: 'text', // 通过不同top值可以设置上下显示
                    left: 'center',
                    top: '45.5%',
                    style: {
                        text: this.ChartData.VisitStatistics.NumberVisits + '次',
                        textAlign: 'center',
                        fill: '#00B8F0',
                        width: 30,
                        height: 30,
                        fontSize: 16,
                        fontWeight: 600,
                        fontFamily: "Microsoft YaHei"
                    }
                },
                { // 环形图中间添加文字
                    type: 'text',
                    left: 'center',
                    top: '51.5%',
                    style: {
                        text: this.ChartData.VisitStatistics.NumberPerson + '人',
                        textAlign: 'center',
                        fill: '#FF8DB3',
                        width: 30,
                        height: 30,
                        fontSize: 16,
                        fontWeight: 600,
                        fontFamily: "Microsoft YaHei"
                    }
                }],
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['40%', '55%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: false,
                                fontSize: 14,
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            { value: this.ChartData.VisitStatistics.NumberVisits, name: '就诊次数' },
                            { value: this.ChartData.VisitStatistics.NumberPerson, name: '就诊人数' },
                        ]
                    }
                ]
            };
            this.myChart3.setOption(option);
            this.myChart3.hideLoading();
            window.addEventListener("resize", () => {
                this.myChart3.resize()
            })
            this.$on('hook:destroyed', () => {
                window.removeEventListener("resize", () => {
                    this.myChart3.resize();
                });
            })
        },
        // 在保人数男女比例
        PercentPieSexRatio() {
            var option = {
                color: this.PercentPieSexRatioParameter.color,
                title: {
                    text: this.PercentPieSexRatioParameter.title,
                    subtext: this.PercentPieSexRatioParameter.subtext,
                    top: '3%',
                    left: 'center',
                    textStyle: {
                        color: '#000000',
                        fontStyle: 'normal',
                        fontWeight: '550',
                        fontFamily: 'sans-serif',
                        fontSize: 16
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c}人 ({d}%)'
                },

                graphic: [{ // 环形图中间添加文字
                    type: 'image', // 通过不同top值可以设置上下显示
                    left: '40%',
                    top: '45.5%',
                    style: {
                        image: require("@/assets/i-mages/male.png"),
                        textAlign: 'center',
                        width: 14,
                        height: 14,

                    }
                }, { // 环形图中间添加文字
                    type: 'text', // 通过不同top值可以设置上下显示
                    left: '48%',
                    top: '45.5%',
                    style: {
                        text: this.ChartData.SexRatio.Male + '人',
                        textAlign: 'center',
                        fontSize: 16,
                        fontWeight: 550,

                    }
                },
                { // 环形图中间添加文字
                    type: 'image', // 通过不同top值可以设置上下显示
                    left: '40%',
                    top: '50%',
                    style: {
                        image: require("@/assets/i-mages/female.png"),
                        textAlign: 'center',
                        width: 16,
                        height: 16,

                    }
                }, { // 环形图中间添加文字
                    type: 'text', // 通过不同top值可以设置上下显示
                    left: '48%',
                    top: '51%',
                    style: {
                        text: this.ChartData.SexRatio.Female + '人',
                        textAlign: 'center',
                        fontSize: 16,
                        fontWeight: 550,

                    }
                }],
                legend: {
                    orient: 'horizontal',
                    bottom: 10,
                    itemHeight: 22,
                    itemWidth: 22,
                    data: [
                        {
                            name: '男',
                            textStyle: {
                                fontSize: 12,
                            },
                            icon: 'image://' + require("@/assets/i-mages/male.png"),
                        },
                        {
                            name: '女',
                            textStyle: {
                                fontSize: 12,
                            },
                            icon: 'image://' + require("@/assets/i-mages/female.png"),
                        }
                    ]
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['40%', '55%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: false,
                                fontSize: 14,
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            { value: this.ChartData.SexRatio.Male, name: '男' },
                            { value: this.ChartData.SexRatio.Female, name: '女' },
                        ]
                    }
                ]
            };

            this.myChart4.setOption(option);
            this.myChart4.hideLoading();
            window.addEventListener("resize", () => {
                this.myChart4.resize()
            })
            this.$on('hook:destroyed', () => {
                window.removeEventListener("resize", () => {
                    this.myChart4.resize();
                });
            })
        },
        // 总体健康概览
        PercentPieGeneralHealthOverview() {
            var option = {
                title: [{
                    text: this.PercentPieGeneralHealthOverviewParameter.titleTop,
                    subtext: 'Overview of employee health',
                    top: '3%',
                    left: 'center',
                    textStyle: {
                        color: '#000000',
                        fontStyle: 'normal',
                        fontWeight: '550',
                        fontFamily: 'sans-serif',
                        fontSize: 16
                    }
                }],
                color: this.PercentPieGeneralHealthOverviewParameter.color,
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    orient: 'horizontal',
                    bottom: 10,
                    data: ['健康人数占比', '就诊人数占比']
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '50%',
                        label: {
                            formatter: '{c}人({per|{d}%})  ',
                            rich: {
                            }
                        },
                        center: ['50%', '50%'],
                        bottom: '5%',
                        data: [
                            {
                                value: this.ChartData.GeneralHealthOverview.HealthPenple,
                                name: '健康人数占比'
                            },
                            {
                                value: this.ChartData.GeneralHealthOverview.VisitPenple,
                                name: '就诊人数占比'
                            },
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 5,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            this.myChart5.setOption(option);
            this.myChart5.hideLoading();
            window.addEventListener("resize", () => {
                this.myChart5.resize()
            })
            this.$on('hook:destroyed', () => {
                window.removeEventListener("resize", () => {
                    this.myChart5.resize();
                });
            })
        },
        // 男性就诊比例
        PercentPiemale() {
            var option = {
                title: {
                    text: this.PercentPiemaleParameter.titleTop,
                    subtext: this.PercentPiemaleParameter.subtext,
                    left: 'center',
                    top: 20,
                    textStyle: {
                        color: '#000000',
                        fontStyle: 'normal',
                        fontWeight: '550',
                        fontFamily: 'sans-serif',
                        fontSize: 16
                    }
                },
                xAxis: {
                    splitLine: { show: false },
                    axisLabel: { show: false },
                    axisTick: { show: false },
                    axisLine: { show: false },
                    max: parseInt(this.ChartData.VisitSexRatio.MaxFeMale),
                    offset: 10,
                },
                yAxis: {
                    data: ['男'],
                    inverse: true,
                    splitLine: { show: false },
                    axisLabel: { show: false },
                    axisTick: { show: false },
                    axisLine: { show: false },
                    max: parseInt(this.ChartData.VisitSexRatio.MaxFeMale),
                    offset: 10,

                },
                grid: {
                    // top: 'center',
                    height: 200,
                    top: 110,
                },
                series: [{
                    type: 'pictorialBar',
                    symbol: this.PercentPiemaleParameter.spirit,
                    symbolRepeat: 'fixed',
                    symbolMargin: '-20%',
                    symbolClip: true,
                    symbolSize: 30,
                    symbolBoundingData: parseInt(this.ChartData.VisitSexRatio.MaxFeMale),
                    data: [parseInt(this.ChartData.VisitSexRatio.VisitFeMale)],
                    z: 10
                }, {
                    type: 'pictorialBar',
                    itemStyle: {
                        normal: {
                            opacity: 0.2
                        }
                    },
                    animationDuration: 0,
                    symbolRepeat: 'fixed',
                    symbolMargin: '-20%',
                    symbol: this.PercentPiemaleParameter.spirit,
                    symbolSize: 30,
                    symbolBoundingData: parseInt(this.ChartData.VisitSexRatio.MaxFeMale),
                    data: [parseInt(this.ChartData.VisitSexRatio.MaxFeMale) - parseInt(this.ChartData.VisitSexRatio.VisitFeMale)],

                }]
            };
            this.myChart6.setOption(option);
            this.myChart6.hideLoading();
            window.addEventListener("resize", () => {
                this.myChart6.resize()
            })
            this.$on('hook:destroyed', () => {
                window.removeEventListener("resize", () => {
                    this.myChart6.resize();
                });
            })
        },
        // 女性就诊比例
        PercentPiefemale() {
            var option = {
                title: {
                    text: this.PercentPiefemaleParameter.titleTop,
                    subtext: this.PercentPiefemaleParameter.subtext,
                    left: 'center',
                    top: 20,
                    textStyle: {
                        color: '#000000',
                        fontStyle: 'normal',
                        fontWeight: '550',
                        fontFamily: 'sans-serif',
                        fontSize: 16
                    }
                },
                xAxis: {
                    splitLine: { show: false },
                    axisLabel: { show: false },
                    axisTick: { show: false },
                    axisLine: { show: false },
                    max: this.ChartData.VisitSexRatio.MaxFeMale,
                    offset: 10,
                },
                yAxis: {
                    data: ['男'],
                    inverse: true,
                    splitLine: { show: false },
                    axisLabel: { show: false },
                    axisTick: { show: false },
                    axisLine: { show: false },
                    max: this.ChartData.VisitSexRatio.MaxFeMale,
                    offset: 10,

                },
                grid: {
                    // top: 'center',
                    height: 200,
                    top: 110,
                },
                series: [{
                    type: 'pictorialBar',
                    symbol: this.PercentPiefemaleParameter.spirit,
                    symbolRepeat: 'fixed',
                    symbolMargin: '-20%',
                    symbolClip: true,
                    symbolSize: 30,
                    symbolBoundingData: this.ChartData.VisitSexRatio.MaxFeMale,
                    data: [this.ChartData.VisitSexRatio.VisitFeMale],
                    z: 10
                }, {
                    type: 'pictorialBar',
                    itemStyle: {
                        normal: {
                            opacity: 0.2
                        }
                    },
                    animationDuration: 0,
                    symbolRepeat: 'fixed',
                    symbolMargin: '-20%',
                    symbol: this.PercentPiefemaleParameter.spirit,
                    symbolSize: 30,
                    symbolBoundingData: this.ChartData.VisitSexRatio.MaxFeMale,
                    data: [this.ChartData.VisitSexRatio.MaxFeMale - this.ChartData.VisitSexRatio.VisitFeMale],

                }]
            };
            this.myChart7.setOption(option);
            this.myChart7.hideLoading();
            window.addEventListener("resize", () => {
                this.myChart7.resize()
            })
            this.$on('hook:destroyed', () => {
                window.removeEventListener("resize", () => {
                    this.myChart7.resize();
                });
            })
        },
        // 就诊人数分布
        PercentDistributionOfPatients() {
            var option = {
                title: {
                    top: 20,
                    left: 'center',
                    text: this.ChartData.DistributionOfPatientAll.Title
                },
                tooltip: {},
                visualMap: {
                    min: 0,
                    max: this.ChartData.DistributionOfPatientAll.Max,
                    calculable: true,
                    orient: 'horizontal',
                    left: 'center',
                    type: 'continuous',
                    itemWidth: 22,
                    itemHeight: 170,
                    bottom: '5%',
                },
                calendar: {
                    left: '5%',
                    right: '5%',
                    top: '26%',
                    bottom: '26%',
                    containLabel: true,
                    orient: 'horizontal',
                    cellSize: ['auto', 25],
                    dayLabel: {
                        firstDay: 1,
                        nameMap: 'cn'
                    },
                    monthLabel: {
                        nameMap: 'cn',
                        margin: 10,
                        fontSize: 15,
                        color: '#000'
                    },
                    range: this.ChartData.DistributionOfPatientAll.Range,
                },
                series: {
                    type: 'heatmap',
                    coordinateSystem: 'calendar',
                    data: this.getVirtulData(this.ChartData.DistributionOfPatientAll.data)
                }
            };
            this.myChart8.setOption(option);
            this.myChart8.hideLoading();
            window.addEventListener("resize", () => {
                this.myChart8.resize()
            })
            this.$on('hook:destroyed', () => {
                window.removeEventListener("resize", () => {
                    this.myChart8.resize();
                });
            })
        },
        getVirtulData(data) {
            var arr = [];
            for (var i = 0; i < data.length; i++) {
                arr.push([
                    data[i].MDateBegin,
                    data[i].Count,
                ]);
            }
            return arr;
        },
        // 就诊次数分布
        PercentNumberOfVisits() {
            var illness_IllnessTypeListArr = [];
            var titalData = this.ChartData.NumberOfVisits.Illness_IllnessTypeList;
            for (var i = 0; i < titalData.length; i++) {
                illness_IllnessTypeListArr.push(
                    titalData[i]
                );
            }
            var personCaseInfoListArr = [];
            var contentData = this.ChartData.NumberOfVisits.PersonCaseInfoList;
            for (var s = 0; s < contentData.length; s++) {
                personCaseInfoListArr.push(
                    contentData[s]
                );
            }

            var option = {
                grid: {
                    left: '3%',
                    right: '3%',
                    bottom: '5%',
                    containLabel: true
                },
                title: {
                    text: this.ChartData.NumberOfVisits.Title,
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
                                        const curr = item.data / this.ChartData.NumberOfVisits.Max * 100

                                        return this.ChartData.NumberOfVisits.Max == 0 ? '0%' : parseInt(curr) + '%'
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
            this.myChart9.setOption(option);
            this.myChart9.hideLoading();
            window.addEventListener("resize", () => {
                this.myChart9.resize()
            })
            this.$on('hook:destroyed', () => {
                window.removeEventListener("resize", () => {
                    this.myChart9.resize();
                });
            })
        },
        // 金额分布
        PercentAmountDistribution() {
            var option = {
                title: [{
                    text: this.PercentAmountDistributionParameter.titleTop,
                    subtext: this.PercentAmountDistributionParameter.subtext,
                    top: '3%',
                    left: 'center',
                    textStyle: {
                        color: '#000000',
                        fontStyle: 'normal',
                        fontWeight: '550',
                        fontFamily: 'sans-serif',
                        fontSize: 16
                    }
                }],
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    orient: 'horizontal',
                    bottom: '3%',
                    data: this.ChartData.AmountDistribution.TitleData
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['40%', '55%'],
                        top: -50,
                        label: {
                            formatter: '{c}人({per|{d}%})  ',
                            rich: {
                            }
                        },
                        center: ['50%', '55%'],
                        data: this.ChartData.AmountDistribution.ContentData,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 5,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: function (params) {
                                    var colorList = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'];
                                    var index = params.dataIndex % colorList.length;
                                    return colorList[index]
                                }
                            }
                        },

                    }
                ]
            };

            this.myChart10.setOption(option);
            this.myChart10.hideLoading();
            window.addEventListener("resize", () => {
                this.myChart10.resize()
            })
            this.$on('hook:destroyed', () => {
                window.removeEventListener("resize", () => {
                    this.myChart10.resize();
                });
            })
        },
        // 年龄分布
        PercentAgeDistribution() {
            var option = {
                title: {
                    text: this.PercentAgeDistributionParameter.titleTop,
                    subtext: this.PercentAgeDistributionParameter.subtext,
                    left: 'center',
                    top: 20,
                    textStyle: {
                        color: '#000000',
                        fontStyle: 'normal',
                        fontWeight: '550',
                        fontFamily: 'sans-serif',
                        fontSize: 16
                    }
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    orient: 'horizontal',
                    bottom: '3%',
                    data: this.ChartData.VisitAgeDistribution.TitleData,
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '50%', // 控制图形大小
                        center: ['50%', '55%'],
                        top: 34,
                        label: {
                            formatter: '{c}人({per|{d}%})  ',
                            rich: {
                            }
                        },
                        data: this.ChartData.VisitAgeDistribution.ContentData.sort(function (a, b) { return a.value - b.value; }),
                        roseType: 'radius',
                        animationType: 'scale',
                        animationEasing: 'elasticOut',
                        animationDelay: function (idx) {
                            return Math.random() * 200;
                        },
                        itemStyle: {
                            normal: {
                                color: function (params) {
                                    var colorList = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'];
                                    var index = params.dataIndex % colorList.length;
                                    return colorList[index]
                                }
                            }
                        },
                    }
                ]
            };
            this.myChart11.setOption(option);
            this.myChart11.hideLoading();
            window.addEventListener("resize", () => {
                this.myChart11.resize()
            })
            this.$on('hook:destroyed', () => {
                window.removeEventListener("resize", () => {
                    this.myChart11.resize();
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
    min-height: 36px;
}

.ContentClass {
    width: 100%;
    height: 430px;
}

.rangeTimeClass {
    width: 100%;
}

::v-deep .el-statistic .head {
    color: #00B8F0;
    font-weight: 550;
}

::v-deep .el-statistic .con .number {
    font-weight: 550;
    color: #00B8F0;
    font-size: 14px;
}

::v-deep .SexVisitDeepClass2 .head {
    color: #CCF1FC;
    font-weight: 550;
}

::v-deep .SexVisitDeepClass2 .con .number {
    font-weight: 550;
    color: #CCF1FC;
    font-size: 14px;
}

::v-deep .SexVisitDeepClass3 .head {
    color: #FF87AF;
    font-weight: 550;
}

::v-deep .SexVisitDeepClass3 .con .number {
    font-weight: 550;
    color: #FF87AF;
    font-size: 14px;
}

::v-deep .SexVisitDeepClass4 .head {
    color: #FFE7EF;
    font-weight: 550;
}

::v-deep .SexVisitDeepClass4 .con .number {
    font-weight: 550;
    color: #FFE7EF;
    font-size: 14px;
}

.SexVisitDeepClass {
    height: 215px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
