<template>
  <div class="login-container">
    <el-card>
      <el-form>
        <el-row class="logoClass">
          <el-col style="width:115px ;" :offset="3">
            <el-image style="width: 115px;" :src="imgUrl" />
          </el-col>
          <el-col class="titleClass">
            HR保险管理系统V2.0
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <div class="contentClass">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on"
               label-position="left"
      >
        <div class="title-container">
          <h3 class="title">系统登录</h3>
        </div>

        <el-form-item prop="username">
          <span class="svg-container">
            <i class="el-icon-user" />
          </span>
          <el-input ref="username" v-model="loginForm.username" placeholder="用户名" tabindex="1" autocomplete="on"
                    clearable @clear="clearAllinfo" @keyup.enter.native="handleLogin"
          />
        </el-form-item>

        <el-tooltip v-model="capsTooltip" content="大写锁定打开" placement="right" manual>
          <el-form-item prop="password">
            <span class="svg-container">
              <i class="el-icon-lock" />
            </span>
            <el-input ref="password" v-model="loginForm.password" show-password placeholder="密码" tabindex="2"
                      autocomplete="on" @keyup.native="checkCapslock" @blur="capsTooltip = false"
                      @keyup.enter.native="handleLogin"
            />
          </el-form-item>
        </el-tooltip>
        <el-form-item prop="inputVal">
          <span class="svg-container">
            <i class="el-icon-key" />
          </span>
          <el-input ref="inputVal" v-model="loginForm.inputVal" style="width:203px ;" placeholder="验证码" tabindex="1"
                    autocomplete="on" @keyup.enter.native="handleLogin"
          />
          <validate-code ref="ref_validateCode" class="validateClass" @change="changeCode" />
        </el-form-item>

        <el-button :loading="loading" type="primary" style="width:100%" @click.native.prevent="handleLogin">登
          录</el-button>
      </el-form>
    </div>
    <div class="footClass">
      <div>{{ loginContent }}</div>
      <div v-if="loginContentFlag">Copyright 2020 员福网（北京格信诺诚企业管理服务有限公司）.All Rights
        Reserved.京ICP备13011191号-京公网安备11010502036667号</div>
    </div>
  </div>
</template>
<script>
import validateCode from "./components/ValidateCode.vue";
import yuanfu from '@/assets/i-mages/yf2w.png';
import xinyazhong from '@/assets/i-mages/xinyazhong.png';
import zhiweijia from '@/assets/i-mages/zhiweijia.png';
import kangkang from '@/assets/i-mages/kangkang.png';
export default {
  name: 'Login',
  components: {
    validateCode
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入不少于六位的密码'))
      } else {
        callback()
      }
    }
    const validateVal = (rule, value, callback) => {
      if (this.loginForm.inputVal) {
        if (this.loginForm.inputVal.toUpperCase() !== this.checkCode) {
          // this.loginForm.inputVal = "";
          // this.$refs["ref_validateCode"].draw();
          callback(new Error('验证码比对失败,请重新输入'))
          return;
        } else {
          callback()
        }
      } else {
        callback(new Error('请输入右侧验证码'))
      }
    }
    return {
      loginContentFlag: true,
      loginContent: '全国统一服务热线 4000-123-300',
      imgUrl: yuanfu,
      loginForm: {
        username: '',
        password: '',
        inputVal: '',
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        inputVal: [{ required: true, trigger: 'blur', validator: validateVal }],
      },
      capsTooltip: false,
      loading: false,
      // showDialog: true,
      redirect: undefined,
      otherQuery: {},
      checkCode: "",
      result: ""
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    const host = window.location.host;
    if (host.indexOf("xcorpins.fuliplat.com") != -1) {
      this.imgUrl = xinyazhong;
      this.loginContentFlag = false;
      this.loginContent = '北京欣亚中物业服务有限公司';
    } else if (host.indexOf("homeconins.fuliplat.com") != -1) {
      this.imgUrl = zhiweijia;
      this.loginContentFlag = false;
      this.loginContent = '职为家';
    // eslint-disable-next-line brace-style
    }
    // 乱写的
    else if (host.indexOf("kangkang.fuliplat.com") != -1) {
      this.imgUrl = kangkang;
      this.loginContentFlag = false;
      this.loginContent = '康康ODS';
    }
    const that = this;
    document.onkeypress = function (e) {
      var keycode = document.all ? event.keyCode : e.which;
      if (keycode == 13) {
        that.login();// 登录方法名
        return false;
      }
    };
  },
  mounted() {

  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then((data) => {
              // 记录logo缓存
              window.localStorage.setItem("LogoCatch", window.location.hash);

              if (data.MenuPermissions == 2) { this.$router.push('InsuranceServices/StatisticsInsuredPersonnel') } else { this.$router.push('UserHomePage/UserHomePageList') }
              // this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch((data) => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    clearAllinfo() {
      this.loginForm.username = '';
      this.loginForm.password = '';
      this.loginForm.inputVal = '';
    },
    changeCode(value) {
      this.checkCode = value;
    },

  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #737478;
$cursor: #737478;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 38px;
    width: 87%;
    background-color: white;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      //padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 38px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #FFF inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid #DCDFE6;
    background: white;
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #FFF;
$dark_gray: #409EFF;
$light_gray: #999999;

.login-container {
  height: 100%;
  width: 100%;
  position: relative;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: absolute;
    width: 420px;
    height: 360px;
    margin: auto;
    overflow: hidden;
    background-color: #FFF;
    padding: 44px 50px 50px 50px;
    right: 10vw;
    border-radius: 5px;
    // 垂直居中有position的情况
    top: 50%;
    transform: translateY(-50%);
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 0 5px 0 15px;
    color: $dark_gray;
    // vertical-align: middle;
    width: 30px;
    height: 38px;
    // display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 20px;
      color: $light_gray;
      margin: 0px auto 30px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }

  .logoClass {
    line-height: 43px;
  }

  .titleClass {
    line-height: 43px;
    height: 43px;
    width: 160px;
    font-size: 18px;
    color: #666;
    letter-spacing: 1px;
    border-left: 1px solid #b1b1b1;
    padding-left: 15px;
    margin-left: 15px;
    display: block;
    font-weight: bold;
  }

  .contentClass {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: calc(100vh - 277px);
    background-image: url("../../assets/i-mages/loginbj.jpg");
    overflow: hidden;
    background-size: cover; //或者background-size:100%;
  }

  .footClass {
    margin: 20px 0;
    text-align: center;
    font-size: 10px;
    line-height: 25px;
  }

  .validateClass {
    width: 80px;
    height: 38px;
    border-left: 1px solid #DCDFE6;
    float: right;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
}

::v-deep .el-card__body {
  padding: 20px 20px 5px 20px;
}
</style>
