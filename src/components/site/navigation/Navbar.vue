<template>
    <div id="navbar">
        <nav class="navbar navbar-dark bg-primary">
            <a class="navbar-brand mb-0 h1" href="/home">{{ company_name }} • Panel de administración</a>
            <div class="float-right">
              <a href="#" @click="logout"><font-awesome-icon icon="sign-out-alt" color="white" size="lg"/></a>
            </div>
        </nav>
    </div>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'Navbar',
  props: {
    company_name: String,
  },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => this.$router.replace('login'))
    }
  }
}
</script>
