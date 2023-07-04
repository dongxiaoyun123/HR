<template>
  <div style="margin:8px">
    <el-card>
      <el-form label-width="90px">
        <el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 0;" label="客服人员">
                <el-select v-model="WhereParameter.User_ID" style="width:100% ;" filterable
                           placeholder="客服人员" clearable
                >
                  <el-option v-for="item in BackstageUserList" :key="item.User_ID"
                             :label="item.User_RealName" :value="item.User_ID"
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
      <el-table v-loading="loading" highlight-current-row :data="BackstageRegionList" fit>
        <el-table-column prop="User_Account" label="登录名" width="150" show-overflow-tooltip />
        <el-table-column prop="User_RealName" label="真实姓名" width="150" show-overflow-tooltip />
        <el-table-column prop="EnterPriseName" label="公司名称" width="250" show-overflow-tooltip />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button icon="el-icon-delete" type="text" size="mini" @click="
              DeleteBackstageRegion(scope.row.EnterPriseCode, scope.row.User_ID)
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
    <el-dialog :visible.sync="addBackstageRegionVisible" top="5vh" width="45%" :lock-scroll="false"
               :append-to-body="true" @close="detailAddDialogVisibleClosed"
    >
      <!-- 上面两个属性用来重置滚动条 -->
      <div slot="title" class="dialog-title">
        <span>添加同步信息</span>
      </div>
      <el-form ref="addBackstageRegionRef" :model="AddBackstageRegionForm" :rules="addBackstageRegionRules"
               label-width="120px"
      >
        <el-form-item label="客服人员" prop="User_ID">
          <el-select v-model="AddBackstageRegionForm.User_ID" filterable placeholder="客服人员">
            <el-option v-for="item in BackstageUserList" :key="item.User_ID" :label="item.User_RealName"
                       :value="item.User_ID"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="合同方" prop="ParentCode">
          <el-select v-model="AddBackstageRegionForm.ParentCode" filterable placeholder="合同方" multiple>
            <el-option v-for="item in ParentContractorList" :key="item.EnterPriseCode"
                       :label="item.EnterPriseName" :value="item.EnterPriseCode"
            />
          </el-select>
        </el-form-item>
        <el-divider />
        <el-row class="buttonCenter">
          <el-col>
            <el-button type="primary" :loading="LoadingAdd" @click="AddBackstageRegion">保
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
    GetBackstageRegion,
    AddBackstageRegion,
    DeleteBackstageRegion,
    GetBackstageUserList,
    GetContractorList,
} from "@/api/hrmain";
export default {
    components: {
    },
    data() {
        return {
            ParentContractorList: [],
            BackstageUserList: [],
            ChildEnterpriseList: [],
            EnterpriseList: [],
            addBackstageRegionVisible: false,
            AddBackstageRegionForm: {
                User_ID: '',
                ParentCode: [],
            },
            WhereParameter: {
                User_ID: '',
                PageIndex: 1,
                PageSize: 20,
            },
            BackstageRegionList: [],
            total: 0,
            loading: false,
            LoadingAdd: false,
            addBackstageRegionRules: {
                User_ID: [
                    { required: true, message: "请选择客服人员", trigger: "change" },
                ],
                ParentCode: [
                    { required: true, message: "请选择付款方名称", trigger: "change" },
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
        this.GetBackstageUserList();
        this.ParentGetContractorList();
    },
    methods: {
        async DeleteBackstageRegion(ParentCode, UserID) {
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
                var addparameter = {
                    UserID,
                    ParentCode,
                };
                DeleteBackstageRegion(addparameter).then((res) => {
                    if (res.success) {
                        this.$message.success("删除成功");
                        this.GetBackstageRegion();
                    } else {
                        this.$message.error("删除失败");
                    }
                });
            }
        },
        // 添加数据
        AddBackstageRegion() {
            this.LoadingAdd = true;
            // 提交请求前，表单预验证
            this.$refs.addBackstageRegionRef.validate(async (valid, object) => {
                // 表单预校验失败
                if (!valid) {
                    this.LoadingAdd = false;
                    return;
                } else {
                    var addparameter = {
                        UserID: this.AddBackstageRegionForm.User_ID,
                        EnterPriseCodeArray: this.AddBackstageRegionForm.ParentCode,
                    };
                    AddBackstageRegion(addparameter).then((res) => {
                        this.LoadingAdd = false;
                        if (res.success) {
                            this.$message.success("添加成功");
                            this.addBackstageRegionVisible = false;
                            this.GetBackstageRegion();
                        } else {
                            this.$message.error(res.resultMessage);
                        }
                    });
                }
            });
        },
        // 添加窗口关闭
        detailAddDialogVisibleClosed() {
            // 初始化data-AddBackstageRegionForm 的数据
            this.$data.AddBackstageRegionForm = this.$options.data().AddBackstageRegionForm;
            this.$refs.addBackstageRegionRef.resetFields();
        },
        // 弹出添加窗口(修改需要传入参数)
        showContractorDialog() {
            this.addBackstageRegionVisible = true;
        },

        // 监听 pagesize改变的事件
        handleSizeChange(newSize) {
            this.WhereParameter.PageSize = newSize;
            this.GetBackstageRegion();
            scrollTo(0, 800)
        },
        // 监听 页码值 改变事件
        handleCurrentChange(newSize) {
            this.WhereParameter.PageIndex = newSize;
            this.GetBackstageRegion();
            scrollTo(0, 800)
        },

        GetAdmin_PermissionSearch() {
            this.WhereParameter.PageIndex = 1;
            this.WhereParameter.PageSize = 20;
            this.GetBackstageRegion();
        },
        // 获取员工方案列表数据
        GetBackstageRegion() {
            this.loading = true;
            var parameter = {
                UserID: this.WhereParameter.User_ID,
                PageIndex: this.WhereParameter.PageIndex,
                PageSize: this.WhereParameter.PageSize,
            }
            GetBackstageRegion(parameter).then((res) => {
                if (res.success) {
                    this.BackstageRegionList = res.result.data;
                    this.total = res.result.count;
                } else {
                    this.BackstageRegionList = [];
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
        // 获取hr人员列表
        GetBackstageUserList() {
            GetBackstageUserList().then((res) => {
                if (res.success) {
                    this.BackstageUserList = res.result;
                } else {
                    this.BackstageUserList = [];
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
