<template>
  <div id="home">
    <Navigation :app_part="title"/>

    <v-content>
      
    </v-content>
  </div>
</template>

<script>
import Navigation from '../navigation/Navigation'

export default {
  name: 'Home',
  components: {
    Navigation
  },
  props: {
    title: String
  }
}
</script>
