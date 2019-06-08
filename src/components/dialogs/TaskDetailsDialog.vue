<template>
  <div id="task-details-dialog" class="text-xs-center">
    <v-dialog
      v-model="isShown"
      width="500">

      <v-card>
        <v-card-title
          class="headline primary"
          primary-title
          style="color: white;">
          Detalles de la tarea
        </v-card-title>

        <v-card-text>
            <p><v-icon small>assessment</v-icon>&nbsp;<b>Estado:</b>&nbsp;<span>{{ task.state }}</span></p>
            <p><v-icon small>turned_in</v-icon>&nbsp;<b>Tipo:</b>&nbsp;<span v-if="task.type == 'arrangement'">Arreglo</span><span v-if="task.type == 'manufacture'">Confección</span></p>
            <p><v-icon small>subject</v-icon>&nbsp;<b>Descripción:</b> {{ task.description }}</p>
            <p><v-icon small>person</v-icon>&nbsp;<b>Pertenece a:</b>&nbsp;<span v-if="task.customerData.type == 'company'">{{ task.customerData.name }}</span><span v-if="task.customerData.type == 'person'">{{ task.customerData.name }} {{ task.customerData.surname }}</span></p>
            <p>
                <v-icon small>accessibility</v-icon>&nbsp;<b>Medidas:&nbsp;</b>
                <v-tooltip right>
                    <template v-slot:activator="{ on }">
                        <span v-on="on" style="font-style: italic;">ver medidas <v-icon small>open_in_new</v-icon></span>
                    </template>
                    <table class="custom-font custom-align">
                        <tbody>
                            <tr class="custom-align">
                                <td class="custom-column">
                                    <span><b>Ancho:</b></span><br/>
                                    <ul>
                                        <li>Espalda: {{ task.measures.ancho.espalda }}cm</li>
                                        <li>Manga: {{ task.measures.ancho.manga }}cm</li>
                                        <li>Pecho: {{ task.measures.ancho.pecho }}cm</li>
                                        <li>Puño: {{ task.measures.ancho.puno }}cm</li>
                                    </ul>
                                </td>
                                <td>
                                    <span><b>Contorno:</b></span><br/>
                                    <ul>
                                        <li>Cadera: {{ task.measures.contorno.pecho }}cm</li>
                                        <li>Cintura: {{ task.measures.contorno.cintura }}cm</li>
                                        <li>Pecho: {{ task.measures.contorno.pecho }}cm</li>
                                    </ul>
                                    
                                </td>
                            </tr>
                            <tr class="custom-align">
                                <td class="custom-column">
                                    <span><b>Bajada:</b></span><br/>
                                    <ul>
                                        <li>Pecho: {{ task.measures.bajada.pecho }}cm</li>
                                        <li>Tiro: {{ task.measures.bajada.tiro }}cm</li>
                                    </ul>
                                </td>
                                <td>
                                    <span><b>Largo:</b></span>
                                    <ul>
                                        <li>Chaqueta: {{ task.measures.largo.chaqueta }}cm</li>
                                        <li>Falda: {{ task.measures.largo.falda }}cm</li>
                                        <li>Manga: {{ task.measures.largo.manga }}cm</li>
                                        <li>Pantalón: {{ task.measures.largo.pantalon }}cm</li>
                                        <li>Total: {{ task.measures.largo.total }}cm</li>
                                    </ul>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </v-tooltip>
            </p>
            <p><v-icon small>schedule</v-icon>&nbsp;<b>Fecha de entrega estimada:</b> {{ task.deliveryDate | formatDate }}</p>
            <p><v-icon small>today</v-icon>&nbsp;<b>Creado:</b> {{ task.createdAt | formatDateTime }}</p>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            outline
            flat
            @click="isShown = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
  import moment from 'moment'

  export default {
    name: 'TaskDetailsDialog',    
    data () {
      return {
        task: {
            type: '',
            customerData: {},
            createdAt: null,
            deliveryDate: null,
            price: 0,                
            quantity: 0,
            extra: {
                description: '',
                price: 0
            },
            state: '',
            notes: '',
            measures: {    
                ancho: {
                    espalda: 0,
                    manga: 0,
                    pecho: 0,
                    puno: 0
                },
                bajada: {
                    pecho: 0,
                    tiro: 0
                },
                contorno: {
                    pecho: 0,
                    cintura: 0,
                    cadera: 0
                },
                largo: {
                    chaqueta: 0,
                    falda: 0,
                    manga: 0,
                    pantalon: 0,
                    total: 0
                }
            }
        },
        isShown: false
      }
    },
    filters: {
        formatDate: (date) => {
            return moment(date).format('DD-MM-YYYY');
        },
        formatDateTime: (date) => {
            return moment(date.toDate()).format('DD-MM-YYYY HH:mm');
        }
    }
  }
</script>

<style>
  .custom-font {
    font-size: 12pt;
    border-collapse: separate;
    border-spacing: 10px 10px;
  }

  .custom-align {
      vertical-align: top;
  }

  .custom-column {
      padding-right: 20px;
  }
</style>