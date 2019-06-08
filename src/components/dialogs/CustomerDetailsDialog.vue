<template>
  <div id="customer-details-dialog" class="text-xs-center">
    <v-dialog
      v-model="isShown"
      width="500">

      <v-card>
        <v-card-title
          class="headline primary"
          primary-title
          style="color: white;">
          Detalles del cliente
        </v-card-title>

        <v-card-text>
          <p v-if="customer.type == 'person'"><v-icon small>fingerprint</v-icon>&nbsp;<b>NIF:</b> {{ customer.nif }}</p>
          <p v-else-if="customer.type == 'company'"><v-icon small>fingerprint</v-icon>&nbsp;<b>CIF:</b> {{ customer.cif }}</p>
          <p v-if="customer.type == 'person'"><v-icon small>person</v-icon>&nbsp;<b>Nombre completo: </b> {{ customer.name }} {{ customer.surname }}</p>
          <p v-else><v-icon small>business</v-icon>&nbsp;<b>Nombre: </b> {{ customer.name }}</p>
          <p v-if="customer.address.homeAddress != ''"><v-icon small>room</v-icon>&nbsp;<b>Dirección:</b> {{ customer.address.homeAddress }} ({{ customer.address.locality }}, {{ customer.address.province }})</p>
          <p v-if="customer.email != ''"><v-icon small>mail</v-icon>&nbsp;<b>Correo electrónico:</b> {{ customer.email }}</p>
          <p v-if="customer.phone != ''"><v-icon small>phone</v-icon>&nbsp;<b>Teléfono de contacto:</b> {{ customer.phone }}</p>
          <p><v-icon small>today</v-icon>&nbsp;<b>Creado:</b> {{ customer.createdAt | formatDate }}</p>
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
    name: 'CustomerDetailsDialog',    
    data () {
      return {
        customer: {
          address: {
            country: '',
            homeAddress: '',
            locality: '',
            province: ''
          },
          createdAt: null,
          email: '',
          name: '',
          nif: '',
          phone: '',
          surname: '',
          type: '',
          updatedAt: null
        },
        isShown: false
      }
    },
    filters: {
      formatDate: (date) => {
        return moment(date.toDate()).format('DD-MM-YYYY HH:mm');
      }
    }
  }
</script>

