<template>
    <div>
        <v-alert
            v-model="isShown"
            dismissible
            type="success">
            {{ message }}
        </v-alert>
  </div>
</template>

<script>
    export default {
        name: 'SuccessAlert',
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