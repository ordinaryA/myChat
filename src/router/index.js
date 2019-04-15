import Vue from 'vue'
import Router from 'vue-router'
import ChatBase from '../views/message/chatBase'
import Chat from '../views/message/chat'
import Room from '../views/message/room'
import Room2 from '../views/message/room2'
import FriendBase from '../views/friend/friendBase'
import Friend from '../views/friend/friend'
import FriendInfo from '../views/friend/friendInfo'
import Find from '../views/find/find'
import Mybase from '../views/mine/myBase'
import Mine from '../views/mine/mine'
import SetPage from '../views/mine/setPage'
import LoginBase from '../views/login/loginBase'
import Register from '../views/login/register'
import Login from '../views/login/login'

import {
  GET_SESSION
} from '../utils/index'

Router.prototype.goBack = function () {
  this.isBack = true
  window.history.go(-1)
}

Vue.use(Router)

const router = new Router({
  routes: [{
      path: '/',
      component: ChatBase,
      children: [{
          path: '',
          name: 'chat',
          component: Chat
        },
        {
          path: '/room',
          name: 'room',
          component: Room
        },
        {
          path: '/room2',
          name: 'room2',
          component: Room2
        }
      ]
    },
    {
      path: '/friend',
      component: FriendBase,
      children: [{
          path: '',
          name: 'friend',
          component: Friend
        },
        {
          path: '/friendInfo',
          name: 'friendInfo',
          component: FriendInfo,
        }
      ]
    },
    {
      path: '/find',
      name: 'find',
      component: Find
    },
    {
      path: '/myBase',
      component: Mybase,
      children: [{
          path: '',
          name: 'mine',
          component: Mine,
        },
        {
          path: '/setPage',
          name: 'setPage',
          component: SetPage,
        }
      ]
    },
    {
      path: '/login',
      component: LoginBase,
      children: [{
          path: '',
          name: 'login',
          component: Login,
        },
        {
          path: '/register',
          name: 'register',
          component: Register,
        },
      ]
    },
    {
      path: '**', // 错误路由
      redirect: '/' //重定向
    },
  ]
})
import STORE from '../store'
router.beforeEach((to, from, next) => {
  // to: Route: 即将要进入的目标 路由对象
  // from: Route: 当前导航正要离开的路由
  // next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。

  const nextRoute = ['chat', 'room', 'find', 'friendBase', 'friend', 'mine', 'mybase', 'setPage'];
  const ISLOGIN = GET_SESSION('ISLOGIN');

  // const {
  //   userInfo,
  //   privateChat,
  //   publicChat
  // } = STORE.state

  // 未登录状态；当路由到nextRoute指定页时，跳转至login
  if (nextRoute.indexOf(to.name) >= 0) {
    if (!ISLOGIN) {
      console.log('没登录啊啊啊啊');
      router.push({
        name: 'login'
      })
    }
  }

  // 已登录状态；当路由到login时，跳转至home 
  if (to.name === 'login') {
    if (ISLOGIN) {
      router.push('chat');
    }
  }
  next();
});


export default router;
