<template>
  <div>
    <svg-icon style="font-size:16px ;" icon-class="pdf" @click="openpdf" />
    <el-dialog append-to-body :visible="isshowpdf" width="80%" top="5vh" @close="isshowpdf = false">
      <iframe v-if="rolesFlag && (rolesFlag[0] == 1 || rolesFlag[0] == 2 || rolesFlag[0] == 7)" style="width: 100%; height: calc(100vh - 200px);"
              :src="srcEnterprise"
      />
      <iframe v-else style="width: 100%; height: calc(100vh - 200px);" :src="src" />
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      src: '/static/HR保险管理系统操作手册2023v2.0.pdf',
      srcEnterprise: '/static/企业HR保险管理系统操作手册2023v2.0.pdf',
      isshowpdf: false,
      rolesFlag: this.$store.getters.roles,
    }
  },
  methods: {
    openpdf() {
      this.isshowpdf = true
    }
  }
}
</script>
<style scoped></style>

