<template>
    <div id="invoiceCreate">
        <Navigation :app_part="title"/>

        <v-container fluid>
            <v-layout row fill-width>
                <v-flex xs2>
                    <v-btn
                        block
                        color="primary"
                        href="/billing">
                        <v-icon>arrow_back</v-icon><span>&nbsp; Atrás</span>
                    </v-btn>
                </v-flex>
            </v-layout>

            <v-layout row fill-width mt-3>
                <InfoAlert
                    message="En este listado solo aparecerán aquellas tareas que se encuentren albaranadas o finalizadas."/>
            </v-layout>

            <v-layout row wrap mt-3 fill-width>
                <v-flex xs12>
                    <BillableTasksDatatable
                        title="Listado de tareas facturables"/>
                </v-flex>

                <v-flex xs12 mt-2 fill-width>
                    <v-btn
                        block
                        color="success">
                        <v-icon>done</v-icon><span>&nbsp; Crear factura</span>
                    </v-btn>
                </v-flex>
            </v-layout>                  
        </v-container>
    </div>
</template>

<script>
import InfoAlert from '../../../alerts/InfoAlert'
import Navigation from '../../navigation/Navigation'
import BillableTasksDatatable from '../../../datatables/BillableTasksDatatable'

export default {    
    name: 'InvoiceCreate',
    components: {
        BillableTasksDatatable,
        InfoAlert,
        Navigation
    },
    props: {
        title: String
    }
}
</script>