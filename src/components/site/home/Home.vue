<template>
  <div id="home">
    <Navigation :app_part="title"/>
    
    <v-container fluid>
      <v-layout row fill-width>
        <InfoAlert
          message='Recuerda que este calendario solo mostrará aquellas tareas que se
                  encuentren en estado "Confirmado".'/>
      </v-layout>
      <v-layout row fill-width>
        <HomeCalendar style="margin-top: 15px;"/>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import HomeCalendar from '../../calendars/HomeCalendar'
  import InfoAlert from '../../alerts/InfoAlert'
  import Navigation from '../navigation/Navigation'

  export default {
    name: 'Home',
    components: {
      HomeCalendar,
      InfoAlert,
      Navigation
    },
    props: {
      title: String
    }
  }
</script>
