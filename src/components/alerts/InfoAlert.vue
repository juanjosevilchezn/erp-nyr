<template>
    <v-alert style="width: 100%"
        value="true"
        type="info">
        {{ message }}
    </v-alert>
</template>

<script>
    export default {
        name: 'InfoAlert',
        props: {
            message: String
        }
    }
</script>

