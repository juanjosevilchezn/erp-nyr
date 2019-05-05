import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import firebase from 'firebase'
import './components/firebaseInit'
import router from './router/index'

Vue.config.productionTip = false

let app;

firebase.auth().onAuthStateChanged(function() {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      router,
      render: h => h(App),
    }).$mount('#app')
  }
})
