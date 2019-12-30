import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Download from '@/views/Download'
import Register from '@/views/Register'
import ForgetPwd from '@/views/ForgetPwd'
import UserRegister from '@/views/GongZhongHao/UserRegister'
import NotFound from '@/views/Error/404'
import Home from '@/views/Home'
import Intro from '@/views/Intro/Intro'
import Generator from '@/views/Generator/Generator'
import api from '@/http/api'
import store from '@/store'
import { getIFramePath, getIFrameUrl } from '@/utils/iframe'
import MedicalRecordList from "@/views/GongZhongHao/MedicalRecordList";
import MedicalRecordDetail from "@/views/GongZhongHao/MedicalRecordDetail";

Vue.use(Router)

const router = new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta:{
        title:'上医林健康'
      },
      children: [
        {
          path: '',
          name: '介绍',
          component: Intro,
          meta: {
            icon: 'fa fa-home fa-lg'
          }
        },
        {
          path: '/generator/generator',
          name: '代码生成',
          component: Generator,
          meta: {
            icon: 'el-icon-mobile-phone'
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta:{
        title:'上医林健康'
      }
    },
    {
      path: '/download',
      name: 'Download',
      component: Download,
      meta:{
        title:'上医林健康-下载'
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta:{
        title:'上医林健康-注册'
      }
    },
    {
      path: '/forgetPwd',
      name: 'ForgetPwd',
      component: ForgetPwd,
      meta:{
        title:'上医林健康-找回密码'
      }
    },
    {
      path: '/userRegister',
      name: 'UserRegister',
      component: UserRegister,
      meta:{
        title:'上医林健康-患者注册'
      }
    },
    {
      path: '/medicalRecordList',
      name: 'MedicalRecordList',
      component: MedicalRecordList,
      meta:{
        title:'上医林健康-医疗记录列表'
      }
    },
    {
      path: '/medicalRecordDetail',
      name: 'MedicalRecordDetail',
      component: MedicalRecordDetail,
      meta:{
        title:'上医林健康-医疗记录详情'
      }
    },
    {
      path: '/404',
      name: 'notFound',
      component: NotFound
    }
  ]
})

router.beforeEach((to, from, next) => {
  //修改网页标题
    if (to.meta.title) {
    document.title = to.meta.title;
    }
  // 登录界面登录成功之后，会把用户信息保存在会话
  // 存在时间为会话生命周期，页面关闭即失效。
  let userName = sessionStorage.getItem('user')
  if (to.path === '/login') {
      // 如果是访问登录界面，如果用户会话信息存在，代表已登录过，跳转到主页
      if(userName) {
        next({ path: '/' })
      } else {
        next()
      }
    } else if(to.path === '/register'){
      next()
    }else if(to.path === '/forgetPwd'){
      next()
    }else if(to.path === '/userRegister'){
      next()
    }else if(to.path === '/medicalRecordList'){
      next()
    }else if(to.path === '/medicalRecordDetail'){
      next()
    }else if(to.path === '/auth'){
      window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxee2590252a0f8e99&redirect_uri=http%3a%2f%2fsoelaine.com%2fuserRegister&response_type=code&scope=snsapi_base&state=123#wechat_redirect';
    }else if(to.path === '/download'){
      next()
    }else{
      if (!userName) {
        // 如果访问非登录界面，且户会话信息不存在，代表未登录，则跳转到登录界面
        next({ path: '/login' })
      } else {
        // 加载动态菜单和路由
        addDynamicMenuAndRoutes(userName, to, from)
        next()
      }
  }
})

/**
* 加载动态菜单和路由
*/
function addDynamicMenuAndRoutes(userName, to, from) {
  // 处理IFrame嵌套页面
  handleIFrameUrl(to.path)
  if(store.state.app.menuRouteLoaded) {
    console.log('动态菜单和路由已经存在.')
    return
  }
  api.menu.findNavTree({'userName':userName})
  .then(res => {
    // 添加动态路由
    let dynamicRoutes = addDynamicRoutes(res.rows)
    router.options.routes[0].children = router.options.routes[0].children.concat(dynamicRoutes)
    router.addRoutes(router.options.routes)
    // 保存加载状态
    store.commit('menuRouteLoaded', true)
    // 保存菜单树
    store.commit('setNavTree', res.rows)
  })
  // .then(res => {
  //   api.user.findPermissions({'name':userName}).then(res => {
  //     // 保存用户权限标识集合
  //     store.commit('setPerms', res.rows)
  //   })
  // })
  .catch(function(res) {
  })
}

/**
 * 处理IFrame嵌套页面
 */
function handleIFrameUrl(path) {
  // 嵌套页面，保存iframeUrl到store，供IFrame组件读取展示
  let url = path
  let length = store.state.iframe.iframeUrls.length
  for(let i=0; i<length; i++) {
    let iframe = store.state.iframe.iframeUrls[i]
    if(path != null && path.endsWith(iframe.path)) {
      url = iframe.url
      store.commit('setIFrameUrl', url)
      break
    }
  }
}

/**
* 添加动态(菜单)路由
* @param {*} menuList 菜单列表
* @param {*} routes 递归创建的动态(菜单)路由
*/
function addDynamicRoutes (menuList = [], routes = []) {
 var temp = []
 for (var i = 0; i < menuList.length; i++) {
   if (menuList[i].children && menuList[i].children.length >= 1) {
     temp = temp.concat(menuList[i].children)
   } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
      menuList[i].url = menuList[i].url.replace(/^\//, '')
      // 创建路由配置
      var route = {
        path: menuList[i].url,
        component: null,
        name: menuList[i].name,
        meta: {
          icon: menuList[i].icon
        }
      }
      let path = getIFramePath(menuList[i].url)
      if (path) {
        // 如果是嵌套页面, 通过iframe展示
        route['path'] = path
        route['component'] = resolve => require([`@/views/IFrame/IFrame`], resolve)
        // 存储嵌套页面路由路径和访问URL
        let url = getIFrameUrl(menuList[i].url)
        let iFrameUrl = {'path':path, 'url':url}
        store.commit('addIFrameUrl', iFrameUrl)
      } else {
       try {
         // 根据菜单URL动态加载vue组件，这里要求vue组件须按照url路径存储
         // 如url="sys/user"，则组件路径应是"@/views/sys/user.vue",否则组件加载不到
         let array = menuList[i].url.split('/')
         let url = ''
         for(let i=0; i<array.length; i++) {
            url += array[i].substring(0,1).toUpperCase() + array[i].substring(1) + '/'
         }
         url = url.substring(0, url.length - 1)
         route['component'] = resolve => require([`@/views/${url}`], resolve)
       } catch (e) {}
     }
     routes.push(route)
   }
 }
 if (temp.length >= 1) {
   addDynamicRoutes(temp, routes)
 } else {
   console.log('动态路由加载...')
   console.log(routes)
   console.log('动态路由加载完成.')
 }
 return routes
}

export default router
