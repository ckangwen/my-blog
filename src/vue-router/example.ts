import { VueRouter } from './VueRouter';
const routes = [
  {
    path: '/',
    name: 'home',
    component: {},
    alias: '/home'
  },
  {
    path: '/login',
    name: 'login',
    component: {},
    alias: '/login'
  },
]

const router = new VueRouter({
  routes,
  base: '/'
})
console.log(router);

router.history.push('/login')

