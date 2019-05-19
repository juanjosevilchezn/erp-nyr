<template>
  <v-app>
    <v-content>
      <router-view></router-view>
    </v-content>

    <v-footer
      class="pa-3"
      color="grey lighten-1"
      >
      <v-spacer></v-spacer>
      <div>Codificado y diseñado por <b>Juan José Vílchez Naranjo</b> &copy; {{ new Date().getFullYear() }}</div>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    name: 'App'
  }
</script>
