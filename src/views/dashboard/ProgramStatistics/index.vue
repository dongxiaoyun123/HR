<template>
  <div>
    <el-card class="box-card" style="height:515px;margin-top: 20px;">
      <div slot="header" class="clearfix">
        <span style="float: left;margin: 0;line-height: 2.2rem;">方案统计</span>
      </div>
      <el-skeleton style="width: 100%" :loading="loading" :rows="11" animated>
        <el-table :data="ProgramList" size="small" max-height="412px" border>
          <el-table-column prop="ProgramName" label="方案名称" min-width="250"></el-table-column>
          <el-table-column prop="Children" label="在保人数" sortable min-width="100">
          </el-table-column>
          <el-table-column prop="AllChildren" label="导入人数" sortable min-width="100">
          </el-table-column>
        </el-table>
      </el-skeleton>
    </el-card>
  </div>
</template>
<script>

import {
  GetProgramInfoAll,
} from "@/api/dashboard";
export default {
  data() {
    return {
      IfClearableEnterprise: this.$store.getters.ParentCode ? false : true,
      ProgramList: [],
      loading: false,
    };
  },
  methods: {
    //根据分公司获取改公司下所有公司配置数据
    GetProgramInfoAll() {
      this.loading = true;
      var parameter = {
        ParentEnterPriseCode: this.WhereParameter.ParentEnterPriseCode,
        EnterPriseCode: this.WhereParameter.EnterPriseCode,
      }
      if (!this.IfClearableEnterprise) {
        if (!this.WhereParameter.EnterPriseCode)
          return;
      }
      GetProgramInfoAll(parameter).then((res) => {
        this.loading = false;
        if (res.success) {
          this.ProgramList = res.result;
        }
        else {
          this.$message.error("获取失败");
        }
      });
    },
  },
  //父组件传过来的数据
  props: {
    WhereParameter: {
      type: Object
    },
  },
  watch: {
    WhereParameter: {
      handler() {
        this.GetProgramInfoAll();
      },
      deep: true,  // 可以深度检测到 obj 对象的属性值的变化
    },
  },
  created() {

  },
};
</script>
  
<style  scoped>
::v-deep .el-card__header {
  padding: 10px 20px
}


::v-deep .el-table {
  margin-top: 0
}
</style>