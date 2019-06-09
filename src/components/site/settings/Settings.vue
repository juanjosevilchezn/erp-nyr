<template>
    <div id="settings">
        <Navigation
            :app_part="title"/>

        <v-container fluid>
            <SuccessAlert
                ref="successAlert"
                message="Los ajustes han sido guardados con éxito."
                style="width: 100%; margin-bottom: 10px;"/>

            <v-card style="width: 100%;" class="elevation-6">
                <v-card-text>
                    <v-form
                        ref="myCompanyForm"
                        v-model="valid"
                        lazy-validation
                        @submit.prevent="checkForm">
                        <v-layout row mb-4 v-if="settings.url_photo != ''" style="border-radius: 5px; border: 2px solid gray;">
                            <v-img
                                contain
                                height="200"
                                width="400"
                                :src="settings.url_photo"
                                style="margin: 10px;"/>
                        </v-layout>
                        <v-layout row>
                            <v-text-field
                                label="Pincha aquí para subir un nuevo logotipo..."
                                @click.prevent="pickFile"
                                v-model="logo.name"
                                prepend-inner-icon="photo"
                                outline
                                readonly/>
                            <input
                                type="file"
                                style="display: none"
                                ref="image_picker"
                                accept="image/*"
                                @change="onFilePicked"/>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6 mr-2>
                                <v-text-field
                                    v-model="settings.cif"
                                    label="CIF"
                                    outline
                                    :rules="required"/>
                            </v-flex>
                            <v-flex xs6 ml-2>
                                <v-text-field
                                    v-model="settings.comercial_name"
                                    label="Nombre comercial"
                                    outline
                                    :rules="required"/>
                            </v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs6 mr-2>
                                <v-text-field
                                    v-model="settings.brand"
                                    label="Marca"
                                    outline
                                    :rules="required"/>
                            </v-flex>
                            <v-flex xs6 ml-2>
                                <v-text-field
                                    v-model="settings.address.home_address"
                                    label="Dirección"
                                    outline
                                    :rules="required"/>
                            </v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs4 mr-2>
                                <v-text-field
                                    v-model="settings.address.locality"
                                    label="Localidad"
                                    outline
                                    :rules="required"/>
                            </v-flex>
                            <v-flex xs4 ml-2 mr-2>
                                <v-text-field
                                    v-model="settings.address.province"
                                    label="Provincia"
                                    outline
                                    :rules="required"/>
                            </v-flex>
                            <v-flex xs4 ml-2>
                                <v-text-field
                                    v-model="settings.address.zip"
                                    label="Código postal"
                                    mask="#####"
                                    outline
                                    :rules="required"/>
                            </v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs4 mr-2>
                                <v-text-field
                                    v-model="settings.email"
                                    label="Correo electrónico"
                                    outline
                                    :rules="email_rules"/>
                            </v-flex>
                            <v-flex xs4 ml-2 mr-2>
                                <v-text-field
                                    v-model="settings.tlf_fijo"
                                    label="Teléfono fijo"
                                    mask="### ## ## ##"
                                    outline/>
                            </v-flex>
                            <v-flex xs4 ml-2>
                                <v-text-field
                                    v-model="settings.phone"
                                    label="Teléfono móvil"
                                    mask="### ## ## ##"
                                    outline
                                    :rules="required"/>
                            </v-flex>
                        </v-layout>
                        <v-layout row>
                            <v-flex xs12>
                                <v-btn
                                    block
                                    color="success"
                                    :loading="isAwaiting"
                                    type="submit">
                                    <v-icon>save</v-icon>&nbsp;Guardar datos
                                </v-btn>
                            </v-flex>
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
    import SuccessAlert from '../../alerts/SuccessAlert'

    const db = firebase.firestore()
    const settingsRef = db.collection('settings')
    const storageRef = firebase.storage().ref().child('images/logo')

    export default {
        name: 'MyCompanySettings',
        components: {
            Navigation,
            SuccessAlert
        },
        data() {
            return {
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
                logo: {
                    file: '',
                    name: ''
                },
                email_rules: [
                    v => !!v || 'Este campo es requerido',
                    v => /.+@.+/.test(v) || 'El formato del correo electrónico no es válido'
                ],
                required: [ v => !!v || 'Este campo es requerido' ],
                isAwaiting: false,
                valid: false
            }
        },
        methods: {
            checkForm() {
                if (this.$refs.myCompanyForm.validate()) {
                    this.saveSettings()
                    this.$refs.myCompanyForm.resetValidation()
                }
            },
            onFilePicked(e) {
                const files = e.target.files
                if(files[0] !== undefined) {
                    this.logo.name = files[0].name

                    if(this.logo.name.lastIndexOf('.') <= 0) {
                        return
                    }
                    const fr = new FileReader()
                    fr.readAsDataURL(files[0])
                    fr.addEventListener('load', () => {
                        this.logo.file = files[0]
                    })
                } else {
                    this.logo = {
                        image: '',
                        name: ''
                    }
                }
            },
            pickFile() {
                this.$refs.image_picker.click()
            },
            async saveSettings() {
                if (this.logo.file != '') {
                    this.isAwaiting = true

                    await storageRef.put(this.logo.file)
                        .then(() => {
                            this.isAwaiting = false
                            this.logo = {
                                image: '',
                                name: ''
                            }
                        })
                        .catch(error => {
                            this.$rollbar.warning('Aviso. No se ha podido subir el fichero cargado en el método saveSettings() del componente Settings. ' + error)
                        })

                    await storageRef.getDownloadURL()
                        .then((url) => {
                            this.settings.url_photo = url
                        })
                        .catch(error => {
                            this.settings.url_photo = ''
                            this.$rollbar.warning('Aviso. No se ha podido obtener la URL del fichero subido en el método saveSettings() del componente Settings. ' + error)
                        })
                }

                settingsRef.doc('RszgIiX4x0cpCiRTsU').set(this.settings)
                    .then(() => {
                        this.$refs.successAlert.isShown = true
                    })
                    .catch(error => {
                        this.$refs.successAlert.isShown = false
                        this.$rollbar.warning('Aviso. No se han podido actualizar los ajustes en el método saveSettings() del componente Settings. ' + error)
                    })
                    .finally(() => {
                        firebase.database().goOffline()
                    })
            }
        },
        mounted() {
            settingsRef.doc('RszgIiX4x0cpCiRTsU').get()
                .then(doc => {
                    this.settings = doc.data()
                })
                .catch(error => {
                    this.$rollbar.critical('Crítico. No se han podido recuperar los ajustes en el método mounted() del componente Settings. ' + error)
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

