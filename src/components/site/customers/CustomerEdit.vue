<template>
    <div id="customersEdit">
        <Navigation :app_part="title"/>

        <v-container fluid>
            <v-layout row wrap fill-width>
                <v-flex xs2>
                    <v-btn
                        block
                        color="primary"
                        href="/customers"
                        class="elevation-6">
                        <v-icon>arrow_back</v-icon><span>&nbsp; Atrás</span>
                    </v-btn>
                </v-flex>

                <v-flex xs12 mt-2>
                    <SuccessAlert
                        ref="successAlert"
                        message="El cliente ha sido actualizado con éxito."/>
                </v-flex>               

                <v-flex xs12 mt-3>
                    <v-card color="grey lighten-4" class="elevation-6">
                        <v-card-text>
                            <h2 style="color: grey;">Datos del cliente</h2>
                            
                            <v-form
                                ref="formCustomerEdit"
                                v-model="valid"
                                lazy-validation
                                @submit.prevent="checkForm">
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
                                            mask="########-A"
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
                                            :rules="phoneRules"
                                            label="Número de teléfono"
                                            mask="### ## ## ##"
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
                                        <v-text-field
                                            v-model="address.locality"
                                            label="Localidad"
                                            outline>
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs4 pl-2 pr-2>
                                        <v-text-field
                                            v-model="address.province"
                                            label="Provincia"
                                            outline>
                                        </v-text-field>
                                    </v-flex>
                                    <v-flex xs4>
                                        <v-text-field
                                            v-model="address.country"
                                            label="País"
                                            outline>
                                        </v-text-field>
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
                                    <v-flex xs12 mt-3>
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
    import Navigation from '../navigation/Navigation'
    import SuccessAlert from '../../alerts/SuccessAlert'

    const db = firebase.firestore()
    let customersRef = db.collection('customers')

    export default {    
        name: 'CreateCustomer',
        components: {
            Navigation,
            SuccessAlert
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
                    v => !!v || 'El número de teléfono es requerido',
                    (v) => v && v.length <= 10 || 'El número de teléfono debe tener menos de 10 dígitos'
                ],
                valid: false,
            }
        },
        methods: {
            checkForm() {
                if (this.$refs.formCustomerEdit.validate()) {
                    this.updateCustomer()
                    this.$refs.formCustomerEdit.resetValidation()
                }
            },
            fillCompany(company) {
                this.customerType = 'company'
                this.companyName = company.name
                this.cif = company.cif
                this.phone = company.phone
                this.address.homeAddress = company.address.homeAddress
                this.address.locality = company.address.locality
                this.address.province = company.address.province
                this.address.country = company.address.country        
                this.email = company.email
            },
            fillPerson(person) {
                this.customerType = 'person'
                this.personName = person.name
                this.personSurname = person.surname
                this.nif = person.nif
                this.phone = person.phone
                this.address.homeAddress = person.address.homeAddress
                this.address.locality = person.address.locality
                this.address.province = person.address.province
                this.address.country = person.address.country        
                this.email = person.email
            },
            updateCustomer() {
                switch(this.customerType) {
                    case 'company':
                        this.updateCompany()
                        break;
                    case 'person':
                        this.updatePerson()
                        break;
                }
            },
            updateCompany() {
                let data = {
                    type: this.customerType,
                    name: this.companyName,
                    cif: this.cif,
                    phone: this.phone,
                    address: this.address,
                    email: this.email,
                    updatedAt: new Date()
                }

                customersRef.doc(this.$route.params.id).update(data)
                    .then(() => {
                        this.$refs.successAlert.isShown = true
                    })
                    .catch(error => {
                        this.$refs.successAlert.isShown = false
                        this.$rollbar.warning('Aviso. No se ha podido actualizar el cliente en el método updateCompany() del componente CustomerEdit. ' + error)
                    })
                    .finally(() => {
                        firebase.database().goOffline()
                    }) 
            },
            updatePerson() {
                let data = {
                    type: this.customerType,
                    name: this.personName,
                    surname: this.personSurname,
                    nif: this.nif,
                    phone: this.phone,
                    address: this.address,
                    email: this.email,
                    updatedAt: new Date()                
                }

                customersRef.doc(this.$route.params.id).update(data)
                    .then(() => {
                        this.$refs.successAlert.isShown = true
                    })
                    .catch(error => {
                        this.$refs.successAlert.isShown = false
                        this.$rollbar.warning('Aviso. No se ha podido actualizar el cliente en el método updatePerson() del componente CustomerEdit. ' + error)
                    })
                    .finally(() => {
                        firebase.database().goOffline()
                    }) 
            }
        },
        mounted() {
            customersRef.doc(this.$route.params.id).get()
                .then(doc => {
                    if (doc.exists) {
                        switch (doc.data().type) {
                            case 'company':
                                this.fillCompany(doc.data())
                                break
                            case 'person':
                                this.fillPerson(doc.data())
                                break
                        }
                    }
                })
                .catch(error => {
                    this.$rollbar.critical('Crítico. No se ha podido recuperar los datos del cliente ' + this.$route.params.id + ' en el método mounted() del componente CustomerEdit. ' + error)
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
