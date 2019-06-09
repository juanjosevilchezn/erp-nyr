<template>
    <div id="error-alert">
        <v-alert
            v-model="isShown"
            dismissible
            type="error">
            {{ message }}
        </v-alert>
  </div>
</template>

<script>
    export default {
        name: 'ErrorAlert',
        data() {
            return {
                isShown: false
            }
        },
        props: {
            message: String
        }
    }
</script>