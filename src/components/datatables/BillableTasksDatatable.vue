<template>
    <div id="billableTasksDatatable">        
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
            v-model="selected"
            item-key="id"
            :headers="headers"
            :items="tasks"
            :search="search"
            no-data-text="No existen tareas finalizadas. Deberás finalizar alguna antes para que aparezcan aquí.">
                <template v-slot:items="props">
                    <td>
                        <v-checkbox
                            color="primary"
                            v-model="props.selected"
                            primary
                            hide-details/>
                    </td>
                    <td>{{ props.item.customerData.name }} {{ props.item.customerData.surname }}</td>
                    <td>{{ props.item.description }}</td>
                    <td>
                        <v-chip color="orange" text-color="white" v-if="props.item.type == 'arrangement'" disabled>
                            Arreglo                            
                        </v-chip>
                        <v-chip color="indigo" text-color="white" v-if="props.item.type == 'manufacture'" disabled>
                            Confección                            
                        </v-chip>
                    </td>
                    <td>{{ props.item.deliveryDate | formatDate }}</td>
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
    let tasksRef = db.collection('tasks')

    export default {    
        name: 'BillableTasksDatatable',
        data() {
            return {
                tasks: [],
                selected: [],
                headers: [
                    { text: '', value: null, sortable: false },
                    { text: 'Cliente', value: 'customerData.name' },                 
                    { text: 'Descripción', value: 'description' },                    
                    { text: 'Tipo', value: 'type' },
                    { text: 'Fecha de entrega', value: 'deliveryDate' }
                ],
                search: ''
            }
        },
        filters: {
            formatDate: (date) => {
                return moment(date.toDate).format('DD-MM-YYYY');
            }
        },
        mounted() {
            tasksRef.get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let taskData = doc.data()

                        if (doc.data().state == 'Finalizado' || doc.data().state == 'Entregado') {
                            taskData.customer.get()
                                .then(res => {
                                    taskData.customerData = res.data()
                                    this.tasks.push({
                                        id: doc.id,
                                        ...taskData
                                    })
                                })
                        }
                    })
                })
                .catch(error => {

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