<template>
    <div id="customers">
        <Navigation app_part="Clientes"/>

        <v-container fluid fill-height>
            <v-layout row wrap style="width: 97.5%;">
                <v-flex xs2>
                    <v-btn
                        block
                        color="success"
                        href="/customers/create">
                        <v-icon>add_circle_outline</v-icon><span>&nbsp; Nuevo cliente</span>
                    </v-btn>
                </v-flex>

                <v-flex xs12 mt-3>
                    <v-card>
                        <v-card-title>
                            Listado de clientes
                            <v-spacer></v-spacer>
                            <v-text-field
                                v-model="search"
                                append-icon="search"
                                label="Buscar..."
                                single-line
                                hide-details>
                            </v-text-field>
                        </v-card-title>
                        
                        <v-data-table
                        :headers="headers"
                        :items="customers"
                        :search="search">
                            <template v-slot:items="props">
                                <td>{{ props.item.dni }}</td>
                                <td>{{ props.item.name }}</td>
                                <td>{{ props.item.surname }}</td>
                                <td>{{ props.item.email }}</td>
                                <td>{{ props.item.phone }}</td>
                            </template>
                            <template v-slot:no-results>
                                <v-alert :value="true" color="error" icon="warning">
                                Tu búsqueda para "{{ search }}" no tiene coincidencias.
                                </v-alert>
                            </template>
                        </v-data-table>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
/* eslint-disable */

import firebase from 'firebase'
import Navigation from '../navigation/Navigation'

const db = firebase.firestore()
let customersRef = db.collection('customers')

export default {    
    name: 'Customers',
    components: {
        Navigation
    },
    data () {
        return {
            customers: [],
            headers: [
                { text: 'DNI', value: 'dni' },
                { text: 'Nombre', value: 'name' },
                { text: 'Apellidos', value: 'surname' },
                { text: 'Correo electrónico', value: 'email' },
                { text: 'Teléfono', value: 'phone' }
            ],
            search: ''
        }        
    },
    mounted() {
        customersRef.get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    this.customers.push(doc.data())
                })
            })
            .catch(err => {
                console.log('Error getting documents', err)
            })
    }
}
</script>