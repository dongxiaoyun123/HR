<template>
    <div style="margin:8px">
        <el-card>
            <el-form label-width="100px">
                <el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item style="margin-bottom: 0;" label="合同方">
                                <el-select class="whereClass" v-model="WhereParameter.ParentEnterPriseCode" filterable
                                    placeholder="合同方" @change="GetChildUser">
                                    <el-option v-for="item in EnterpriseList" :key="item.ParentEnterPriseCode"
                                        :label="item.ParentEnterPriseName" :value="item.ParentEnterPriseCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item style="margin-bottom: 0;" label="付款方">
                                <el-select @change="GetManageSettings" class="whereClass"
                                    v-model="WhereParameter.EnterPriseCode" filterable placeholder="付款方">
                                    <el-option v-for="item in ChildEnterpriseList" :key="item.EnterPriseCode"
                                        :label="item.EnterPriseName" :value="item.EnterPriseCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-button :disabled="ReadOnly" style="margin-left: 2rem;" type="primary" :loading="LoadingAdd"
                                @click="UpdateEnterpriseManage">保
                                存</el-button>

                        </el-col>
                    </el-row>
                </el-row>
            </el-form>
        </el-card>

        <el-form v-loading="loading" style="width: 100%;" :model="EnterpriseManage" ref="EnterpriseManageRef"
            :rules="EnterpriseManageRules" label-width="100px">
            <el-card style="margin-top:8px ;">
                <div slot="header" class="clearfix">
                    <span>收款账户</span>
                </div>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="开户类型" prop="AccountOpenType">
                            <el-select class="rangeTimeClass" v-model="EnterpriseManage.AccountOpenType" filterable
                                placeholder="开户类型">
                                <el-option v-for="item in AccountOpenTypeArray" :key="item.ConfigValue"
                                    :label="item.ConfigName" :value="item.ConfigValue">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="账户姓名" prop="AccountName">
                            <el-input v-model="EnterpriseManage.AccountName" placeholder="账户姓名" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="收款账户" prop="CollectionAccount">
                            <el-input @input="GetBank" v-model="EnterpriseManage.CollectionAccount" placeholder="收款账户"
                                clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="EnterpriseManage.AccountOpenType != 2">
                        <el-form-item label="开户网点" prop="OpeningBranch">
                            <el-input v-model="EnterpriseManage.OpeningBranch" placeholder="开户网点" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8" v-if="EnterpriseManage.AccountOpenType != 2">
                        <el-form-item label="银行名称" prop="BankName">
                            <el-input v-model="EnterpriseManage.BankName" placeholder="银行名称" readonly></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
            <el-card style="margin-top:-1px ;">
                <div slot="header" class="clearfix">
                    <span>发票抬头</span>
                </div>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="公司名称" prop="CompanyName">
                            <el-input v-model="EnterpriseManage.CompanyName" placeholder="公司名称" clearable></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
            <el-card style="margin-top:-1px ;">
                <div slot="header" class="clearfix">
                    <span>收件地址</span>
                </div>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="联系人" prop="ContactPerson">
                            <el-input v-model="EnterpriseManage.ContactPerson" placeholder="联系人" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系方式" prop="Phone">
                            <el-input v-model="EnterpriseManage.Phone" placeholder="联系方式" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="所在地区" prop="LocationRegion">
                            <el-cascader class="rangeTimeClass" @change="handleChange" :options="options"
                                v-model="EnterpriseManage.LocationRegion" clearable filterable>
                            </el-cascader>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="详细地址" prop="DetailedAddress">
                            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }"
                                v-model="EnterpriseManage.DetailedAddress" placeholder="详细地址" clearable></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
        </el-form>


    </div>
</template>
<script>
import moment from "moment";
moment.locale("zh-cn");
import {
    GetEnterpriseList,
    GetChildUser,
    GetDataConfigData,
    GetManageSettings,
    AddOrUpdateManageSettings,
} from "@/api/hrmain";
import { regionData } from 'element-china-area-data'
export default {
    components: {
    },
    data() {
        //身份证检验规则
        var checkCollectionAccount = (rule, value, callback) => {
            if (value) {
                //只检验证件类型是身份证的
                if (this.EnterpriseManage.AccountOpenType == 1) {
                    if (!this.EnterpriseManage.BankName)
                        return callback(new Error("收款账户输入有误，请检查"));
                    else {
                        return callback();
                    }
                } else {
                    const regMobile = /^1[34578]\d{9}$/;
                    if (regMobile.test(this.EnterpriseManage.CollectionAccount)) {
                        return callback();
                    } else
                        return callback(new Error("收款账户输入有误，请检查"));
                }
            }
            else
                return callback();

        };
        // 自定义手机号规则
        var checkMobile = (rule, value, callback) => {
            if (value) {
                const regMobile = /^1[34578]\d{9}$/;
                if (regMobile.test(value)) {
                    return callback();
                }
                return callback(new Error("请输入正确的手机号码"));
            } else {
                return callback();
            }
        };
        return {
            ReadOnly: false,//演示人员不能操作数据
            AccountOpenTypeArray: [],
            LoadingAdd: false,
            options: regionData,
            EnterpriseManage: {
                AccountOpenType: '',
                AccountName: '',
                CollectionAccount: '',
                OpeningBranch: '',
                BankName: '',
                CompanyName: '',
                ContactPerson: '',
                Phone: '',
                LocationRegion: [],
                DetailedAddress: '',
                LocationRegionArray: [],
            },
            AccountOpenTypeArray: [],
            WhereParameter: {
                ParentEnterPriseCode: '',
                EnterPriseCode: '',
            },
            loading: true,
            EnterpriseList: [],
            ChildEnterpriseList: [],
            EnterpriseManageRules: {
                CompanyName: [
                    { required: true, message: "请输入公司名称", trigger: "blur" },
                ],
                AccountOpenType: [
                    { required: true, message: "请选择开户类型", trigger: "change" },
                ],
                CollectionAccount: [
                    { required: false, message: "", trigger: "blur", validator: checkCollectionAccount, },
                ],
                Phone: [
                    { required: false, message: "", trigger: "blur", validator: checkMobile, },
                ],

            },
        };
    },
    methods: {
        UpdateEnterpriseManage() {
            this.LoadingAdd = true;
            // 提交请求前，表单预验证
            this.$refs.EnterpriseManageRef.validate(async (valid, object) => {
                // 表单预校验失败
                if (!valid) {
                    this.LoadingAdd = false;
                    return;
                } else {
                    var parameter = {
                        EnterPriseCode: this.WhereParameter.EnterPriseCode,
                        AccountOpenType: this.EnterpriseManage.AccountOpenType,
                        AccountName: this.EnterpriseManage.AccountName,
                        CollectionAccount: this.EnterpriseManage.CollectionAccount,
                        OpeningBranch: this.EnterpriseManage.OpeningBranch,
                        BankName: this.EnterpriseManage.BankName,
                        CompanyName: this.EnterpriseManage.CompanyName,
                        ContactPerson: this.EnterpriseManage.ContactPerson,
                        Phone: this.EnterpriseManage.Phone,
                        LocationRegionArray: this.EnterpriseManage.LocationRegion,
                        DetailedAddress: this.EnterpriseManage.DetailedAddress,
                    };
                    AddOrUpdateManageSettings(parameter).then((res) => {
                        this.LoadingAdd = false;
                        if (res.success) {
                            this.$message.success("操作成功");
                        } else {
                            this.$message.error("操作失败");
                        }
                    });
                }
            });
        },
        GetBank() {
            this.$getBankcardinfo.getBankBin(this.EnterpriseManage.CollectionAccount, (err, data) => {
                if (!err) {
                    
                    this.EnterpriseManage.BankName = data.bankName;
                }
                else
                    this.EnterpriseManage.BankName = '';
            })
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
                        this.GetManageSettings();
                    }
                } else {
                    this.ChildEnterpriseList = [];
                }
            });
        },
        //根据分公司获取改公司下所有公司配置数据
        GetManageSettings() {
            this.$refs.EnterpriseManageRef.resetFields();
            this.loading = true;
            GetManageSettings(this.WhereParameter.EnterPriseCode).then((res) => {
                if (res.success) {
                    this.ManageSettingsData = res.result;
                    if (res.result) {
                        this.EnterpriseManage.AccountOpenType = res.result.AccountOpenType + '';
                        this.EnterpriseManage.AccountName = res.result.AccountName;
                        this.EnterpriseManage.CollectionAccount = res.result.CollectionAccount;
                        this.EnterpriseManage.OpeningBranch = res.result.OpeningBranch;
                        this.EnterpriseManage.BankName = res.result.BankName;
                        this.EnterpriseManage.CompanyName = res.result.CompanyName;
                        this.EnterpriseManage.ContactPerson = res.result.ContactPerson;
                        this.EnterpriseManage.Phone = res.result.Phone;
                        this.EnterpriseManage.LocationRegion = res.result.LocationRegion;
                        this.EnterpriseManage.DetailedAddress = res.result.DetailedAddress;
                        this.EnterpriseManage.LocationRegion = [];
                        res.result.LocationRegion.split(',').forEach(element => {
                            this.EnterpriseManage.LocationRegion.push(element);
                        });
                    }
                    else {
                        this.EnterpriseManage.AccountOpenType = '';
                        this.EnterpriseManage.AccountName = '';
                        this.EnterpriseManage.CollectionAccount = '';
                        this.EnterpriseManage.OpeningBranch = '';
                        this.EnterpriseManage.BankName = '';
                        this.EnterpriseManage.CompanyName = '';
                        this.EnterpriseManage.ContactPerson = '';
                        this.EnterpriseManage.Phone = '';
                        this.EnterpriseManage.LocationRegion = [];
                        this.EnterpriseManage.DetailedAddress = '';
                    }
                }
                this.loading = false;
            });
        },
        //行政区选择事件
        handleChange(value) {
            this.AddEnterpriseFrom.EnterpriseCityArray = value;
        },
        GetDataConfigData() {
            //获取配置下拉数据
            GetDataConfigData().then((res) => {
                if (res.success) {
                    this.AccountOpenTypeArray = res.result.filter((item) => {
                        return item.DataTypes == "AccountOpenType";
                    });
                    // this.EnterpriseManage.AccountOpenType = this.AccountOpenTypeArray[0].ConfigValue;
                } else {
                    this.AccountOpenTypeArray = [];
                }
            });
        },
    },
    created() { },
    //加载完成后执行调取回款数据接口
    mounted() {
        if (this.$store.getters.roles.indexOf(7) != -1)
            this.ReadOnly = true
        this.GetDataConfigData();
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
</style>