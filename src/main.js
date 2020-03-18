import Vue from 'vue';
import './assets/css/style.css';
import * as VueMenu from '@hscmap/vue-menu';
import * as VueWindow from '@hscmap/vue-window';
import splitPane from 'vue-splitpane';
import App from './App.vue';
import store from './store';

Vue.use(VueMenu);
Vue.use(VueWindow);
Vue.component('split-pane', splitPane);
Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount('#app');
