<template>
    <div id="tasks">
        <Navigation :app_part="title"/>

        <v-container fluid>
            <v-layout row fill-width>
                <v-flex xs2>
                    <v-btn
                        block
                        color="success"
                        href="/tasks/create">
                        <v-icon>add_circle_outline</v-icon><span>&nbsp; Nueva tarea</span>
                    </v-btn>
                </v-flex>
            </v-layout>

            <v-layout row fill-width mt-3>
                <InfoAlert
                    message="Si la tarea ya ha sido albaranada o facturada, no podrás modificarla ni eliminarla."/>
            </v-layout>

            <v-layout row fill-width>
                <v-flex xs12 mt-3>
                    <TasksDatatable
                        title="Listado de tareas"/>
                </v-flex>
            </v-layout>           
        </v-container>
    </div>
</template>

<script>
    import InfoAlert from '../../alerts/InfoAlert'
    import Navigation from '../navigation/Navigation'
    import TasksDatatable from '../../datatables/TasksDatatable'

    export default {    
        name: 'Tasks',
        components: {
            InfoAlert,
            Navigation,
            TasksDatatable
        },
        props: {
            title: String
        }
    }
</script>