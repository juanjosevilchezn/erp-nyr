import App from './App.vue'
import Vue from 'vue'
import Rollbar from 'vue-rollbar'
import './plugins/vuetify'
import firebase from 'firebase'
import './components/firebaseInit'
import router from './router/index'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false

Vue.use(Rollbar, {
  accessToken: '75ce754aaa8f4f70a998385150760b86',
  captureUncaught: true,
  captureUnhandledRejections: true,
  enabled: true,
  source_map_enabled: true,
  environment: 'production',
  payload: {
    client: {
         javascript: {
            code_version: '1.0'
         }
    }
  }
})

let app

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      router,
      render: h => h(App),
    }).$mount('#app')
  }
})