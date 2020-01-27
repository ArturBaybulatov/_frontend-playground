import axios from 'axios';
import chroma from 'chroma-js';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/ru-RU';
import _ from 'lodash';
import Vue from 'vue';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import '@arturbaybulatov/util-css/dist/index.css';
import * as util from '@arturbaybulatov/util-js';

import App from './App.vue';
import router from './router';
import store from './store';
import './main.less';


window.util_ = util; // Debug
window.chroma_ = chroma; // Debug

const log = window.log = val => { console.log(val); return val }; // eslint-disable-line no-multi-assign
Object.defineProperty(Vue.prototype, 'log', { value: log }); // Define as read-only property

Object.defineProperty(Vue.prototype, 'chroma', { value: chroma });

Object.defineProperty(Vue.prototype, '_', { value: _ });

axios.interceptors.response.use(res => res.data);

Vue.config.productionTip = false;

Vue.use(ElementUI, { locale });

Vue.component('multiselect', Multiselect);

new Vue({
  render: h => h(App),
  router,
  store,
}).$mount('#app');
