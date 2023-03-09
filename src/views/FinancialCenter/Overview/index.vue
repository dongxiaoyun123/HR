<template>
    <div style="margin:8px">
        <el-card>
            <el-form label-width="100px">
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
                                <el-select @change="ChangeEnterprise" class="whereClass"
                                    v-model="WhereParameter.EnterPriseCode" filterable placeholder="付款方">
                                    <el-option v-for="item in ChildEnterpriseList" :key="item.EnterPriseCode"
                                        :label="item.EnterPriseName" :value="item.EnterPriseCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" style="text-align: right;">
                            <el-tooltip placement="left">
                                <div slot="content" style="line-height: 20px;font-size: 13px;width: 300px;">
                                    <span style="font-weight: bold;font-size: 14px;text-align: center;">导出数据问题</span>
                                    <el-divider content-position="left">解决方案如下</el-divider>
                                    <div style="margin-bottom:5px;color: #FFBA00;">
                                        1.账单列表和账单明细（如果输入了查询时间段）导出的数据中人员方案汇总Sheet页只针对当前账单和查询时间段
                                        的操作数据。</div>
                                    <div style="margin-bottom:5px;color: #13CE66;">
                                        2.如果想导出全部数据那么可以去首页导出投保数据或者在流水明细中不输入查询条件人员方案汇总Sheet页导出的也是全部的投保数据</div>
                                </div>
                                <el-badge value="hot" class="item">
                                    <el-button>提示</el-button>
                                </el-badge>
                            </el-tooltip>
                        </el-col>
                    </el-row>
                </el-row>
            </el-form>
        </el-card>
        <el-tabs class="CardTableClass" v-model="ActiveName" type="border-card" @tab-click="handleClick">
            <el-tab-pane label="帐单列表" name="first">
                <transition name="el-fade-in-linear">
                    <div v-show="buttonShow">
                        <el-card class="CardTableClass">
                            <el-table v-loading="loading" :data="OverviewData" fit highlight-current-row>
                                <el-table-column prop="OrderCode" label="账单号" min-width="150"
                                    show-overflow-tooltip></el-table-column>
                                <el-table-column prop="ProgramNameOld" label="操作周期" min-width="170" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <i class="el-icon-time"></i>
                                        <span>
                                            {{ scope.row.OrderBeginTime + " 至 " + scope.row.OrderEndTime }}
                                        </span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="AllSum" label="金额" :formatter="dateFormat" min-width="100">
                                    <template slot-scope="scope">
                                        <span v-if="BlankSum">
                                            暂无
                                        </span>
                                        <span v-else v-format="'¥#,##0.00'">
                                            {{ scope.row.AllSum }}
                                        </span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="EndTime" label="状态" :formatter="dateFormat" min-width="100">
                                    <template slot-scope="scope">
                                        <span v-if="BlankSum">
                                            暂无
                                        </span>
                                        <span v-else v-format="'¥#,##0.00'">
                                            {{ scope.row.OrderStatesName }}
                                        </span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="PaymentTime" label="本期缴费时间" min-width="120">
                                    <template slot-scope="scope">
                                        <i class="el-icon-time"></i>
                                        <span style="margin-left: 6px">{{ scope.row.PaymentTime }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" fixed="right" min-width="150">
                                    <template slot-scope="scope">
                                        <el-button :disabled="ReadOnly" icon="el-icon-view" type="text" size="mini"
                                            @click="OpenOrderDetailVisible(scope.row)">详情</el-button>
                                        <el-button :disabled="ReadOnly" v-loading.fullscreen.lock="ExportLoading"
                                            element-loading-text="拼命导出中" element-loading-spinner="el-icon-loading"
                                            element-loading-background="rgba(0, 0, 0, 0.8)"
                                            @click="ExportAllByOrder(scope.row)" icon="el-icon-download" type="text"
                                            size="mini">导出</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-card>
                    </div>
                </transition>
            </el-tab-pane>
            <el-tab-pane label="流水明细" name="second">
                <transition name="el-fade-in-linear">
                    <div v-show="!buttonShow">
                        <el-form label-width="100px">
                            <el-row>
                                <el-col :span="12" v-if="ActiveName == 'second'">
                                    <el-form-item label="保障方案" class="whereClass">
                                        <el-select class="rangeTimeClass" v-model="WhereParameter.ProgramCode" filterable
                                            placeholder="保障方案" clearable="" multiple collapse-tags>
                                            <el-option v-for="item in ProgramInfoAllList" :key="item.ProgramCode"
                                                :label="item.Children" :value="item.ProgramCode">
                                                <span style="float: left">{{ item.Children }}</span>
                                                <span v-if="item.StatesName == '过期'"
                                                    style="float: right; color: #909399; font-size: 13px">{{
                                                        item.StatesName
                                                    }}</span>
                                                <span v-else style="float: right; color: #13CE66; font-size: 13px">{{
                                                    item.StatesName
                                                }}</span>
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" v-if="ActiveName == 'second'">
                                    <el-form-item label="添加时间" class="whereClass">
                                        <el-date-picker class="rangeTimeClass" @input="datetimeChange"
                                            v-model="WhereParameter.CreateTime" type="daterange" range-separator="至"
                                            start-placeholder="开始时间" end-placeholder="结束时间" :picker-options="pickerOptions"
                                            clearable="">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6" v-if="ActiveName == 'second'">
                                    <el-button-group class="buttonGroupClass">
                                        <el-button type="primary" @click="GetAdmin_PermissionSearch"
                                            icon="el-icon-search">查询明细
                                        </el-button>
                                        <el-button :disabled="ReadOnly" v-loading.fullscreen.lock="ExportLoading"
                                            element-loading-text="拼命导出中" element-loading-spinner="el-icon-loading"
                                            element-loading-background="rgba(0, 0, 0, 0.8)" type="success"
                                            @click="ExportOrderDetail(null)" icon="el-icon-download">导出明细
                                        </el-button>
                                    </el-button-group>
                                </el-col>
                            </el-row>
                        </el-form>
                        <el-card class="CardTableClass">
                            <el-table v-loading="DetailLoading" :data="OverViewDetailList" fit highlight-current-row
                                ref="multipleTable">
                                <el-table-column prop="CreateTime" label="操作时间" :formatter="dateTimeFormat" min-width="140"
                                    show-overflow-tooltip></el-table-column>
                                <el-table-column prop="ProgramName" label="方案名称" min-width="120"
                                    show-overflow-tooltip></el-table-column>
                                <el-table-column prop="StaffName" label="姓名" min-width="80">
                                </el-table-column>
                                <el-table-column prop="IdentificationNumber" label="证件号码" min-width="150">
                                </el-table-column>
                                <el-table-column prop="IsDel" label="操作说明" min-width="100">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.IsDel == 0 && scope.row.EmployeeRelationshipCode == 1">
                                            添加员工
                                        </span>
                                        <span v-if="scope.row.IsDel == 0 && scope.row.EmployeeRelationshipCode != 1">
                                            添加连带
                                        </span>
                                        <span v-if="scope.row.IsDel != 0 && scope.row.EmployeeRelationshipCode == 1">
                                            删减员工
                                        </span>
                                        <span v-if="scope.row.IsDel != 0 && scope.row.EmployeeRelationshipCode != 1">
                                            删减连带
                                        </span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="StatesName" label="发生金额" min-width="100">
                                    <template slot-scope="scope">
                                        <span v-if="BlankSum">
                                            暂无
                                        </span>
                                        <span v-else v-format="'¥#,##0.00'">
                                            {{ scope.row.AmountIncurred }}
                                        </span>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <!-- 分页区域 -->
                            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                :current-page="WhereParameter.PageIndex" :page-sizes="[20, 50, 100]"
                                :page-size="WhereParameter.PageSize" layout="total, sizes, prev, pager, next, jumper"
                                :total="total"></el-pagination>
                        </el-card>
                    </div>
                </transition>
            </el-tab-pane>
        </el-tabs>
        <el-dialog :visible.sync="OrderDetailVisible" top="5vh" width="60%" @close="OrderDetailVisibleClosed"
            :lock-scroll="false" :append-to-body="true">
            <div slot="title" class="dialog-title">
                <span>账单详情</span>
            </div>
            <el-row type="flex" class="row-bg" justify="space-around">
                <el-col :span="6">
                    <div class="grid-content">
                        <el-statistic :title="OrderDetailMoney.title1">
                            <template slot="prefix">
                                <div v-if="!BlankSum">
                                    <svg-icon icon-class="OverViewAll" style="color: #FF4949;font-size: 18px;" />
                                    <span class="MoneySpanClass" v-format="'#,##0.00'">{{ OrderDetailMoney.AllMoney
                                    }}</span>
                                </div>
                                <div v-else class="MoneySpanClass">暂无</div>
                            </template>
                        </el-statistic>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content">
                        <el-statistic :title="OrderDetailMoney.title2">
                            <template slot="prefix">
                                <div v-if="!BlankSum">
                                    <svg-icon icon-class="OverViewAdd" style="color: #13CE66;font-size: 18px;" />
                                    <span class="MoneySpanClass" v-format="'#,##0.00'">{{ OrderDetailMoney.AddMoney
                                    }}</span>
                                </div>
                                <div v-else class="MoneySpanClass">暂无</div>

                            </template>
                        </el-statistic>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="grid-content">
                        <el-statistic :title="OrderDetailMoney.title3">
                            <template slot="prefix">
                                <div v-if="!BlankSum">
                                    <svg-icon icon-class="OverViewDelete" style="font-size: 18px;" />
                                    <span class="MoneySpanClass" v-format="'#,##0.00'">{{ OrderDetailMoney.DeleteMoney
                                    }}</span>
                                </div>
                                <div v-else class="MoneySpanClass">暂无</div>
                            </template>
                        </el-statistic>
                    </div>
                </el-col>
            </el-row>
            <el-tabs class="CardTableClass" v-model="ActiveDetailName" @tab-click="handleDetailClick">
                <el-form label-width="80px">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="姓名" class="whereDetailClass">
                                <el-input v-model="WhereParameter.StaffName" clearable placeholder="姓名"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="身份证号" class="whereDetailClass">
                                <el-input v-model="WhereParameter.IdentificationNumber" clearable
                                    placeholder="人员姓名"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-button style="margin-left:2rem ;margin-top: 5px;" type="primary" @click="GetDetails"
                                icon="el-icon-search">查询
                            </el-button>
                        </el-col>
                    </el-row>
                </el-form>
                <el-tab-pane label="加人计费" name="first">
                    <transition name="el-fade-in-linear">
                        <div v-show="buttonDetailShow">
                            <el-card class="CardTableClass">
                                <el-table v-loading="AddDetailLoading" :data="AddOverViewDetailList" fit
                                    highlight-current-row>
                                    <el-table-column prop="CreateTime" :formatter="dateTimeFormat" label="操作时间"
                                        min-width="140" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="ProgramName" label="方案名称" min-width="150" show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column prop="StaffName" label="姓名" min-width="100">
                                    </el-table-column>
                                    <el-table-column prop="IdentificationNumber" label="证件号码" min-width="150">
                                    </el-table-column>
                                    <el-table-column prop="EmployeeRelationshipCode" label="操作说明" min-width="100">
                                        <template slot-scope="scope">
                                            <span v-if="scope.row.EmployeeRelationshipCode == 1">
                                                添加员工
                                            </span>
                                            <span v-if="scope.row.EmployeeRelationshipCode != 1">
                                                添加连带
                                            </span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="AmountIncurred" label="发生金额" min-width="100">
                                        <template slot-scope="scope">
                                            <span v-if="BlankSum">
                                                暂无
                                            </span>
                                            <span v-else v-format="'¥#,##0.00'">
                                                {{ scope.row.AmountIncurred }}
                                            </span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <!-- 分页区域 -->
                                <el-pagination @size-change="AddhandleSizeChange" @current-change="AddhandleCurrentChange"
                                    :current-page="WhereParameter.AddPageIndex" :page-sizes="[20, 50, 100]"
                                    :page-size="WhereParameter.AddPageSize" layout="total, sizes, prev, pager, next, jumper"
                                    :total="Addtotal"></el-pagination>
                            </el-card>
                        </div>
                    </transition>
                </el-tab-pane>
                <el-tab-pane label="减人计费" name="second">
                    <transition name="el-fade-in-linear">
                        <div v-show="!buttonDetailShow">
                            <el-card class="CardTableClass">
                                <el-table v-loading="DeleteDetailLoading" :data="DeleteOverViewDetailList" fit
                                    highlight-current-row>
                                    <el-table-column prop="CreateTime" :formatter="dateTimeFormat" label="操作时间"
                                        min-width="140" show-overflow-tooltip></el-table-column>
                                    <el-table-column prop="ProgramName" label="方案名称" min-width="150" show-overflow-tooltip>
                                    </el-table-column>
                                    <el-table-column prop="StaffName" label="姓名" min-width="100">
                                    </el-table-column>
                                    <el-table-column prop="IdentificationNumber" label="证件号码" min-width="150">
                                    </el-table-column>
                                    <el-table-column prop="EmployeeRelationshipCode" label="操作说明" min-width="100">
                                        <template slot-scope="scope">
                                            <span v-if="scope.row.EmployeeRelationshipCode == 1">
                                                删减员工
                                            </span>
                                            <span v-if="scope.row.EmployeeRelationshipCode != 1">
                                                删减连带
                                            </span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="AmountIncurred" label="发生金额" min-width="100">
                                        <template slot-scope="scope">
                                            <span v-if="BlankSum">
                                                暂无
                                            </span>
                                            <span v-else v-format="'¥#,##0.00'">
                                                {{ scope.row.AmountIncurred }}
                                            </span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <!-- 分页区域 -->
                                <el-pagination @size-change="DeletehandleSizeChange"
                                    @current-change="DeletehandleCurrentChange"
                                    :current-page="WhereParameter.DeletePageIndex" :page-sizes="[20, 50, 100]"
                                    :page-size="WhereParameter.DeletePageSize"
                                    layout="total, sizes, prev, pager, next, jumper" :total="Deletetotal"></el-pagination>
                            </el-card>
                        </div>
                    </transition>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
    </div>
</template>
<script>
import moment from "moment";
import { scrollTo } from '@/utils/scroll-to'
moment.locale("zh-cn");
import {
    GetEnterpriseList,
    GetChildUser,
    GetProgramInfoAll,
    GetOverviewData,
    GetOverviewDataDetail,
    GetOverviewDataDetailByOrder,
    GetOverviewMoneyByOrder,
    OrderExportAll,
} from "@/api/hrmain";
export default {
    components: {
    },
    data() {
        return {
            ReadOnly: false,//演示人员不能操作数据
            ExportLoading: false,
            buttonShow: true,
            buttonDetailShow: true,
            OrderDetailMoney: {
                title1: '账单金额',
                title2: '加人计费',
                title3: '减人计费',
                AllMoney: 0,
                AddMoney: 0,
                DeleteMoney: 0,
            },
            DeleteOverViewDetailList: [],
            AddOverViewDetailList: [],
            DeleteDetailLoading: false,
            AddDetailLoading: false,
            ActiveDetailName: "first",
            OrderDetailVisible: false,
            OverViewDetailList: [],
            ProgramInfoAllList: [],
            EnterpriseData: [],
            ActiveName: "first",
            OverviewData: [],
            loading: false,
            DetailLoading: false,
            BlankSum: false,
            ProgramInfoList: [],
            WhereParameter: {
                ParentEnterPriseCode: '',
                EnterPriseCode: '',
                ProgramCode: [],
                CreateTime: [],
                BeginTime: '',
                EndTime: '',
                PageIndex: 1,
                PageSize: 20,
                StaffName: '',
                IdentificationNumber: '',
                OrderCode: '',
                AddPageIndex: 1,
                AddPageSize: 20,
                DeletePageIndex: 1,
                DeletePageSize: 20,
            },
            total: 0,
            Addtotal: 0,
            Deletetotal: 0,
            EnterpriseList: [],
            ChildEnterpriseList: [],
            ProgramOptions: [{
                value: 0,
                label: '在用方案'
            }, {
                value: 1,
                label: '隐藏方案'
            }],
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
        //根据账单导出数据
        ExportAllByOrder(row) {
            var parameter = {
                EnterPriseCode: this.WhereParameter.EnterPriseCode,
                OrderCode: row.OrderCode,
                Flag: 0,
                ProgramCode: [],
            }
            this.ExportLoading = true;
            OrderExportAll(parameter).then((res) => {
                if (res.success) {
                    window.location.href = res.result;
                } else {
                    this.$message.error("导出失败，请重新刷新页面");
                }
                this.ExportLoading = false;
            });
        },
        //根据详情导出数据
        ExportOrderDetail() {
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
                OrderCode: "",
                ProgramCode: this.WhereParameter.ProgramCode,
                BeginTime: this.WhereParameter.BeginTime,
                EndTime: this.WhereParameter.EndTime,
                Flag: 1,
            }
            this.ExportLoading = true;
            OrderExportAll(parameter).then((res) => {
                if (res.success) {
                    window.location.href = res.result;
                } else {
                    this.$message.error("导出失败，请重新刷新页面");
                }
                this.ExportLoading = false;
            });
        },
        //详情关闭
        OrderDetailVisibleClosed() {
            this.WhereParameter.OrderCode = '';//点击时的订单
            this.WhereParameter.StaffName = '';//查询条件姓名重置
            this.WhereParameter.IdentificationNumber = '';//查询条件身份证号重置
            this.ActiveDetailName = 'first';//切换默认选怎第一个
            this.WhereParameter.AddPageIndex = 1;//分页重置
            this.WhereParameter.AddPageSize = 20;
            this.WhereParameter.DeletePageIndex = 1;
            this.WhereParameter.DeletePageSize = 20;
            this.OrderDetailMoney.AddMoney = 0;//账单金额重置
            this.OrderDetailMoney.DeleteMoney = 0;//账单金额重置
            this.OrderDetailMoney.AllMoney = 0;//账单金额重置
            this.buttonDetailShow = true;
            this.OrderDetailVisible = false;

        },
        //详情切换选项卡
        handleDetailClick(tab, event) {
            this.ActiveDetailName = tab.name;
            if (tab.name == 'first') {
                this.buttonDetailShow = true;
            }
            else {
                this.buttonDetailShow = false;
            }
        },
        //打开详情
        OpenOrderDetailVisible(row) {
            this.WhereParameter.OrderCode = row.OrderCode;
            this.GetOverviewMoneyByOrder();
            this.GetDetails();
            this.OrderDetailVisible = true;
        },
        //获取详情方法
        GetDetails() {
            this.WhereParameter.AddPageIndex = 1;
            this.WhereParameter.AddPageSize = 20;
            this.WhereParameter.DeletePageIndex = 1;
            this.WhereParameter.DeletePageSize = 20;
            this.AddGetOverviewDataDetailByOrder();
            this.DeleteGetOverviewDataDetailByOrder();

        },
        AddGetOverviewDataDetailByOrder() {
            this.AddDetailLoading = true;
            var AddParameter = {
                EnterPriseCode: this.WhereParameter.EnterPriseCode,
                OrderCode: this.WhereParameter.OrderCode,
                StaffName: this.WhereParameter.StaffName,
                IdentificationNumber: this.WhereParameter.IdentificationNumber,
                PageIndex: this.WhereParameter.AddPageIndex,
                PageSize: this.WhereParameter.AddPageSize,
                Flag: 0,
            }
            GetOverviewDataDetailByOrder(AddParameter).then((res) => {
                if (res.success) {
                    this.AddOverViewDetailList = res.result.data;
                    this.Addtotal = res.result.count;
                } else {
                    this.AddOverViewDetailList = [];
                    this.Addtotal = 0;
                }
                this.AddDetailLoading = false;
            });
        },
        DeleteGetOverviewDataDetailByOrder() {
            this.DeleteDetailLoading = true;
            var DeleteParameter = {
                EnterPriseCode: this.WhereParameter.EnterPriseCode,
                OrderCode: this.WhereParameter.OrderCode,
                StaffName: this.WhereParameter.StaffName,
                IdentificationNumber: this.WhereParameter.IdentificationNumber,
                PageIndex: this.WhereParameter.DeletePageIndex,
                PageSize: this.WhereParameter.DeletePageSize,
                Flag: 1,
            }
            GetOverviewDataDetailByOrder(DeleteParameter).then((res) => {
                if (res.success) {
                    this.DeleteOverViewDetailList = res.result.data;
                    this.Deletetotal = res.result.count;
                } else {
                    this.DeleteOverViewDetailList = [];
                    this.Deletetotal = 0;
                }
                this.DeleteDetailLoading = false;
            });
        },
        GetOverviewMoneyByOrder() {
            var Parameter = {
                EnterPriseCode: this.WhereParameter.EnterPriseCode,
                OrderCode: this.WhereParameter.OrderCode,
            }
            GetOverviewMoneyByOrder(Parameter).then((res) => {
                if (res.success) {
                    this.OrderDetailMoney.AllMoney = res.result.AllMoney;
                    this.OrderDetailMoney.AddMoney = res.result.AddMoney;
                    this.OrderDetailMoney.DeleteMoney = res.result.DeleteMoney;
                } else {
                    this.OrderDetailMoney.AllMoney = 0;
                    this.OrderDetailMoney.AddMoney = 0;
                    this.OrderDetailMoney.DeleteMoney = 0;
                }
                this.DeleteDetailLoading = false;
            });
        },
        // 监听 pagesize改变的事件
        AddhandleSizeChange(newSize) {
            this.WhereParameter.AddPageSize = newSize;
            this.AddGetOverviewDataDetailByOrder();
        },
        // 监听 页码值 改变事件
        AddhandleCurrentChange(newSize) {
            this.WhereParameter.AddPageIndex = newSize;
            this.AddGetOverviewDataDetailByOrder();
        },
        // 监听 pagesize改变的事件
        DeletehandleSizeChange(newSize) {
            this.WhereParameter.AddDeletePageSize = newSize;
            this.DeleteGetOverviewDataDetailByOrder();
        },
        // 监听 页码值 改变事件
        DeletehandleCurrentChange(newSize) {
            this.WhereParameter.AddDeletePageIndex = newSize;
            this.DeleteGetOverviewDataDetailByOrder();
        },
        handleClick(tab, event) {
            this.ActiveName = tab.name;
            if (tab.name == 'first') {
                this.buttonShow = true;
            }
            else {
                this.buttonShow = false;
            }
        },
        //列表时间格式化
        dateFormat(row, column, cellValue, index) {
            const daterc = row[column.property]
            if (daterc != null) {
                return this.$moment(daterc).format("YYYY-MM-DD");
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
            this.GetOverviewDataDetail(); scrollTo(0, 800)
        },
        // 监听 页码值 改变事件
        handleCurrentChange(newSize) {
            this.WhereParameter.PageIndex = newSize;
            this.GetOverviewDataDetail(); scrollTo(0, 800)
        },

        GetAdmin_PermissionSearch() {
            this.WhereParameter.PageIndex = 1;
            this.WhereParameter.PageSize = 20;
            this.GetOverviewDataDetail();
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
                        this.ChangeEnterprise();
                    }
                } else {
                    this.ChildEnterpriseList = [];
                }
            });
        },
        //切换公司重新加载数据
        ChangeEnterprise() {
            this.buttonShow = true;
            //切换公司重置查询条件
            this.WhereParameter.CreateTime = [];
            this.WhereParameter.ProgramCode = [];
            this.GetOverviewData();
            this.GetProgramInfoAll();
            this.GetAdmin_PermissionSearch();
        },
        //根据分公司获取改公司下所有方案
        GetOverviewData() {
            this.ActiveName = 'first';
            this.loading = true;
            GetOverviewData(this.WhereParameter.EnterPriseCode).then((res) => {
                if (res.success) {
                    this.OverviewData = res.result;
                    this.BlankSum = res.result1;
                } else {
                    this.ProgramInfoList = [];
                }
                this.loading = false;
            });
        },
        //根据分公司获取改公司下所有方案
        GetProgramInfoAll() {
            GetProgramInfoAll(
                this.WhereParameter.EnterPriseCode
            ).then((res) => {
                if (res.success) {
                    this.ProgramInfoAllList = res.result;
                    //公司数据
                    this.EnterpriseData = res.result1;
                } else {
                    this.ProgramInfoAllList = [];
                }
            });
        },
        //获取流水明细数据
        GetOverviewDataDetail() {
            this.DetailLoading = true;
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
                ProgramCode: this.WhereParameter.ProgramCode,
                BeginTime: this.WhereParameter.BeginTime,
                EndTime: this.WhereParameter.EndTime,
                PageIndex: this.WhereParameter.PageIndex,
                PageSize: this.WhereParameter.PageSize,
            }
            GetOverviewDataDetail(parameter).then((res) => {
                if (res.success) {
                    this.OverViewDetailList = res.result.data;
                    this.total = res.result.count;
                } else {
                    this.OverViewDetailList = [];
                    this.total = 0;
                }
                this.DetailLoading = false;
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
.whereClass {
    width: 100%;
    margin-bottom: 0;
    margin-bottom: 3px;
}

.dotClass {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    display: block;
}

.buttonGroupClass {
    margin-left: 2rem;
}

.rangeTimeClass {
    width: 100%;
}

.el-divider--horizontal {
    margin: 5px 0;
}

::v-deep .el-dialog__body {
    padding: 0 20px 30px 20px
}

.whereDetailClass {
    margin-top: 5px;
    margin-bottom: 8px;
}

.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
}

/* 过渡动画用到此样式 */
.transition-box {
    margin-bottom: 10px;
    width: 200px;
    height: 100px;
    border-radius: 4px;
    background-color: #409EFF;
    text-align: center;
    color: #fff;
    padding: 40px 20px;
    box-sizing: border-box;
    margin-right: 20px;
}

.el-divider__text {
    padding: 0px 3px;
    font-size: 12px;
    color: #FFFFFF;
    background-color: #303133;
}

::v-deep .el-divider {
    margin: 20px 0;
}

.el-range-editor--small.el-input__inner {
    width: 100%;
}

.el-form-item--mini.el-form-item,
.el-form-item--small.el-form-item {
    margin-bottom: 0px;
}

.MoneySpanClass {
    font-size: 18px;
    padding: 0 4px;
    display: inline-block;
    margin: 0;
    line-height: 100%;
}
</style>