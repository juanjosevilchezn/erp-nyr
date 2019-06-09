<template>
    <div id="deliveryNoteCreate">
        <Navigation :app_part="title"/>

        <ErrorDialog
            message="Recuerda que debes seleccionar al menos una tarea para poder crear el albarán de entrega."
            ref="deliveryErrorDialogOne"
            title="Ha ocurrido un error..."/>

        <ErrorDialog
            message="Has seleccionado una o más tareas que se encuentran asignadas a distintos clientes. Recuerda 
                    que para crear un albarán todas las tareas deben estar asignadas al mismo cliente."
            ref="deliveryErrorDialogTwo"
            title="Ha ocurrido un error..."/>

        <v-container fluid>
            <v-layout row fill-width>
                <v-flex xs2>
                    <v-btn
                        block
                        color="primary"
                        href="/billing"
                        class="elevation-6">
                        <v-icon>arrow_back</v-icon><span>&nbsp; Atrás</span>
                    </v-btn>
                </v-flex>
            </v-layout>

            <v-layout row fill-width mt-3>
                <InfoAlert
                    message="En este listado solo se mostrarán aquellas tareas que se encuentren finalizadas."/>
            </v-layout>

            <v-layout row mt-3 fill-width>
                <SuccessAlert
                    ref="successAlert"
                    message="El albarán de entrega ha sido generado con éxito."/>
            </v-layout>

            <v-layout row mt-3 fill-width>
                <v-flex xs12>
                    <FinishedTasksDatatable
                        ref="finishedTasksDatatable"
                        title="Listado de tareas finalizadas"/>
                </v-flex>
            </v-layout>

            <v-layout row mt-2 fill-width>
                <v-flex xs12>
                    <v-btn
                        block
                        color="success"
                        @click="saveDeliveryNote"
                        class="elevation-6"
                        style="margin-top: 10px;">
                        <v-icon>create</v-icon><span>&nbsp; Crear albarán de entrega</span>
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
    import SuccessAlert from '../../../alerts/SuccessAlert'
    import Navigation from '../../navigation/Navigation'
    import FinishedTasksDatatable from '../../../datatables/FinishedTasksDatatable'

    const db = firebase.firestore()
    const billingDocumentsRef = db.collection('billingDocuments').doc()
    const tasksRef = db.collection('tasks')

    export default {    
        name: 'DeliveryNoteCreate',
        components: {
            ErrorDialog,
            FinishedTasksDatatable,
            InfoAlert,
            SuccessAlert,
            Navigation
        },
        computed: {
            areSameCustomersTasksSelected() {
                const propOne = 'customer'
                const propTwo = 'id'
                const arr = this.$refs.finishedTasksDatatable.selected
                const value = arr[0][propOne][propTwo];
                const valid = !arr.some((element) => element[propOne][propTwo] !== value)

                return valid
            },
            getCustomerId() {
                return this.$refs.finishedTasksDatatable.selected[0].customer.id
            },
            involvedTasksDocs() {
                let docs = []

                this.$refs.finishedTasksDatatable.selected.forEach(task => {
                    docs.push(db.doc('/tasks/' + task.id))
                });

                return docs
            }
        },
        methods: {
            saveDeliveryNote() {
                if (this.$refs.finishedTasksDatatable.selected.length) {
                    if (this.areSameCustomersTasksSelected) {
                        let data = {
                            customer: db.doc('/customers/' + this.getCustomerId),
                            involvedTasks: this.involvedTasksDocs,
                            type: 'delivery_note',
                            createdAt: new Date()
                        }

                        billingDocumentsRef.set(data)
                            .then(() => {
                                this.$refs.successAlert.isShown = true
                            })
                            .catch(error => {
                                this.$refs.successAlert.isShown = false
                                this.$rollbar.warning('Aviso. No ha sido posible guardar el albarán de entrega en el método saveDeliveryNote() del componente DeliveryNoteCreate. ' + error)
                            })
                            .finally(() => {
                                firebase.database().goOffline()
                            })

                        this.setDeliveredState()
                        this.$refs.finishedTasksDatatable.selected = []
                    } else {
                        this.$refs.deliveryErrorDialogTwo.isShown = true
                    }                    
                } else {
                    this.$refs.deliveryErrorDialogOne.isShown = true                    
                }                 
            },
            setDeliveredState() {
                this.$refs.finishedTasksDatatable.selected.forEach(task => {
                    tasksRef.doc(task.id).update({ state: 'Entregado', updatedAt: new Date() })
                    
                    let index = this.$refs.finishedTasksDatatable.tasks.map(item => item.id).indexOf(task.id)
                    this.$refs.finishedTasksDatatable.tasks.splice(index, 1)
                });
            }
        },
        props: {
            title: String
        }
    }
</script>