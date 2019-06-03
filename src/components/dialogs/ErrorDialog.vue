<template>
  <v-layout row justify-center fill-height>
    <v-dialog
      v-model="isShown"
      max-width="500">
      <v-card>
        <v-card-title class="headline">{{ title }}</v-card-title>

        <v-card-text>
          {{ message }}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-1"
            flat="flat"
            @click="isShown = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>


<script>
    export default {
        name: 'ErrorDialog',
        data () {
            return {
                isShown: false
            }
        },
        props: {
            message: String,
            title: String
        }
    }
</script>