import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import Login from '../views/Login'
import Edit from '../views/Edit'
import Company from '../views/Company'

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
      path:'/edit/:fid/:tid',
      name:'edit',
      component:Edit,
      props: { default: true, sidebar: false },
      meta:{
        requiresAuth:true
      }
    },
    {
      path:'/company/:name',
      name:'company',
      component:Company,
      props: { default: true, sidebar: false },
      meta:{
        requiresAuth:true
      }
    }
    ]
  })
  
  export default router