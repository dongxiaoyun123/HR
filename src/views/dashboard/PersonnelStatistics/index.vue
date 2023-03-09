<template>
  <el-row :gutter="20" class="panel-group">

    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">

      <div class="card-panel">

        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="AddStaff" class-name="card-panel-icon" />
        </div>

        <div class="card-panel-description">
          <div class="card-panel-text">
            全部导入员工
          </div>
          <count-to :start-val="0" :end-val="allUnderInsuranceCount" :duration="2600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="AddStaffOnline" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            当前在保
          </div>
          <count-to :start-val="0" :end-val="underInsurance" :duration="3000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="AddRelation" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            全部导入连带
          </div>
          <count-to :start-val="0" :end-val="allRelatedCount" :duration="3200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="AddRelationOnline" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            连带在保
          </div>
          <count-to :start-val="0" :end-val="underInsuranceAllrelated" :duration="3600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import {
  GetStaffCount,
} from "@/api/dashboard";
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      IfClearableEnterprise: this.$store.getters.ParentCode ? false : true,
      allUnderInsuranceCount: null,//全部
      underInsurance: null,//在保人员
      allRelatedCount: null,//全部连带
      underInsuranceAllrelated: null,//连带在保
      loading: false
    };
  },
  methods: {
    //根据分公司获取改公司下所有公司配置数据
    GetStaffCount() {
      this.loading = true;
      var parameter = {
        ParentEnterPriseCode: this.WhereParameter.ParentEnterPriseCode,
        EnterPriseCode: this.WhereParameter.EnterPriseCode,
      }
      if (!this.IfClearableEnterprise) {
        if (!this.WhereParameter.EnterPriseCode)
          return;
      }
      GetStaffCount(parameter).then((res) => {
        this.loading = false;
        if (res.success) {
          this.allUnderInsuranceCount = res.result.allUnderInsuranceCount;//全部
          this.underInsurance = res.result.underInsurance;//在保人员
          this.allRelatedCount = res.result.allRelatedCount;//全部连带
          this.underInsuranceAllrelated = res.result.underInsuranceAllrelated;//连带在保
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
        this.GetStaffCount();
      },
      deep: true,  // 可以深度检测到 obj 对象的属性值的变化
    },
  },
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 20px;

  // .card-panel-col {
  //   margin-bottom: 32px;
  // }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #1890FF;
      }

      .icon-message {
        background: #13CE66;
      }

      .icon-money {
        background: #FFBA00;
      }

      .icon-shopping {
        background: #FF5E5E
      }
    }

    .icon-people {
      color: #1890FF;
    }

    .icon-message {
      color: #13CE66;
    }

    .icon-money {
      color: #FFBA00;
    }

    .icon-shopping {
      color: #FF5E5E
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 23px 0 0 23px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 30px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
