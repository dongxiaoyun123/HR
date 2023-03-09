<template>
    <div style="margin:8px">
        <el-card>
            <el-form label-width="100px">
                <el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item style="margin-bottom: 0;" label="合同方">
                                <el-select class="whereClass" v-model="WhereParameter.ParentCode" filterable
                                    placeholder="合同方" clearable>
                                    <el-option v-for="item in EnterpriseList" :key="item.ParentEnterPriseCode"
                                        :label="item.ParentEnterPriseName" :value="item.ParentEnterPriseCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-button-group class="buttonGroupClass">
                            <el-button type="primary" @click="GetAdmin_PermissionSearch" icon="el-icon-search">查 询
                            </el-button>
                            <el-button type="success" @click="showContractorDialog(null)"
                                icon="el-icon-circle-plus-outline">增
                                加
                            </el-button>
                        </el-button-group>
                    </el-row>
                </el-row>
            </el-form>
        </el-card>
        <el-card class="CardTableClass">
            <el-table v-loading="loading" highlight-current-row :data="ProgramList" fit>
                <el-table-column prop="EnterpriseName" label="付款方" min-width="200" show-overflow-tooltip></el-table-column>
                <el-table-column prop="ProgramName" label="方案名称" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column prop="BeginTimeString" label="开始时间" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 6px">{{ scope.row.BeginTimeString }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="EndTimeString" label="结束时间" min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 6px">{{ scope.row.EndTimeString }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="PaymentCodeName" label="缴别" min-width="100">
                </el-table-column>
                <el-table-column prop="Rate" label="费率" min-width="80" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="MonthlyFeeRate" label="月费率" sortable min-width="100" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="PlanTypeName" label="类型" sortable min-width="100" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="IsDel" label="状态" sortable min-width="100" show-overflow-tooltip>
                    <template slot-scope="scope">

                        <el-tag effect="plain" v-if="scope.row.IsDel == 0" type="success">
                            显示
                        </el-tag>
                        <el-tag effect="plain" v-else type="info">
                            隐藏
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column min-width="215px" label="排序" fixed="right">
                    <template slot-scope="{row}">
                        <template v-if="row.edit">
                            <el-input-number size="mini" v-model="row.OrderBy" :min="1"></el-input-number>
                            <el-button size="mini" class="cancel-btn" icon="el-icon-refresh" type="text"
                                @click="cancelEdit(row)">
                                取消
                            </el-button>
                        </template>
                        <span v-else>{{ row.OrderBy }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="250">
                    <template slot-scope="{row}">
                        <el-button size="mini" v-if="row.edit" type="text" icon="el-icon-check" @click="confirmEdit(row)">
                            确定
                        </el-button>
                        <el-button size="mini" v-else type="text" icon="el-icon-sort" @click="row.edit = !row.edit">
                            排序
                        </el-button>
                        <el-button icon="el-icon-close" v-if="row.IsDel == 0" type="text" size="mini" @click="
                            UpdateProgramInfo(row.ProgramCode, 1)
                        ">
                            置为隐藏</el-button>
                        <el-button icon="el-icon-view" v-else type="text" size="mini" @click="
                            UpdateProgramInfo(row.ProgramCode, 0)
                        ">
                            置为显示</el-button>

                        <el-button icon="el-icon-refresh" type="text" size="mini" @click="
                            RefreshProgramInfo(row.EnterpriseCode, row.ProgramCode)
                        ">更新</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="WhereParameter.PageIndex" :page-sizes="[20, 50, 100]" :page-size="WhereParameter.PageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </el-card>
        <!-- 添加投保数据 -->
        <el-dialog :visible.sync="addProgramVisible" top="5vh" width="45%" @close="detailAddDialogVisibleClosed"
            :lock-scroll="false" :append-to-body="true">
            <!-- 上面两个属性用来重置滚动条 -->
            <div slot="title" class="dialog-title">
                <span>添加方案信息</span>
            </div>
            <el-form :model="AddProgramForm" ref="addProgramRef" :rules="addProgramRules" label-width="120px">
                <el-alert style="margin-bottom:20px ;" type="success" show-icon
                    title="方案名称（不是隐藏的）要和客服系统中的保持一致，方案信息和当前客服系统保持一致，客服系统如果修改那么只需点击同步即可更新方案信息" :closable="false">
                </el-alert>
                <el-form-item label="合同方" prop="ParentCode">
                    <el-select v-model="AddProgramForm.ParentCode" filterable placeholder="合同方"
                        @change="GetChildEnterprise">
                        <el-option v-for="item in EnterpriseList" :key="item.ParentEnterPriseCode"
                            :label="item.ParentEnterPriseName" :value="item.ParentEnterPriseCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="付款方" prop="EnterPriseCode">
                    <el-select v-model="AddProgramForm.EnterPriseCode" filterable placeholder="付款方">
                        <el-option v-for="item in ChildEnterpriseList" :key="item.EnterPriseCode"
                            :label="item.EnterPriseName" :value="item.EnterPriseCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="方案名称" prop="ProgramName">
                    <el-input v-model="AddProgramForm.ProgramName" placeholder="方案名称"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="OrderBy">
                    <el-input-number v-model="AddProgramForm.OrderBy" :min="1"></el-input-number>
                </el-form-item>
                <el-divider></el-divider>
                <el-row class="buttonCenter">
                    <el-col>
                        <el-button type="primary" :loading="LoadingAdd" @click="addProgram">保
                            存</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'
import { getDateByTimes } from "@/utils"; //时间日期格式化成字符串
import {
    GetSettingProgramList,
    AddPrograminfo,
    GetEnterpriseList,
    GetChildEnterprise,
    UpdateProgramInfo,
    RefreshProgramInfo,
    EditProgramOrderBy,
} from "@/api/hrmain";
export default {
    components: {
    },
    data() {
        return {
            ChildEnterpriseList: [],
            EnterpriseList: [],
            addProgramVisible: false,
            AddProgramForm: {
                ParentCode: '',
                EnterPriseCode: '',
                ProgramName: '',
                OrderBy: null,
            },
            WhereParameter: {
                ParentCode: '',
                PageIndex: 1,
                PageSize: 20,
            },
            ProgramList: [],
            total: 0,
            loading: false,
            LoadingAdd: false,
            addProgramRules: {
                ParentCode: [
                    { required: true, message: "请选择合同方", trigger: "change" },
                ],
                EnterPriseCode: [
                    { required: true, message: "请选择付款方", trigger: "change" },
                ],
                ProgramName: [
                    { required: true, message: "请输入方案名称", trigger: "blur" },
                ],
                OrderBy: [
                    { required: true, message: "请输入排序", trigger: "change" },
                ],
            },
        };
    },
    methods: {
        //行内取消编辑，还原数据
        cancelEdit(row) {
            row.OrderBy = row.originalOrderBy
            row.edit = false
            this.$message({
                message: '排序已恢复到原始值',
                type: 'warning'
            })
        },
        //确认行内编辑
        confirmEdit(row) {
            if (!row.OrderBy) {
                this.$message({
                    message: '请输入排序值',
                    type: 'warning'
                });
                return;
            }
            //编辑排序方法
            EditProgramOrderBy(row.ProgramCode, row.OrderBy).then((res) => {
                if (res.success) {
                    row.edit = false;
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    });
                    this.GetContractorList();
                } else {
                    this.$message({
                        message: '操作失败',
                        type: 'error'
                    });
                }
            });
        },
        UpdateProgramInfo(ProgramCode, States) {
            UpdateProgramInfo(ProgramCode, States).then((res) => {
                if (res.success) {
                    this.$message.success("操作成功");
                    this.GetSettingProgramList();
                } else {
                    this.$message.error("操作失败");
                }
            });
        },
        RefreshProgramInfo(EnterpriseCode, ProgramCode) {
            RefreshProgramInfo(EnterpriseCode, ProgramCode).then((res) => {
                if (res.success) {
                    this.$message.success("更新成功");
                    this.GetSettingProgramList();
                } else {
                    this.$message.error("更新失败");
                }
            });
        },
        //根据父级公司获取分公司
        GetChildEnterprise() {
            GetChildEnterprise(this.AddProgramForm.ParentCode).then((res) => {
                if (res.success) {
                    this.ChildEnterpriseList = res.result;
                    this.AddProgramForm.EnterPriseCode = res.result[0].EnterPriseCode;
                } else {
                    this.ChildEnterpriseList = [];
                }
            });
        },

        //添加投保数据
        addProgram() {
            this.LoadingAdd = true;
            // 提交请求前，表单预验证
            this.$refs.addProgramRef.validate(async (valid, object) => {
                // 表单预校验失败
                if (!valid) {
                    this.LoadingAdd = false;
                    return;
                } else {
                    var addparameter = {
                        ParentCode: this.AddProgramForm.ParentCode,
                        EnterPriseCode: this.AddProgramForm.EnterPriseCode,
                        ProgramName: this.AddProgramForm.ProgramName,
                        OrderBy: this.AddProgramForm.OrderBy,
                    };
                    AddPrograminfo(addparameter).then((res) => {
                        this.LoadingAdd = false;
                        if (res.success) {
                            this.$message.success("添加成功");
                            this.addProgramVisible = false;
                            this.GetSettingProgramList();
                        } else {
                            this.$message.error(res.resultMessage);
                        }
                    });
                }
            });
        },
        //添加窗口关闭
        detailAddDialogVisibleClosed() {
            //初始化data-AddProgramForm 的数据
            this.$data.AddProgramForm = this.$options.data().AddProgramForm;
            this.$refs.addProgramRef.resetFields();
        },
        //弹出添加窗口(修改需要传入参数)
        showContractorDialog() {
            this.addProgramVisible = true;
        },

        // 监听 pagesize改变的事件
        handleSizeChange(newSize) {
            this.WhereParameter.PageSize = newSize;
            this.GetSettingProgramList(); scrollTo(0, 800)
        },
        // 监听 页码值 改变事件
        handleCurrentChange(newSize) {
            this.WhereParameter.PageIndex = newSize;
            this.GetSettingProgramList(); scrollTo(0, 800)
        },

        GetAdmin_PermissionSearch() {
            this.WhereParameter.PageIndex = 1;
            this.WhereParameter.PageSize = 20;
            this.GetSettingProgramList();
        },
        //获取员工方案列表数据
        GetSettingProgramList() {
            this.loading = true;
            var parameter = {
                ParentCode: this.WhereParameter.ParentCode,
                PageIndex: this.WhereParameter.PageIndex,
                PageSize: this.WhereParameter.PageSize,
            }
            GetSettingProgramList(
                parameter
            ).then((res) => {
                if (res.success) {
                    this.ProgramList = res.result.data.map(v => {
                        this.$set(v, 'edit', false);//通过this.$set 方法重新为数组赋值，用来判断是不是需要编辑的标识
                        this.$set(v, 'originalOrderBy', v.OrderBy);//用于取消时重新赋值
                        return v
                    });
                    this.total = res.result.count;
                } else {
                    this.ProgramList = [];
                    this.total = 0;
                }
                this.loading = false;
            });
        },
        //获取公司列表
        GetEnterpriseList() {
            GetEnterpriseList().then((res) => {
                if (res.success) {
                    this.EnterpriseList = res.result.filter((item) => { return item.MenuPermissions != 2 });
                } else {
                    this.EnterpriseList = [];
                }
            });
        },
    },
    created() {
    },
    //加载完成后执行调取回款数据接口
    mounted() {
        this.GetEnterpriseList();
        this.GetAdmin_PermissionSearch();
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

.buttonGroupClass {
    margin-left: 2rem;
}

.buttonCenter {
    text-align: center;
    margin-top: 20px;
}
</style>