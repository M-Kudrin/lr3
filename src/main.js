import Vue from 'vue'

import App from './App'

import VueIdb from 'vue-idb'

Vue.use(VueIdb);

export default new VueIdb({
  database: 'appDB',
  schemas: [
    {messages: 'id, sendingTime, value, authorUID,authorLogin, type'}
  ]
})

Vue.config.productionTip = false;

window.$ = window.jQuery = require('jquery');

Vue.prototype.$bus = new Vue();

new Vue({
  el: '#app',
  render: h => h(App)
});
