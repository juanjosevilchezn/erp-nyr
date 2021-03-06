<template>
    <div id="invoice-preview">
        <v-container>
            <v-layout row wrap fill-width>
                <v-flex xs12>
                    <p class="title">FACTURA</p>
                </v-flex>
                <v-flex xs12 invoice-details>
                    <b>Fecha:</b> 28/05/2018<br/>
                    <b>Número de factura:</b>&nbsp;<span style="border: 1px solid black;">________</span>
                </v-flex>      
            </v-layout>
            <v-layout row wrap fill-width>
                <v-flex xs12 mb-4 mt-4>
                    <hr/>
                </v-flex>
                <v-flex xs5 billing-details>
                    <b>Facturado a:</b><br/><br/>
                    {{ fullname }}<br/>
                    {{ documentation }}<br/>
                    {{ customer.address.homeAddress }}<br/>
                    {{ customer.address.locality }}, {{ customer.address.province }}<br/>
                    {{ customer.address.country }}
                </v-flex>
                <v-flex xs2>
                    <!-- SPACE BETWEEN BILLING DETAILS -->
                </v-flex>
                <v-flex xs5 billing-details>
                    <b>Facturado por:</b><br/><br/>
                    {{ settings.comercial_name }}<br/>
                    {{ settings.cif }}<br/>
                    {{ settings.address.home_address }}<br/>
                    {{ settings.address.locality }}, {{ settings.address.province }}<br/>
                    {{ settings.address.zip }}
                </v-flex>
                <v-flex xs12 mb-4 mt-4>
                    <hr/>
                </v-flex>
            </v-layout>
            <v-layout row wrap fill-width>
                <v-flex xs12>
                    <table class="table fill-width">
                        <tr>
                            <th style="width: 40%">Descripción arreglo</th>
                            <th style="width: 12%">Cantidad</th>
                            <th style="width: 12%">P. unitario (IVA exc.)</th>
                            <th style="width: 12%">IVA</th>
                            <th style="width: 12%">P. unitario (IVA inc.)</th>
                            <th style="width: 12%">P. total (IVA inc.)</th>
                        </tr>
                        <tr v-for="task in tasks" v-bind:key="task.id">
                            <td>{{ task.description }}</td>
                            <td>{{ task.quantity }}</td>
                            <td>{{ parseInt(task.price).toFixed(2) }}€</td>
                            <td>21%</td>
                            <td>{{ getPriceTaxApplied(task.price) }}€</td>
                            <td>{{ getTotalTaskPriceTaxApplied(task.price, task.quantity) }}€</td>
                        </tr>
                    </table>
                </v-flex>            
            </v-layout>
            <v-layout row wrap fill-width v-if="anyTaskHasExtra">
                <v-flex xs12 mb-4 mt-1>
                    <!-- TOP SPACE TO MAIN TABLE-->
                </v-flex>
                <v-flex xs3>
                    <!-- LEFT SPACE TO RESUME BOX -->
                </v-flex>
                <v-flex xs6>
                    <table class="table fill-width">
                        <tr>
                            <th style="width: 70%;">Suplemento</th>
                            <th style="width: 30%;">Precio</th>
                        </tr>
                        <tr v-for="task in tasksHasExtra" v-bind:key="task.id">
                            <td>{{ task.extra.description }}</td>
                            <td>{{ parseInt(task.extra.price).toFixed(2) }}€</td>
                        </tr>
                    </table>
                </v-flex>
                <v-flex xs3>
                    <!-- RIGHT SPACE TO RESUME BOX -->
                </v-flex>            
            </v-layout>
            <v-layout row wrap fill-width>
                <v-flex xs12 mb-4 mt-4>
                    <hr/>
                </v-flex>
                <v-flex xs8>
                    <!-- LEFT SPACE TO RESUME BOX -->
                </v-flex>
                <v-flex xs4>
                    <table class="table fill-width">
                        <tr>
                            <th style="width: 30%;">IVA</th>
                            <td style="width: 70%;">21%</td>
                        </tr>
                        <tr>
                            <th style="width: 30%;">Total</th>
                            <td style="width: 70%;">{{ total }}€</td>
                        </tr>
                    </table>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import firebase from 'firebase'

    const db = firebase.firestore()
    let documentsRef = db.collection('billingDocuments')
    let settingsRef = db.collection('settings').doc('RszgIiX4x0cpCiRTsU')

    export default {
        name: 'InvoicePreview',
        computed: {
            fullname() {
                let fullname = ''

                if (this.customer.type == 'person') {
                    fullname = this.customer.name + ' ' + this.customer.surname
                } else {
                    fullname = this.customer.name
                }               

                return fullname
            },
            documentation() {
                let documentation = ''

                if (this.customer.type == 'person') {
                    documentation = this.customer.nif
                } else {
                    documentation = this.customer.cif
                }               

                return documentation
            },
            anyTaskHasExtra() {
                let valid = false

                this.tasks.forEach(task => {
                    if (task.extra.price > 0) {
                        valid = true
                    }
                })

                return valid
            },
            tasksHasExtra() {
                return this.tasks.filter((task) => task.extra.price > 0)
            },
            total() {
                let total = 0

                this.tasks.forEach(task => {
                    total += parseInt(task.quantity * task.price)
                    total += parseInt(task.extra.price)
                })

                total = total * 1.21
                total = total.toFixed(2)

                return total
            }
        },
        data() {
            return {
                customer: {
                    type: '',
                    name: '',
                    surname: '',
                    cif: '',
                    nif: '',
                    phone: '',
                    address: {
                        homeAddress: '',
                        locality: '',
                        province: '',
                        country: '',
                    }
                },
                settings: {
                    cif: '',                    
                    comercial_name: '',
                    brand: '',
                    address: {
                        home_address: '',
                        locality: '',
                        province: '',
                        zip: ''
                    },
                    email: '',
                    tlf_fijo: '',
                    phone: '',
                    url_photo: ''
                },
                invoice: {},
                tasks: []
            }
        },
        methods: {
            getPriceTaxApplied(price) {
                let calculatedPrice = 0

                calculatedPrice = price * 1.21

                return calculatedPrice
            },
            getTotalTaskPriceTaxApplied(price, quantity) {
                let calculatedPrice = 0

                calculatedPrice = (price * quantity) * 1.21
                calculatedPrice = calculatedPrice.toFixed(2)

                return calculatedPrice
            }
        },
        mounted() {
            settingsRef.get()
                .then((doc) => {
                    this.settings = doc.data()
                })
                .catch((error) => {
                    this.$rollbar.critical('Crítico. No se han podido recuperar los datos de la empresa en el método mounted() del componente InvoicePreview. ' + error)
                })
                .finally(() => {
                    firebase.database().goOffline()
                })

            documentsRef.doc(this.$route.params.id).get()
                .then(doc => {
                    this.invoice = {
                        id: doc.id,
                        type: doc.data().type,
                        createdAt: doc.data().createdAt
                    }

                    doc.data().customer.get()
                        .then(customer => {
                            this.customer = {
                                id: customer.id,
                                ...customer.data()
                            }
                        })
                        .catch(error => {
                            this.$rollbar.critical('Crítico. No se ha podido recuperar el cliente en el método mounted() del componente InvoicePreview. ' + error)
                        })

                    doc.data().involvedTasks.forEach(task => {
                        task.get()
                            .then(taskDoc => {
                                this.tasks.push({
                                    id: taskDoc.id,
                                    ...taskDoc.data()
                                })
                            })
                            .catch(error => {
                                this.$rollbar.critical('Crítico. No se han podido recuperar las tareas involucradas en el método mounted() del componente InvoicePreview. ' + error)
                            })
                    })
                })
                .catch(error => {
                    this.$rollbar.critical('Crítico. No se han podido recuperar los documentos en el método mounted() del componente InvoicePreview. ' + error)
                })
                .finally(() => {
                    firebase.database().goOffline()
                })           
        }
    }
</script>

<style>
    #invoice-preview .billing-details {
        font-size: 13pt;
        text-align: start;
    }

    #invoice-preview .invoice-details {
        font-size: 16pt;
        text-align: end;
    }

    #invoice-preview .fill-width {
        width: 100%;
    }

    #invoice-preview table {
        text-align: center;
    }

    #invoice-preview th {
        background-color: black;
        color: white;
        font-size: 11pt;
        font-weight: bold;
        height: 30px;
    }

    #invoice-preview td {
        border-bottom: 1px solid black;
        font-size: 10pt;
        height: 30px;
    }

    #invoice-preview .title {
        font-size: 26pt !important;
        font-weight: bold;
        text-align: end;
    }
</style>

