<template>
    <div id="taskEdit">
        <Navigation :app_part="title"/>

        <v-container fluid>
            <v-layout row wrap fill-width>
                <v-flex xs2>
                    <v-btn
                        block
                        color="primary"
                        href="/tasks"
                        class="elevation-6">
                        <v-icon>arrow_back</v-icon><span>&nbsp; Atrás</span>
                    </v-btn>
                </v-flex>

                <v-flex xs12 mt-2>
                    <SuccessAlert
                        ref="successAlert"
                        message="La tarea ha sido actualizada con éxito."/>
                </v-flex>               

                <v-flex xs12 mt-3>
                    <v-card color="grey lighten-4" class="elevation-6">
                        <v-card-text>
                            <h2 style="color: grey;">Datos de la tarea</h2>
                            
                            <v-form
                                ref="formTaskCreate"
                                v-model="valid"
                                lazy-validation
                                @submit.prevent="checkForm">
                                <v-layout row>
                                    <v-flex xs12>
                                        <v-radio-group v-model="type" row>
                                            <v-radio color="primary" label="Arreglo" value="arrangement"></v-radio>
                                            <v-radio color="primary" label="Confección" value="manufacture"></v-radio>
                                        </v-radio-group>
                                    </v-flex>                                    
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs9 pr-2>
                                        <v-text-field
                                            v-model="description"
                                            label="Descripción de la tarea"
                                            :rules="required"
                                            outline
                                            required>
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs3 pl-2>
                                        <v-overflow-btn
                                            :items="states"
                                            v-model="state"
                                            label="Estado"
                                            :rules="required"
                                            item-value="name"
                                            item-text="name"
                                            editable
                                            outline
                                            required/>
                                    </v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs8 pr-2>
                                        <v-overflow-btn
                                            :items="customers"
                                            v-model="customerData.id"
                                            label="Cliente"
                                            :rules="required"
                                            item-value="id"
                                            :item-text="getFormattedText"
                                            editable
                                            outline
                                            required/>
                                    </v-flex>
                                    <v-flex xs4 pl-2>
                                        <v-text-field
                                            v-model="quantity"
                                            label="Cantidad"
                                            :rules="required_number"
                                            type="number"
                                            min="1"
                                            outline
                                            required>
                                        </v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs6 pr-2>
                                        <v-menu
                                            v-model="deliveryDateMenu"
                                            :close-on-content-click="false"
                                            :nudge-right="40"
                                            lazy
                                            transition="scale-transition"
                                            offset-y
                                            full-width
                                            min-width="290px">
                                            <template v-slot:activator="{ on }">
                                                <v-text-field
                                                    v-model="deliveryDate"
                                                    label="Fecha máxima de entrega"
                                                    readonly
                                                    outline                                                    
                                                    v-on="on"
                                                    :rules="required">
                                                </v-text-field>
                                            </template>
                                            <v-date-picker
                                                v-model="deliveryDate"
                                                @input="deliveryDateMenu = false"
                                                locale="es"
                                                :allowed-dates="allowedDates"/>
                                        </v-menu>
                                    </v-flex>
                                    <v-flex xs6 pl-2>
                                        <v-text-field
                                            v-model="price"                                            
                                            label="Precio"
                                            :rules="required_number"
                                            type="number"
                                            min="0"
                                            outline
                                            required>
                                        </v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs12 pb-4>
                                        <v-expansion-panel>
                                            <v-expansion-panel-content>
                                                <template v-slot:header>
                                                    <span style="color: gray; font-size: 12pt;">¿Suplemento?</span>
                                                </template>
                                                <v-card color="grey lighten-4">
                                                    <v-card-text>
                                                        <v-card>
                                                            <v-card-title/>
                                                            <v-card-text>
                                                                <v-layout row>
                                                                    <v-flex xs9 pr-2>
                                                                        <v-text-field
                                                                            v-model="extra.description"                                            
                                                                            label="Descripción suplemento"
                                                                            outline>
                                                                        </v-text-field>
                                                                    </v-flex>

                                                                    <v-flex xs3 pl-2>
                                                                        <v-text-field
                                                                            v-model="extra.price"                                          
                                                                            label="Coste suplemento"
                                                                            :rules="requiredNumberRule"
                                                                            type="number"
                                                                            min="0"                                                                    
                                                                            outline
                                                                            required>
                                                                        </v-text-field>
                                                                    </v-flex>
                                                                </v-layout>
                                                            </v-card-text>
                                                        </v-card>
                                                    </v-card-text>
                                                </v-card>
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>                                        
                                    </v-flex>                                    
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs12 pb-4>
                                        <v-expansion-panel>
                                            <v-expansion-panel-content>
                                                <template v-slot:header>
                                                    <span style="color: gray; font-size: 12pt;">¿Medidas?</span>
                                                </template>
                                                <v-card color="grey lighten-4">
                                                    <v-card-text>
                                                        <!-- ANCHO -->
                                                        <v-layout row>
                                                            <v-flex xs12>
                                                                <v-card>
                                                                    <v-card-text>
                                                                        <v-layout row pb-4>
                                                                            <span style="color: gray; font-size: 14pt; font-weight: bold;">Ancho</span>
                                                                        </v-layout>
                                                                        <v-layout row>
                                                                            <v-flex pr-2>
                                                                                <v-text-field
                                                                                    v-model="measures.ancho.espalda"
                                                                                    label="Espalda"
                                                                                    :rules="requiredNumberRule"
                                                                                    type="number"
                                                                                    min="0"                                                                    
                                                                                    outline
                                                                                    required>
                                                                                </v-text-field>
                                                                            </v-flex>
                                                                            <v-flex pl-2 pr-2>
                                                                                <v-text-field
                                                                                    v-model="measures.ancho.manga"
                                                                                    label="Manga"
                                                                                    :rules="requiredNumberRule"
                                                                                    type="number"
                                                                                    min="0"                                                                    
                                                                                    outline
                                                                                    required>
                                                                                </v-text-field>
                                                                            </v-flex>
                                                                            <v-flex pl-2 pr-2>
                                                                                <v-text-field
                                                                                    v-model="measures.ancho.pecho"
                                                                                    label="Pecho"
                                                                                    :rules="requiredNumberRule"
                                                                                    type="number"
                                                                                    min="0"                                                                    
                                                                                    outline
                                                                                    required>
                                                                                </v-text-field>
                                                                            </v-flex>
                                                                            <v-flex pl-2>
                                                                                <v-text-field
                                                                                    v-model="measures.ancho.puno"
                                                                                    label="Puño"
                                                                                    :rules="requiredNumberRule"
                                                                                    type="number"
                                                                                    min="0"                                                                    
                                                                                    outline
                                                                                    required>
                                                                                </v-text-field>
                                                                            </v-flex>
                                                                        </v-layout>
                                                                    </v-card-text>
                                                                </v-card>
                                                            </v-flex>
                                                        </v-layout>

                                                        <!-- BAJADA -->
                                                        <v-layout row pt-4>
                                                            <v-flex xs12>
                                                                <v-card>
                                                                    <v-card-text>
                                                                        <v-layout row pb-4>
                                                                            <span style="color: gray; font-size: 14pt; font-weight: bold;">Bajada</span>
                                                                        </v-layout>
                                                                        <v-layout row>
                                                                            <v-flex pr-2>
                                                                                <v-text-field
                                                                                    v-model="measures.bajada.pecho"
                                                                                    label="Pecho"
                                                                                    :rules="requiredNumberRule"
                                                                                    type="number"
                                                                                    min="0"                                                                   
                                                                                    outline
                                                                                    required>
                                                                                </v-text-field>
                                                                            </v-flex>
                                                                            <v-flex pl-2>
                                                                                <v-text-field
                                                                                    v-model="measures.bajada.tiro"
                                                                                    label="Tiro"
                                                                                    :rules="requiredNumberRule"
                                                                                    type="number"
                                                                                    min="0"                                                                    
                                                                                    outline
                                                                                    required>
                                                                                </v-text-field>
                                                                            </v-flex>
                                                                        </v-layout>
                                                                    </v-card-text>
                                                                </v-card>
                                                            </v-flex>
                                                        </v-layout>

                                                        <!-- CONTORNO -->
                                                        <v-layout row pt-4>
                                                            <v-flex xs12>
                                                                <v-card>
                                                                    <v-card-text>
                                                                        <v-layout row pb-4>
                                                                            <span style="color: gray; font-size: 14pt; font-weight: bold;">Contorno</span>
                                                                        </v-layout>
                                                                        <v-layout row>
                                                                            <v-flex pr-2>
                                                                                <v-text-field
                                                                                    v-model="measures.contorno.cadera"
                                                                                    label="Cadera"
                                                                                    :rules="requiredNumberRule"
                                                                                    type="number"
                                                                                    min="0"                                                                    
                                                                                    outline
                                                                                    required>
                                                                                </v-text-field>
                                                                            </v-flex>
                                                                            <v-flex pl-2 pr-2>
                                                                                <v-text-field
                                                                                    v-model="measures.contorno.cintura"
                                                                                    label="Cintura"
                                                                                    :rules="requiredNumberRule"
                                                                                    type="number"
                                                                                    min="0"                                                                    
                                                                                    outline
                                                                                    required>
                                                                                </v-text-field>
                                                                            </v-flex>
                                                                            <v-flex pl-2>
                                                                                <v-text-field
                                                                                    v-model="measures.contorno.pecho"
                                                                                    label="Pecho"
                                                                                    :rules="requiredNumberRule"
                                                                                    type="number"
                                                                                    min="0"                                                                    
                                                                                    outline
                                                                                    required>
                                                                                </v-text-field>
                                                                            </v-flex>
                                                                        </v-layout>
                                                                    </v-card-text>
                                                                </v-card>
                                                            </v-flex>
                                                        </v-layout>

                                                        <!-- LARGO -->
                                                        <v-layout row pt-4>
                                                            <v-flex xs12>
                                                                <v-card>
                                                                    <v-card-text>
                                                                        <v-layout row pb-4>
                                                                            <span style="color: gray; font-size: 14pt; font-weight: bold;">Largo</span>
                                                                        </v-layout>
                                                                        <v-layout row>
                                                                            <v-flex pr-2>
                                                                                <v-text-field
                                                                                    v-model="measures.largo.chaqueta"
                                                                                    label="Chaqueta"
                                                                                    :rules="requiredNumberRule"
                                                                                    type="number"
                                                                                    min="0"                                                                    
                                                                                    outline
                                                                                    required>
                                                                                </v-text-field>
                                                                            </v-flex>
                                                                            <v-flex pl-2 pr-2>
                                                                                <v-text-field
                                                                                    v-model="measures.largo.falda"
                                                                                    label="Falda"
                                                                                    :rules="requiredNumberRule"
                                                                                    type="number"
                                                                                    min="0"                                                                    
                                                                                    outline
                                                                                    required>
                                                                                </v-text-field>
                                                                            </v-flex>
                                                                            <v-flex pl-2 pr-2>
                                                                                <v-text-field
                                                                                    v-model="measures.largo.manga"
                                                                                    label="Manga"
                                                                                    :rules="requiredNumberRule"
                                                                                    type="number"
                                                                                    min="0"                                                                    
                                                                                    outline
                                                                                    required>
                                                                                </v-text-field>
                                                                            </v-flex>
                                                                            <v-flex pl-2 pr-2>
                                                                                <v-text-field
                                                                                    v-model="measures.largo.pantalon"
                                                                                    label="Pantalón"
                                                                                    :rules="requiredNumberRule"
                                                                                    type="number"
                                                                                    min="0"                                                                    
                                                                                    outline
                                                                                    required>
                                                                                </v-text-field>
                                                                            </v-flex>
                                                                            <v-flex pl-2>
                                                                                <v-text-field
                                                                                    v-model="measures.largo.total"
                                                                                    label="Total"
                                                                                    :rules="requiredNumberRule"
                                                                                    type="number"
                                                                                    min="0"                                                                    
                                                                                    outline
                                                                                    required>
                                                                                </v-text-field>
                                                                            </v-flex>
                                                                        </v-layout>
                                                                    </v-card-text>
                                                                </v-card>
                                                            </v-flex>
                                                        </v-layout>
                                                    </v-card-text>
                                                </v-card>
                                            </v-expansion-panel-content>
                                        </v-expansion-panel>                                        
                                    </v-flex>                                    
                                </v-layout>                                
                                <v-layout row>
                                    <v-textarea
                                        v-model="notes"
                                        label="Notas"
                                        outline/>
                                </v-layout>                
                                <v-layout row>
                                    <v-flex xs12>
                                        <v-btn
                                            block
                                            color="success"
                                            type="submit">
                                            <v-icon>save</v-icon><span>&nbsp; Guardar datos</span>
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                            </v-form>
                        </v-card-text>                    
                    </v-card>                    
                </v-flex>                
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import firebase from 'firebase'
    import moment from 'moment'
    import Navigation from '../navigation/Navigation'
    import SuccessAlert from '../../alerts/SuccessAlert'

    const db = firebase.firestore()
    let customersRef = db.collection('customers')
    let tasksRef = db.collection('tasks')

    export default {    
        name: 'TaskCreate',
        components: {
            Navigation,
            SuccessAlert
        },
        data() {
            return {
                type: 'arrangement',
                customer: '',
                customerData: {},
                description: '',
                price: 0,                
                quantity: 1,
                extra: {
                    description: '',
                    price: 0
                },
                deliveryDate: '',
                notes: '',
                measures: {    
                    ancho: {
                        espalda: 0,
                        manga: 0,
                        pecho: 0,
                        puno: 0
                    },
                    bajada: {
                        pecho: 0,
                        tiro: 0
                    },
                    contorno: {
                        pecho: 0,
                        cintura: 0,
                        cadera: 0
                    },
                    largo: {
                        chaqueta: 0,
                        falda: 0,
                        manga: 0,
                        pantalon: 0,
                        total: 0
                    }
                },
                state: '',             
                customers: [],
                states: ['Presupuestado', 'Confirmado', 'Finalizado'],
                required: [
                    v => !!v || 'Este campo es requerido'
                ],
                required_number: [
                    v => (v != '' || v.toString() == '0') || 'Este campo es requerido',
                    v => v >= 0 || 'Debes introducir un número positivo'
                ],
                deliveryDateMenu: false,
                valid: false,
            }
        },
        methods: {           
            allowedDates: (value) => moment(value).isAfter(new Date),
            checkForm() {
                if (this.$refs.formTaskCreate.validate()) {
                    this.updateTask()
                    this.$refs.formTaskCreate.resetValidation()
                }
            },            
            fillTask(task) {
                this.type = task.type
                this.description = task.description
                this.state = task.state
                this.price = task.price
                this.quantity = task.quantity
                this.extra = task.extra
                this.deliveryDate = task.deliveryDate
                this.customerData.id = task.customerData.id
                this.notes = task.notes
                this.measures = task.measures
            },
            getFormattedText: item => item.type == 'company' ? item.name + ' (' + item.phone + ')' : item.name + ' ' + item.surname + ' (' + item.phone + ')',           
            updateTask() {                
                let data = {
                    type: this.type,
                    customer: db.doc('/customers/' + this.customerData.id),
                    description: this.description,
                    price: this.price,
                    quantity: this.quantity,
                    extra: this.extra,
                    deliveryDate: this.deliveryDate,
                    notes: this.notes,
                    measures: this.measures,
                    state: this.state,
                    updatedAt: new Date()
                }

                tasksRef.doc(this.$route.params.id).update(data)
                    .then(() => {
                        this.$refs.successAlert.isShown = true
                    })
                    .catch(error => {                        
                        this.$refs.successAlert.isShown = false
                        this.$rollbar.warning('Aviso. No se ha podido actualizar la tarea en el método updateTask() del componente TaskEdit. ' + error)
                    })
                    .finally(() => {
                        firebase.database().goOffline()
                    }) 
            },
        },
        mounted() {
            customersRef.get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        this.customers.push({
                            id: doc.id,
                            ...doc.data()
                        })
                    })
                })
                .catch(error => {
                    this.$rollbar.critical('Crítico. No se ha podido recuperar los clientes en el método mounted() del componente TaskEdit. ' + error)
                })
                .finally(() => {
                    firebase.database().goOffline()
                })

            tasksRef.doc(this.$route.params.id).get()
                .then(doc => {
                    let taskData = doc.data()

                    taskData.customer.get()
                        .then(res => {
                            taskData.customerData = {
                                id: res.id,
                                ...res.data()
                            }
                            this.fillTask(taskData)
                        })
                })
                .catch(error => {
                    this.$rollbar.critical('Crítico. No se ha podido recuperar los datos de la tarea ' + this.$route.params.id + ' en el método mounted() del componente TaskEdit. ' + error)
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
