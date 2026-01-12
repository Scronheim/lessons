import { createApp } from 'vue'
import { createPinia } from 'pinia'
import CanvasJSChart from '@canvasjs/vue-charts'

import router from './router'

import './styles/style.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'leaflet/dist/leaflet.css'

import App from './App.vue'

createApp(App).use(router).use(createPinia()).use(CanvasJSChart).mount('#app')
