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
                        <td>{{ props.item.customerData.name }} {{ props.item.customerData.surname }}</td>
                        <td>{{ props.item.type }}</td>
                        <td>{{ props.item.createdAt }}</td>
                        <td></td>
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
        mounted() {
            billingDocumentsRef.get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let documentData = doc.data()

                        documentData.customer.get()
                            .then(res => {
                                documentData.customerData = res.data()
                                this.documents.push({
                                    id: doc.id,
                                    ...documentData
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