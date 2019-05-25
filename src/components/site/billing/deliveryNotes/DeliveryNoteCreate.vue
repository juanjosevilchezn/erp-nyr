<template>
    <div id="deliveryNoteCreate">
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
                    message="En este listado solo se mostrarán aquellas tareas que se encuentren finalizadas."/>
            </v-layout>   

            <v-layout row mt-3 fill-width>
                <v-flex xs12>
                    <FinishedTasksDatatable
                        title="Listado de tareas finalizadas"/>
                </v-flex>
            </v-layout>

            <v-layout row mt-2 fill-width>
                <v-flex xs12>
                    <v-btn
                        block
                        color="success">
                        <v-icon>done</v-icon><span>&nbsp; Crear albarán de entrega</span>
                    </v-btn>
                </v-flex>
            </v-layout>                           
        </v-container>
    </div>
</template>

<script>
    import InfoAlert from '../../../alerts/InfoAlert'
    import Navigation from '../../navigation/Navigation'
    import FinishedTasksDatatable from '../../../datatables/FinishedTasksDatatable'

    export default {    
        name: 'DeliveryNoteCreate',
        components: {
            FinishedTasksDatatable,
            InfoAlert,
            Navigation
        },
        props: {
            title: String
        }
    }
</script>