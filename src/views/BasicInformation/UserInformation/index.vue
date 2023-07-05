<template>
  <div style="margin:8px">
    <el-card>
      <el-form label-width="90px">
        <el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 0;" label="合同方">
                <el-select v-model="WhereParameter.ParentCode" class="whereClass" filterable
                           placeholder="合同方" clearable
                >
                  <el-option v-for="(item, index) in EnterpriseList" :key="index"
                             :label="item.ParentEnterPriseName" :value="item.ParentEnterPriseCode"
                  />
                </el-select>
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
      <el-table v-loading="loading" highlight-current-row :data="UserList" fit>
        <el-table-column prop="User_Account" label="登陆用户名" min-width="100" show-overflow-tooltip />
        <el-table-column prop="User_RealName" label="真实姓名" min-width="150" show-overflow-tooltip />
        <el-table-column prop="ParentCode" label="用户类型" :formatter="ParentCodeFormat" min-width="100"
                         show-overflow-tooltip
        />
        <el-table-column prop="EnterPriseName" label="公司名称" min-width="150" show-overflow-tooltip />
        <el-table-column prop="InsuranceTypeCode" label="生效方式" min-width="100" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.InsuranceTypeCode == 1" type="success">次日生效</el-tag>
            <el-tag v-else-if="scope.row.InsuranceTypeCode == 2">月底生效</el-tag>
            <el-tag v-else type="info">暂无配置</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="160">
          <template slot-scope="scope">
            <el-button icon="el-icon-edit" type="text" size="mini" @click="
              showContractorDialog(scope.row)
            "
            >编辑</el-button>

            <el-button icon="el-icon-delete" type="text" size="mini" @click="
              DeleteUser(scope.row)
            "
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination background :current-page="WhereParameter.PageIndex" :page-sizes="[20, 50, 100]"
                     :page-size="WhereParameter.PageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
                     @size-change="handleSizeChange" @current-change="handleCurrentChange"
      />
    </el-card>
    <!-- 添加用户 -->
    <el-dialog :visible.sync="addUserVisible" top="5vh" width="45%" :lock-scroll="false" :append-to-body="true"
               @close="detailUserVisibleClosed"
    >
      <!-- 上面两个属性用来重置滚动条 -->
      <div slot="title" class="dialog-title">
        <span>{{ !IfUpdate ? '添加用户' : '修改用户' }}</span>
      </div>

      <el-form ref="addStaffRef" :model="AddUserForm" :rules="addContractorRules" label-width="120px">
        <el-alert v-if="!IfUpdate" style="margin-bottom:20px ;" type="success" show-icon
                  title="此登陆密码默认为登录名加“YUANFU001”，例如：用户名为dongxiaoyun则密码为dongxiaoyunYUANFU001" :closable="false"
        />
        <el-form-item label="用户类型" prop="UserType">
          <el-radio v-model="AddUserForm.UserType" :disabled="IfUpdate" label="1" border
                    @input="UserTypeChange"
          >合同方用户</el-radio>
          <el-radio v-model="AddUserForm.UserType" :disabled="IfUpdate" label="2" border
                    @input="UserTypeChange"
          >付款方用户</el-radio>
        </el-form-item>
        <el-form-item label="合同方" prop="ParentCode">
          <el-select v-model="AddUserForm.ParentCode" filterable placeholder="合同方" :disabled="IfUpdate"
                     @change="GetChildEnterpriseChange"
          >
            <el-option v-for="(item, index) in ParentContractorList" :key="index" :label="item.EnterPriseName"
                       :value="item.EnterPriseCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="付款方" prop="EnterPriseCode">
          <el-select v-model="AddUserForm.EnterPriseCode" filterable placeholder="付款方"
                     :disabled="IfUpdate || ShowEntFlag"
          >
            <el-option v-for="(item, index) in ChildEnterpriseList" :key="index" :label="item.EnterPriseName"
                       :value="item.EnterPriseCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="登陆用户名" prop="User_Account">
          <el-input v-model="AddUserForm.User_Account" placeholder="登陆用户名" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="User_RealName">
          <el-input v-model="AddUserForm.User_RealName" placeholder="真实姓名" />
        </el-form-item>
        <el-form-item label="生效方式" prop="InsuranceTypeCode">
          <el-select v-model="AddUserForm.InsuranceTypeCode" placeholder="生效方式">
            <el-option v-for="item in InsuranceTypeCodeArray" :key="item.value" :label="item.label"
                       :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="演示用户">
          <el-switch v-model="AddUserForm.DemoUser" :disabled="IfUpdate" active-text="是" inactive-text="否" />
        </el-form-item>

        <el-divider />
        <el-row class="buttonCenter">
          <el-col>
            <el-button type="primary" :loading="LoadingAdd" @click="addContractor">保
              存</el-button>
            <el-button v-if="!IfUpdate" @click="detailUserVisibleClosed">重 置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'
import {
    GetUserList,
    GetEnterpriseList,
    GetEnterpriseDetail,
    GetChildEnterprise,
    GetCustomerInoperable,
    AddContract,
    AddPayer,
    UpdateUserInfo,
    DeleteUserInfo,
    GetContractorList,
} from "@/api/hrmain";
export default {
    components: {
    },
    data() {
        // 付款方验证
        var checkEnterPriseCode = (rule, value, callback) => {
            if (!this.ShowEntFlag) {
                if (!this.AddUserForm.EnterPriseCode) { callback("请选择付款方"); } else { callback(); }
            } else { callback(); }
        };
        return {
            ParentContractorList: [],
            ShowEntFlag: true,
            ChildEnterpriseList: [],
            IfUpdate: false,
            EnterpriseList: [],
            ChannelInformationList: [],
            addUserVisible: false,
            AddUserForm: {
                UserType: '1', // 1 合同方用户 2付款方用户
                ParentCode: '',
                EnterPriseCode: '',
                User_Account: '',
                User_RealName: '',
                InsuranceTypeCode: '',
                UserID: '',
                DemoUser: false,
            },
            WhereParameter: {
                ContractorParameter: '',
                EnterpriseType: 2,
                PageIndex: 1,
                PageSize: 20,
            },
            UserList: [],
            total: 0,
            loading: false,
            LoadingAdd: false,
            addContractorRules: {
                ParentCode: [
                    { required: true, message: "请选择合同方名称", trigger: "change" },
                ],
                EnterPriseCode: [
                    { required: false, message: "", trigger: "change", validator: checkEnterPriseCode, },
                ],
                User_Account: [
                    { required: true, message: "请输入登陆用户名", trigger: "blur" },
                ],
                User_RealName: [
                    { required: true, message: "请输入真实姓名", trigger: "blur" },
                ],
                InsuranceTypeCode: [
                    { required: true, message: "请选择生效方式", trigger: "change" },
                ],
            },
            InsuranceTypeCodeArray: [{
                value: "1",
                label: '次日生效'
            }, {
                value: "2",
                label: '月底生效'
            }],
        };
    },
    computed: {
    },
    created() {
    },
    // 加载完成后执行调取回款数据接口
    mounted() {
        this.GetEnterpriseList();
        this.GetAdmin_PermissionSearch();
        this.ParentGetContractorList();
    },
    methods: {
        async DeleteUser(row) {
            const confirmResult = await this.$confirm(
                "删除不可恢复是否永久删除？",
                "提示",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            ).catch((err) => err);
            if (confirmResult !== "confirm") {
                return this.$message.info("已取消删除");
            } else {
                DeleteUserInfo(row.User_ID).then((res) => {
                    if (res.success) {
                        this.$message.success("删除成功");
                        this.GetUserList();
                    } else {
                        this.$message.error(res.resultMessage);
                    }
                });
            }
        },

        UserTypeChange() {
            if (this.AddUserForm.UserType == '1') {
                this.ShowEntFlag = true;
                this.AddUserForm.EnterPriseCode = '';
            } else { this.ShowEntFlag = false; }
        },
        ParentCodeFormat(row, column, cellValue, index) {
            const daterc = row[column.property];
            if (daterc != null) {
                return '付款方登录用户'
            } else { return '合同方登录用户' }
        },
        // 添加投保数据
        addContractor() {
            this.LoadingAdd = true;
            // 提交请求前，表单预验证
            this.$refs.addStaffRef.validate(async (valid, object) => {
                // 表单预校验失败
                if (!valid) {
                    this.LoadingAdd = false;
                    return;
                } else {
                    var addparameter = {
                        ParentCode: this.AddUserForm.ParentCode,
                        EnterPriseCode: this.AddUserForm.EnterPriseCode,
                        User_Account: this.AddUserForm.User_Account,
                        User_RealName: this.AddUserForm.User_RealName,
                        InsuranceTypeCode: this.AddUserForm.InsuranceTypeCode,
                        UserID: this.AddUserForm.UserID,
                        DemoUser: this.AddUserForm.DemoUser,
                    };
                    // 修改操作
                    if (this.IfUpdate) {
                        UpdateUserInfo(addparameter).then((res) => {
                            this.LoadingAdd = false;
                            if (res.success) {
                                this.$message.success("修改成功");
                                this.addUserVisible = false;
                                this.GetUserList();
                            } else {
                                this.$message.error(res.resultMessage);
                            }
                        });
                        // eslint-disable-next-line brace-style
                    }
                    // 否则时添加操作，添加操作分为添加合同方和添加付款方
                    else {
                        // 这个是添加合同方
                        if (this.ShowEntFlag) {
                            AddContract(addparameter).then((res) => {
                                this.LoadingAdd = false;
                                if (res.success) {
                                    this.$message.success("添加成功");
                                    this.addUserVisible = false;
                                    this.GetUserList();
                                } else {
                                    this.$message.error(res.resultMessage);
                                }
                            });
                            // eslint-disable-next-line brace-style
                        }
                        // 这个是添加付款方
                        else {
                            AddPayer(addparameter).then((res) => {
                                this.LoadingAdd = false;
                                if (res.success) {
                                    this.$message.success("添加成功");
                                    this.addUserVisible = false;
                                    this.GetUserList();
                                } else {
                                    this.$message.error(res.resultMessage);
                                }
                            });
                        }
                        // 添加完成清空
                        this.ChildEnterpriseList = [];
                    }
                }
            });
        },
        // 添加窗口关闭
        detailUserVisibleClosed() {
            // 初始化data-AddUserForm 的数据
            this.$data.AddUserForm = this.$options.data().AddUserForm;
            this.$refs.addStaffRef.resetFields();
        },
        // 弹出添加窗口(修改需要传入参数)
        showContractorDialog(row) {
            this.UserTypeChange();
            // 如果是修改数据
            if (row) {
                this.IfUpdate = true;
                // 生效方式反填
                GetCustomerInoperable(row.User_ID).then((res) => {
                    if (res.success) {
                        this.AddUserForm.InsuranceTypeCode = res.result.InsuranceTypeCode + '';
                    }
                });
                // 付款方反填
                if (row.ParentCode) {
                    this.AddUserForm.ParentCode = row.ParentCode;
                    this.AddUserForm.EnterPriseCode = row.EnterPriseCode;
                    this.GetChildEnterprise(true);
                    // eslint-disable-next-line brace-style
                }
                // 合同方反填
                else {
                    this.AddUserForm.ParentCode = row.EnterPriseCode;
                    this.AddUserForm.EnterPriseCode = '';
                }
                // 共用反填
                this.AddUserForm.User_Account = row.User_Account;
                this.AddUserForm.User_RealName = row.User_RealName;
                this.AddUserForm.UserID = row.User_ID;
                this.AddUserForm.UserType = row.ParentCode ? "2" : "1";
                this.AddUserForm.DemoUser = row.DemoUser;
            } else { this.IfUpdate = false; }
            this.addUserVisible = true;
        },

        // 监听 pagesize改变的事件
        handleSizeChange(newSize) {
            this.WhereParameter.PageSize = newSize;
            this.GetUserList(); scrollTo(0, 800)
        },
        // 监听 页码值 改变事件
        handleCurrentChange(newSize) {
            this.WhereParameter.PageIndex = newSize;
            this.GetUserList(); scrollTo(0, 800)
        },

        GetAdmin_PermissionSearch() {
            this.WhereParameter.PageIndex = 1;
            this.WhereParameter.PageSize = 20;
            this.GetUserList();
        },
        // 获取员工方案列表数据
        GetUserList() {
            this.loading = true;
            var parameter = {
                EnterpriseCode: this.WhereParameter.ParentCode,
                PageIndex: this.WhereParameter.PageIndex,
                PageSize: this.WhereParameter.PageSize,
            }
            GetUserList(
                parameter
            ).then((res) => {
                if (res.success) {
                    this.UserList = res.result.data;
                    this.total = res.result.count;
                } else {
                    this.UserList = [];
                    this.total = 0;
                }
                this.loading = false;
            });
        },
        datetimeChange(time) {
            // 强制刷新
            this.$forceUpdate();
        },
        // 如果登陆人是客服，那么获取公司列表
        GetEnterpriseList() {
            // 传入vuex存储的值
            GetEnterpriseList().then((res) => {
                if (res.success) {
                    this.EnterpriseList = res.result;
                } else {
                    this.EnterpriseList = [];
                }
            });
        },
        // 根据父级公司获取分公司
        GetChildEnterprise(flag) {
            GetChildEnterprise(this.AddUserForm.ParentCode).then((res) => {
                if (res.success) {
                    this.ChildEnterpriseList = res.result;
                    if (!flag) { this.AddUserForm.EnterPriseCode = res.result[0].EnterPriseCode; }
                } else {
                    this.ChildEnterpriseList = [];
                }
            });
        },
        // 添加时调用
        GetChildEnterpriseChange() {
            this.GetChildEnterprise(false);
        },
        ParentCodeChange() {
            GetEnterpriseDetail(this.AddUserForm.ParentCode).then((res) => {
                if (res.success) {
                    this.AddUserForm.MenuPermissions = res.result.MenuPermissions + '';
                    this.AddUserForm.RangeDate = (res.result.BeginTime && res.result.EndTime) ? [res.result.BeginTime, res.result.EndTime] : [];
                    this.AddUserForm.PaymentCode = res.result.PaymentCode + '';
                    this.AddUserForm.Simples = res.result.Simples == '1' ? '1' : '0';
                }
            });
        },
        // 获取员工方案列表数据
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
