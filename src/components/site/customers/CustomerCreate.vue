<template>
    <div id="customersCreate">
        <Navigation :app_part="title"/>

        <v-container fluid fill-height>
            <v-layout row wrap style="width: 97.5%;">
                <v-flex xs2>
                    <v-btn
                        block
                        color="primary"
                        href="/customers">
                        <v-icon>arrow_back</v-icon><span>&nbsp; Atrás</span>
                    </v-btn>
                </v-flex>

                <v-flex xs12>
                    <!-- TO-DO ALERT COMPONENT -->
                </v-flex>               

                <v-flex xs12 mt-3>
                    <v-card color="grey lighten-4">
                        <v-card-text>
                            <h2 style="color: grey;">Datos del cliente</h2>
                            
                            <v-form
                                ref="formCustomerCreate"
                                v-model="valid"
                                lazy-validation>
                                <v-layout row>
                                    <v-flex xs12>
                                        <v-radio-group v-model="customerType" row>
                                            <v-radio color="primary" label="Empresa" value="company"></v-radio>
                                            <v-radio color="primary" label="Persona" value="person"></v-radio>
                                        </v-radio-group>
                                    </v-flex>
                                </v-layout>
                                <v-layout row v-if="customerType == 'person'">
                                    <v-flex xs6 pr-2>
                                        <v-text-field
                                            v-model="personName"
                                            :rules="nameRules"
                                            label="Nombre"
                                            outline
                                            required>
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs6 pl-2>
                                        <v-text-field
                                            v-model="personSurname"
                                            :rules="surnameRules"
                                            label="Apellidos"
                                            outline
                                            required>
                                        </v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row v-if="customerType == 'company'">
                                    <v-flex xs12 pr-2>
                                        <v-text-field
                                            v-model="companyName"
                                            :rules="nameRules"
                                            label="Nombre de la empresa"
                                            outline
                                            required>
                                        </v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs6 pr-2 v-if="customerType == 'person'">
                                        <v-text-field
                                            v-model="nif"
                                            label="NIF"
                                            outline>
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs6 pr-2 v-if="customerType == 'company'">
                                        <v-text-field
                                            v-model="cif"
                                            label="CIF"
                                            outline>
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs6 pl-2>
                                        <v-text-field
                                            v-model="phone"
                                            type="number"
                                            :rules="phoneRules"
                                            label="Número de teléfono"
                                            outline
                                            required>
                                        </v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs12>
                                        <v-text-field
                                            v-model="address.homeAddress"
                                            label="Dirección"
                                            outline>
                                        </v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs4>
                                        <v-overflow-btn
                                            :items="localities"
                                            v-model="address.locality"
                                            label="Localidad"
                                            editable
                                            outline
                                            item-value="text">
                                        </v-overflow-btn>
                                    </v-flex>
                                    <v-flex xs4 pl-2 pr-2>
                                        <v-overflow-btn
                                            :items="provinces"
                                            v-model="address.province"
                                            label="Provincia"
                                            editable
                                            outline
                                            item-value="text">
                                        </v-overflow-btn>
                                    </v-flex>
                                    <v-flex xs4>
                                        <v-overflow-btn
                                            :items="countries"
                                            v-model="address.country"
                                            label="País"
                                            editable
                                            outline
                                            item-value="text">
                                        </v-overflow-btn>
                                    </v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs12>
                                        <v-text-field
                                            v-model="email"
                                            label="Dirección de correo electrónico"
                                            outline>
                                        </v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout row>
                                    <v-flex xs12>
                                        <v-btn
                                            block
                                            color="success"
                                            @click="checkForm">
                                            <v-icon>done</v-icon><span>&nbsp; Guardar datos</span>
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
    /* eslint-disable */

    import firebase from 'firebase'
    import Navigation from '../navigation/Navigation'

    const db = firebase.firestore()
    let customersRef = db.collection('customers')

    export default {    
        name: 'CreateCustomer',
        components: {
            Navigation
        },
        data() {
            return {
                customerType: 'person',
                companyName: '',
                personName: '',
                personSurname: '',
                cif: '',
                nif: '',
                phone: '',
                address: {
                    homeAddress: '',
                    locality: '',
                    province: '',
                    country: '',
                },            
                email: '',
                createdAt: '',
                updatedAt: '',
                countries: [],
                localities: [],
                provinces: [],
                nameRules: [
                    v => !!v || 'El nombre es requerido'
                ],
                surnameRules: [
                    v => !!v || 'El apellido es requerido'
                ],
                phoneRules: [
                    v => !!v || 'El número de teléfono es requerido'
                ],
                valid: false,
            }
        },
        methods: {
            clearForm() {
                this.companyName = ''
                this.personName = ''
                this.personSurname = ''
                this.cif = ''
                this.nif = ''
                this.phone = ''
                this.address = []
                this.email = ''
            },
            checkForm() {
                if (this.$refs.formCustomerCreate.validate()) {
                    this.saveCustomer()
                    this.$refs.formCustomerCreate.resetValidation()
                    this.clearForm()
                }
            },
            saveCustomer() {                
                switch(this.customerType) {
                    case 'company':
                        this.saveCompany()
                        break
                    case 'person':
                        this.savePerson()
                        break
                }
            },
            saveCompany() {
                let data = {
                    type: this.customerType,
                    name: this.companyName,
                    cif: this.cif,
                    phone: this.phone,
                    address: this.address,
                    email: this.email,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }

                customersRef.doc().set(data)
                    .then(function() {
                        // active success alert component
                    })
                    .catch(function() {
                        // active error alert component
                    })
            },
            savePerson() {
                let data = {
                    type: this.customerType,
                    name: this.personName,
                    surname: this.personSurname,
                    nif: this.nif,
                    phone: this.phone,
                    address: this.address,
                    email: this.email,
                    createdAt: new Date(),
                    updatedAt: new Date()                
                }

                customersRef.doc().set(data)
                    .then(function() {
                        // active success alert component
                    })
                    .catch(function() {
                        // active error alert component
                    })
            }
        },
        props: {
            title: String
        }
    }
</script>
