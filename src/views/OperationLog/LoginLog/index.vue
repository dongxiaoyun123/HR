<template>
    <div style="margin:8px">
        <el-card>
            <el-form label-width="90px">
                <el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item style="margin-bottom: 0;" label="操作时间">
                                <el-date-picker style="width: 100%;" @input="datetimeChange"
                                    v-model="WhereParameter.CreateTime" type="daterange" range-separator="至"
                                    start-placeholder="开始时间" end-placeholder="结束时间" :picker-options="pickerOptions"
                                    clearable="">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item style="margin-bottom: 0;" label="合同方">
                                <el-input v-model="WhereParameter.EnterPriseName" clearable placeholder="合同方"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-button-group class="buttonGroupClass">
                                <el-button type="primary" icon="el-icon-search" @click="GetLoginLogSearch">查 询
                                </el-button>
                            </el-button-group>
                        </el-col>
                    </el-row>
                </el-row>
            </el-form>
        </el-card>
        <el-card class="CardTableClass">
            <el-table v-loading="loading" highlight-current-row :data="LoginLogList" fit ref="multipleTable">
                <el-table-column prop="EnterPriseName" label="公司名称" min-width="140" show-overflow-tooltip></el-table-column>
                <el-table-column prop="User_Account" label="登录名" min-width="140" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="CreateTime" label="登陆时间" min-width="170" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 6px">{{ dateFormat(scope.row.CreateTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="Description" label="描述" min-width="350" show-overflow-tooltip>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="WhereParameter.PageIndex" :page-sizes="[20, 50, 100]" :page-size="WhereParameter.PageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </el-card>
    </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'
import { getDateByTimes } from "@/utils"; //时间日期格式化成字符串
import moment from "moment"; //导入模块
moment.locale("zh-cn");
import {
    GetLoginLog,
} from "@/api/hrmain";
export default {
    components: {
    },
    data() {
        return {
            WhereParameter: {
                ParentEnterPriseCode: '',
                EnterPriseName: '',
                CreateTime: [],
                BeginTime: '',
                EndTime: '',
                PageIndex: 1,
                PageSize: 20,
            },
            LoginLogList: [],
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
            ExportLoading: false,
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
            this.GetLoginLog(); scrollTo(0, 800)
        },
        // 监听 页码值 改变事件
        handleCurrentChange(newSize) {
            this.WhereParameter.PageIndex = newSize;
            this.GetLoginLog(); scrollTo(0, 800)
        },
        GetLoginLogSearch() {
            this.WhereParameter.PageIndex = 1;
            this.WhereParameter.PageSize = 20;
            this.GetLoginLog();
        },
        //获取员工方案列表数据
        GetLoginLog() {
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
                EnterPriseName: this.WhereParameter.EnterPriseName,
                BeginTime: this.WhereParameter.BeginTime,
                EndTime: this.WhereParameter.EndTime,
                PageIndex: this.WhereParameter.PageIndex,
                PageSize: this.WhereParameter.PageSize,
            }
            GetLoginLog(parameter).then((res) => {
                if (res.success) {
                    this.LoginLogList = res.result.data;
                    this.total = res.result.count;
                } else {
                    this.LoginLogList = [];
                    this.total = 0;
                }
                this.loading = false;
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
        this.GetLoginLogSearch();
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
    margin-left: 2rem;
}
</style>