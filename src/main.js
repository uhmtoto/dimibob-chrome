import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import moment from 'moment'

Vue.prototype.moment = moment
Vue.prototype.$api = axios.create();

new Vue({
  el: '#app',
  render: h => h(App)
})
