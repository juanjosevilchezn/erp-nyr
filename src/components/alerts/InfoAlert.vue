<template>
    <div id="info-alert" style="width: 100%">
        <v-alert 
            class="elevation-6"
            value="true"
            type="info">
            {{ message }}
        </v-alert>
    </div>
</template>

<script>
    export default {
        name: 'InfoAlert',
        props: {
            message: String
        }
    }
</script>

