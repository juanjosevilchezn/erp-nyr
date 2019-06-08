<template>
    <div id="companiesDatatable">    
        <DeleteConfirmationDialog
            ref="companyDeleteDialog"/>

        <CustomerDetailsDialog
            ref="customerDetailsDialog"/>

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
                :items="this.companies"
                :search="search"
                no-data-text="No existen empresas. Deberás crear alguna antes para que aparezcan aquí.">
                <template v-slot:items="props">                    
                    <td>{{ props.item.name }}</td>
                    <td>{{ props.item.cif }}</td>
                    <td>{{ props.item.email }}</td>
                    <td>{{ props.item.phone }}</td>
                    <td>
                        <v-btn 
                            flat
                            icon
                            color="primary"
                            @click="showCompany(props.item)">
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
                            @click="deleteCompany(props.item)">
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
    let companiesRef = db.collection('customers')

    export default {    
        name: 'CompaniesDatatable',
        components: {
            CustomerDetailsDialog,
            DeleteConfirmationDialog
        },
        data() {
            return {
                companies: [],
                headers: [                    
                    { text: 'Nombre', value: 'name' },
                    { text: 'CIF', value: 'cif' },
                    { text: 'Correo electrónico', value: 'email' },
                    { text: 'Teléfono', value: 'phone' },
                    { text: 'Acciones', value: null, sortable: false }
                ],
                search: ''                
            }
        },
        methods: {
            deleteCompany(company) {
                const title = '¿Estás segur@ de eliminar esta empresa?'
                const message = 'Este proceso es irreversible y no podrás recuperar los datos borrados. Junto con la empresa se eliminarán ' +
                                'las tareas, albaranes y facturas de la misma.'

                this.$refs.companyDeleteDialog.open(title, message)
                    .then(() => {
                        companiesRef.doc(company.id).delete()
                            .then(() => {
                                let index = this.companies.map(item => item.id).indexOf(company.id)

                                this.companies.splice(index, 1)
                            })
                            .catch((error) => {
                                // SEND TO ERROR PAGE TO-DO
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
            showCompany(company) {
                this.$refs.customerDetailsDialog.customer = company
                this.$refs.customerDetailsDialog.isShown = true
            }
        },
        mounted() {
            companiesRef.get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        if (doc.data().type == 'company') {
                            this.companies.push({
                                id: doc.id,
                                ...doc.data()
                            })
                        }
                    })
                })
        },
        props: {
            title: String
        }
    }
</script>