<template>
    <div id="tasksDatatable">        
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
            :headers="this.headers"
            :items="this.tasks"
            :search="search">
                <template v-slot:items="props">
                    <td>{{ props.item.customerData.name }} {{ props.item.customerData.surname }}</td>                    
                    <td>{{ props.item.description }}</td>                    
                    <td>{{ props.item.price }}</td>
                    <td>
                        <v-chip color="orange" text-color="white" v-if="props.item.type == 'arrangement'" disabled>
                            Arreglo                            
                        </v-chip>
                        <v-chip color="indigo" text-color="white" v-if="props.item.type == 'manufacture'" disabled>
                            Confección                            
                        </v-chip>
                    </td>
                    <td>
                        <v-chip color="#70ddff" text-color="black" v-if="props.item.state == 'Presupuestado'" disabled>
                            Presupuestado                            
                        </v-chip>
                        <v-chip color="teal lighten-4" text-color="black" v-if="props.item.state == 'Confirmado'" disabled>
                            Confirmado                            
                        </v-chip>
                        <v-chip color="green accent-3" text-color="black" v-if="props.item.state == 'Finalizado'" disabled>
                            Finalizado                            
                        </v-chip>
                        <v-chip color="lime lighten-1" text-color="black" v-if="props.item.state == 'Entregado'" disabled>
                            Entregado                            
                        </v-chip>
                        <v-chip color="brown lighten-4" text-color="black" v-if="props.item.state == 'Facturado'" disabled>
                            Facturado
                        </v-chip>
                    </td>
                    <td>{{ props.item.deliveryDate }}</td>
                    <td>
                        <v-btn 
                            flat
                            icon
                            color="primary">
                            <v-icon>remove_red_eye</v-icon>
                        </v-btn>
                        <v-btn 
                            flat
                            icon
                            color="yellow darken-2"
                            @click="goToEdit(props.item.id)"
                            v-if="props.item.state != 'Entregado' && props.item.state != 'Facturado'">
                            <v-icon>edit</v-icon>
                        </v-btn>
                        <v-btn 
                            flat
                            icon
                            color="red"
                            @click="deleteTask(props.item)"
                            v-if="props.item.state != 'Entregado' && props.item.state != 'Facturado'">
                            <v-icon>delete</v-icon>
                        </v-btn>
                    </td>
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

    const db = firebase.firestore()
    let tasksRef = db.collection('tasks')

    export default {    
        name: 'TasksDatatable',
        data() {
            return {
                tasks: [],
                headers: [
                    { text: 'Cliente', value: 'customerData.name' },        
                    { text: 'Descripción', value: 'description' },
                    { text: 'Precio', value: 'price' },
                    { text: 'Tipo', value: 'type' },
                    { text: 'Estado', value: 'state' },
                    { text: 'Fecha de entrega', value: 'deliveryDate' },
                    { text: 'Acciones', value: null, sortable: false }
                ],
                search: ''
            }
        },
        methods: {
            deleteTask(task) {
                tasksRef.doc(task.id).delete()
                    .then(() => {
                        let index = this.tasks.map(item => item.id).indexOf(task.id)

                        this.tasks.splice(index, 1)
                    })                
            },
            goToEdit(taskId) {
                this.$router.push(
                    { 
                        name: 'TaskEdit', 
                        params: { 
                            id:  taskId
                        } 
                    })
            }
        },
        mounted() {
            tasksRef.get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let taskData = doc.data()

                        taskData.customer.get()
                            .then(res => {
                                taskData.customerData = res.data()
                                this.tasks.push({
                                    id: doc.id,
                                    ...taskData
                                })
                            })
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