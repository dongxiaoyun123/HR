<template>
    <div style="margin:8px">
        <el-card>
            <el-form label-width="90px">
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
                        <el-col :span="6">
                            <el-form-item style="margin-bottom: 0;" label="付款方">
                                <el-input v-model="WhereParameter.ContractorParameter" clearable
                                    placeholder="付款方"></el-input>
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
            <el-table v-loading="loading" highlight-current-row :data="ContractorList" fit>
                <el-table-column prop="ParentName" label="合同方" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column prop="EnterPriseName" label="付款方" min-width="150" show-overflow-tooltip></el-table-column>
                <el-table-column prop="MenuPermissionsStr" label="显示菜单类型" min-width="120" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="BeginTimeStr" label="开始时间" min-width="120" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 6px">{{ scope.row.BeginTimeStr }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="EndTimeStr" label="结束时间" min-width="120">
                    <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 6px">{{ scope.row.EndTimeStr }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="PaymentName" label="支付方式" min-width="80" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="SimplesStr" label="导入类型" sortable min-width="100" show-overflow-tooltip>
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
                <el-table-column label="操作" fixed="right" width="150">
                    <template slot-scope="{row}">
                        <el-button size="mini" v-if="row.edit" type="text" icon="el-icon-check" @click="confirmEdit(row)">
                            确定
                        </el-button>
                        <el-button size="mini" v-else type="text" icon="el-icon-sort" @click="row.edit = !row.edit">
                            排序
                        </el-button>
                        <el-button icon="el-icon-edit" type="text" size="mini" @click="
                            showContractorDialog(row)
                        ">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页区域 -->
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="WhereParameter.PageIndex" :page-sizes="[20, 50, 100]" :page-size="WhereParameter.PageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </el-card>
        <!-- 添加投保数据 -->
        <el-dialog :visible.sync="addContractorVisible" top="5vh" width="45%" @close="detailAddDialogVisibleClosed"
            :lock-scroll="false" :append-to-body="true">

            <!-- 上面两个属性用来重置滚动条 -->
            <div slot="title" class="dialog-title">
                <span>{{ !IfUpdate ? '添加付款方' : '修改付款方' }}</span>
            </div>
            <el-form :model="AddContractorForm" ref="addStaffRef" :rules="addContractorRules" label-width="120px">
                <el-alert style="margin-bottom:20px ;" type="warning" show-icon v-if="IfUpdate"
                    title="对于已经添加过数据的合同方或者付款方，不能修改，如果想只修改请联系管理员,因为修改公司信息会重新生成订单，如果不重新生成就会导致付款方投保日期和订单的投保日期出现对应不上的问题，此外，如果修改付款方的投保期，那么方案则不会跟着付款方来变化，所以，请谨慎修改合同放或者付款方的信息(这个功能就是用在初始添加信息时添加错误问题)！"
                    :closable="false">
                </el-alert>
                <el-form-item label="合同方" prop="ParentCode">
                    <el-select v-model="AddContractorForm.ParentCode" filterable placeholder="合同方"
                        @change="ParentCodeChange" :disabled="IfUpdate">
                        <el-option v-for="item in ParentContractorList" :key="item.EnterPriseCode"
                            :label="item.EnterPriseName" :value="item.EnterPriseCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="付款方" prop="EnterPriseName">
                    <el-input v-model="AddContractorForm.EnterPriseName" placeholder="付款方" :disabled="IfUpdate"></el-input>
                </el-form-item>
                <el-form-item label="显示菜单类型" prop="MenuPermissions">
                    <el-select v-model="AddContractorForm.MenuPermissions" placeholder="显示菜单类型" disabled>
                        <el-option v-for="item in MenuPermissionsArray" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-tag style="margin-left:1rem ;" type="success">显示菜单类型会根据付款方来显示菜单</el-tag>
                </el-form-item>
                <el-form-item label="投保日期" prop="RangeDate">
                    <el-date-picker @input="datetimeChange" v-model="AddContractorForm.RangeDate" type="daterange"
                        range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="缴费方式" prop="PaymentCode">
                    <el-select v-model="AddContractorForm.PaymentCode" placeholder="缴费方式" :disabled="IfUpdate">
                        <el-option v-for="item in PaymentCodeArray" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="导入类型" prop="Simples">
                    <el-select v-model="AddContractorForm.Simples" placeholder="导入类型">
                        <el-option v-for="item in SimplesArray" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" prop="OrderBy">
                    <el-input-number v-model="AddContractorForm.OrderBy" :min="1"></el-input-number>
                </el-form-item>
                <el-divider></el-divider>
                <el-row class="buttonCenter">
                    <el-col>
                        <el-button type="primary" :loading="LoadingAdd" @click="addContractor">保
                            存</el-button>
                        <el-button v-if="!IfUpdate" @click="detailAddDialogVisibleClosed">重 置</el-button>
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
    GetContractorList,
    GetChannelInformation,
    UpdateEnterpriseInfo,
    AddEnterpriseChildinfo,
    GetEnterpriseList,
    GetEnterpriseDetail,
    EditOrderBy,
} from "@/api/hrmain";
export default {
    components: {
    },
    data() {
        return {
            ParentContractorList:[],
            IfUpdate: false,
            EnterpriseList: [],
            ChannelInformationList: [],
            addContractorVisible: false,
            AddContractorForm: {
                ParentCode: '',
                ChName: '',
                EnterPriseCode: '',
                EnterPriseName: '',
                MenuPermissions: '',
                RangeDate: [],
                RangeDateBegin: '',
                RangeDateEnd: '',
                PaymentCode: '',
                Simples: '',
                ParentCode: '',
                OrderBy: null,
            },
            WhereParameter: {
                ContractorParameter: '',
                EnterpriseType: 2,
                PageIndex: 1,
                PageSize: 20,
            },
            ContractorList: [],
            total: 0,
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
            LoadingAdd: false,
            addContractorRules: {
                ParentCode: [
                    { required: true, message: "请选择付款方", trigger: "change" },
                ],
                EnterPriseName: [
                    { required: true, message: "请输入付款方名称", trigger: "blur" },
                ],
                MenuPermissions: [
                    { required: true, message: "请选择显示菜单类型", trigger: "change" },
                ],
                RangeDate: [
                    { required: true, message: "请选择投保日期", trigger: "change" },
                ],
                PaymentCode: [
                    { required: true, message: "请选择缴费方式", trigger: "change" },
                ],
                Simples: [
                    { required: true, message: "请选择导入类型", trigger: "change" },
                ],
                OrderBy: [
                    { required: true, message: "请输入排序", trigger: "change" },
                ],
            },
            MenuPermissionsArray: [{
                value: "1",
                label: '只显示在线增减'
            }, {
                value: "2",
                label: '只显示健康数据'
            }, {
                value: "3",
                label: '全部显示'
            }],
            PaymentCodeArray: [
                {
                    value: "1",
                    label: "月缴",
                },
                {
                    value: "3",
                    label: "季缴",
                },
                {
                    value: "6",
                    label: "半年缴",
                },
                {
                    value: "12",
                    label: "年缴",
                },
            ],
            SimplesArray: [
                {
                    value: "0",
                    label: "正常导入",
                },
                {
                    value: "1",
                    label: "简单导入",
                }
            ],
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
            EditOrderBy(row.EnterPriseCode, row.OrderBy).then((res) => {
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
        //添加投保数据
        addContractor() {
            this.LoadingAdd = true;
            // 提交请求前，表单预验证
            this.$refs.addStaffRef.validate(async (valid, object) => {
                // 表单预校验失败
                if (!valid) {
                    this.LoadingAdd = false;
                    return;
                } else {
                    if (this.AddContractorForm.RangeDate && this.AddContractorForm.RangeDate.length > 0) {
                        this.AddContractorForm.RangeDateBegin = this.$moment(this.AddContractorForm.RangeDate[0]).format("YYYY-MM-DD");
                        this.AddContractorForm.RangeDateEnd = this.$moment(this.AddContractorForm.RangeDate[1]).format("YYYY-MM-DD");
                    }
                    else {
                        this.AddContractorForm.RangeDateBegin = '';
                        this.AddContractorForm.RangeDateEnd = '';
                    }
                    var addparameter = {
                        EnterPriseCode: this.AddContractorForm.EnterPriseCode,
                        ChName: this.AddContractorForm.ChName,
                        EnterPriseName: this.AddContractorForm.EnterPriseName,
                        MenuPermissions: this.AddContractorForm.MenuPermissions,
                        RangeDateBegin: this.AddContractorForm.RangeDateBegin,
                        RangeDateEnd: this.AddContractorForm.RangeDateEnd,
                        PaymentCode: this.AddContractorForm.PaymentCode,
                        Simples: this.AddContractorForm.Simples,
                        Flag: false,//修改时传入参数 合同放为true，付款方为false
                        ParentCode: this.AddContractorForm.ParentCode,
                        OrderBy: this.AddContractorForm.OrderBy,
                    };
                    if (this.IfUpdate)
                        UpdateEnterpriseInfo(addparameter).then((res) => {
                            this.LoadingAdd = false;
                            if (res.success) {
                                this.$message.success("修改成功");
                                this.addContractorVisible = false;
                                this.GetContractorList();
                            } else {
                                this.$message.error(res.resultMessage);
                            }
                        });
                    else
                        AddEnterpriseChildinfo(addparameter).then((res) => {
                            this.LoadingAdd = false;
                            if (res.success) {
                                this.$message.success("添加成功");
                                this.addContractorVisible = false;
                                this.GetContractorList();
                            } else {
                                this.$message.error(res.resultMessage);
                            }
                        });
                }
            });
        },
        //添加窗口关闭
        detailAddDialogVisibleClosed() {
            //初始化data-AddContractorForm 的数据
            this.$data.AddContractorForm = this.$options.data().AddContractorForm;
            this.$refs.addStaffRef.resetFields();
        },
        //弹出添加窗口(修改需要传入参数)
        showContractorDialog(row) {
            //如果是修改数据
            if (row) {
                this.IfUpdate = true;
                this.AddContractorForm.EnterPriseCode = row.EnterPriseCode;
                this.AddContractorForm.EnterPriseName = row.EnterPriseName;
                this.AddContractorForm.MenuPermissions = row.MenuPermissions + '';
                this.AddContractorForm.RangeDate = (row.BeginTime && row.EndTime) ? [row.BeginTime, row.EndTime] : [];
                this.AddContractorForm.PaymentCode = row.PaymentCode + '';
                this.AddContractorForm.Simples = row.Simples == '1' ? '1' : '0';
                this.AddContractorForm.ChName = row.ChID;
                this.AddContractorForm.ParentCode = row.ParentCode;

                this.AddContractorForm.OrderBy = row.OrderBy;
            }
            else
                this.IfUpdate = false;
            this.addContractorVisible = true;
        },

        // 监听 pagesize改变的事件
        handleSizeChange(newSize) {
            this.WhereParameter.PageSize = newSize;
            this.GetContractorList(); scrollTo(0, 800)
        },
        // 监听 页码值 改变事件
        handleCurrentChange(newSize) {
            this.WhereParameter.PageIndex = newSize;
            this.GetContractorList(); scrollTo(0, 800)
        },

        GetAdmin_PermissionSearch() {
            this.WhereParameter.PageIndex = 1;
            this.WhereParameter.PageSize = 20;
            this.GetContractorList();
        },
        //获取员工方案列表数据
        GetContractorList() {
            this.loading = true;
            var parameter = {
                ParentCode: this.WhereParameter.ParentCode,
                ContractorParameter: this.WhereParameter.ContractorParameter,
                EnterpriseType: this.WhereParameter.EnterpriseType,
                PageIndex: this.WhereParameter.PageIndex,
                PageSize: this.WhereParameter.PageSize,
            }
            GetContractorList(
                parameter
            ).then((res) => {
                if (res.success) {
                    //编辑时增加两个字段处理数据
                    this.ContractorList = res.result.data.map(v => {
                        this.$set(v, 'edit', false);//通过this.$set 方法重新为数组赋值，用来判断是不是需要编辑的标识
                        this.$set(v, 'originalOrderBy', v.OrderBy);//用于取消时重新赋值
                        return v
                    });

                    this.total = res.result.count;
                } else {
                    this.ContractorList = [];
                    this.total = 0;
                }
                this.loading = false;
            });
        },
        //获取通道数据
        GetChannelInformation() {
            GetChannelInformation().then((res) => {
                if (res.success) {
                    this.ChannelInformationList = res.result;
                } else {
                    this.ChannelInformationList = [];
                }
            });
        },
        datetimeChange(time) {
            //强制刷新
            this.$forceUpdate();
        },
        //如果登陆人是客服，那么获取公司列表
        GetEnterpriseList() {
            // 传入vuex存储的值
            GetEnterpriseList().then((res) => {
                if (res.success) {
                    this.EnterpriseList = res.result.filter((item) => { return item.MenuPermissions != 2 });
                } else {
                    this.EnterpriseList = [];
                }
            });
        },
        ParentCodeChange() {
            GetEnterpriseDetail(this.AddContractorForm.ParentCode).then((res) => {
                if (res.success) {
                    this.AddContractorForm.MenuPermissions = res.result.MenuPermissions + '';
                    this.AddContractorForm.RangeDate = (res.result.BeginTime && res.result.EndTime) ? [res.result.BeginTime, res.result.EndTime] : [];
                    this.AddContractorForm.PaymentCode = res.result.PaymentCode + '';
                    this.AddContractorForm.Simples = res.result.Simples == '1' ? '1' : '0';
                }
            });
        },
        //获取员工方案列表数据
        ParentGetContractorList() {
            var parameter = {
                ContractorParameter: "",
                EnterpriseType: 1,
                PageIndex: 1,
                PageSize: 10000,
            }
            GetContractorList(
                parameter
            ).then((res) => {
                if (res.success) {
                    this.ParentContractorList = res.result.data;
                } else {
                    this.ParentContractorList = [];
                }
            });
        },
    },
    created() {
        this.GetChannelInformation();
        this.ParentGetContractorList();
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