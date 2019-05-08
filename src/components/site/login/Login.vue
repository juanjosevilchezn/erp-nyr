<template>
    <div id="login" class="container">
      <h1>Logo N&amp;R</h1>

      <br/>

      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          prepend-icon="email"
          outline
          required
        />

        <v-text-field
          v-model="password"
          :append-icon="showPassword ? 'visibility' : 'visibility_off'"
          :rules="passwordRules"
          :type="showPassword ? 'text' : 'password'"
          label="Contraseña"
          prepend-icon="lock"
          @click:append="showPassword = !showPassword"
          outline
          required
        />       

        <v-flex class="text-xs-center">
          <v-btn
            :disabled="!valid"
            color="primary"
            @click="login"
            
          >Iniciar sesión</v-btn>
        </v-flex>
      </v-form>

      <br/>

      <p class="text-xs-center grey--text">Juan José Vílchez Naranjo &copy; 2019</p>
    </div>
</template>

<script>
import firebase from 'firebase'

/* eslint-disable */

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
      ]
    }
  },
  methods: {
    login() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then((user) => this.$router.replace('home'), (error) => console.error(error));
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

v-form > * {
  display: block;
}

</style>

