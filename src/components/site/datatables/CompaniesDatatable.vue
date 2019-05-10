<template>
    <div id="companiesDatatable">        
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
            :search="search">
                <template v-slot:items="props">
                    <td>{{ props.item.cif }}</td>
                    <td>{{ props.item.name }}</td>
                    <td>{{ props.item.email }}</td>
                    <td>{{ props.item.phone }}</td>
                    <td>
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

    const db = firebase.firestore()
    let companiesRef = db.collection('customers')

    export default {    
        name: 'CompaniesDatatable',
        data() {
            return {
                companies: [],
                headers: [
                    { text: 'CIF', value: 'cif' },
                    { text: 'Nombre', value: 'name' },
                    { text: 'Correo electrónico', value: 'email' },
                    { text: 'Teléfono', value: 'phone' },
                    { text: 'Acciones', value: null }
                ],
                search: ''                
            }
        },
        methods: {
            deleteCompany(company) {
                companiesRef.doc(company.id).delete()
                    .then(() => {
                        this.companies.splice(company.index, 1)
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