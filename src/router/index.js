import Vue from 'vue'
import Router from 'vue-router'
import {
  Message
} from 'element-ui';

/**组件 */
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import Users from '@/components/users/users.vue'
import Rights from '@/components/rights/right.vue'
import Role from '../components/rights/role.vue'
import Goods from '../components/goods/goods.vue';
import Params from '../components/goods/params.vue'
import Categories from '../components/goods/categories.vue'
import GoodsAdd from '../components/goods/goodsAdd.vue'


Vue.use(Router)

const router = new Router({
  routes: [{
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [{
          name: 'users',
          path: '/users',
          component: Users
        },
        {
          name: 'rights',
          path: '/rights',
          component: Rights
        },
        {
          name: 'roles',
          path: '/roles',
          component: Role
        },
        {
          name: 'goods',
          path: '/goods',
          component: Goods
        },
        {
          name: 'params',
          path: '/params',
          component: Params
        },
        {
          name: 'categories',
          path: '/categories',
          component: Categories
        },
        {
          name: 'goodsAdd',
          path: '/goodsAdd',
          component: GoodsAdd
        }
      ]
    }
  ]
})

/**再路由配置生效之前（调用路由守卫），统一判断token， */
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    const token = localStorage.getItem('token')
    if (!token) {
      Message.warning('请先登录')
      router.push({
        name: 'login'
      })
      return
    }
    next()
  }

})

export default router
