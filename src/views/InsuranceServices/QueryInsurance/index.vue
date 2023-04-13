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
                                <el-select @change="GetAdmin_PermissionSearch" class="whereClass"
                                    v-model="WhereParameter.EnterPriseCode" filterable placeholder="付款方"
                                    :clearable="IfClearableEnterprise">
                                    <el-option v-for="item in ChildEnterpriseList" :key="item.EnterPriseCode"
                                        :label="item.EnterPriseName" :value="item.EnterPriseCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="6">
                            <el-form-item class="whereClass" label="投保日期">
                                <el-date-picker format="yyyy-MM" v-model="WhereParameter.Times" type="month"
                                    placeholder="选择月" :clearable="false">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item class="whereClass" label="人员信息">
                                <el-input v-model="WhereParameter.Kwd" clearable placeholder="姓名、证件号"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-button style="margin-left:2.7rem ;" type="primary" @click="GetAdmin_PermissionSearch"
                                icon="el-icon-search">查 询
                            </el-button>
                        </el-col>
                    </el-row>
                </el-row>
            </el-form>
        </el-card>
        <el-card class="CardTableClass">
            <el-table v-loading="loading" :data="QueryInsuranceList" fit highlight-current-row ref="multipleTable">
                <el-table-column prop="PsnName" label="姓名" min-width="80" show-overflow-tooltip></el-table-column>
                <el-table-column prop="Gender" label="性别" :formatter="SexFormat" min-width="60"
                    show-overflow-tooltip></el-table-column>
                <el-table-column prop="IDNum" label="证件号" min-width="120">
                </el-table-column>
                <el-table-column prop="Month" label="投保月份" min-width="100">
                    <template slot-scope="scope">
                        <span>
                            {{ scope.row.IYear }}年{{ scope.row.IMonth }}月
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="CorpName" label="付款方" min-width="150" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="ConCorpName" label="合同方" min-width="150" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="PlanName" label="方案" min-width="200" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="RName" label="连带人" sortable min-width="100" show-overflow-tooltip>
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
import moment from "moment";
moment.locale("zh-cn");
import {
    GetEnterpriseList,
    GetChildUser,
} from "@/api/hrmain";
import {
    GetInsStateListOfCon,
    LoadInsurePsns,
} from "@/api/hrstatistics";
export default {
    components: {
    },
    data() {
        return {
            IfClearableEnterprise: this.$store.getters.ParentCode ? false : true,
            loading: false,
            QueryInsuranceList: [],
            WhereParameter: {
                ParentEnterPriseCode: '',
                EnterPriseCode: '',
                ConID: '',
                CorpID: '',
                Times: '',
                Kwd: '',
                PageIndex: 1,
                PageSize: 20,
            },
            total: 0,
            EnterpriseList: [],
            ChildEnterpriseList: [],
        };
    },
    methods: {
        //性别格式化
        SexFormat(row, column, cellValue, index) {
            const daterc = row[column.property]
            if (daterc != null) {
                return daterc == '1' ? '男' : '女'
            }
        },
        //列表时间格式化
        dateFormat(row, column, cellValue, index) {
            const daterc = row[column.property]
            if (daterc != null) {
                return this.$moment(daterc).format("YYYY-MM-DD");
            }
        },
        PaymentCodeFormat(row, column, cellValue, index) {
            const daterc = row[column.property]
            if (daterc != null) {
                switch (daterc) {
                    case 1:
                        return "月缴";
                    case 3:
                        return "季缴";
                    case 6:
                        return "半年缴";
                    case 12:
                        return "年缴";
                }
            }
        },
        PlanTypeFormat(row, column, cellValue, index) {
            const daterc = row[column.property]
            if (daterc != null) {
                switch (daterc) {
                    case 0:
                        return "主险方案";
                    case 1:
                        return "关联险";
                }
            }
        },
        // 监听 pagesize改变的事件
        handleSizeChange(newSize) {
            this.WhereParameter.PageSize = newSize;
            this.GetInsStateListOfCon(); scrollTo(0, 800)
        },
        // 监听 页码值 改变事件
        handleCurrentChange(newSize) {
            this.WhereParameter.PageIndex = newSize;
            this.GetInsStateListOfCon(); scrollTo(0, 800)
        },

        GetAdmin_PermissionSearch() {
            this.WhereParameter.PageIndex = 1;
            this.WhereParameter.PageSize = 20;
            this.GetInsStateListOfCon();
        },
        //如果登陆人是客服，那么获取公司列表
        GetEnterpriseList() {
            // 传入vuex存储的值
            GetEnterpriseList().then((res) => {
                if (res.success) {
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
            this.EnterpriseList.forEach(element => {
                if (this.WhereParameter.ParentEnterPriseCode == element.ParentEnterPriseCode) {
                    this.WhereParameter.ConID = element.ConID;
                }
            });
            GetChildUser(ParentEnterPriseCode).then((res) => {
                if (res.success) {
                    this.ChildEnterpriseList = res.result;
                    if (this.ChildEnterpriseList.length > 0) {
                        //如果是合同方直接查询全部数据
                        if (!this.IfClearableEnterprise)
                            this.WhereParameter.EnterPriseCode = this.ChildEnterpriseList[0].EnterPriseCode;
                        this.GetInsStateListOfCon()
                    }
                } else {
                    this.ChildEnterpriseList = [];
                }
            });
        },
        //根据分公司获取改公司下所有方案
        GetInsStateListOfCon() {
            var whereClass = {
                ConID: this.WhereParameter.ConID,
                year: this.$moment(this.WhereParameter.Times).format("YYYY-MM").split("-")[0],
                month: this.$moment(this.WhereParameter.Times).format("YYYY-MM").split("-")[1],
            }
            if (this.WhereParameter.EnterPriseCode)
                this.ChildEnterpriseList.forEach(element => {
                    if (this.WhereParameter.EnterPriseCode == element.EnterPriseCode) {
                        this.WhereParameter.CorpID = element.CorpID;
                        return;
                    }
                });
            else
                this.WhereParameter.CorpID = '';
            this.loading = true;
            GetInsStateListOfCon(whereClass).then((res) => {
                if (res.success) {
                    if (res.result.NoRight == 1) {
                        this.loading = false;
                        this.QueryInsuranceList = [];
                        this.total = 0;
                        return this.$message.warning("没有该合同执行权限");
                    }
                    if (res.result.MainLock != 1) {
                        if (res.result.SubLock == 0) {
                            this.loading = false;
                            this.QueryInsuranceList = [];
                            this.total = 0;
                            return this.$message.warning("未生成该月投保");
                        }
                    }
                    //正常请求接口
                    var childWhereClass = {
                        ConID: this.WhereParameter.ConID,
                        year: this.$moment(this.WhereParameter.Times).format("YYYY-MM").split("-")[0],
                        month: this.$moment(this.WhereParameter.Times).format("YYYY-MM").split("-")[1],
                        CorpID: this.WhereParameter.CorpID,
                        Kwd: this.WhereParameter.Kwd,
                        PageIndex: this.WhereParameter.PageIndex,
                        PageSize: this.WhereParameter.PageSize,
                    }
                    LoadInsurePsns(childWhereClass).then((res) => {
                        this.loading = false;
                        if (res.success) {
                            this.QueryInsuranceList = res.result.data;
                            this.total = res.result.count;
                        } else {
                            this.QueryInsuranceList = [];
                            this.total = 0;
                            return this.$message.error("数据获取失败");
                        }
                    });
                } else {
                    this.QueryInsuranceList = [];
                    this.total = 0;
                    return this.$message.error("数据获取失败");
                }
            });
        },
    },
    created() { },
    //加载完成后执行调取回款数据接口
    mounted() {
        this.WhereParameter.Times = this.$moment().format("YYYY-MM");
        this.GetEnterpriseList();
    },
    computed: {
    }
};
</script>

<style scoped>
.whereClass {
    width: 100%;
}
</style>