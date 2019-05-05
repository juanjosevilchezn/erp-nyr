<template>
    <div id="navigation">
      <v-navigation-drawer :clipped="clipped" v-model="drawer" enable-resize-watcher app dark class="primary lighten-3">
        <v-list>
          <v-list-tile
            v-for="option in options"
            :key="option.title"
            :to="option.url"
          >
            <v-list-tile-action>
              <v-icon color="white">{{option.icon}}</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title v-text="option.title"></v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>

      <v-toolbar fixed app :clipped-left="clipped">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title>{{ company_name }} &bull; Panel de administración</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          @click="logout" 
          icon>
          <v-icon>exit_to_app</v-icon>
        </v-btn>
      </v-toolbar>
    </div>    
</template>

<script>
  import firebase from 'firebase'

  export default {
    name: 'Navigation',    
    data() {
      return {
        clipped: false,
        company_name: 'N&R',
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
    }
  }
</script>

<style>
    #navigation {
        height: 100%;
    }
</style>
