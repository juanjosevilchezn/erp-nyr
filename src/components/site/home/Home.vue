<template>
  <div id="home">
    <Navigation/>
    <v-content>
      <router-view></router-view>
    </v-content>    
  </div>
</template>

<script>
import Navigation from '../navigation/Navigation'

export default {
  name: 'Home',
  components: {
    Navigation
  }
}
</script>
