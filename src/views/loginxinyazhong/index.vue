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
      <div class="login-form">
        <span class="login-form-one" />
        <span class="login-form-two" />
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="loginFormClass" autocomplete="on"
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
                      clearable @clear="clearAllinfo"
            />
          </el-form-item>

          <el-tooltip v-model="capsTooltip" content="大写锁定打开" placement="right" manual>
            <el-form-item prop="password">
              <span class="svg-container">
                <i class="el-icon-lock" />
              </span>
              <el-input ref="password" v-model="loginForm.password" show-password placeholder="密码" tabindex="2"
                        autocomplete="on" @keyup.native="checkCapslock" @blur="capsTooltip = false"
              />
            </el-form-item>
          </el-tooltip>
          <el-form-item prop="inputVal">
            <span class="svg-container">
              <i class="el-icon-key" />
            </span>
            <el-input ref="inputVal" v-model="loginForm.inputVal" style="width:202px ;" placeholder="验证码" tabindex="3"
                      autocomplete="on"
            />
            <validate-code ref="ref_validateCode" class="validateClass" @change="changeCode" />
          </el-form-item>
          <el-form-item>
            <el-button :loading="loading" type="primary" style="width:100%" @click.native.prevent="handleLogin">登
              录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="footClass">
      <div>北京欣亚中物业服务有限公司</div>
    </div>
  </div>
</template>

<script>
import validateCode from "../login/components/ValidateCode.vue";
import xinyazhong from '@/assets/i-mages/xinyazhong.png';
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
      imgUrl: xinyazhong,
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
  },
  created() {
    const that = this;
    document.onkeypress = function (e) {
      var keycode = document.all ? event.keyCode : e.which;
      if (keycode == 13) {
        that.handleLogin();// 登录方法名
        return false;
      }
    };
  },
  mounted() {

  },
  destroyed() {
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
              this.loading = false
              if (data.success) {
                // 记录logo缓存
                window.localStorage.setItem("LogoCatch", window.location.hash);
                // if (data.MenuPermissions == 2)
                //   this.$router.push('InsuranceServices/StatisticsInsuredPersonnel')
                // else
                //   this.$router.push('UserHomePage/UserHomePageList')
                this.$router.push('/')
                // this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              } else { this.$message.error(data.resultMessage); }
            })
            .catch((data) => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
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
      color: #737478;
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
@import '../../styles/transitionLogin.scss';

.login-container {
  height: 100%;
  width: 100%;
  position: relative;
  background-color: #FFF;
  overflow: hidden;

  .login-form {
    border: 1px solid #79bbff;
    border-radius: 3px;
    width: 450px;
    height: 345px;
    position: relative;
    overflow: hidden;
    background-color: #ffffff;
    position: absolute;
    margin: auto;
    overflow: hidden;
    background-color: #FFF;
    right: 10vw;
    border-radius: 5px;
    // 垂直居中有position的情况
    top: 50%;
    transform: translateY(-50%);

    .login-form-one,
    .login-form-two {
      position: absolute;
      display: block;
      width: inherit;
      height: inherit;

      &::before,
      &::after {
        content: '';
        position: absolute;
        z-index: 1;
      }
    }

    .login-form-one {
      &::before {
        filter: hue-rotate(0deg);
        top: 0px;
        left: 0;
        width: 100%;
        height: 3px;
        background: linear-gradient(90deg, transparent, #409eff);
        animation: loginLeft 3s linear infinite;
      }

      &::after {
        filter: hue-rotate(60deg);
        top: -100%;
        right: 2px;
        width: 3px;
        height: 100%;
        background: linear-gradient(180deg, transparent, #409eff);
        animation: loginTop 3s linear infinite;
        animation-delay: 0.7s;
      }
    }

    .login-form-two {
      &::before {
        filter: hue-rotate(120deg);
        bottom: 2px;
        right: -100%;
        width: 100%;
        height: 3px;
        background: linear-gradient(270deg, transparent, #409eff);
        animation: loginRight 3s linear infinite;
        animation-delay: 1.4s;
      }

      &::after {
        filter: hue-rotate(300deg);
        bottom: -100%;
        left: 0px;
        width: 3px;
        height: 100%;
        background: linear-gradient(360deg, transparent, #409eff);
        animation: loginBottom 3s linear infinite;
        animation-delay: 2.1s;
      }
    }

    .loginFormClass {
      padding: 40px 55px 0 55px;
    }
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
    color: #409EFF;
    // vertical-align: middle;
    width: 30px;
    height: 38px;
    // display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 20px;
      color: #999999;
      margin: 0px auto 34px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: #409EFF;
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
    height: 43px;
  }

  .titleClass {
    line-height: 43px;
    height: 43px;
    width: 200px;
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
    height: calc(100vh - 210px);
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
</style>
