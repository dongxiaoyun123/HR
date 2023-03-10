import { asyncRoutes, constantRoutes } from '@/router'
import Layout from '@/layout'
import { fetchUserMenuList } from '@/api/user'
import { getUserPermissions } from '@/api/hrmain'
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
    
      // const asyncRoutesssss = [
      //   {
      //     path: '/permission',
      //     component: 'Layout',
      //     redirect: '/permission/page',
      //     name: 'Permission',
      //     meta: {
      //       title: 'Permission',
      //       icon: 'lock',
      //     },
      //     children: [
      //       {
      //         path: 'page',
      //         component: 'permission/page',
      //         name: 'PagePermission',
      //         meta: {
      //           title: 'Page Permission',
      //           icon: 'lock',
      //         }
      //       },
      //       {
      //         path: 'directive',
      //         component: 'permission/directive',
      //         name: 'DirectivePermission',
      //         meta: {
      //           title: 'Directive Permission'
      //           // if do not set roles, means: this page does not require permission
      //         }
      //       },
      //       {
      //         path: 'role',
      //         component: 'permission/role',
      //         name: 'RolePermission',
      //         meta: {
      //           title: 'Role Permission',
      //         }
      //       }
      //     ]
      //   },

      //   {
      //     path: '/icon',
      //     component: 'Layout',
      //     redirect: '/permission/page',
      //     name: 'icon',
      //     meta: {
      //       title: 'Permission',
      //       icon: 'lock',
      //     },
      //     children: [
      //       {
      //         path: 'index',
      //         component: 'icons/index',
      //         name: 'Icons',
      //         meta: { title: 'Icons', icon: 'icon' }
      //       }
      //     ]
      //   },
      // ]
      // accessedRoutes = filterAsyncRouter(asyncRoutesssss)
      
      getUserPermissions().then(response => {
        const { result } = response;
        if (response.success) {
          accessedRoutes = filterAsyncRouter(result);
          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        }
      })

      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
  
    })
  }
}
// ????????????????????????????????????????????????????????????
function filterAsyncRouter(asyncRouterMap) {
  return asyncRouterMap.filter(route => {
    if (route.component) {
      // Layout??????????????????
      if (route.component === 'Layout') {
        route.component = Layout
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
}

// export const loadView = view => {
//
//   return () => import(`@/views/${view}`);
// };

export const loadView = view => {
  // ???????????????
  return resolve => require(['@/views/' + view], resolve)
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
