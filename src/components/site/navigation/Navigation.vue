<template>
    <div id="navigation">
      <v-navigation-drawer v-model="drawer" temporary app>
        <v-list>
          <v-list-tile
            v-for="option in options"
            :key="option.title"
            :to="option.url"
          >
            <v-list-tile-action>
              <v-icon color="primary">{{option.icon}}</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title v-text="option.title"></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>

      <v-toolbar fixed dark app color="primary">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title>{{ company_name }} &bull; {{ app_part }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          @click="logout" 
          icon>
          <v-icon>exit_to_app</v-icon>
        </v-btn>
      </v-toolbar>
      
      <Footer footer/>
    </div>    
</template>

<script>
  import firebase from 'firebase'
  import Footer from '../footer/Footer'

  const db = firebase.firestore()
  const settingsRef = db.collection('settings').doc('RszgIiX4x0cpCiRTsU')

  export default {
    name: 'Navigation',
    components: {
      Footer
    },
    data() {
      return {
        company_name: '',
        drawer: false,
        options: [
          {
            icon: 'home',
            title: 'Inicio',
            url: '/home'
          },
          {
            icon: 'person',
            title: 'Clientes',
            url: '/customers'
          },
          {
            icon: 'work',
            title: 'Tareas',
            url: '/tasks'
          },
          {
            icon: 'payment',
            title: 'Facturación',
            url: '/billing'
          },
          {
            icon: 'notifications',
            title: 'Notificaciones',
            url: '/notifications'
          },
          {
            icon: 'settings',
            title: 'Ajustes',
            url: '/settings'
          }
        ]        
      }
    },
    methods: {
      logout() {
        firebase
          .auth()
          .signOut()
          .then(() => this.$router.replace('login'))
      }
    },
    beforeCreate() {
      settingsRef.get()
        .then((doc) => {
            this.company_name = doc.data().brand
        })
        .catch(error => {
            this.$rollbar.critical('Crítico. No se ha podido recuperar la marca de la empresa ' + this.$route.params.id + ' en el método beforeCreate() del componente Navigation. ' + error)
        })
        .finally(() => {
            firebase.database().goOffline()
        })
    },
    props: {
      app_part: String
    }
  }
</script>

<style>
    #navigation {
        height: 100%;
    }

    #footer {
      position: fixed;
      width: 100%;
      z-index: 4;
      bottom: 0px;      
    }
</style>
