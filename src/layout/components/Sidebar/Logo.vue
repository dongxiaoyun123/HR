<template>
  <div class="sidebar-logo-container" :class="{ 'collapse': collapse }">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 v-else class="sidebar-title">{{ title }} </h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 class="sidebar-title">{{ title }} </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
import yuanfu from '@/assets/i-mages/logo.png';
import xinyazhong from '@/assets/i-mages/xinyazhongLogo.png';
import zhiweijia from '@/assets/i-mages/zhiweijiaLogo.png';
import kangkang from '@/assets/i-mages/kangkangLogo.png';
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: 'HR保险管理系统V2.0',
      logo: yuanfu,
      // link: this.$store.getters.MenuPermissions == 2 ? 'InsuranceServices/StatisticsInsuredPersonnel' : 'UserHomePage/UserHomePageList',
    }
  },
  mounted() {
    var LogoCatch = window.localStorage.getItem('LogoCatch');
    switch (LogoCatch) {
      case "#/login":
        this.logo = yuanfu;
        break;
      case "#/loginxinyazhong":
        this.logo = xinyazhong;
        break;
      case "#/loginzhiweijia":
        this.logo = zhiweijia;
        break;
      case "#/loginkangkang":
        this.logo = kangkang;
        break;
    }
  },
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #FFFFFF;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 43px;
      height: 43px;
      vertical-align: middle;
      margin-bottom: 3px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #00A0E9;
      font-weight: 600;
      line-height: 50px;
      font-size: 15px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
