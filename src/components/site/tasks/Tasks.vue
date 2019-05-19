<template>
    <div id="tasks">
        <Navigation :app_part="title"/>

        <v-container fluid>
            <v-layout row wrap style="width: 97.5%;">
                <v-flex xs2>
                    <v-btn
                        block
                        color="success"
                        href="/tasks/create">
                        <v-icon>add_circle_outline</v-icon><span>&nbsp; Nueva tarea</span>
                    </v-btn>
                </v-flex>

                <v-flex xs12 mt-3>
                    <TasksDatatable
                        title="Listado de tareas"/>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
/* eslint-disable */
import Navigation from '../navigation/Navigation'
import TasksDatatable from '../datatables/TasksDatatable'

export default {    
    name: 'Tasks',
    components: {
        Navigation,
        TasksDatatable
    },
    props: {
        title: String
    }
}
</script>