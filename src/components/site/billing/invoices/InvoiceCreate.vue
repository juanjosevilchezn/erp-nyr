<template>
    <div id="invoiceCreate">
        <Navigation :app_part="title"/>

        <ErrorDialog
            message="Recuerda que debes seleccionar al menos una tarea para poder crear la factura."
            ref="invoiceErrorDialogOne"
            title="Ha ocurrido un error..."/>

        <ErrorDialog
            message="Has seleccionado una o más tareas que se encuentran asignadas a distintos clientes. Recuerda 
                    que para crear una factura todas las tareas deben estar asignadas al mismo cliente."
            ref="invoiceErrorDialogTwo"
            title="Ha ocurrido un error..."/>

        <ErrorDialog
            message='El cliente no tiene CIF/NIF asociado. Para crear esta factura el cliente debe tener un CIF/NIF 
                    asociado. Añade este dato en la página "Clientes" y vuelve a intentarlo después.'
            ref="invoiceErrorDialogThree"
            title="Ha ocurrido un error..."/>

        <v-container fluid>
            <v-layout row fill-width>
                <v-flex xs2>
                    <v-btn
                        block
                        color="primary"
                        href="/billing">
                        <v-icon>arrow_back</v-icon><span>&nbsp; Atrás</span>
                    </v-btn>
                </v-flex>
            </v-layout>

            <v-layout row fill-width mt-3>
                <InfoAlert
                    message="En este listado solo aparecerán aquellas tareas que se encuentren entregadas o finalizadas."/>
            </v-layout>

            <v-layout row wrap mt-3 fill-width>
                <v-flex xs12>
                    <BillableTasksDatatable
                        ref="billableTasksDatatable"
                        title="Listado de tareas facturables"/>
                </v-flex>

                <v-flex xs12 mt-2 fill-width>
                    <v-btn
                        block
                        color="success"
                        @click="this.saveInvoice">
                        <v-icon>done</v-icon><span>&nbsp; Crear factura</span>
                    </v-btn>
                </v-flex>
            </v-layout>                  
        </v-container>
    </div>
</template>

<script>
    import firebase from 'firebase'
    import ErrorDialog from '../../../dialogs/ErrorDialog'
    import InfoAlert from '../../../alerts/InfoAlert'
    import Navigation from '../../navigation/Navigation'
    import BillableTasksDatatable from '../../../datatables/BillableTasksDatatable'

    const db = firebase.firestore()
    const billingDocumentsRef = db.collection('billingDocuments').doc()
    const tasksRef = db.collection('tasks')

    export default {    
        name: 'InvoiceCreate',
        components: {
            BillableTasksDatatable,
            ErrorDialog,
            InfoAlert,
            Navigation
        },
        computed: {
            areSameCustomersTasksSelected() {
                const propOne = 'customer'
                const propTwo = 'id'
                const arr = this.$refs.billableTasksDatatable.selected
                const value = arr[0][propOne][propTwo];
                const valid = !arr.some((element) => element[propOne][propTwo] !== value)

                return valid
            },
            getCustomerId() {
                return this.$refs.billableTasksDatatable.selected[0].customer.id
            },
            hasDocumentation() {
                let customer = this.$refs.billableTasksDatatable.selected[0].customerData
                let valid = false

                console.log(customer)

                if (customer.type == 'company') {
                    valid = customer.cif != '' ? true : false
                } else if (customer.type == 'person') {
                    valid = customer.nif != '' ? true : false
                }
                console.log(valid)

                return valid
            },
            involvedTasksDocs() {
                let docs = []

                this.$refs.billableTasksDatatable.selected.forEach(task => {
                    docs.push(db.doc('/tasks/' + task.id))
                });

                return docs
            }
        },
        methods: {
            saveInvoice() {
                if (this.$refs.billableTasksDatatable.selected.length) {
                    if (this.areSameCustomersTasksSelected) {
                        if (this.hasDocumentation) {
                            let data = {
                                customer: db.doc('/customers/' + this.getCustomerId),
                                involvedTasks: this.involvedTasksDocs,
                                type: 'invoice',
                                createdAt: new Date()
                            }

                            billingDocumentsRef.set(data)
                                .then(() => {
                                    // active success alert component TO-DO
                                })
                                .catch(error => {
                                    // active error alert component TO-DO
                                })
                                .finally(() => {
                                    firebase.database().goOffline()
                                })

                            this.setBilledState()
                            this.$refs.billableTasksDatatable.selected = []
                        } else {
                            this.$refs.invoiceErrorDialogThree.isShown = true
                        }                        
                    } else {
                        this.$refs.invoiceErrorDialogTwo.isShown = true
                    }                    
                } else {
                    this.$refs.invoiceErrorDialogOne.isShown = true
                }                 
            },
            setBilledState() {
                this.$refs.billableTasksDatatable.selected.forEach(task => {
                    tasksRef.doc(task.id).update({ state: 'Facturado', updatedAt: new Date() })
                    
                    let index = this.$refs.billableTasksDatatable.tasks.map(item => item.id).indexOf(task.id)
                    this.$refs.billableTasksDatatable.tasks.splice(index, 1)
                });
            }
        },
        props: {
            title: String
        }
    }
</script>