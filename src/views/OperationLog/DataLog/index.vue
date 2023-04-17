<template>
    <div style="margin:8px">
        <el-card>
            <el-form label-width="100px">
                <el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item class="whereClass" label="合同方">
                                <el-select class="whereClass" v-model="WhereParameter.ParentEnterPriseCode" filterable
                                    placeholder="合同方" @change="GetChildUser">
                                    <el-option v-for="item in EnterpriseList" :key="item.ParentEnterPriseCode"
                                        :label="item.ParentEnterPriseName" :value="item.ParentEnterPriseCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item class="whereClass" label="付款方">
                                <el-select class="whereClass" v-model="WhereParameter.EnterPriseCode" filterable
                                    placeholder="付款方" @change="GetOperationLogSearch">
                                    <el-option v-for="item in ChildEnterpriseList" :key="item.EnterPriseCode"
                                        :label="item.EnterPriseName" :value="item.EnterPriseCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item class="whereClass" label="操作时间">
                                <el-date-picker style="width: 100%;" @input="datetimeChange"
                                    v-model="WhereParameter.CreateTime" type="daterange" range-separator="至"
                                    start-placeholder="开始时间" end-placeholder="结束时间" :picker-options="pickerOptions"
                                    clearable="">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item class="whereClass" label="日志信息">
                                <el-input v-model="WhereParameter.Where" clearable placeholder="用户名、真实姓名、证件号等"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-button-group class="buttonGroupClass">
                                <el-button type="primary" icon="el-icon-search" @click="GetOperationLogSearch">查
                                    询
                                </el-button>
                                <el-button :disabled="ReadOnly" type="success" icon="el-icon-download"
                                    @click="ExportOperationLog">导 出
                                </el-button>
                            </el-button-group>
                        </el-col>
                    </el-row>
                </el-row>
            </el-form>
        </el-card>
        <el-card class="CardTableClass">
            <el-table v-loading="loading" highlight-current-row :data="OperationLogList" fit ref="multipleTable">
                <el-table-column prop="User_RealName" label="真实姓名" min-width="140" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column prop="StaffCode" label="操作用户编号" min-width="100"  show-overflow-tooltip>
                </el-table-column> -->
                <el-table-column prop="MenuName" label="内容" min-width="140" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="CreateTime" label="操作时间" min-width="170" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 6px">{{ dateFormat(scope.row.CreateTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="Description" label="详细" min-width="350" show-overflow-tooltip>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="WhereParameter.PageIndex" :page-sizes="[20, 50, 100]" :page-size="WhereParameter.PageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </el-card>
        <div v-if="isShowProgress" class="popContainer">
            <el-progress type="circle" :percentage="parseInt(fakes.progress * 100)" :stroke-width="9" :color="customColors"
                style="top: 30%; left: calc(50vw - 58px);color:white"></el-progress>
        </div>
    </div>
</template>

<script>
import FakeProgress from 'fake-progress';
import { scrollTo } from '@/utils/scroll-to'
import { getDateByTimes } from "@/utils"; //时间日期格式化成字符串
import moment from "moment"; //导入模块
moment.locale("zh-cn");
import {
    GetEnterpriseList,
    GetChildUser,
    GetOperationLog,
    ExportStaffList,
    ReportOperationLog,
} from "@/api/hrmain";
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
            ReadOnly: false,//演示人员不能操作数据
            WhereParameter: {
                ParentEnterPriseCode: '',
                EnterPriseCode: '',
                Where: '',
                CreateTime: [],
                BeginTime: '',
                EndTime: '',
                PageIndex: 1,
                PageSize: 20,
            },
            OperationLogList: [],
            total: 0,
            EnterpriseList: [],
            ChildEnterpriseList: [],
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
                            var y = end.getFullYear(); //年

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

            loading: false,
        };
    },
    methods: {
        //列表时间格式化
        dateFormat(row) {
            if (row) {
                return this.$moment(row).format("YYYY-MM-DD HH:mm:ss");
            }
            else
                return null;
        },
        // 监听 pagesize改变的事件
        handleSizeChange(newSize) {
            this.WhereParameter.PageSize = newSize;
            this.GetOperationLog(); scrollTo(0, 800)
        },
        // 监听 页码值 改变事件
        handleCurrentChange(newSize) {
            this.WhereParameter.PageIndex = newSize;
            this.GetOperationLog(); scrollTo(0, 800)
        },
        GetOperationLogSearch() {
            this.WhereParameter.PageIndex = 1;
            this.WhereParameter.PageSize = 20;
            this.GetOperationLog();
        },
        //获取员工方案列表数据
        GetOperationLog() {
            this.loading = true;
            if (this.WhereParameter.CreateTime && this.WhereParameter.CreateTime.length > 0) {
                this.WhereParameter.BeginTime = this.$moment(this.WhereParameter.CreateTime[0]).format("YYYY-MM-DD");
                this.WhereParameter.EndTime = this.$moment(this.WhereParameter.CreateTime[1]).format("YYYY-MM-DD");
            }
            else {
                this.WhereParameter.BeginTime = '';
                this.WhereParameter.EndTime = '';
            }
            var parameter = {
                EnterPriseCode: this.WhereParameter.EnterPriseCode,
                Where: this.WhereParameter.Where,
                BeginTime: this.WhereParameter.BeginTime,
                EndTime: this.WhereParameter.EndTime,
                PageIndex: this.WhereParameter.PageIndex,
                PageSize: this.WhereParameter.PageSize,
            }
            GetOperationLog(parameter).then((res) => {
                if (res.success) {
                    this.OperationLogList = res.result.data;
                    this.total = res.result.count;
                } else {
                    this.OperationLogList = [];
                    this.total = 0;
                }
                this.loading = false;
            });
        },
        ExportOperationLog() {
            if (this.WhereParameter.CreateTime && this.WhereParameter.CreateTime.length > 0) {
                this.WhereParameter.BeginTime = this.$moment(this.WhereParameter.CreateTime[0]).format("YYYY-MM-DD");
                this.WhereParameter.EndTime = this.$moment(this.WhereParameter.CreateTime[1]).format("YYYY-MM-DD");
            }
            else {
                this.WhereParameter.BeginTime = '';
                this.WhereParameter.EndTime = '';
            }
            var parameter = {
                EnterPriseCode: this.WhereParameter.EnterPriseCode,
                Where: this.WhereParameter.Where,
                BeginTime: this.WhereParameter.BeginTime,
                EndTime: this.WhereParameter.EndTime,
                PageIndex: 1,
                PageSize: 100000,
            }
            this.isShowProgress = true;
            this.fakes.start();
            ReportOperationLog(parameter).then((res) => {
                this.fakes.end();
                //初始化进度条
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

        //如果登陆人是客服，那么获取公司列表
        GetEnterpriseList() {
            // 传入vuex存储的值
            GetEnterpriseList().then((res) => {
                if (res.success) {
                    this.EnterpriseList = res.result.filter((item) => { return item.MenuPermissions != 2 });
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
            this.WhereParameter.EnterPriseCode = '';
            GetChildUser(ParentEnterPriseCode).then((res) => {
                if (res.success) {
                    this.ChildEnterpriseList = res.result;
                    if (this.ChildEnterpriseList.length > 0) {
                        this.WhereParameter.EnterPriseCode = this.ChildEnterpriseList[0].EnterPriseCode;
                        //加载完方案后调用加载数据接口
                        this.GetOperationLog();
                    }

                } else {
                    this.ChildEnterpriseList = [];
                }
            });
        },
        datetimeChange(time) {
            //强制刷新
            this.$forceUpdate();
        },
    },
    created() { },
    //加载完成后执行调取回款数据接口
    mounted() {
        if (this.$store.getters.roles.indexOf(7) != -1)
            this.ReadOnly = true
        this.GetEnterpriseList();
    },
    computed: {

    }
};
</script>

<style scoped>
.rangeTimeClass {
    width: 100%;
}

.whereClass {
    width: 100%;
}

.buttonGroupClass {
    margin-left: 2.7rem;
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