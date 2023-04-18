<template>
    <div style="margin:8px">
        <el-card style="padding-bottom:20px ;">
            <el-form label-width="90px" >
                <el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item style="margin-bottom: 0;" label="合同方">
                                <el-select class="whereClass" v-model="WhereParameter.ParentEnterPriseCode" filterable
                                    placeholder="合同方" @change="GetChildUser">
                                    <el-option v-for="item in EnterpriseList" :key="item.ParentEnterPriseCode"
                                        :label="item.ParentEnterPriseName" :value="item.ParentEnterPriseCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item style="margin-bottom: 0;" label="付款方">
                                <el-select @change="GetDataFinancial" class="whereClass"
                                    v-model="WhereParameter.EnterPriseCode" filterable placeholder="付款方"
                                    :clearable='IfClearableEnterprise'>
                                    <el-option v-for="item in ChildEnterpriseList" :key="item.EnterPriseCode"
                                        :label="item.EnterPriseName" :value="item.EnterPriseCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item style="margin-bottom: 0;" label="投保日期">
                                <el-date-picker :clearable="false" style="width: 100%;" @input="datetimeChange"
                                    v-model="WhereParameter.CreateTime" type="daterange" range-separator="至"
                                    start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-button style="margin-left:2rem ;"  type="primary" icon="el-icon-search"
                                @click="GetDataFinancial">查 询
                            </el-button>
                        </el-col>
                    </el-row>
                </el-row>
            </el-form>
        </el-card>
        <el-row :gutter="8" v-loading="loading" style="min-height: calc(100vh - 200px);">
            <el-col :span="8" style="margin-top: 8px;">
                <el-card class="box-card">
                    <el-table style="margin-bottom:18px ;" :data="InsuranceServiceFeeData"  border>
                        <el-table-column type="index" width="50">
                        </el-table-column>
                        <el-table-column prop="Value1" label="公司名称" min-width="200" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="Value2" label="保费合计">
                            <template slot-scope="scope">
                                <span v-format="'¥#,##0.00'">{{ scope.row.Value2 }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import moment from "moment";
moment.locale("zh-cn");
import {
    GetEnterpriseList,
    GetChildUser,
} from "@/api/hrmain";
import {
    GetDataFinancial,
} from "@/api/hrstatistics";
export default {
    components: {
    },
    data() {
        return {
            IfClearableEnterprise: this.$store.getters.ParentCode ? false : true,
            InsuranceServiceFeeData: [],
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
        };
    },
    methods: {
        datetimeChange(time) {
            //强制刷新
            this.$forceUpdate();
        },
        GetEnterpriseList() {
            // 传入vuex存储的值
            GetEnterpriseList().then((res) => {
                if (res.success) {
                    //过滤掉自主增减的公司
                    this.EnterpriseList = res.result.filter((item) => { return item.MenuPermissions != 1 });
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
                        //如果是合同方直接查询全部数据
                        if (!this.IfClearableEnterprise)
                            this.WhereParameter.EnterPriseCode = this.ChildEnterpriseList[0].EnterPriseCode;
                        this.GetDataFinancial();
                    }
                } else {
                    this.ChildEnterpriseList = [];
                }
            });
        },
        //根据分公司获取改公司下所有公司配置数据
        GetDataFinancial() {
            if (this.WhereParameter.CreateTime && this.WhereParameter.CreateTime.length > 0) {
                this.WhereParameter.BeginTime = this.$moment(this.WhereParameter.CreateTime[0]).format("YYYY-MM-DD");
                this.WhereParameter.EndTime = this.$moment(this.WhereParameter.CreateTime[1]).format("YYYY-MM-DD");
            }
            else {
                this.WhereParameter.BeginTime = '';
                this.WhereParameter.EndTime = '';
            }
            var parameter = {
                ParentEnterPriseCode: this.WhereParameter.ParentEnterPriseCode,
                EnterPriseCode: this.WhereParameter.EnterPriseCode,
                BeginTime: this.WhereParameter.BeginTime,
                EndTime: this.WhereParameter.EndTime,
            }
            this.loading = true;
            GetDataFinancial(parameter).then((res) => {
                
                this.loading = false;
                if (res.success) {
                    if (res.result) {
                        
                        this.InsuranceServiceFeeData = res.result;
                    }
                    else {
                        this.InsuranceServiceFeeData = [];
                        this.$message.error("获取数据失败");
                    }
                }
                else {
                    this.InsuranceServiceFeeData = [];
                    this.$message.error(res.resultMessage);
                }
            });
        },
    },
    created() { },
    //加载完成后执行调取回款数据接口
    mounted() {
        var now = new Date();
        var year = now.getFullYear(); //得到年份
        this.WhereParameter.CreateTime = [moment(`${year}-01-01`), moment(now)];
        this.GetEnterpriseList();
    },
    computed: {

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

::v-deep .el-card__body {
    padding: 20px 20px 0 20px;
}
.el-range-editor--small.el-input__inner{
  width: 100%;
}
</style>