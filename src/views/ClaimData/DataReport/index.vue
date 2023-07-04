<template>
  <div style="margin:8px">
    <el-card style="padding-bottom:20px ;">
      <el-form label-width="90px">
        <el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 0;" label="合同方">
                <el-select v-model="WhereParameter.ParentEnterPriseCode" class="whereClass" filterable
                           placeholder="合同方" @change="GetChildUser"
                >
                  <el-option v-for="item in EnterpriseList" :key="item.ParentEnterPriseCode"
                             :label="item.ParentEnterPriseName" :value="item.ParentEnterPriseCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 0;" label="付款方">
                <el-select v-model="WhereParameter.EnterPriseCode" class="whereClass"
                           filterable placeholder="付款方" :clearable="IfClearableEnterprise"
                           @change="GetReportData"
                >
                  <el-option v-for="item in ChildEnterpriseList" :key="item.EnterPriseCode"
                             :label="item.EnterPriseName" :value="item.EnterPriseCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 0;" label="投保日期">
                <el-date-picker v-model="WhereParameter.CreateTime" style="width: 100%;" :clearable="false"
                                class="rangeTimeClass" type="daterange" range-separator="至"
                                start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"
                                @input="datetimeChange"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-button-group>
                <el-button style="margin-left:2rem ;" type="primary" icon="el-icon-search"
                           @click="GetReportData"
                >查 询
                </el-button>
                <el-dropdown style="margin-left: 0;" @command="
                  (command) => {
                    handleButtonCommand(command);
                  }
                "
                >
                  <el-button type="success">
                    更 多<i class="el-icon-arrow-down el-icon--right" />
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :disabled="ReadOnly" command="a" icon="el-icon-download">下载报销明细
                      {{ "\xa0" }}
                    </el-dropdown-item>
                    <el-dropdown-item :disabled="ReadOnly" command="b" icon="el-icon-download">下载退单明细 {{
                      "\xa0"
                    }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-button-group>

            </el-col>
          </el-row>
        </el-row>
      </el-form>
    </el-card>
    <el-row v-loading="loading" style="min-height: calc(100vh - 200px);">
      <el-row :gutter="8">
        <!-- 第一块 -->
        <el-col v-for="(item,index) in ListNewAll" :key="index" :span="8" style="margin-top: 8px;">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>{{ item.CorpName }}</span>
            </div>
            <el-table style="margin-bottom:18px ;" :data="item.objlist" border>
              <el-table-column prop="FieldName" label="月份" />
              <el-table-column prop="AllCount" label="申请报销数量（件）" />
              <el-table-column prop="Pay" label="报销数量（件）" />
              <el-table-column prop="Reject" label="退单数量（件）" />
            </el-table>
          </el-card>
        </el-col>
      </el-row>
      <!-- 第二块 -->
      <el-row :gutter="8">
        <el-col :span="12" style="margin-top: 8px;">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>赔付金额排行榜(按申请日期统计)</span>
            </div>
            <el-table style="margin-bottom:18px ;" :data="list0" border>
              <el-table-column prop="CorpName" label="公司名称" min-width="160" show-overflow-tooltip />
              <el-table-column prop="PsnName" label="姓名" />
              <el-table-column prop="Pay" label="医疗费总额">
                <template slot-scope="scope">
                  <span v-format="'¥#,##0.00'">{{ scope.row.Pay }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="SPay" label="赔付总金额">
                <template slot-scope="scope">
                  <span v-format="'¥#,##0.00'">{{ scope.row.SPay }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="12" style="margin-top: 8px;">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>申请件数排行榜(按申请日期统计)</span>
            </div>
            <el-table style="margin-bottom:18px ;" :data="list1" border>
              <el-table-column prop="CorpName" label="公司名称" min-width="160" show-overflow-tooltip />
              <el-table-column prop="PsnName" label="姓名" min-width="80" />
              <el-table-column show-overflow-tooltip prop="Acount" min-width="180" label="申请件数（包括进行中、获赔、退单）" />
            </el-table>
          </el-card>
        </el-col>
      </el-row>
      <!-- 第三块 -->
      <el-row :gutter="8">
        <el-col :span="12" style="margin-top: 8px;">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>以下数据按照医疗发票日期统计</span>
            </div>
            <el-descriptions class="margin-top" :column="2" border style="margin-bottom: 27px;">
              <el-descriptions-item>
                <template slot="label">

                  获赔件数
                </template>
                {{ Total_LiPeiCount }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">

                  审核中件数
                </template>
                {{ UnFinish_LipeiCount }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  员工理赔占比
                </template>
                <el-tag>
                  {{ Psn_ClmaimsAmount }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  连带人理赔占比
                </template>
                <el-tag>
                  {{ Rln_ClmaimsAmount }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  审核中的申请理赔金额
                </template>
                {{ UnFinish_ClmAmount }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-col>

        <el-col :span="12" style="margin-top: 8px;">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>以下数据按照医疗发票日期统计</span>
            </div>
            <el-table style="margin-bottom:18px ;" :data="ExtendData" border>
              <el-table-column prop="ExtendType" label="理赔类型" />
              <el-table-column prop="LipeiCount" label="获赔件数" />
              <el-table-column prop="CountZhanBi" label="件数占比" />
              <el-table-column prop="PeiKuan" label="理赔金额" />
              <el-table-column prop="JunJian" label="件均理赔" />
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </el-row>
    <div v-if="isShowProgress" class="popContainer">
      <el-progress type="circle" :percentage="parseInt(fakes.progress * 100)" :stroke-width="9" :color="customColors"
                   style="top: 30%; left: calc(50vw - 58px);color:white"
      />
    </div>
  </div>
</template>
<script>
import FakeProgress from 'fake-progress';
import { getDateByTimes } from "@/utils"; // 时间日期格式化成字符串
import moment from "moment";
moment.locale("zh-cn");
import {
    GetEnterpriseList,
    GetChildUser,
} from "@/api/hrmain";
import {
    GetDetails,
    GetDetailsRev,
    GetDataBriefs,
} from "@/api/hrstatistics";
export default {
    components: {
    },
    data() {
        return {
            isShowProgress: false,
            fakes: new FakeProgress({
                timeConstant: 10000,
                autoStart: false
            }),
            customColors: [
                { color: '#ff4949', percentage: 20 },
                { color: '#ffba00', percentage: 40 },
                { color: '#5cb87a', percentage: 60 },
                { color: '#1989fa', percentage: 80 },
                { color: '#6f7ad3', percentage: 100 }
            ],
            ReadOnly: false, // 演示人员不能操作数据
            Total_LiPeiCount: null,
            UnFinish_LipeiCount: null,
            ExtendData: [],
            UnFinish_ClmAmount: null,
            Rln_ClmaimsAmount: null,
            Psn_ClmaimsAmount: null,
            OnLineLipeiCount: null,
            Total_OnLinePeiKuan: null,
            OnLineJunJian: null,
            OnLineCountZhanBi: null,
            OffLineLipeiCount: null,
            OffLineCountZhanBi: null,
            Total_OffLinePeiKuan: null,
            OffLineJunJian: null,
            IfClearableEnterprise: !this.$store.getters.ParentCode,
            BriefsList: [],
            ListNewAll: [],
            AccountOpenTypeArray: [],
            LoadingAdd: false,
            WhereParameter: {
                ParentEnterPriseCode: '',
                EnterPriseCode: '',
                CreateTime: [],
                BeginTime: '',
                EndTime: '',
            },
            EnterpriseList: [],
            ChildEnterpriseList: [],
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
            list0: [],
            list1: [],
        };
    },
    computed: {

    },
    created() { },
    // 加载完成后执行调取回款数据接口
    mounted() {
        if (this.$store.getters.roles.indexOf(7) != -1) { this.ReadOnly = true }
        var now = new Date();
        var year = now.getFullYear(); // 得到年份
        this.WhereParameter.CreateTime = [moment(`${year}-01-01`), moment(now)];
        this.GetEnterpriseList();
    },
    methods: {
        // 执行上方按钮更多操作
        handleButtonCommand(flag) {
            switch (flag) {
                case "a":
                    this.ExportReimbursement();
                    break;
                case "b":
                    this.ExportChargeback(false);
                    break;
            }
        },
        // 导出报销
        ExportReimbursement() {
            if (this.WhereParameter.CreateTime && this.WhereParameter.CreateTime.length > 0) {
                this.WhereParameter.BeginTime = this.$moment(this.WhereParameter.CreateTime[0]).format("YYYY-MM-DD");
                this.WhereParameter.EndTime = this.$moment(this.WhereParameter.CreateTime[1]).format("YYYY-MM-DD");
            } else {
                this.WhereParameter.BeginTime = '';
                this.WhereParameter.EndTime = '';
            }
            var parameter = {
                EnterPriseCode: this.WhereParameter.EnterPriseCode,
                ParentEnterPriseCode: this.WhereParameter.ParentEnterPriseCode,
                BeginTime: this.WhereParameter.BeginTime,
                EndTime: this.WhereParameter.EndTime,
            }
            this.isShowProgress = true;
            this.fakes.start();
            GetDetails(parameter).then((res) => {
                this.fakes.end();
                // 初始化进度条
                setTimeout(() => {
                    this.fakes = new FakeProgress({
                        timeConstant: 10000,
                        autoStart: false
                    });
                    this.isShowProgress = false;
                }, 800)
                if (res.success) {
                    window.location.href = res.result;
                } else {
                    this.$message.error("导出失败，请重新刷新页面");
                }
            });
        },
        // 导出退单
        ExportChargeback() {
            if (this.WhereParameter.CreateTime && this.WhereParameter.CreateTime.length > 0) {
                this.WhereParameter.BeginTime = this.$moment(this.WhereParameter.CreateTime[0]).format("YYYY-MM-DD");
                this.WhereParameter.EndTime = this.$moment(this.WhereParameter.CreateTime[1]).format("YYYY-MM-DD");
            } else {
                this.WhereParameter.BeginTime = '';
                this.WhereParameter.EndTime = '';
            }
            var parameter = {
                EnterPriseCode: this.WhereParameter.EnterPriseCode,
                ParentEnterPriseCode: this.WhereParameter.ParentEnterPriseCode,
                BeginTime: this.WhereParameter.BeginTime,
                EndTime: this.WhereParameter.EndTime,
            }
            this.isShowProgress = true;
            this.fakes.start();
            GetDetailsRev(parameter).then((res) => {
                this.fakes.end();
                // 初始化进度条
                setTimeout(() => {
                    this.fakes = new FakeProgress({
                        timeConstant: 10000,
                        autoStart: false
                    });
                    this.isShowProgress = false;
                }, 800)
                if (res.success) {
                    window.location.href = res.result;
                } else {
                    this.$message.error("导出失败，请重新刷新页面");
                }
            });
        },
        datetimeChange(time) {
            // 强制刷新
            this.$forceUpdate();
        },
        GetEnterpriseList() {
            // 传入vuex存储的值
            GetEnterpriseList().then((res) => {
                if (res.success) {
                    // 过滤掉自主增减的公司
                    this.EnterpriseList = res.result.filter((item) => { return item.MenuPermissions != 1 });
                    // 如果有数据那么赋个默认的值
                    if (this.EnterpriseList.length > 0) {
                        this.WhereParameter.ParentEnterPriseCode = this.EnterpriseList[0].ParentEnterPriseCode;
                        this.GetChildUser(this.EnterpriseList[0].ParentEnterPriseCode);
                    }
                } else {
                    this.EnterpriseList = [];
                }
            });
        },
        // 根据父级公司获取分公司
        GetChildUser(ParentEnterPriseCode) {
            this.WhereParameter.EnterPriseCode = '';
            GetChildUser(ParentEnterPriseCode).then((res) => {
                if (res.success) {
                    this.ChildEnterpriseList = res.result;
                    if (this.ChildEnterpriseList.length > 0) {
                        // 如果是合同方直接查询全部数据
                        if (!this.IfClearableEnterprise) { this.WhereParameter.EnterPriseCode = this.ChildEnterpriseList[0].EnterPriseCode; }
                        this.GetReportData();
                    }
                } else {
                    this.ChildEnterpriseList = [];
                }
            });
        },
        // 根据分公司获取改公司下所有公司配置数据
        GetReportData() {
            this.loading = true;
            if (this.WhereParameter.CreateTime && this.WhereParameter.CreateTime.length > 0) {
                this.WhereParameter.BeginTime = this.$moment(this.WhereParameter.CreateTime[0]).format("YYYY-MM-DD");
                this.WhereParameter.EndTime = this.$moment(this.WhereParameter.CreateTime[1]).format("YYYY-MM-DD");
            } else {
                this.WhereParameter.BeginTime = '';
                this.WhereParameter.EndTime = '';
            }
            var parameter = {
                ParentEnterPriseCode: this.WhereParameter.ParentEnterPriseCode,
                EnterPriseCode: this.WhereParameter.EnterPriseCode,
                BeginTime: this.WhereParameter.BeginTime,
                EndTime: this.WhereParameter.EndTime,
            }
            GetDataBriefs(parameter).then((res) => {
                this.loading = false;
                if (res.success) {
                    this.BriefsList = res.result;
                    this.ListNewAll = this.BriefsList.ListNewAll
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
                    } else {
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
                } else {
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
    }
};
</script>

<style scoped>
.whereClass {
    width: 100%;
    margin-bottom: 0;
}

.rangeTimeClass {
    width: 100%;
}

.whereDetailClass {
    margin-top: 5px;
    margin-bottom: 5px;
}

::v-deep .el-card__body {
    padding: 20px 20px 0 20px;
}

/*遮罩层*/
.popContainer {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999999;
    background: rgba(0, 0, 0, 0.6);
}

::v-deep .el-progress__text {
    color: white !important;
}
</style>
