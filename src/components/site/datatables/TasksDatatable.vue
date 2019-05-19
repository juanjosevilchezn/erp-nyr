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
                    <td>{{ props.item.description }}</td>
                    <td>{{ props.item.type }}</td>
                    <td>{{ props.item.price }}</td>
                    <td>{{ props.item.state }}</td>
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
                            @click="goToEdit(props.item.id)">
                            <v-icon>edit</v-icon>
                        </v-btn>
                        <v-btn 
                            flat
                            icon
                            color="red"
                            @click="deleteTask(props.item)">
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
                    { text: 'Descripción', value: 'description' },
                    { text: 'Tipo', value: 'type' },
                    { text: 'Precio', value: 'price' },
                    { text: 'Estado', value: 'state' },
                    { text: 'Fecha de entrega', value: 'deliveryDate' },                    
                    { text: 'Acciones', value: null }
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
                        this.tasks.push({
                            id: doc.id,
                            ...doc.data()
                        })                        
                    })
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