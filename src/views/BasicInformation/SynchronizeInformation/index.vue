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
              <el-button type="success" icon="el-icon-circle-plus-outline" @click="showContractorDialog()">增
                加
              </el-button>
            </el-button-group>
          </el-row>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="CardTableClass">
      <el-table v-loading="loading" highlight-current-row :data="SynchronizationList" fit>
        <el-table-column prop="ParentName" label="合同方" width="250" show-overflow-tooltip />
        <el-table-column prop="EnterPriseName" label="付款方" width="250" show-overflow-tooltip />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button icon="el-icon-delete" type="text" size="mini" @click="
              DeleteSynchronization(scope.row.EnterPriseCode)
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
    <!-- 添加同步信息 -->
    <el-dialog :visible.sync="addSynchronizationVisible" top="5vh" width="45%" :lock-scroll="false"
               :append-to-body="true" @close="detailAddDialogVisibleClosed"
    >
      <!-- 上面两个属性用来重置滚动条 -->
      <div slot="title" class="dialog-title">
        <span>添加同步信息</span>
      </div>
      <el-form ref="addSynchronizationRef" :model="AddSynchronizationForm" :rules="addSynchronizationRules"
               label-width="120px"
      >
        <el-form-item label="合同方" prop="ParentCode">
          <el-select v-model="AddSynchronizationForm.ParentCode" filterable placeholder="合同方"
                     @change="GetChildEnterprise"
          >
            <el-option v-for="item in ParentContractorList" :key="item.EnterPriseCode"
                       :label="item.EnterPriseName" :value="item.EnterPriseCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="付款方" prop="EnterPriseCode">
          <el-select v-model="AddSynchronizationForm.EnterPriseCode" style="width:100%" filterable
                     placeholder="付款方" multiple
          >
            <el-option v-for="item in ChildEnterpriseList" :key="item.EnterPriseCode"
                       :label="item.EnterPriseName" :value="item.EnterPriseCode"
            />
          </el-select>
        </el-form-item>
        <el-divider />
        <el-row class="buttonCenter">
          <el-col>
            <el-button type="primary" :loading="LoadingAdd" @click="AddSynchronization">保
              存</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'
import {
    GetEnterpriseList,
    GetChildEnterprise,
    GetSynchronizationList,
    AddSynchronization,
    DeleteSynchronization,
    GetContractorList
} from "@/api/hrmain";
export default {
    name:'SynchronizeInformation',
    components: {
    },
    data() {
        return {
            ParentContractorList: [],
            ChildEnterpriseList: [],
            EnterpriseList: [],
            addSynchronizationVisible: false,
            AddSynchronizationForm: {
                ParentCode: '',
                EnterPriseCode: [],
            },
            WhereParameter: {
                ParentCode: '',
                PageIndex: 1,
                PageSize: 20,
            },
            SynchronizationList: [],
            total: 0,
            loading: false,
            LoadingAdd: false,
            addSynchronizationRules: {
                ParentCode: [
                    { required: true, message: "请选择付款方", trigger: "change" },
                ],
                EnterPriseCode: [
                    { required: true, message: "请输入付款方名称", trigger: "change" },
                ],
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
        async DeleteSynchronization(EnterpriseCode) {
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
                DeleteSynchronization(EnterpriseCode).then((res) => {
                    if (res.success) {
                        this.$message.success("删除成功");
                        this.GetSynchronizationList();
                    } else {
                        this.$message.error("删除失败");
                    }
                });
            }
        },
        // 根据父级公司获取分公司
        GetChildEnterprise() {
            GetChildEnterprise(this.AddSynchronizationForm.ParentCode).then((res) => {
                if (res.success) {
                    this.ChildEnterpriseList = res.result;
                } else {
                    this.ChildEnterpriseList = [];
                }
            });
        },

        // 添加数据
        AddSynchronization() {
            this.LoadingAdd = true;
            // 提交请求前，表单预验证
            this.$refs.addSynchronizationRef.validate(async (valid, object) => {
                // 表单预校验失败
                if (!valid) {
                    this.LoadingAdd = false;
                    return;
                } else {
                    var addparameter = {
                        EnterPriseCodeArray: this.AddSynchronizationForm.EnterPriseCode,
                    };
                    AddSynchronization(addparameter).then((res) => {
                        this.LoadingAdd = false;
                        if (res.success) {
                            this.$message.success("添加成功");
                            this.addSynchronizationVisible = false;
                            this.GetSynchronizationList();
                        } else {
                            this.$message.error(res.resultMessage);
                        }
                    });
                }
            });
        },
        // 添加窗口关闭
        detailAddDialogVisibleClosed() {
            // 初始化data-AddSynchronizationForm 的数据
            this.$data.AddSynchronizationForm = this.$options.data().AddSynchronizationForm;
            this.$refs.addSynchronizationRef.resetFields();
        },
        // 弹出添加窗口(修改需要传入参数)
        showContractorDialog() {
            this.addSynchronizationVisible = true;
        },

        // 监听 pagesize改变的事件
        handleSizeChange(newSize) {
            this.WhereParameter.PageSize = newSize;
            this.GetSynchronizationList(); scrollTo(0, 800)
        },
        // 监听 页码值 改变事件
        handleCurrentChange(newSize) {
            this.WhereParameter.PageIndex = newSize;
            this.GetSynchronizationList(); scrollTo(0, 800)
        },

        GetAdmin_PermissionSearch() {
            this.WhereParameter.PageIndex = 1;
            this.WhereParameter.PageSize = 20;
            this.GetSynchronizationList();
        },
        // 获取员工方案列表数据
        GetSynchronizationList() {
            this.loading = true;
            var parameter = {
                ParentCode: this.WhereParameter.ParentCode,
                PageIndex: this.WhereParameter.PageIndex,
                PageSize: this.WhereParameter.PageSize,
            }
            GetSynchronizationList(
                parameter
            ).then((res) => {
                if (res.success) {
                    this.SynchronizationList = res.result.data;
                    this.total = res.result.count;
                } else {
                    this.SynchronizationList = [];
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
