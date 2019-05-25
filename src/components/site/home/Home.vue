<template>
  <div id="home">
    <Navigation :app_part="title"/>

    <v-container fluid>
      <v-layout row fill-width>
        <!-- TO-DO CALENDAR PREVIEW AND NEAR FINISH TASKS LIST -->
      </v-layout>
    </v-container>
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
