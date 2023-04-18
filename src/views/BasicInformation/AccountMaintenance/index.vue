<template>
    <div style="margin:8px">
        <el-card style="padding-bottom:20px ;">
            <el-form label-width="90px">
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
                                <el-select @change="GetEnterpriseInfo" class="whereClass"
                                    v-model="WhereParameter.EnterPriseCode" filterable placeholder="付款方">
                                    <el-option v-for="item in ChildEnterpriseList" :key="item.EnterPriseCode"
                                        :label="item.EnterPriseName" :value="item.EnterPriseCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-button :disabled="ReadOnly" style="margin-left: 2rem;" type="primary" :loading="LoadingAdd"
                                @click="UpdateEnterpriseManage">保
                                存</el-button>
                        </el-col>
                    </el-row>
                </el-row>
            </el-form>
        </el-card>

        <el-form v-loading="loading" style="width: 100%;" :model="EnterpriseManage" ref="EnterpriseManageRef"
            :rules="EnterpriseManageRules" label-width="120px">
            <el-card style="margin-top:8px ;">
                <div slot="header" class="clearfix">
                    <span>基本资料</span>
                </div>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="企业名称" prop="EnterPriseName">
                            <el-input v-model="EnterpriseManage.EnterPriseName" placeholder="企业名称" disabled=""></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系电话" prop="EnterPrisePhone">
                            <el-input v-model="EnterpriseManage.EnterPrisePhone" placeholder="联系电话" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="电子邮箱" prop="EnterPriseEmail">
                            <el-input v-model="EnterpriseManage.EnterPriseEmail" placeholder="电子邮箱" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="联系地址" prop="EnterPriseAddress">
                            <el-input v-model="EnterpriseManage.EnterPriseAddress" placeholder="联系地址" clearable></el-input>
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
                        <el-form-item label="统一信用代码" prop="UnifiedSocialCreditCode">
                            <el-input v-model="EnterpriseManage.UnifiedSocialCreditCode" placeholder="统一信用代码"
                                clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="组织机构代码" prop="OrganizationCode">
                            <el-input v-model="EnterpriseManage.OrganizationCode" placeholder="组织机构代码" clearable></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-card>
            <el-card style="margin-top:-1px ;">
                <div slot="header" class="clearfix">
                    <span>方案信息</span>
                </div>
                <el-row>
                    <el-col :span="4" v-for="item in EnterpriseManage.Children" :key="item.ProgramCode">
                        <el-tag style="margin-bottom: 18px;" :type="item.Type">{{ item.ProgramName }}</el-tag>
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
    UpdateEnterpriseAndUserpwd,
    GetEnterpriseInfo,
} from "@/api/hrmain";
export default {
    components: {
    },
    data() {
        // 自定义手机号规则
        const checkMobile = (rule, value, callback) => {
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
        const checkEmail = (rule, value, callback) => {
            if (!value) {
                return callback();
            }
            else {
                const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
                setTimeout(() => {
                    if (mailReg.test(value)) {
                        callback();
                    } else {
                        callback(new Error("请输入正确的邮箱格式"));
                    }
                }, 100);
            }
        };
        return {
            ReadOnly: false,//演示人员不能操作数据
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
            AccountOpenTypeArray: [],
            WhereParameter: {
                ParentEnterPriseCode: '',
                EnterPriseCode: '',
            },
            loading: true,
            EnterpriseList: [],
            ChildEnterpriseList: [],
            EnterpriseManageRules: {
                EnterPrisePhone: [
                    { required: false, message: "", trigger: "blur", validator: checkMobile, },
                ],
                EnterPriseEmail: [
                    { required: false, message: "", trigger: "blur", validator: checkEmail, },
                ],
                UnifiedSocialCreditCode: [
                    { required: true, message: "请输入统一信用代码", trigger: "blur" },
                ],
                OrganizationCode: [
                    { required: true, message: "请输入组织机构代码", trigger: "blur" },
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
                        EnterPrisePhone: this.EnterpriseManage.EnterPrisePhone,
                        EnterPriseEmail: this.EnterpriseManage.EnterPriseEmail,
                        EnterPriseAddress: this.EnterpriseManage.EnterPriseAddress,
                        UnifiedSocialCreditCode: this.EnterpriseManage.UnifiedSocialCreditCode,
                        OrganizationCode: this.EnterpriseManage.OrganizationCode,
                    };
                    UpdateEnterpriseAndUserpwd(parameter).then((res) => {
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
                        this.GetEnterpriseInfo();
                    }
                } else {
                    this.ChildEnterpriseList = [];
                }
            });
        },
        //根据分公司获取改公司下所有公司配置数据
        GetEnterpriseInfo() {
            this.$refs.EnterpriseManageRef.resetFields();
            this.loading = true;
            GetEnterpriseInfo(this.WhereParameter.EnterPriseCode).then((res) => {
                if (res.success) {
                    this.ManageSettingsData = res.result;
                    if (res.result) {
                        this.EnterpriseManage.EnterPriseName = res.result.EnterPriseName;
                        this.EnterpriseManage.EnterPrisePhone = res.result.EnterPrisePhone;
                        this.EnterpriseManage.EnterPriseEmail = res.result.EnterPriseEmail;
                        this.EnterpriseManage.EnterPriseAddress = res.result.EnterPriseAddress;
                        this.EnterpriseManage.UnifiedSocialCreditCode = res.result.UnifiedSocialCreditCode;
                        this.EnterpriseManage.OrganizationCode = res.result.OrganizationCode;
                        // this.EnterpriseManage.Children = res.result.Children;

                        let types = [
                            '',
                            'success',
                            'info',
                            'warning',
                            'danger',
                        ];
                        this.EnterpriseManage.Children = [];
                        res.result.Children.forEach(element => {
                            var tagType = types[Math.floor(Math.random() * 5)]; //进行计算随机
                            let item = {
                                ProgramCode: element.ProgramCode,
                                ProgramName: element.ProgramName,
                                Type: tagType,
                            };
                            this.EnterpriseManage.Children.push(item);
                        });
                    }
                    else {
                        this.EnterpriseManage.EnterPriseName = '';
                        this.EnterpriseManage.EnterPrisePhone = '';
                        this.EnterpriseManage.EnterPriseEmail = '';
                        this.EnterpriseManage.EnterPriseAddress = '';
                        this.EnterpriseManage.UnifiedSocialCreditCode = '';
                        this.EnterpriseManage.OrganizationCode = '';
                        this.EnterpriseManage.Children = [];
                    }
                }
                this.loading = false;
            });
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