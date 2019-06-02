<template>
  <v-app>
    <v-content>
      <router-view></router-view>
    </v-content>   
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
