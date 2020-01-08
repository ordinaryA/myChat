import Vue from 'vue'
import App from '../App'
import router from '../router'
import store from '../store'


import {
  Install_Components
} from './build'

Install_Components(Vue)

new Vue({
  el: '#app',
  router,
  store: store,
  components: {
    App
  },
  template: '<App/>'
})
