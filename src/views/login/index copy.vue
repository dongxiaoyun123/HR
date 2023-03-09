<template>
  <div class="login-container">
    <el-card>
      <el-form>
        <el-row class="logoClass">
          <el-col style="width:115px ;" :offset="4">
            <el-image style="width: 115px;" :src="require('@/assets/i-mages/yf2w.png')"></el-image>
          </el-col>
          <el-col class="titleClass">
            HR保险管理系统V2.0
          </el-col>
        </el-row>
      </el-form>
    </el-card>



    		<div class="login-right flex">
			<div class="login-right-warp flex-margin">
				<span class="login-right-warp-one"></span>
				<span class="login-right-warp-two"></span>
				<div class="login-right-warp-mian">
				
				</div>
			</div>
		</div>
    <div class="contentClass">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on"
        label-position="left">
        <div class="title-container">
          <h3 class="title">HR保险管理系统V2.0</h3>
        </div>

        <el-form-item prop="username">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input ref="username" v-model="loginForm.username" placeholder="用户名" 
            tabindex="1" autocomplete="on" clearable  @clear="clearAllinfo" />
        </el-form-item>

        <el-tooltip v-model="capsTooltip" content="大写锁定打开" placement="right" manual>
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input show-password  ref="password" v-model="loginForm.password"
              placeholder="密码"  tabindex="2" autocomplete="on" @keyup.native="checkCapslock"
              @blur="capsTooltip = false" @keyup.enter.native="handleLogin" />
          </el-form-item>
        </el-tooltip>

        <el-button :loading="loading" type="primary" style="width:100%" @click.native.prevent="handleLogin">登
          录</el-button>
      </el-form>

    </div>
    <div class="footClass">
      <div>全国统一服务热线 4000-123-300</div>
      <div>Copyright 2020 员福网（北京格信诺诚企业管理服务有限公司）.All Rights Reserved.京ICP备13011191号-京公网安备11010502036667号</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Login',
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
    return {
      logo: "../../assets/i-mages/yf2w.png",
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      capsTooltip: false,
      loading: false,
      // showDialog: true,
      redirect: undefined,
      otherQuery: {}
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
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
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
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
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
    height: 42px;
    width: 90%;
    background-color: white;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      //padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 42px;
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
$bg: #FFF;
$dark_gray: #889aa4;
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
    height: 320px;
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
    vertical-align: middle;
    width: 30px;
    height: 42px;
    display: inline-block;
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
    line-height: 35px;
  }

  .titleClass {
    width: 150px;
    font-size: 16px;
    color: #666;
    letter-spacing: 1px;
    border-left: 1px solid #b1b1b1;
    padding-left: 15px;
    margin-left: 15px;
    display: block;
  }

  .contentClass {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 70vh;
    background-image: url("../../assets/i-mages/loginbj.jpg");
    overflow: hidden;
    background-size: cover; //或者background-size:100%;
  }

  .footClass {
    margin-top: 40px;
    text-align: center;
    font-size: 10px;
    line-height: 25px;
  }

  .login-right {
		width: 700px;
		.login-right-warp {
			border: 1px solid #79bbff;
			border-radius: 3px;
			width: 500px;
			height: 500px;
			position: relative;
			overflow: hidden;
			background-color: #ffffff;
			.login-right-warp-one,
			.login-right-warp-two {
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
			.login-right-warp-one {
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
			.login-right-warp-two {
				&::before {
					filter: hue-rotate(120deg);
					bottom: 2px;
					right: -100%;
					width: 100%;
					height: 3px;
					background: linear-gradient(270deg, transparent,#409eff);
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
			.login-right-warp-mian {
				display: flex;
				flex-direction: column;
				height: 100%;
				.login-right-warp-main-title {
					height: 130px;
					line-height: 130px;
					font-size: 27px;
					text-align: center;
					letter-spacing: 3px;
					animation: logoAnimation 0.3s ease;
					animation-delay: 0.3s;
					color: #303133;
				}
				.login-right-warp-main-form {
					flex: 1;
					padding: 0 50px 50px;
					.login-content-main-sacn {
						position: absolute;
						top: 0;
						right: 0;
						width: 50px;
						height: 50px;
						overflow: hidden;
						cursor: pointer;
						transition: all ease 0.3s;
						color: #409eff;
						&-delta {
							position: absolute;
							width: 35px;
							height: 70px;
							z-index: 2;
							top: 2px;
							right: 21px;
							background: #ffffff;
							transform: rotate(-45deg);
						}
						&:hover {
							opacity: 1;
							transition: all ease 0.3s;
							color: #409eff !important;
						}
						i {
							width: 47px;
							height: 50px;
							display: inline-block;
							font-size: 48px;
							position: absolute;
							right: 1px;
							top: 0px;
						}
					}
				}
			}
		}
	}
}
</style>
