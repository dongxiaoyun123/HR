import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Watermark from '@/utils/watermark';  //水印
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/auth-redirect', '/login', '/loginxinyazhong', '/loginzhiweijia', '/loginkangkang'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken();
  
  if (hasToken) {
    if (to.path === '/' || whiteList.indexOf(to.path) !== -1) {
      next({ path: '/' })
      NProgress.done()
    }
    // else if (to.path === '/login' || to.path === '/loginxinyazhong' || to.path === '/loginzhiweijia' || to.path === '/loginkangkang') {
    //   // if is logged in, redirect to the home page
    //   //自己添加的验证，根据不同的菜单跳转到默认的路由（配置菜单不同）
    //   if (store.getters.MenuPermissions && store.getters.MenuPermissions.indexOf(2) != -1)
    //     next({ path: 'InsuranceServices/StatisticsInsuredPersonnel' })
    //   else
    //     next({ path: 'UserHomePage/UserHomePageList' })
    //   NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    // }
    else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          //获取角色和公司编号（如果是公司角色那么需要公司编号来进行动态获取绑定的路由）
          const roles = await store.dispatch('user/getInfo')

          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // dynamically add accessible routes
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          // Message.error(error || 'Has Error')
          // next(`/login?redirect=${to.path}`)

          var LogoCatch = window.localStorage.getItem('LogoCatch');
          switch (LogoCatch) {
            case "#/login":
              next(`/login`);
              break;
            case "#/loginxinyazhong":
              next(`/loginxinyazhong`);
              break;
            case "#/loginzhiweijia":
              next(`/loginzhiweijia`);
              break;
            case "#/loginkangkang":
              next(`/loginkangkang`);
              break;
            default:
              next(`/login`)
          }
          NProgress.done()
        }
      }
    }
  } else {
    
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      // next(`/login?redirect=${to.path}`)
      var LogoCatch = window.localStorage.getItem('LogoCatch');
      switch (LogoCatch) {
        case "#/login":
          next(`/login`);
          break;
        case "#/loginxinyazhong":
          next(`/loginxinyazhong`);
          break;
        case "#/loginzhiweijia":
          next(`/loginzhiweijia`);
          break;
        case "#/loginkangkang":
          next(`/loginkangkang`);
          break;
        default:
          next(`/login`)
      }
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  if (store.state.user.roles.indexOf(7) != -1)
    Watermark.set(store.state.user.realname);
  // finish progress bar
  NProgress.done();

})
