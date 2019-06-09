<template>
    <div id="personsDatatable">
        <DeleteConfirmationDialog
            ref="personDeleteDialog"/>

        <CustomerDetailsDialog
            ref="customerDetailsDialog"/>

        <v-card class="elevation-6">
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
                :items="this.persons"
                :search="search"
                no-data-text="No existen clientes. Deberás crear alguno antes para que aparezcan aquí.">
                <template v-slot:items="props">                    
                    <td>{{ props.item.name }}</td>
                    <td>{{ props.item.surname }}</td>
                    <td>{{ props.item.nif }}</td>
                    <td>{{ props.item.email }}</td>
                    <td>{{ props.item.phone }}</td>
                    <td>
                        <v-btn 
                            flat
                            icon
                            color="primary"
                            @click="showPerson(props.item)">
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
                            @click="deletePerson(props.item)">
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
    import DeleteConfirmationDialog from '../dialogs/DeleteConfirmationDialog'
    import CustomerDetailsDialog from '../dialogs/CustomerDetailsDialog'

    const db = firebase.firestore()
    const documentsRef = db.collection('billingDocuments')
    const personsRef = db.collection('customers')
    const tasksRef = db.collection('tasks')

    export default {    
        name: 'PersonsDatatable',
        components: {
            CustomerDetailsDialog,
            DeleteConfirmationDialog
        },
        data() {
            return {
                persons: [],
                headers: [                    
                    { text: 'Nombre', value: 'name' },
                    { text: 'Apellidos', value: 'surname' },
                    { text: 'NIF', value: 'nif' },
                    { text: 'Correo electrónico', value: 'email' },
                    { text: 'Teléfono', value: 'phone' },
                    { text: 'Acciones', value: null, sortable: false }
                ],
                search: ''
            }
        },
        methods: {
            deletePerson(person) {
                const title = '¿Estás segur@ de eliminar este cliente?'
                const message = 'Este proceso es irreversible y no podrás recuperar los datos borrados. Junto con el cliente se eliminarán ' +
                                'las tareas, albaranes y facturas del mismo.'

                this.$refs.personDeleteDialog.open(title, message)
                    .then(async () => {
                        const personRef = personsRef.doc(person.id)

                        await documentsRef.where('customer', '==', personRef).get()
                            .then(docs => {
                                docs.forEach(doc => {
                                    doc.ref.delete()
                                })
                            })
                            .catch(error => {
                                this.$rollbar.warning('Aviso. No ha sido posible eliminar los documentos del cliente ' + person.id + ' en el método deletePerson() del componente PersonsDatatable. ' + error)
                            })
                            .finally(() => {
                                firebase.database().goOffline()
                            })

                        await tasksRef.where('customer', '==', personRef).get()
                            .then(docs => {
                                docs.forEach(doc => {
                                    doc.ref.delete()
                                })
                            })
                            .catch(error => {
                                this.$rollbar.warning('Aviso. No ha sido posible eliminar las tareas del cliente ' + person.id + ' en el método deletePerson() del componente PersonsDatatable. ' + error)
                            })
                            .finally(() => {
                                firebase.database().goOffline()
                            })

                        await personRef.delete()
                            .then(() => {
                                let index = this.persons.map(item => item.id).indexOf(person.id)

                                this.persons.splice(index, 1)
                            }) 
                            .catch(error => {
                                this.$rollbar.warning('Aviso. No ha sido posible eliminar el cliente ' + person.id + ' en el método deletePerson() del componente PersonsDatatable. ' + error)
                            })
                            .finally(() => {
                                firebase.database().goOffline()
                            })
                            
                    })
                    .catch(() => {
                        // NOTHING HAPPENS
                    })
            },
            goToEdit(customerId) {
                this.$router.push(
                    { 
                        name: 'CustomerEdit', 
                        params: { 
                            id:  customerId
                        } 
                    })
            },
            showPerson(person) {
                this.$refs.customerDetailsDialog.customer = person
                this.$refs.customerDetailsDialog.isShown = true
            }
        },
        mounted() {
            personsRef.get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        if (doc.data().type == 'person') {
                            this.persons.push({
                                id: doc.id,
                                ...doc.data()
                            })
                        }
                    })
                })
                .catch(error => {
                    this.$rollbar.critical('Crítico. No ha sido posible recuperar los clientes en el método mounted() del componente PersonsDatatable. ' + error)
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