<template>
  <div style="margin:8px">
    <el-card style="padding-bottom:20px ;">
      <el-form label-width="90px">
        <el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 0;" label="合同方">
                <el-select v-model="WhereParameter.ParentEnterPriseCode" class="whereClass" filterable
                           placeholder="合同方" @change="GetChildUser"
                >
                  <el-option v-for="item in EnterpriseList" :key="item.ParentEnterPriseCode"
                             :label="item.ParentEnterPriseName" :value="item.ParentEnterPriseCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 0;" label="付款方">
                <el-select v-model="WhereParameter.EnterPriseCode" class="whereClass"
                           filterable placeholder="付款方" :clearable="IfClearableEnterprise"
                           @change="GetInsvCount"
                >
                  <el-option v-for="item in ChildEnterpriseList" :key="item.EnterPriseCode"
                             :label="item.EnterPriseName" :value="item.EnterPriseCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
      </el-form>
    </el-card>
    <el-row v-loading="loading" :gutter="8" style="min-height: calc(100vh - 200px);">
      <el-col v-for="item in StatisticsData" :key="item.CorpName" :span="8" style="margin-top: 8px;">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ item.CorpName }}</span>
          </div>
          <el-table style="margin-bottom:18px ;" :data="item.objlist" border>
            <el-table-column prop="MonthName" label="月份">
              <template slot-scope="scope">
                <i class="el-icon-time" />
                <span style="margin-left: 10px">{{ scope.row.MonthName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="AllCount" label="投保人数" />
            <el-table-column prop="ReltnAllCount" label="连带人数" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import moment from "moment";
moment.locale("zh-cn");
import {
    GetEnterpriseList,
    GetChildUser,
} from "@/api/hrmain";
import {
    GetInsvCount,
} from "@/api/hrstatistics";
export default {
  name:'StatisticsInsuredPersonnel',
    components: {
    },
    data() {
        return {
            IfClearableEnterprise: !this.$store.getters.ParentCode,
            StatisticsData: [],
            AccountOpenTypeArray: [],
            LoadingAdd: false,
            EnterpriseManage: {
                EnterPriseName: '',
                EnterPrisePhone: '',
                EnterPriseEmail: '',
                EnterPriseAddress: '',
                UnifiedSocialCreditCode: '',
                OrganizationCode: '',
                Children: [],
            },
            WhereParameter: {
                ParentEnterPriseCode: '',
                EnterPriseCode: '',
            },
            EnterpriseList: [],
            ChildEnterpriseList: [],
            loading: false,
        };
    },
    computed: {

    },
    created() { },
    // 加载完成后执行调取回款数据接口
    mounted() {
        this.GetEnterpriseList();
    },
    methods: {
        GetEnterpriseList() {
            // 传入vuex存储的值
            GetEnterpriseList().then((res) => {
                if (res.success) {
                    // 过滤掉自主增减的公司

                    this.EnterpriseList = res.result.filter((item) => { return item.MenuPermissions != 1 });
                    // 如果有数据那么赋个默认的值
                    if (this.EnterpriseList.length > 0) {
                        this.WhereParameter.ParentEnterPriseCode = this.EnterpriseList[0].ParentEnterPriseCode;
                        this.GetChildUser(this.EnterpriseList[0].ParentEnterPriseCode);
                    }
                } else {
                    this.EnterpriseList = [];
                }
            });
        },
        // 根据父级公司获取分公司
        GetChildUser(ParentEnterPriseCode) {
            this.WhereParameter.EnterPriseCode = '';
            GetChildUser(ParentEnterPriseCode).then((res) => {
                if (res.success) {
                    this.ChildEnterpriseList = res.result;
                    if (this.ChildEnterpriseList.length > 0) {
                        // 如果是合同方直接查询全部数据
                        if (!this.IfClearableEnterprise) { this.WhereParameter.EnterPriseCode = this.ChildEnterpriseList[0].EnterPriseCode; }
                        this.GetInsvCount();
                    }
                } else {
                    this.ChildEnterpriseList = [];
                }
            });
        },
        // 根据分公司获取改公司下所有公司配置数据
        GetInsvCount() {
            // //由于区域不确定，所以这里采用整页加载的方式
            // const loading = this.$loading({
            //     lock: true,
            //     text: 'Loading',
            //     spinner: 'el-icon-loading',
            //     background: 'rgba(0, 0, 0, 0.7)'
            // });
            this.loading = true;
            GetInsvCount(this.WhereParameter.ParentEnterPriseCode, this.WhereParameter.EnterPriseCode).then((res) => {
                this.loading = false;
                if (res.success) {
                    if (res.result) {
                        this.StatisticsData = res.result;
                    } else {
                        this.StatisticsData = [];
                        this.$message.error("获取数据失败");
                    }
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
    margin-bottom: 5px;
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

.el-card.is-always-shadow {
    box-shadow: 0 0px 0px 0 rgb(0 0 0 / 10%);
}

::v-deep .el-card__body {
    padding: 20px 20px 0 20px;
}
</style>
