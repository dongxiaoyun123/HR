<template>
  <div style="margin:8px">
    <el-card>
      <el-form label-width="90px">
        <el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 0;" label="合同方">
                <el-input v-model="WhereParameter.ContractorParameter" clearable
                          placeholder="合同方"
                />
              </el-form-item>
            </el-col>
            <el-button-group class="buttonGroupClass">
              <el-button type="primary" icon="el-icon-search" @click="GetAdmin_PermissionSearch">查 询
              </el-button>
              <el-button type="success" icon="el-icon-circle-plus-outline"
                         @click="showContractorDialog(null)"
              >增
                加
              </el-button>
            </el-button-group>
          </el-row>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="CardTableClass">
      <el-table v-loading="loading" highlight-current-row :data="ContractorList" fit>
        <el-table-column prop="EnterPriseName" label="合同方" min-width="150" show-overflow-tooltip
                         fixed="left"
        />
        <el-table-column prop="MenuPermissionsStr" label="显示菜单类型" min-width="120" fixed="left"
                         show-overflow-tooltip
        />
        <el-table-column prop="BeginTimeStr" label="开始时间" min-width="120" fixed="left" show-overflow-tooltip>
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span style="margin-left: 6px">{{ scope.row.BeginTimeStr }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="EndTimeStr" label="结束时间" min-width="120">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span style="margin-left: 6px">{{ scope.row.EndTimeStr }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="PaymentName" label="支付方式" min-width="80" show-overflow-tooltip />
        <el-table-column prop="SimplesStr" label="导入类型" sortable min-width="100" show-overflow-tooltip />
        <el-table-column label="操作" fixed="right" width="150">
          <template slot-scope="scope">
            <!-- <el-button icon="el-icon-menu" type="text" size="mini"
                            @click="showManagementEditDialog(scope.row.EnterPriseCode)">模块管理</el-button> -->
            <el-button icon="el-icon-edit" type="text" size="mini" @click="
              showContractorDialog(scope.row)
            "
            >编辑</el-button>
            <!-- <el-button  v-loading.fullscreen.lock="synchronizationLoading" element-loading-text="拼命同步中"
                            element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)"
                            icon="el-icon-refresh" type="text" size="mini" @click="
                                synchronization(scope.row)
                            ">同步</el-button> -->
            <el-dropdown icon="el-icon-refresh" style="margin-left: 10px;" @command="
              (command) => {
                handleButtonCommand(command, scope.row);
              }
            "
            >
              <el-button type="text" size="mini">
                更 多<i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a" icon="el-icon-refresh">同 步 {{
                  "\xa0" }}
                </el-dropdown-item>
                <el-dropdown-item command="b" icon="el-icon-menu">模块管理
                  {{ "\xa0" }}
                </el-dropdown-item>
                <el-dropdown-item command="c" icon="el-icon-money">隐藏金额
                  {{ "\xa0"
                  }}
                </el-dropdown-item>
                <el-dropdown-item command="d" icon="el-icon-edit">全月操作 {{
                  "\xa0" }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination background :current-page="WhereParameter.PageIndex" :page-sizes="[20, 50, 100]"
                     :page-size="WhereParameter.PageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
                     @size-change="handleSizeChange" @current-change="handleCurrentChange"
      />
    </el-card>
    <!-- 添加投保数据 -->
    <el-dialog :visible.sync="addContractorVisible" top="5vh" width="45%" :lock-scroll="false"
               :append-to-body="true" @close="detailAddDialogVisibleClosed"
    >
      <!-- 上面两个属性用来重置滚动条 -->
      <div slot="title" class="dialog-title">
        <span>{{ !IfUpdate ? '添加合同方' : '修改合同方' }}</span>
      </div>
      <el-form ref="addContractorRef" :model="AddContractorForm" :rules="addContractorRules" label-width="120px">
        <el-form-item label="通道" prop="ChName">
          <el-select v-model="AddContractorForm.ChName" placeholder="通道" :disabled="IfUpdate">
            <el-option v-for="item in ChannelInformationList" :key="item.ChID" :label="item.ChName"
                       :value="item.ChID"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="合同方" prop="EnterPriseName">
          <el-input v-model="AddContractorForm.EnterPriseName" placeholder="合同方" :disabled="IfUpdate" />
        </el-form-item>
        <el-form-item label="显示菜单类型" prop="MenuPermissions">
          <el-select v-model="AddContractorForm.MenuPermissions" placeholder="显示菜单类型">
            <el-option v-for="item in MenuPermissionsArray" :key="item.value" :label="item.label"
                       :value="item.value"
            />
          </el-select>
          <el-tag style="margin-left:1rem ;" type="success">这里为默认配置，模块管理为自定义配置</el-tag>
        </el-form-item>
        <el-form-item label="投保日期" prop="RangeDate">
          <el-date-picker v-model="AddContractorForm.RangeDate" type="daterange" range-separator="至"
                          start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" @input="datetimeChange"
          />
        </el-form-item>
        <el-form-item label="缴费方式" prop="PaymentCode">
          <el-select v-model="AddContractorForm.PaymentCode" placeholder="缴费方式" :disabled="IfUpdate">
            <el-option v-for="item in PaymentCodeArray" :key="item.value" :label="item.label"
                       :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="导入类型" prop="Simples">
          <el-select v-model="AddContractorForm.Simples" placeholder="导入类型">
            <el-option v-for="item in SimplesArray" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-divider />
        <el-row class="buttonCenter">
          <el-col>
            <el-button type="primary" :loading="LoadingAdd" @click="addContractor">保
              存</el-button>
            <el-button v-if="!IfUpdate" @click="detailAddDialogVisibleClosed">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 模块管理自定义配置界面 -->
    <el-dialog :visible.sync="updateRoleDialogVisible" top="5vh" width="50%">
      <div slot="title" class="dialog-title">
        <span>模块管理</span>
      </div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>选择模块进行关联</span>
          <el-button v-loading.fullscreen.lock="LoadingRoleUpdate" style="float: right;" type="primary"
                     @click="saveRoleUpdate"
          >绑定</el-button>
        </div>
        <el-tree ref="tree" style="height: calc(100vh - 350px); overflow-y: scroll" :data="permissionTree"
                 show-checkbox:true show-checkbox default-expand-all:true node-key="id" highlight-current
        />
      </el-card>
    </el-dialog>
    <!-- 弹出可隐藏金额、全月操作的付款方-->
    <el-dialog :visible.sync="updateChildDialogVisible" top="5vh" width="50%">
      <div slot="title" class="dialog-title">
        <span>设置付款方</span>
      </div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>选择付款方进行关联</span>
          <el-button style="float: right;" type="primary" :loading="LoadingChildEnterprise"
                     @click="SaveChildEnterprise"
          >设置</el-button>
        </div>
        <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;" />
        <el-checkbox-group v-model="checkedChildEnterprise" @change="handleCheckedChildEnterpriseChange">
          <el-row>
            <el-col v-for="(item,index) in ChildEnterpriseList" :key="index" :span="12">
              <el-checkbox :key="item.EnterPriseCode" style="height: 2rem;" :label="item.EnterPriseCode">{{
                item.EnterPriseName
              }}</el-checkbox>
            </el-col>
          </el-row>
        </el-checkbox-group>
      </el-card>
    </el-dialog>
    <div v-if="isShowProgress" class="popContainer">
      <el-progress type="circle" :percentage="parseInt(fakes.progress * 100)" :stroke-width="9" :color="customColors"
                   style="top: 30%; left: calc(50vw - 58px);color:white"
      />
    </div>
  </div>
</template>

<script>
import { getDateByTimes } from "@/utils"; // 时间日期格式化成字符串
import { scrollTo } from '@/utils/scroll-to'
// import moment from "moment"; // 导入模块
import FakeProgress from 'fake-progress';
import {
    GetContractorList,
    GetChannelInformation,
    UpdateEnterpriseInfo,
    AddEnterpriseinfo,
    GetAdmin_PermissionByRole,
    GetAdmin_PermissionByRoleID,
    BindRole_Permissions,
    GetChildUser,
    SaveChildEnterprise,
    GetChildEnterpriseBind,
} from "@/api/hrmain";

import {
    HrSynchronizeDataJudge,
    HrSynchronizeData
} from "@/api/hrsynchronization";
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
            IfUpdate: false,
            ChannelInformationList: [],
            addContractorVisible: false,
            AddContractorForm: {
                ChName: '',
                EnterPriseCode: '',
                EnterPriseName: '',
                MenuPermissions: '',
                RangeDate: [],
                RangeDateBegin: '',
                RangeDateEnd: '',
                PaymentCode: '',
                Simples: '',
            },
            WhereParameter: {
                ContractorParameter: '',
                EnterpriseType: 1,
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
            loading: false,
            LoadingAdd: false,
            addContractorRules: {
                ChName: [
                    { required: true, message: "请选择通道", trigger: "change" },
                ],
                EnterPriseName: [
                    { required: true, message: "请输入合同方名称", trigger: "blur" },
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
                ]
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
            permissionTree: [],
            updateRoleDialogVisible: false,
            LoadingRoleUpdate: false,
            bingdArray: {
                EnterpriseCode: null,
                PermissionsArray: [],
            },
            updateChildDialogVisible: false,
            ChildEnterpriseList: [],
            checkAll: false,
            checkedChildEnterprise: [],
            LoadingChildEnterprise: false,
            SaveFlag: null,
            AllKeys: [],
        };
    },
    computed: {
    },
    created() {
        this.GetChannelInformation();
    },
    // 加载完成后执行调取回款数据接口
    mounted() {
        this.GetAdmin_PermissionSearch();
    },
    methods: {
        // 执行列表右侧按钮更多操作
        handleButtonCommand(flag, row) {
            switch (flag) {
                case "a":
                    this.synchronization(row);
                    break;
                case "b":
                    this.showManagementEditDialog(row.EnterPriseCode);
                    break;
                case "c":
                    this.showChildEnterpriseDialog(row.EnterPriseCode, 'BlankSum');
                    break;
                case "d":
                    this.showChildEnterpriseDialog(row.EnterPriseCode, 'AllMonthOperation');
                    break;
            }
        },
        // 弹出可隐藏金额、全月操作的付款方
        showChildEnterpriseDialog(EnterpriseCode, Flag) {
            this.SaveFlag = Flag;
            GetChildUser(EnterpriseCode).then((res) => {
                if (res.success) {
                    this.ChildEnterpriseList = res.result;
                    this.ChildEnterpriseList.forEach(element => {
                        this.AllKeys.push(element.EnterPriseCode);
                    });
                    GetChildEnterpriseBind(EnterpriseCode, Flag).then((res) => {
                        if (res.success) {
                            this.checkedChildEnterprise = res.result;
                            this.checkAll = res.result.length === this.ChildEnterpriseList.length;
                        } else {
                            this.checkedChildEnterprise = [];
                        }
                    });
                    this.updateChildDialogVisible = true;
                } else {
                    this.ChildEnterpriseList = [];
                }
            });
        },
        handleCheckAllChange(val) {
            const allKeys = [];
            this.ChildEnterpriseList.forEach(element => {
                allKeys.push(element.EnterPriseCode);
            });
            this.checkedChildEnterprise = val ? allKeys : [];
        },
        handleCheckedChildEnterpriseChange(value) {
            const checkedCount = value.length;
            this.checkAll = checkedCount === this.ChildEnterpriseList.length;
        },
        // 保存关联数据
        SaveChildEnterprise() {
            this.LoadingChildEnterprise = true;

            const parameter = {
                AllKeys: this.AllKeys,
                checkedChildEnterprise: this.checkedChildEnterprise,
                SaveFlag: this.SaveFlag,
            }
            SaveChildEnterprise(parameter).then((res) => {
                this.LoadingChildEnterprise = false;
                if (res.success) {
                    this.updateChildDialogVisible = false;
                    this.$message.success("操作成功");
                } else {
                    this.$message.error("操作失败");
                }
            });
        },
        async synchronization(item) {
            let flag = false;
            await HrSynchronizeDataJudge(item.EnterPriseCode).then((res) => {
                if (res.success) {
                    flag = true;
                } else {
                    this.$message.warning(res.resultMessage);
                }
            });
            if (flag) {
                const confirmResult = await this.$confirm(
                    "等待时间可能较长，是否执行同步？",
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    }
                ).catch((err) => err);
                if (confirmResult !== "confirm") {
                    return this.$message.info("已取消");
                } else {
                    this.isShowProgress = true;
                    this.fakes.start();
                    HrSynchronizeData(item.EnterPriseCode).then((res) => {
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
                            this.$message.success("操作成功");
                        } else {
                            this.$message.error("操作失败");
                        }
                    });
                }
            }
        },
        // 模块管理反填数据
        showManagementEditDialog(EnterpriseCode) {
            this.bingdArray.EnterpriseCode = EnterpriseCode;
            GetAdmin_PermissionByRole().then((res) => {
                if (res.success) {
                    this.permissionTree = res.result;
                    GetAdmin_PermissionByRoleID(EnterpriseCode).then((res) => {
                        if (res.success) {
                            this.$refs.tree.setCheckedKeys(res.result);
                        }
                    });
                    this.updateRoleDialogVisible = true;
                } else {
                    return this.$message.error("数据获取失败！");
                }
            });
        },
        // 绑定模块操作
        saveRoleUpdate() {
            this.LoadingRoleUpdate = true;
            this.bingdArray.PermissionsArray = this.$refs.tree
                .getCheckedKeys()
                .concat(this.$refs.tree.getHalfCheckedKeys());
            BindRole_Permissions(this.bingdArray).then((res) => {
                if (res.success) {
                    this.updateRoleDialogVisible = false;
                    this.$message.success("操作成功，请该合同方下的用户刷新页面后查看");
                } else {
                    this.$message.error(res.resultMessage);
                }
                this.LoadingRoleUpdate = false;
            });
        },
        // 添加投保数据
        addContractor() {
            this.LoadingAdd = true;
            // 提交请求前，表单预验证
            this.$refs.addContractorRef.validate(async (valid, object) => {
                // 表单预校验失败
                if (!valid) {
                    this.LoadingAdd = false;
                    return;
                } else {
                    if (this.AddContractorForm.RangeDate && this.AddContractorForm.RangeDate.length > 0) {
                        this.AddContractorForm.RangeDateBegin = this.$moment(this.AddContractorForm.RangeDate[0]).format("YYYY-MM-DD");
                        this.AddContractorForm.RangeDateEnd = this.$moment(this.AddContractorForm.RangeDate[1]).format("YYYY-MM-DD");
                    } else {
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
                        Flag: true, // 修改时传入参数 合同放为true，付款方为false
                    };
                    if (this.IfUpdate) {
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
} else {
 AddEnterpriseinfo(addparameter).then((res) => {
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
                }
            });
        },
        // 添加窗口关闭
        detailAddDialogVisibleClosed() {
            // 初始化data-AddContractorForm 的数据
            this.$data.AddContractorForm = this.$options.data().AddContractorForm;
            this.$refs.addContractorRef.resetFields();
        },
        // 弹出添加窗口(修改需要传入参数)
        showContractorDialog(row) {
            // 如果是修改数据
            if (row) {
                this.IfUpdate = true;
                this.AddContractorForm.EnterPriseCode = row.EnterPriseCode;
                this.AddContractorForm.EnterPriseName = row.EnterPriseName;
                this.AddContractorForm.MenuPermissions = row.MenuPermissions + '';
                this.AddContractorForm.RangeDate = (row.BeginTime && row.EndTime) ? [row.BeginTime, row.EndTime] : [];
                this.AddContractorForm.PaymentCode = row.PaymentCode + '';
                this.AddContractorForm.Simples = row.Simples == '1' ? '1' : '0';
                this.AddContractorForm.ChName = row.ChID;
            } else { this.IfUpdate = false; }
            this.addContractorVisible = true;
        },

        // 监听 pagesize改变的事件
        handleSizeChange(newSize) {
            this.WhereParameter.PageSize = newSize;
            this.GetContractorList();
            scrollTo(0, 800)
        },
        // 监听 页码值 改变事件
        handleCurrentChange(newSize) {
            this.WhereParameter.PageIndex = newSize;
            this.GetContractorList();
            scrollTo(0, 800)
        },

        GetAdmin_PermissionSearch() {
            this.WhereParameter.PageIndex = 1;
            this.WhereParameter.PageSize = 20;
            this.GetContractorList();
        },
        // 获取员工方案列表数据
        GetContractorList() {
            this.loading = true;
            var parameter = {
                ContractorParameter: this.WhereParameter.ContractorParameter,
                EnterpriseType: this.WhereParameter.EnterpriseType,
                PageIndex: this.WhereParameter.PageIndex,
                PageSize: this.WhereParameter.PageSize,
            }
            GetContractorList(
                parameter
            ).then((res) => {
                if (res.success) {
                    this.ContractorList = res.result.data;
                    this.total = res.result.count;
                } else {
                    this.ContractorList = [];
                    this.total = 0;
                }
                this.loading = false;
            });
        },
        // 获取通道数据
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
            // 强制刷新
            this.$forceUpdate();
        },
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
