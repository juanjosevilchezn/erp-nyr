<template>
    <div id="notifications">
        <Navigation :app_part="title"/>

        <v-container fluid>
            <v-card style="width: 100%;" class="elevation-6">
                <v-card-text>
                    <v-form
                        ref="messageForm"
                        v-model="valid"
                        lazy-validation
                        @submit.prevent="sendMessage">
                        <v-layout row>
                            <v-combobox
                                v-model="selected"
                                :items="customers"
                                :item-text="getFormattedText"
                                hide-no-data
                                return-object
                                outline
                                :rules="addresseeRules"
                                label="Destinatario">
                            </v-combobox>
                        </v-layout>
                        <v-layout row>
                            <v-textarea
                                v-model="message"
                                label="Mensaje"
                                counter="1000"
                                :rules="messageRules"
                                outline/>
                        </v-layout>
                        <v-layout row>
                            <v-btn
                                block
                                bold
                                color="success"
                                type="submit">
                                Enviar mensaje &nbsp;&nbsp;<v-icon>send</v-icon>
                            </v-btn>
                        </v-layout>
                    </v-form>
                </v-card-text>
            </v-card>            
        </v-container>
    </div>
</template>

<script>
    import firebase from 'firebase'
    import Navigation from '../navigation/Navigation'

    const db = firebase.firestore()
    let customersRef = db.collection('customers')

    export default {
        name: 'Notifications',
        components: {
            Navigation
        },
        data() {
            return {
                message: '',
                selected: '',
                customers: [],
                addresseeRules: [
                    v => !!v || 'Este campo es requerido'
                ],
                messageRules: [
                    v => !!v || 'Este campo es requerido',
                    v => v.length <= 1000 || 'La longitud máxima del mensaje son 1000 carácteres'
                ],
                valid: false
            }
        },
        methods: {
            getFormattedText: item => item.type == 'company' ? item.name + ' (' + item.phone + ')' : item.name + ' ' + item.surname + ' (' + item.phone + ')',
            sendMessage() {
                if (this.$refs.messageForm.validate()) {
                    if (typeof this.selected != 'string') {                        
                        window.open('https://web.whatsapp.com/send?phone=' + encodeURI('34' + this.selected.phone) + '&text=' + encodeURI(this.message), "_blank")
                        this.clearData()
                        this.$refs.messageForm.resetValidation()                     
                    }
                }
            },
            clearData() {
                this.message = ''
                this.selected = ''
            }
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
                    this.$rollbar.critical('Crítico. No se han podido los clientes en el método mounted() del componente Notifications. ' + error)
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
