<template>
    <div id="billing">
        <Navigation :app_part="title"/>

        <v-container fluid>
            <v-layout row fill-width>
                <v-flex xs6 pr-2>
                    <v-btn
                        block
                        color="success"
                        href="/billing/createDeliveryNote"
                        class="elevation-6">
                        <v-icon>add_circle_outline</v-icon><span>&nbsp; Crear albarán de entrega</span>
                    </v-btn>
                </v-flex>
                <v-flex xs6 pl-2>
                    <v-btn
                        block
                        color="warning"
                        href="/billing/createInvoice"
                        class="elevation-6">
                        <v-icon>add_circle_outline</v-icon><span>&nbsp; Crear factura</span>
                    </v-btn>
                </v-flex>
            </v-layout>
            <v-layout row mt-3 fill-width>
                <v-flex xs12>
                    <BillingDocumentsDatatable
                        title="Listado de documentos"/>
                </v-flex>
            </v-layout>            
        </v-container>
    </div>
</template>

<script>
    import BillingDocumentsDatatable from '../../datatables/BillingDocumentsDatatable'
    import Navigation from '../navigation/Navigation'

    export default {    
        name: 'Billing',
        components: {
            BillingDocumentsDatatable,
            Navigation
        },
        props: {
            title: String
        }
    }
</script>