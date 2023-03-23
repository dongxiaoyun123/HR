<template>
  <div>
    <!-- <el-badge :is-dot="true" style="line-height: 25px;margin-top: -5px;" @click.native="dialogTableVisible=true"> -->
      <!-- <el-button style="padding: 8px 10px;"  type="danger"> -->
        <svg-icon icon-class="question"  @click.native="dialogTableVisible=true"/>
      <!-- </el-button> -->
    <!-- </el-badge> -->

    <el-dialog :visible.sync="dialogTableVisible" top="5vh" width="80%" append-to-body>
      <!-- <div slot="title">
        <span style="padding-right: 10px;">Error Log</span>
        <el-button size="mini" type="primary" icon="el-icon-delete" @click="clearAll">Clear All</el-button>
      </div> -->
      <el-table :data="MessageLogList" border height="calc(100vh - 180px)">
        <el-table-column label="疑难问题">
          <template slot-scope="{row}">
            <div class="divClass">
              <span class="message-title">菜单名称：</span>
              <el-tag type="primary">
                {{ row.MenuName }}
              </el-tag>
            </div>
            <div class="divClass">
              <span class="message-title">问题描述：</span>
              <el-tag type="danger">
                {{ row.ProblemDescription }}
              </el-tag>
            </div>
            <div class="divClass">
              <span class="message-title">结果反馈：</span>
              <el-tag v-if="row.ResultFeedback=='已解决'" type="success">
                {{ row.ResultFeedback }}
              </el-tag>
              <el-tag v-else type="warning">
                {{ row.ResultFeedback }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="解决方案">
          <template slot-scope="scope">
            {{ scope.row.Solution }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>

import {
  GetMessageLog
} from "@/api/hrmain";
export default {
  name: 'ErrorLog',
  data() {
    return {
      dialogTableVisible: false,
      MessageLogList:[],
    }
  },
  computed: {
    errorLogs() {
      return this.$store.getters.errorLogs
    }
  },
  methods: {
    clearAll() {
      this.dialogTableVisible = false
      this.$store.dispatch('errorLog/clearErrorLog')
    },
        //获取数据
        GetMessageLog() {
          GetMessageLog().then((res) => {
                if (res.success) {
                    this.MessageLogList = res.result;
                } else {
                    this.MessageLogList = [];
                }
            });
        },
  },
      mounted() {
        this.GetMessageLog();

    },
}
</script>

<style scoped>
.message-title {
  font-size: 13px;
  color: #333;
  font-weight: bold;
  padding-right: 8px;
}
.divClass{
  margin: 10px 0;
}
</style>
