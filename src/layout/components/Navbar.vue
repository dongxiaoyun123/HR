<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container"
      @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
  
        <el-tooltip content="菜单搜索" effect="dark" placement="bottom">
          <search id="header-search" class="right-menu-item" />
        </el-tooltip>

        <error-log class="errLog-container right-menu-item hover-effect" />

        <el-tooltip content="全屏" effect="dark" placement="bottom">
          <screenfull id="screenfull" class="right-menu-item hover-effect" />
        </el-tooltip>

        <el-tooltip content="自定义尺寸" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
        <el-tooltip content="操作手册" effect="dark" placement="bottom">
          <OperationManual id="header-search" class="right-menu-item" />
        </el-tooltip>
      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" @command="
        (command) => {
          handleCommand(command);
        }
      ">

        <el-form  :inline="true" style="color: white;height: 50px;cursor: pointer;">
          <el-form-item>
            <div class="avatar-wrapper">
              <el-avatar size="medium" shape="circle" :src="userlogo">
              </el-avatar>
              <!-- <img :src="userlogo" class="user-avatar"> -->
            </div>
          </el-form-item>
          <el-form-item>
            <el-tooltip v-if="realname.length > 5" class="item" effect="dark" :content="realname" placement="left">
              <div
                style="width:80px;white-space: nowrap;text-overflow:ellipsis; overflow:hidden;color: black;height: 50px;line-height: 50px;">
                {{ realname }}</div>
            </el-tooltip>
            <div v-else
              style="width:80px;white-space: nowrap;text-overflow:ellipsis; overflow:hidden;color: black;height: 50px;line-height: 50px;">
              {{ realname }}</div>
          </el-form-item>
        </el-form>

        <el-dropdown-menu>
          <!-- <router-link to="/profile/index">
            <el-dropdown-item>Profile</el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>Dashboard</el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-element-admin/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item command="a">修改密码</el-dropdown-item>
          <el-dropdown-item command="b">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- 修改密码对话框 -->
      <el-dialog append-to-body title="修改密码" :visible.sync="updatePasswordVisible" top="15vh" width="30%"
        @close="dialogClosed">
        <!-- 内容主体 -->
        <el-form  :model="updatePassword" ref="updatePasswordRef" :rules="updatePasswordRules"
          label-width="100px">
          <el-form-item label="新密码" prop="User_Pwd">
            <el-input v-model="updatePassword.User_Pwd" show-password></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="ConfirmPassword">
            <el-input v-model="updatePassword.ConfirmPassword" show-password></el-input>
          </el-form-item>
        </el-form>
        <el-divider></el-divider>
        <el-row class="buttonCenter">
          <el-col>
            <el-button type="primary" :loading="UpdatePasswordLoading" @click="UpdatePasswordCommit" >
              确 定
            </el-button>
            <el-button @click="updatePasswordVisible = false" >取 消</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import OperationManual from '@/components/OperationManual'

import {
  UpdatePasswordCommit
} from "@/api/hrmain";
export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search,
    OperationManual
  },
  data() {
    return {
      updatePasswordVisible: false,
      updatePassword: {
        User_ID: "",
        User_Pwd: "",
        ConfirmPassword: "",
      },
      UpdatePasswordLoading: false,
      updatePasswordRules: {
        User_Pwd: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          {
            message:
              "密码格式不正确,应包含大小写字母、数字、特殊符号(包含!@#$%^&*)、8-16位",
            trigger: "blur",
            pattern:
              /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[!@#$%^&*.])[a-zA-Z\d!@#$%^&*.]{8,16}$/,
          },
        ],
        ConfirmPassword: [
          { required: true, message: "请输入确认密码", trigger: "blur" },
          {
            message:
              "密码格式不正确,应包含大小写字母、数字、特殊符号(包含!@#$%^&*)、8-16位",
            trigger: "blur",
            pattern:
              /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[!@#$%^&*.])[a-zA-Z\d!@#$%^&*.]{8,16}$/,
          },
        ],
      },
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'realname'
    ]),
    userlogo() {
      // 存放要换的图片
      let imgs = [
        require('@/assets/i-mages/Logo1.gif'),
        require('@/assets/i-mages/Logo2.gif'),
        require('@/assets/i-mages/Logo3.gif'),
      ];
      return imgs[Math.floor(Math.random() * 3)]; //进行计算随机

    },
  },
  methods: {
    dialogClosed() {
      this.$refs.updatePasswordRef.resetFields();
    },
    handleCommand(flag) {
      switch (flag) {
        case "a":
          this.updatePasswordClick();
          break;
        case "b":
          this.logout();
          break;
      }
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar');
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      var LogoCatch = window.localStorage.getItem('LogoCatch');
      switch (LogoCatch) {
        case "#/login":
        this.$router.push(`/login`);
        break;
        case "#/loginxinyazhong":
        this.$router.push(`/loginxinyazhong`);
        break;
        case "#/loginzhiweijia":
        this.$router.push(`/loginzhiweijia`);
        break;
        case "#/loginkangkang":
        this.$router.push(`/loginkangkang`);
        break;
      }
      //清除logo缓存
      window.localStorage.removeItem("LogoCatch");
    },
    //修改密码
    updatePasswordClick() {
      this.updatePassword.User_ID = this.$store.getters.UserBaseInfoLoginBackstage;
      this.updatePasswordVisible = true;
    },
    //修改密码提交验证
    UpdatePasswordCommit() {
      this.UpdatePasswordLoading = true;
      // 提交请求前，表单预验证
      this.$refs.updatePasswordRef.validate(async (valid) => {
        // 表单预校验失败
        if (!valid) {
          this.UpdatePasswordLoading = false;
          return;
        }
        UpdatePasswordCommit(this.updatePassword).then((res) => {
          this.UpdatePasswordLoading = false;
          if (res.success) {
            this.$message.success("密码修改成功！");
            // 隐藏添加用户对话框
            this.updatePasswordVisible = false;
            setTimeout(() => {
              this.logout();
            }, 800)
          } else {
            this.$message.error(res.resultMessage);
          }
        });
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      // margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
      }
    }

  }
}

.buttonCenter {
  text-align: center;
  margin-top: 20px;
}
</style>
