<template>
    <div id="login">
      <v-container fluid fill-height>        
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          @submit.prevent="login">
          <v-card width="350">
            <v-card-text class="elevation-6">
              <v-layout row mb-4 align-center v-if="hasImage">
                <v-img
                  height="100"
                  width="200"
                  contain
                  src="https://firebasestorage.googleapis.com/v0/b/erp-nyr.appspot.com/o/images%2Flogo?alt=media&token=226400ca-ce7d-4c75-88f5-d4207706d58c"
                  @error="hasImage = false"/>
              </v-layout>
              <v-layout row mb-4 align-center v-else>
                <h2 style="text-align: center;">NO LOGO</h2>
              </v-layout>
              <v-layout row align-center>
                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  label="Correo electrónico"
                  prepend-inner-icon="email"
                  @keyup.enter="login"
                  outline
                  required/>
              </v-layout>
              <v-layout row align-center>
                <v-text-field
                  v-model="password"
                  :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                  :rules="passwordRules"
                  :type="showPassword ? 'text' : 'password'"
                  label="Contraseña"
                  prepend-inner-icon="lock"
                  @click:append="showPassword = !showPassword"
                  @keyup.enter="login"
                  outline
                  required/>   
              </v-layout>
              <v-layout row align-center mb-4 v-if="loginError">
                <span style="color: red; font-size: 10pt;">Las credenciales no son correctas, vuelve a intentarlo</span>
              </v-layout>
              <v-layout row align-center>
                <v-btn
                  :disabled="!valid"
                  block
                  color="primary"
                  type="submit">
                  Iniciar sesión
                </v-btn>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-form>
      </v-container>
    </div>
</template>

<script>
  import firebase from 'firebase'

  export default {
    name: 'Login',
    props: {
      title: String
    },
    data() {
      return {
        email: '',
        password: '',
        valid: true,
        showPassword: false,
        emailRules: [
          v => !!v || 'El correo electrónico es requerido',
          v => /.+@.+/.test(v) || 'Revisa el formato del correo introducido'
        ],
        passwordRules: [
          value => !!value || 'Debes introducir una contraseña'
        ],
        hasImage: true,
        loginError: false
      }
    },
    methods: {
      login() {
        firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(() => {
            this.loginError = false
            this.$router.replace('home')
          })
          .catch(error => {
            this.loginError = true
            this.$rollbar.info('Información. Se ha intentando iniciar sesión sin éxito en la aplicación. ' + error)
          })
      }
    }
  }
</script>

<style>
  #login {
    height: 100%;
  }

  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
</style>

