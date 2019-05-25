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
      <div>Codificado y diseñado por <a href="mailto:juanjosevilchezn@gmail.com" style="color: black; text-decoration: none; font-weight: bold;">Juan José Vílchez Naranjo</a> &copy; {{ new Date().getFullYear() }}</div>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
  .fill-width {
    width: 97.5%
  }
</style>
