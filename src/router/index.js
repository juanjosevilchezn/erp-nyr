import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'
import Login from '../components/site/login/Login'
import Home from '../components/site/home/Home'
import Customers from '../components/site/customers/Customers'
import CustomerCreate from '../components/site/customers/CustomerCreate'
import CustomerEdit from '../components/site/customers/CustomerEdit'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/home'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: {
        requiresAuth: true
      },
      props: {
        title: 'Inicio'
      }
    },
    {
      path: '/customers',
      name: 'Customers',
      component: Customers,
      meta: {
        requiresAuth: true
      },
      props: {
        title: 'Clientes'
      }
    },
    {
      path: '/customers/create',
      name: 'CustomerCreate',
      component: CustomerCreate,
      meta: {
        requiresAuth: true
      },
      props: {
        title: 'Crear nuevo cliente'
      }
    },    
    {
      path: '/customers/edit/:id',
      name: 'CustomerEdit',
      component: CustomerEdit,
      meta: {
        requiresAuth: true
      },
      props: {
        title: 'Editar cliente'
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  // Check for requiresAuth guard
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if NO logged user
    if (!firebase.auth().currentUser) {
      // Go to login
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      // Proceed to route
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    // Check if NO logged user
    if (firebase.auth().currentUser) {
      // Go to login
      next({
        path: '/',
        query: {
          redirect: to.fullPath
        }
      })
    } else {
      // Proceed to route
      next()
    }
  } else {
    // Proceed to route
    next()
  }
})

export default router