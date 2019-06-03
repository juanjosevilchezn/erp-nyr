<template>
  <v-layout row justify-center fill-height>
    <v-dialog
      v-model="isShown"
      max-width="500"
      persistent>
      <v-card>
        <v-card-title class="headline">¿Estás segur@ de que quieres deshacer este documento?</v-card-title>

        <v-card-text>
          Este proceso es irreversible. Una vez finalice el proceso, el estado de las tareas implicadas 
          pasará a ser "Finalizado" de nuevo y podrás volver a generar un nuevo documento con ellas.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="gray darken-1"
            flat
            @click="cancel">
            Cancelar
          </v-btn>
          <v-btn
            outline
            color="warning darken-1"
            flat
            @click="agree">
            Sí, deshacer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>


<script>
    export default {
        name: 'UndoConfirmationDialog',
        data () {
            return {
                isShown: false,
                resolve: null,
                reject: null,
                message: null,
                title: null
            }
        },
        methods: {
            open(title, message) {
                return new Promise((resolve, reject) => {
                    this.isShown = true
                    this.title = title
                    this.message = message
                    this.resolve = resolve
                    this.reject = reject
                })
            },
            agree() {
                this.resolve(true)
                this.isShown = false
            },
            cancel() {
                this.reject(true)
                this.isShown = false
            }
        }
    }
</script>