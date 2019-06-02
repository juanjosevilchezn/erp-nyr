<template>
    <div id="footer">
        <v-footer
            class="pa-3"
            color="grey lighten-1">
            <v-spacer></v-spacer>
            <div>Codificado y diseñado por <a href="mailto:juanjosevilchezn@gmail.com" style="color: black; text-decoration: none; font-weight: bold;">Juan José Vílchez Naranjo</a> &copy; {{ new Date().getFullYear() }}</div>
        </v-footer>
    </div>
</template>

<script>
    export default {
        name: 'Footer'
    }
</script>



