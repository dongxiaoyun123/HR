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
                  <el-option v-for="item in EnterpriseList" :key="item.ParentEnterPriseCode"
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
      <el-table v-loading="loading" highlight-current-row :data="BillingList" fit>
        <el-table-column prop="EnterpriseName" label="付款方" min-width="180" show-overflow-tooltip />
        <el-table-column prop="OrderCode" label="账单编号" min-width="150" show-overflow-tooltip />
        <el-table-column prop="OrderBeginTime" label="开始时间" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span style="margin-left: 6px">{{ scope.row.OrderBeginTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="OrderEndTime" label="结束时间" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span style="margin-left: 6px">{{ scope.row.OrderEndTime }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="OrderStatesName" label="订单状态" min-width="100" />
        <el-table-column prop="PaymentTime" label="支付时间" min-width="100" show-overflow-tooltip />
      </el-table>
      <!-- 分页区域 -->
      <el-pagination background :current-page="WhereParameter.PageIndex" :page-sizes="[20, 50, 100]"
                     :page-size="WhereParameter.PageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
                     @size-change="handleSizeChange" @current-change="handleCurrentChange"
      />
    </el-card>
    <!-- 添加账单信息 -->
    <el-dialog :visible.sync="addBillingVisible" top="5vh" width="45%" :lock-scroll="false"
               :append-to-body="true" @close="detailAddDialogVisibleClosed"
    >
      <!-- 上面两个属性用来重置滚动条 -->
      <div slot="title" class="dialog-title">
        <span>添加账单信息</span>
      </div>
      <el-form ref="addBillingRef" :model="AddBillingForm" :rules="addBillingRules" label-width="120px">
        <el-alert style="margin-bottom:20px ;" type="warning" show-icon title="只有续签的客户才能添加账单信息，慎重！慎重！慎重！"
                  :closable="false"
        />
        <el-form-item label="合同方" prop="ParentCode">
          <el-select v-model="AddBillingForm.ParentCode" filterable placeholder="合同方"
                     @change="GetChildEnterprise"
          >
            <el-option v-for="item in ParentContractorList" :key="item.EnterPriseCode"
                       :label="item.EnterPriseName" :value="item.EnterPriseCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="付款方" prop="EnterPriseCode">
          <el-select v-model="AddBillingForm.EnterPriseCode" filterable placeholder="付款方">
            <el-option v-for="item in ChildEnterpriseList" :key="item.EnterPriseCode"
                       :label="item.EnterPriseName" :value="item.EnterPriseCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="账单日期" prop="OrderRangeDate">
          <el-date-picker v-model="AddBillingForm.OrderRangeDate" type="daterange" range-separator="至"
                          start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" @input="datetimeChange"
          />
        </el-form-item>

        <el-divider />
        <el-row class="buttonCenter">
          <el-col>
            <el-button type="primary" :loading="LoadingAdd" @click="addBilling">保
              存</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'
import { getDateByTimes } from "@/utils"; // 时间日期格式化成字符串
import {
    GetOrderList,
    AddOrder,
    GetEnterpriseList,
    GetChildEnterprise,
    GetContractorList,
} from "@/api/hrmain";
export default {
    components: {
    },
    data() {
        return {
            ParentContractorList: [],
            ChildEnterpriseList: [],
            EnterpriseList: [],
            addBillingVisible: false,
            AddBillingForm: {
                ParentCode: '',
                EnterPriseCode: '',
                OrderRangeDate: [],
                OrderBeginTime: '',
                OrderEndTime: '',
            },
            WhereParameter: {
                ParentCode: '',
                PageIndex: 1,
                PageSize: 20,
            },
            BillingList: [],
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
            addBillingRules: {
                ParentCode: [
                    { required: true, message: "请选择付款方", trigger: "change" },
                ],
                EnterPriseCode: [
                    { required: true, message: "请输入付款方名称", trigger: "change" },
                ],
                OrderRangeDate: [
                    { required: true, message: "请选择账单日期", trigger: "change" },
                ]
            },
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
        datetimeChange(time) {
            // 强制刷新
            this.$forceUpdate();
        },
        // 根据父级公司获取分公司
        GetChildEnterprise() {
            GetChildEnterprise(this.AddBillingForm.ParentCode).then((res) => {
                if (res.success) {
                    this.ChildEnterpriseList = res.result;
                    this.AddBillingForm.EnterPriseCode = res.result[0].EnterPriseCode;
                } else {
                    this.ChildEnterpriseList = [];
                }
            });
        },
        // 添加投保数据
        addBilling() {
            this.LoadingAdd = true;
            // 提交请求前，表单预验证
            this.$refs.addBillingRef.validate(async (valid, object) => {
                // 表单预校验失败
                if (!valid) {
                    this.LoadingAdd = false;
                    return;
                } else {
                    if (this.AddBillingForm.OrderRangeDate && this.AddBillingForm.OrderRangeDate.length > 0) {
                        this.AddBillingForm.OrderBeginTime = this.$moment(this.AddBillingForm.OrderRangeDate[0]).format("YYYY-MM-DD");
                        this.AddBillingForm.OrderEndTime = this.$moment(this.AddBillingForm.OrderRangeDate[1]).format("YYYY-MM-DD");
                    } else {
                        this.AddBillingForm.OrderBeginTime = '';
                        this.AddBillingForm.OrderEndTime = '';
                    }
                    var addparameter = {
                        EnterPriseCode: this.AddBillingForm.EnterPriseCode,
                        OrderBeginTime: this.AddBillingForm.OrderBeginTime,
                        OrderEndTime: this.AddBillingForm.OrderEndTime,
                    };
                    AddOrder(addparameter).then((res) => {
                        this.LoadingAdd = false;
                        if (res.success) {
                            this.$message.success("添加成功");
                            this.addBillingVisible = false;
                            this.GetOrderList();
                        } else {
                            this.$message.error(res.resultMessage);
                        }
                    });
                }
            });
        },
        // 添加窗口关闭
        detailAddDialogVisibleClosed() {
            // 初始化data-AddBillingForm 的数据
            this.$data.AddBillingForm = this.$options.data().AddBillingForm;
            this.$refs.addBillingRef.resetFields();
        },
        // 弹出添加窗口(修改需要传入参数)
        showContractorDialog() {
            this.addBillingVisible = true;
        },

        // 监听 pagesize改变的事件
        handleSizeChange(newSize) {
            this.WhereParameter.PageSize = newSize;
            this.GetOrderList();
            scrollTo(0, 800)
        },
        // 监听 页码值 改变事件
        handleCurrentChange(newSize) {
            this.WhereParameter.PageIndex = newSize;
            this.GetOrderList();
            scrollTo(0, 800)
        },

        GetAdmin_PermissionSearch() {
            this.WhereParameter.PageIndex = 1;
            this.WhereParameter.PageSize = 20;
            this.GetOrderList();
        },
        // 获取员工方案列表数据
        GetOrderList() {
            this.loading = true;
            var parameter = {
                ParentCode: this.WhereParameter.ParentCode,
                PageIndex: this.WhereParameter.PageIndex,
                PageSize: this.WhereParameter.PageSize,
            }
            GetOrderList(
                parameter
            ).then((res) => {
                if (res.success) {
                    this.BillingList = res.result.data;
                    this.total = res.result.count;
                } else {
                    this.BillingList = [];
                    this.total = 0;
                }
                this.loading = false;
            });
        },
        // 获取公司列表
        GetEnterpriseList() {
            GetEnterpriseList().then((res) => {
                if (res.success) {
                    this.EnterpriseList = res.result.filter((item) => { return item.MenuPermissions != 2 });
                } else {
                    this.EnterpriseList = [];
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
