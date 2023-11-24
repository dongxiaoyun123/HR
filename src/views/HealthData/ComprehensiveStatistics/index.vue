<template>
  <div style="margin: 8px">
    <el-card>
      <el-form label-width="90px">
        <el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 0" label="合同方">
                <el-select
                  v-model="WhereParameter.ConID"
                  class="whereClass"
                  filterable
                  placeholder="合同方"
                  @change="GetChildUser"
                >
                  <el-option
                    v-for="item in EnterpriseList"
                    :key="item.ConID"
                    :label="item.ParentEnterPriseName"
                    :value="item.ConID"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 0" label="付款方">
                <el-select
                  v-model="WhereParameter.CorpID"
                  class="whereClass"
                  filterable
                  placeholder="付款方"
                  :clearable="IfClearableEnterprise"
                  @change="ComprehensiveStatisticsData"
                >
                  <el-option
                    v-for="item in ChildEnterpriseList"
                    :key="item.CorpID"
                    :label="item.EnterPriseName"
                    :value="item.CorpID"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 0" label="操作时间">
                <el-date-picker
                  v-model="WhereParameter.CreateTime"
                  style="width: 100%"
                  :clearable="false"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  :picker-options="pickerOptions"
                  @input="datetimeChange"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-button
                style="margin-left: 2rem"
                type="primary"
                icon="el-icon-search"
                @click="ComprehensiveStatisticsData"
                >查 询
              </el-button>
            </el-col>
          </el-row>
        </el-row>
      </el-form>
    </el-card>

    <el-row :gutter="8" style="margin-top: 8px">
      <el-col :span="24">
        <el-card>
          <div class="grid-content">
            <div ref="chart1" class="ContentClass" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="8" style="margin-top: 8px">
      <el-col :span="24">
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
import echarts from "echarts";
import moment from "moment"; // 导入模块
import { getDateByTimes } from "@/utils"; // 时间日期格式化成字符串
import { mapState } from "vuex";
moment.locale("zh-cn");
import { GetEnterpriseList, GetChildUserConId } from "@/api/hrmain";
import { ComprehensiveStatisticsData } from "@/api/hrstatistics";

export default {
  name: "ComprehensiveStatistics",
  components: {},
  data() {
    return {
      IfClearableEnterprise: !this.$store.getters.ParentCode,
      EnterpriseList: [],
      WhereParameter: {
        ConID: "",
        CorpID: null,
        CreateTime: [],
        BeginTime: "",
        EndTime: "",
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
              var range = getDateByTimes();
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
  watch: {
    opened(val) {
      setTimeout(() => {
        //点击折叠按钮时图标不渲染问题（缩放浏览器自适应的方法写在了渲染图表时和页面点击不一样）
        this.myChart1.resize();
        this.myChart2.resize();
      }, 300);
    },
  },

  computed: {
    ...mapState({
      opened: (state) => state.app.sidebar.opened,
    }),
  },
  created() {},
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
          this.EnterpriseList = res.result.filter((item) => {
            return item.MenuPermissions != 1;
          });
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
            if (!this.IfClearableEnterprise) {
              this.WhereParameter.CorpID = this.ChildEnterpriseList[0].CorpID;
            }
            this.ComprehensiveStatisticsData();
          }
        } else {
          this.ChildEnterpriseList = [];
        }
      });
    },
    // 获取列表数据
    ComprehensiveStatisticsData() {
      this.loading = true;
      if (
        this.WhereParameter.CreateTime &&
        this.WhereParameter.CreateTime.length > 0
      ) {
        this.WhereParameter.BeginTime = this.$moment(
          this.WhereParameter.CreateTime[0]
        ).format("YYYY-MM-DD");
        this.WhereParameter.EndTime = this.$moment(
          this.WhereParameter.CreateTime[1]
        ).format("YYYY-MM-DD");
      } else {
        this.WhereParameter.BeginTime = "";
        this.WhereParameter.EndTime = "";
      }
      var parameter = {
        ConID: this.WhereParameter.ConID,
        CorpID: this.WhereParameter.CorpID,
        BeginTime: this.WhereParameter.BeginTime,
        EndTime: this.WhereParameter.EndTime,
      };
      var chart1 = this.$refs.chart1;
      this.myChart1 = echarts.init(chart1);
      this.myChart1.clear();
      this.myChart1.showLoading({
        text: "loading",
        color: this.$store.state.settings.theme,
        textColor: "#000",
        maskColor: "rgba(255, 255, 255, 0.8)",
        zlevel: 0,
      });
      var chart2 = this.$refs.chart2;
      this.myChart2 = echarts.init(chart2);
      this.myChart2.clear();
      this.myChart2.showLoading({
        text: "loading",
        color: this.$store.state.settings.theme,
        textColor: "#000",
        maskColor: "rgba(255, 255, 255, 0.8)",
        zlevel: 0,
      });
      ComprehensiveStatisticsData(parameter).then((res) => {
        if (res.success) {
          this.ChartData = res.result;
          this.GetCropType();
          this.GetLineList();
        }
        this.loading = false;
      });
    },
    // 获取疾病统计数据
    GetCropType() {
      var datapie = [];
      for (
        var i = 0;
        i < this.ChartData.GetCropTypeData.peoplecount.length;
        i++
      ) {
        var temp = {
          value: this.ChartData.GetCropTypeData.peoplecount[i],
          name: this.ChartData.GetCropTypeData.category[i],
        };
        datapie.push(temp);
      }
      var option = {
        title: {
          top: 20,
          text: "疾病统计",
          subtext: "来自报销理赔系统",
          x: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        // color: ['#96514d', '#8d6449', '#deb068', '#bf794e', '#b98c46',
        //     '#b79b5b', '#ad7d4c', '#ad7d4c', '#a86f4c', '#946243',
        //     '#917347', '#8c7042', '#7b6c3e', '#698aab', '#008899',
        //     '#00a3af', '#2a83a2', '#59b9c6', '#2ca9e1', '#0095d9',
        //     '#0094c8', '#007bbb', '#5383c3', '#4c6cb3', '#3e62ad', '#1e50a2'],
        color: [
          "#5470c6",
          "#91cc75",
          "#fac858",
          "#ee6666",
          "#73c0de",
          "#3ba272",
          "#fc8452",
          "#9a60b4",
          "#ea7ccc",
        ],
        legend: {
          top: 20,
          orient: "vertical",
          left: "left",
          data: this.ChartData.GetCropTypeData.category,
        },
        series: [
          {
            name: "人数统计",
            type: "pie",
            radius: "65%",
            center: ["50%", "55%"],
            data: datapie,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      this.myChart1.setOption(option);
      this.myChart1.hideLoading();
      window.addEventListener("resize", () => {
        this.myChart1.resize();
      });

      this.$on("hook:destroyed", () => {
        window.removeEventListener("resize", () => {
          this.myChart1.resize();
        });
      });
    },
    // 获取看诊统计数据
    GetLineList() {
      var option = {
        title: {
          top: 20,
          text: this.ChartData.GetLineListData.title,
          subtext: "来自报销理赔系统",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "4%",
          right: "4%",
          bottom: "2%",
          top: "12%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: this.ChartData.GetLineListData.monthList,
          axisTick: {
            alignWithLabel: true,
          },
        },
        yAxis: {
          type: "value",
        },
        legend: {
          top: 20,
          data: ["男", "女", "总人数"],
        },
        series: [
          {
            name: "男",
            type: "bar",
            itemStyle: {
              normal: { color: "#5470c6" },
            },
            data: this.ChartData.GetLineListData.yeardata1,
          },
          {
            name: "女",
            type: "bar",
            itemStyle: {
              normal: { color: "#ee6666" },
            },
            data: this.ChartData.GetLineListData.yeardata0,
          },
          {
            name: "总人数",
            type: "line",
            itemStyle: {
              normal: { color: "#91cc75" },
            },
            data: this.ChartData.GetLineListData.yeardata,
          },
        ],
      };
      this.myChart2.setOption(option);
      this.myChart2.hideLoading();
      window.addEventListener("resize", () => {
        this.myChart2.resize();
      });

      this.$on("hook:destroyed", () => {
        window.removeEventListener("resize", () => {
          this.myChart2.resize();
        });
      });
    },
  },
};
</script>
<style scoped>
.whereClass {
  width: 100%;
  margin-bottom: 0;
}

.grid-content {
  border-radius: 4px;
  height: calc(100vh - 225px);
}

.ContentClass {
  width: 100%;
  height: 100%;
}

.rangeTimeClass {
  width: 100%;
}
</style>
