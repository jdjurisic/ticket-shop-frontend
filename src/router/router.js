import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import Login from '../views/Login'

Vue.use(VueRouter);

let router = new VueRouter({
  
    routes: [
      {
        path: '/login',// ako hocemo da dodamo url parametar: /login/:id
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
      }]
  })
  
  export default router