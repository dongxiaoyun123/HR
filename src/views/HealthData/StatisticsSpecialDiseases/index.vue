<template>
    <div style="margin:8px">
        <el-card>
            <el-form label-width="100px">
                <el-row>
                    <el-row>
                        <el-col :span="6">
                            <el-form-item style="margin-bottom: 0;" label="合同方">
                                <el-select class="whereClass" v-model="WhereParameter.ConID" filterable placeholder="合同方"
                                    @change="GetChildUser">
                                    <el-option v-for="item in EnterpriseList" :key="item.ConID"
                                        :label="item.ParentEnterPriseName" :value="item.ConID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item style="margin-bottom: 0;" label="付款方">
                                <el-select @change="GetillnesslistNew" class="whereClass" v-model="WhereParameter.CorpID"
                                    filterable placeholder="付款方" :clearable='IfClearableEnterprise'>
                                    <el-option v-for="item in ChildEnterpriseList" :key="item.CorpID"
                                        :label="item.EnterPriseName" :value="item.CorpID">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-row>
            </el-form>
        </el-card>
        <el-row :gutter="8" style="margin-top: 8px;">
            <el-col :span="12">
                <el-card>
                    <div class="grid-content">
                        <el-skeleton style="width: 100%" :loading="loading" :rows="20" animated>
                            <el-table :data="StatisticsSpecialDiseasesData" border height="100%">
                                <el-table-column prop="IllnessName" label="疾病类型" show-overflow-tooltip min-width="50">
                                </el-table-column>
                                <el-table-column prop="nameChildren" label="患者" show-overflow-tooltip min-width="250">
                                </el-table-column>
                            </el-table>
                        </el-skeleton>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import moment from "moment"; //导入模块
moment.locale("zh-cn");
import {
    GetEnterpriseList,
    GetChildUserConId,
} from "@/api/hrmain";
import {
    GetillnesslistNew
} from "@/api/hrstatistics";

export default {
    components: {
    },
    data() {
        return {
            IfClearableEnterprise: this.$store.getters.ParentCode ? false : true,
            ChildEnterpriseList: [],
            EnterpriseList: [],
            WhereParameter: {
                ConID: '',
                CorpID: null,
                CreateTime: [],
                BeginTime: '',
                EndTime: '',
            },
            StatisticsSpecialDiseasesData: [],
            count: 0,
            loading: false,
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
        datetimeChange(time) {
            //强制刷新
            this.$forceUpdate();
        },
        //如果登陆人是客服，那么获取公司列表
        GetEnterpriseList() {
            // 传入vuex存储的值
            GetEnterpriseList().then((res) => {
                if (res.success) {
                    this.EnterpriseList = res.result.filter((item) => { return item.MenuPermissions != 1 });
                    //如果有数据那么赋个默认的值
                    if (this.EnterpriseList.length > 0) {
                        this.WhereParameter.ConID = this.EnterpriseList[0].ConID;
                        this.GetChildUser();
                    }
                } else {
                    this.EnterpriseList = [];
                }
            });
        },
        //根据父级公司获取分公司
        GetChildUser() {
            this.WhereParameter.CorpID = null;
            GetChildUserConId(this.WhereParameter.ConID).then((res) => {
                if (res.success) {
                    this.ChildEnterpriseList = res.result;
                    if (this.ChildEnterpriseList.length > 0) {
                        //如果是合同方直接查询全部数据
                        if (!this.IfClearableEnterprise)
                            this.WhereParameter.CorpID = this.ChildEnterpriseList[0].CorpID;
                        this.GetillnesslistNew();
                    }
                } else {
                    this.ChildEnterpriseList = [];
                }
            });
        },
        //获取列表数据
        GetillnesslistNew() {
            this.loading = true;
            if (this.WhereParameter.CreateTime && this.WhereParameter.CreateTime.length > 0) {
                this.WhereParameter.BeginTime = this.$moment(this.WhereParameter.CreateTime[0]).format("YYYY-MM-DD");
                this.WhereParameter.EndTime = this.$moment(this.WhereParameter.CreateTime[1]).format("YYYY-MM-DD");
            }
            else {
                this.WhereParameter.BeginTime = '';
                this.WhereParameter.EndTime = '';
            }
            var parameter = {
                ConID: this.WhereParameter.ConID,
                CorpID: this.WhereParameter.CorpID,
                BeginTime: this.WhereParameter.BeginTime,
                EndTime: this.WhereParameter.EndTime,
            }
            GetillnesslistNew(parameter).then((res) => {
                this.loading = false;
                if (res.success) {
                    this.StatisticsSpecialDiseasesData = res.result.lists;
                }
            });
        },
    },
    created() {

    },
    //加载完成后执行调取回款数据接口
    mounted() {
        var now = new Date();
        var year = now.getFullYear(); //得到年份
        this.WhereParameter.CreateTime = [moment(`${year}-01-01`), moment(now)];
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

.grid-content {
    border-radius: 4px;
    height: calc(100vh - 230px);
}

.ContentClass {
    width: 100%;
    height: 100%;
}

.rangeTimeClass {
    width: 100%;
}
</style>
<style>
.map {
    width: 100%;
    height: calc(100vh - 230px);
    display: inline-block;
}
</style>