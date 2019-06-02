<template>
    <div id="BillingDocumentsDatatable">        
        <v-card>
            <v-card-title>
                <h4>{{ this.title }}</h4>
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
                :expand="expand"
                :headers="headers"
                :items="documents"
                :search="search"
                no-data-text="No existen documentos aún. Deberás crear alguno antes para que aparezcan aquí.">
                    <template v-slot:items="props">
                        <tr @click="props.expanded = !props.expanded">              
                            <td>{{ props.item.customerData.name }} {{ props.item.customerData.surname }}</td>
                            <td>
                                <v-chip color="lime lighten-1" text-color="black" v-if="props.item.type == 'delivery_note'" disabled>
                                    Albarán                            
                                </v-chip>
                                <v-chip color="brown lighten-4" text-color="black" v-if="props.item.type == 'invoice'" disabled>
                                    Factura
                                </v-chip>
                            </td>
                            <td>{{ new Date(props.item.createdAt.seconds * 1000) | formatDate }}</td>
                            <td>
                                <v-btn 
                                    flat
                                    icon
                                    color="primary"
                                    @click="goToView(props.item)">
                                    <v-icon>remove_red_eye</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </template>
                    <template v-slot:expand="props">
                        <v-card flat>
                            <v-card-text>
                                <p>Este documento contiene las siguientes tareas:</p>
                                <ul v-for="task in props.item.tasksData" v-bind:key="task.id">
                                    <li>{{ task.description }}</li>
                                </ul>
                            </v-card-text>                                    
                        </v-card>
                    </template>
                    <template v-slot:no-results>
                        <v-alert :value="true" color="error" icon="warning">
                        Tu búsqueda para "{{ search }}" no tiene coincidencias.
                        </v-alert>
                    </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<script>
    import firebase from 'firebase'
    import moment from 'moment'

    const db = firebase.firestore()
    let billingDocumentsRef = db.collection('billingDocuments')

    export default {    
        name: 'BillingDocumentsDatatable',
        data() {
            return {
                expand: false,
                documents: [],
                headers: [
                    { text: 'Cliente', value: 'customerData.name' },
                    { text: 'Tipo', value: 'type' },
                    { text: 'Creado', value: 'createdAt' },
                    { text: 'Acciones', value: null, sortable: false }
                ],
                search: ''
            }
        },
        filters: {
            formatDate: (date) => {
                return moment(date).format('DD/MM/YYYY HH:mm');
            }
        },
        methods: {
            goToView(document) {
                let componentName = ''

                if (document.type == 'delivery_note') {
                    componentName = 'DeliveryNotePreview'
                } else if (document.type == 'invoice') {
                    componentName = 'InvoicePreview'
                }

                this.$router.push(
                    { 
                        name: componentName, 
                        params: { 
                            id:  document.id
                        } 
                    })
            }
        },
        mounted() {
            billingDocumentsRef.get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let documentData = doc.data()
                        documentData.tasksData = []

                        documentData.customer.get()
                            .then(res => {
                                documentData.customerData = res.data()
                                this.documents.push({
                                    id: doc.id,
                                    ...documentData
                                })
                            })
                            .catch(error => {
                                // TO-DO SEND TO ERROR PAGE
                            })

                        documentData.involvedTasks.forEach(task => {
                        task.get()
                            .then(res => {
                                console.log(res.data())
                                documentData.tasksData.push(res.data())
                            })
                            .catch(error => {
                                // TO-DO SEND TO ERROR PAGE
                            })
                        })
                    })
                })
                .catch(error => {
                    // TO-DO SEND TO ERROR PAGE
                })
                .finally(() => {
                    firebase.database().goOffline()
                })
        },
        props: {
            title: String
        }
    }
</script>