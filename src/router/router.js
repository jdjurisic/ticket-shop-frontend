import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import Login from '../views/Login'
import Edit from '../views/Edit'

Vue.use(VueRouter);

let router = new VueRouter({
  
    routes: [
      {
        path: '/login',
        name: 'login',
        component: Login,
        meta: { 
          requiresAuth: false
        }
      },
      
      {
        path: '/',
        name: 'home',
        component: Home,
        meta: { 
          requiresAuth: true
        }
      },
    {
      path:'/edit/:id',
      name:'edit',
      component:Edit,
      meta:{
        requiresAuth:true
      }
    }]
  })
  
  export default router