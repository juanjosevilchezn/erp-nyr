<template>
    <div id="success-alert" style="width: 100%;">
        <v-alert
            v-model="isShown"
            dismissible
            type="success"
            class="elevation-6">
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