<template>
    <div style="margin:8px">
        <el-card>
            <el-form label-width="90px">
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
                                <el-select @change="GetAdmin_PermissionSearch" class="whereClass"
                                    v-model="WhereParameter.EnterPriseCode" filterable placeholder="付款方">
                                    <el-option v-for="item in ChildEnterpriseList" :key="item.EnterPriseCode"
                                        :label="item.EnterPriseName" :value="item.EnterPriseCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item style="margin-bottom: 0;" label="使用状态">
                                <el-select v-model="WhereParameter.States" filterable placeholder="使用状态" clearable>
                                    <el-option v-for="item in ProgramOptions" :key="item.value" :label="item.label"
                                        :value="item.value">
                                        <template slot-scope="scope">
                                            <el-tag effect="plain" v-if="item.value == 0" type="success">在用方案</el-tag>
                                            <el-tag effect="plain" v-if="item.value == 1" type="info">隐藏方案</el-tag>
                                        </template>
                                    </el-option>
                                </el-select>
                                <el-button style="margin-left:2rem ;" type="primary" @click="GetAdmin_PermissionSearch"
                                    icon="el-icon-search">查 询
                                </el-button>
                            </el-form-item>

                        </el-col>
                    </el-row>
                </el-row>
            </el-form>
        </el-card>
        <el-card class="CardTableClass">
            <el-table v-loading="loading" :data="ProgramInfoList" fit highlight-current-row ref="multipleTable">
                <el-table-column prop="ConProgramID" label="方案编号" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column prop="ProgramNameOld" label="方案名称" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column prop="BeginTime" label="开始时间" min-width="120">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 6px">{{ dateFormat(scope.row.BeginTime) }}</span>
                    </template>

                </el-table-column>
                <el-table-column prop="EndTime" label="结束时间" min-width="120">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 6px">{{ dateFormat(scope.row.EndTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="IsDel" label="使用状态" min-width="100">
                    <template slot-scope="scope">
                        <el-tag effect="plain" v-if="scope.row.IsDel == 0" type="success">在用方案</el-tag>
                        <el-tag effect="plain" v-if="scope.row.IsDel == 1" type="info">隐藏方案</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="StatesName" label="状态" min-width="100">
                    <template slot-scope="scope">
                        <div style="display: flex;  align-items: center;">
                            <span slot="reference" style="margin-right: 8px;">
                                <i v-if="scope.row.StatesName == '正常'" class="dotClass"
                                    style="background-color: #13CE66"></i>
                                <i v-if="scope.row.StatesName == '过期'" class="dotClass"
                                    style="background-color: #909399"></i>
                            </span>
                            {{ scope.row.StatesName }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="PaymentCode" label="缴费方式" :formatter="PaymentCodeFormat" min-width="100">
                </el-table-column>
                <el-table-column prop="Rate" label="费率" sortable min-width="100">
                    <template slot-scope="scope">
                        <span v-format="'¥#,##0.00'">{{ scope.row.Rate }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="MonthlyFeeRate" label="每月费率" min-width="100">
                    <template slot-scope="scope">
                        <span v-format="'¥#,##0.00'">{{ scope.row.MonthlyFeeRate }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="OrderBy" label="排序" min-width="80"></el-table-column>
                <el-table-column prop="PlanType" label="方案类型" :formatter="PlanTypeFormat" min-width="100"></el-table-column>
                <el-table-column prop="CreateTime" label="添加时间" :formatter="dateTimeFormat" min-width="140">
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
    GetProgramList,
} from "@/api/hrmain";
export default {
    components: {
    },
    data() {
        return {
            loading: false,
            ProgramInfoList: [],
            WhereParameter: {
                ParentEnterPriseCode: '',
                EnterPriseCode: '',
                States: null,
                PageIndex: 1,
                PageSize: 20,
            },
            total: 0,
            EnterpriseList: [],
            ChildEnterpriseList: [],
            ProgramOptions: [{
                value: 0,
                label: '在用方案'
            }, {
                value: 1,
                label: '隐藏方案'
            }],
        };
    },
    methods: {
        //列表时间格式化
        dateFormat(row) {
            if (row) {
                return this.$moment(row).format("YYYY-MM-DD");
            }
            else
                return null;
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
        // 列表时间格式化
        dateTimeFormat(row, column, cellValue, index) {
            const daterc = row[column.property]
            if (daterc != null) {
                return this.$moment(daterc).format("YYYY-MM-DD HH:mm:ss");
            }
        },
        // 监听 pagesize改变的事件
        handleSizeChange(newSize) {
            this.WhereParameter.PageSize = newSize;
            this.GetProgramList(); scrollTo(0, 800)
        },
        // 监听 页码值 改变事件
        handleCurrentChange(newSize) {
            this.WhereParameter.PageIndex = newSize;
            this.GetProgramList(); scrollTo(0, 800)
        },

        GetAdmin_PermissionSearch() {
            this.WhereParameter.PageIndex = 1;
            this.WhereParameter.PageSize = 20;
            this.GetProgramList();
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
                        this.GetProgramList()
                    }
                } else {
                    this.ChildEnterpriseList = [];
                }
            });
        },
        //根据分公司获取改公司下所有方案
        GetProgramList() {
            var whereClass = {
                EnterpriseCode: this.WhereParameter.EnterPriseCode,
                States: this.WhereParameter.States,
                PageIndex: this.WhereParameter.PageIndex,
                PageSize: this.WhereParameter.PageSize,
            }
            this.loading = true;
            GetProgramList(whereClass).then((res) => {
                //方案和部门清空选中数据默认为空
                this.WhereParameter.ProgramCode = [];
                this.WhereParameter.DepartmentCode = [];
                if (res.success) {
                    this.ProgramInfoList = res.result.data;
                    this.total = res.result.count;
                } else {
                    this.ProgramInfoList = [];
                    this.total = 0;
                }
                this.loading = false;
            });
        },
    },
    created() { },
    //加载完成后执行调取回款数据接口
    mounted() {
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

.dotClass {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    display: block;
}
</style>