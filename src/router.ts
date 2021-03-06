import Vue from 'vue'
import VueRouter, { RouterOptions } from 'vue-router'

import { store } from '@/main'

import Alerts from './views/Alerts.vue'
import Alert from './views/Alert.vue'
import Heartbeats from './views/Heartbeats.vue'
import Blackouts from './views/Blackouts.vue'
import Users from './views/Users.vue'
import Groups from './views/Groups.vue'
import Perms from './views/Perms.vue'
import Customers from './views/Customers.vue'
import ApiKeys from './views/ApiKeys.vue'
import Reports from './views/Reports.vue'

import Login from './views/Login.vue'
import Signup from './views/Signup.vue'
import Confirm from './views/Confirm.vue'
import Forgot from './views/Forgot.vue'
import Reset from './views/Reset.vue'
import Logout from './views/Logout.vue'
import Settings from './views/Settings.vue'

Vue.use(VueRouter)

export function createRouter(basePath): VueRouter {
  const router = new VueRouter({
    mode: 'history',
    base: basePath || process.env.BASE_URL,
    routes: [
      {
        path: '/alerts',
        name: 'alerts',
        component: Alerts,
        props: route => ({
          query: route.query.q,
          isKiosk: route.query.kiosk,
          hash: route.hash
        }),
        meta: { title: 'Alerts', requiresAuth: true }
      },
      {
        path: '/alert/:id',
        name: 'alert',
        component: Alert,
        props: true,
        meta: { title: 'Alert Detail', requiresAuth: true }
      },
      {
        path: '/heartbeats',
        name: 'heartbeats',
        component: Heartbeats,
        meta: { title: 'Heartbeats', requiresAuth: true }
      },
      {
        path: '/users',
        name: 'users',
        component: Users,
        meta: { title: 'Users', requiresAuth: true }
      },
      {
        path: '/groups',
        name: 'groups',
        component: Groups,
        meta: { title: 'Groups', requiresAuth: true }
      },
      {
        path: '/customers',
        name: 'customers',
        component: Customers,
        meta: { title: 'Customers', requiresAuth: true }
      },
      {
        path: '/blackouts',
        name: 'blackouts',
        component: Blackouts,
        meta: { title: 'Blackouts', requiresAuth: true }
      },
      {
        path: '/perms',
        name: 'perms',
        component: Perms,
        meta: { title: 'Permissions', requiresAuth: true }
      },
      {
        path: '/keys',
        name: 'apiKeys',
        component: ApiKeys,
        meta: { title: 'API Keys', requiresAuth: true }
      },
      {
        path: '/reports',
        name: 'reports',
        component: Reports,
        meta: { title: 'Reports', requiresAuth: true }
      },
      {
        path: '/settings',
        name: 'settings',
        component: Settings,
        meta: { title: 'Settings', requiresAuth: true }
      },
      {
        path: '/help',
        name: 'help',
        component: () => window.open('https://docs.alerta.io/?utm_source=app', '_blank')
      },
      {
        path: '/about',
        name: 'about',
        component: () =>
          import(/* webpackChunkName: 'about' */ './views/About.vue'),
        meta: { title: 'About', requiresAuth: true }
      },
      {
        path: '/login',
        name: 'login',
        component: Login,
        meta: { title: 'Login' }
      },
      {
        path: '/signup',
        name: 'signup',
        component: Signup,
        meta: { title: 'Sign Up' }
      },
      {
        path: '/confirm/:token',
        name: 'confirm',
        component: Confirm,
        meta: { title: 'Confirm Email' }
      },
      {
        path: '/forgot',
        name: 'forgot',
        component: Forgot,
        meta: { title: 'Forgot Password' }
      },
      {
        path: '/reset/:token',
        name: 'reset',
        component: Reset,
        meta: { title: 'Reset Password' }
      },
      {
        path: '/logout',
        name: 'logout',
        component: Logout,
        meta: { title: 'Logout' }
      },
      {
        path: '*',
        redirect: '/alerts'
      }
    ]
  } as RouterOptions)

  // redirect users not logged in to /login if authentication enabled
  router.beforeEach((to, from, next) => {
    if ((store.getters.getConfig('auth_required') &&
      to.matched.some(record => record.meta.requiresAuth))) {
      if (!store.getters['auth/isLoggedIn']) {
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      } else {
        next()
      }
    } else {
      next()
    }
  })

  router.beforeEach((to, from, next) => {
    if (to.meta.title) {
      document.title = to.meta.title + ' | Alerta'
    }
    next()
  })

  // redirect hashbang mode links to HTML5 mode links
  router.beforeEach((to, from, next) => {
    if (to.fullPath.substr(0, 2) === '/#') {
      const pathMinusHashbang = to.fullPath.substr(2)
      console.log('rewriting ', to.fullPath, ' to ', pathMinusHashbang)
      next(pathMinusHashbang)
    } else {
      next()
    }
  })

  router.beforeEach((to, from, next) => {
    let externalUrl = to.fullPath.replace('/', '')
    if (externalUrl.match(/^(http(s)?|ftp):\/\//)) {
      window.open(externalUrl, '_blank')
    } else {
      next()
    }
  })

  return router
}
