import Vue from 'vue'
import App from './App'

// 不再需要手动导入 uni-ui 组件，使用 easycom 自动导入
// 全局组件导入保留
// 引入全局组件
import navBar from './components/custom-nav-bar.vue'
Vue.component('nav-bar', navBar)

import jobCard from './components/job-card.vue'
Vue.component('job-card', jobCard)

import identitySwitch from './components/identity-switch.vue'
Vue.component('identity-switch', identitySwitch)

// 引入ColorUI
import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom', cuCustom)

// 全局状态管理
import store from './store'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
    store
})
app.$mount()
