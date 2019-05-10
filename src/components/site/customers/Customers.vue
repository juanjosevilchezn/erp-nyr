<template>
    <div id="customers">
        <Navigation app_part="Clientes"/>

        <v-container fluid fill-height>
            <v-layout row wrap style="width: 97.5%;">
                <v-flex xs2>
                    <v-btn
                        block
                        color="success"
                        href="/customers/create">
                        <v-icon>add_circle_outline</v-icon><span>&nbsp; Nuevo cliente</span>
                    </v-btn>
                </v-flex>

                <v-flex xs12 mt-3>
                    <CompaniesDatatable
                        title="Listado de empresas"/>
                </v-flex>

                <v-flex xs12 mt-3>
                    <PersonsDatatable
                        title="Listado de personas"/>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
/* eslint-disable */
import CompaniesDatatable from '../datatables/CompaniesDatatable'
import PersonsDatatable from '../datatables/PersonsDatatable'
import Navigation from '../navigation/Navigation'

export default {    
    name: 'Customers',
    components: {
        CompaniesDatatable,
        PersonsDatatable,
        Navigation
    },
}
</script>