<template>
    <div style="width: 100%;">
        <v-layout mt-3 row style="width: 100%;">
            <v-card
                color="primary"
                flat 
                width="100%">
                <v-card-text>
                    <v-layout ro align-center> 
                        <v-flex xs2>
                            <v-btn
                                fab
                                color="white"
                                small
                                @click="$refs.calendar.prev()">
                                <v-icon>keyboard_arrow_left</v-icon>
                            </v-btn>
                        </v-flex>
                        <v-flex xs8 text-xs-center>
                            <h2 style="color: white;">{{ getActualMonthYearString }}</h2>
                        </v-flex>
                        <v-flex xs2 text-sm-right>
                            <v-btn
                                fab
                                color="white"
                                small
                                @click="$refs.calendar.next()">
                                <v-icon>keyboard_arrow_right</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>                    
                </v-card-text>
            </v-card>
        </v-layout>
        <v-layout row style="width: 100%;">
            <v-flex>
                <v-sheet height="600">
                    <v-calendar
                        ref="calendar"
                        v-model="start"
                        :today="today"
                        type="month"
                        locale="es"
                        color="primary"
                        :weekdays="[1, 2, 3, 4, 5]">
                        <template v-slot:day="{ date }">
                            <template v-for="event in eventsMap[date]">
                                <v-menu
                                    :key="event.title"
                                    v-model="event.open"
                                    offset-x>

                                    <template v-slot:activator="{ on }">
                                        <div
                                            v-if="!event.time"
                                            v-ripple
                                            class="my-event"
                                            v-on="on"
                                            v-html="event.title"
                                            :style="'background-color: ' + getTaskColor(event) + ';'"/>
                                    </template>

                                    <v-card
                                        color="grey lighten-4"
                                        min-width="350px"
                                        max-width="350px"
                                        flat>
                                    <v-toolbar
                                        :color="getTaskColor(event)"
                                        dark>
                                        <v-toolbar-title v-html="event.title"/>
                                        <v-spacer></v-spacer>
                                        <v-btn icon>
                                            <v-icon>close</v-icon>
                                        </v-btn>
                                    </v-toolbar>
                                    <v-card-title primary-title>
                                        <p><span v-if="event.type == 'arrangement'">Este arreglo</span><span v-else-if="event.type == 'manufacture'">Esta confección</span> pertenece a <span v-if="event.details.type == 'company'"><b>{{ event.details.name }}</b></span>
                                        <span v-else-if="event.details.type == 'person'"><b>{{ event.details.name }} {{ event.details.surname }}</b></span>,
                                        puedes contactar con el cliente a través de su número: <b>{{ event.details.phone}}</b>.</p>
                                    </v-card-title>
                                    <v-card-actions>
                                        <v-layout justify-space-around>
                                        <v-btn
                                            flat
                                            outline
                                            color="warning"
                                            style="width: 45%;"
                                            @click.prevent="goToEdit(event.id)">                                        
                                            Editar tarea                                      
                                        </v-btn>
                                        <v-btn
                                            flat
                                            outline
                                            color="green"
                                            style="width: 45%;"
                                            @click.prevent="finishTask(event.id)">                                        
                                            Finalizar tarea                                      
                                        </v-btn>
                                        </v-layout>
                                </v-card-actions>
                                </v-card>
                            </v-menu>
                        </template>
                    </template>
                </v-calendar>
                </v-sheet>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
    import firebase from 'firebase'
    import moment from 'moment'
    
    const db = firebase.firestore()
    const tasksRef = db.collection('tasks')
    moment.locale('es')

    export default {
        data: () => ({
            events: [],
            start: moment(new Date()).format('YYYY-MM-DD'),
            today: moment(new Date()).format('YYYY-MM-DD')      
        }),
        computed: {
            // convert the list of events into a map of lists keyed by date
            eventsMap () {
                const map = {}
                this.events.forEach(e => (map[e.date] = map[e.date] || []).push(e))
                return map
            },
            getActualMonthYearString() {
                return moment(this.start).format('MMMM YYYY');
            }
        },
        methods: {
            finishTask(taskId) {
                tasksRef.doc(taskId).update({ state: 'Finalizado' })
                    .then(() => {
                        let index = this.events.map(item => item.id).indexOf(taskId)

                        this.events.splice(index, 1)
                    })
                    .catch(error => {
                        // SEND TO ERROR PAGE TO-DO
                    })
                    .finally(() => {
                        firebase.database().goOffline()
                    })
            },            
            getTaskColor(task) {
                let color = ''

                if (new Date(task.date) < new Date()) {
                    color = 'gray'
                } else {
                    if (task.details.type == 'arrangement') {
                        color = 'orange'
                    } else {
                        color = '#3f51b5'
                    }
                }

                return color
            },
            goToEdit(taskId) {
                this.$router.push(
                    { 
                        name: 'TaskEdit', 
                        params: { 
                            id:  taskId
                        } 
                    })
            },
            open (event) {
                alert(event.title)
            }
        },
        mounted() {
            tasksRef.get()
                .then(snapshot => {
                    snapshot.forEach(doc => {
                        let taskData = doc.data()

                        if (doc.data().state == 'Confirmado') {
                            taskData.customer.get()
                                .then(res => {
                                    this.events.push({
                                        id: doc.id,
                                        title: taskData.description,
                                        date: taskData.deliveryDate,
                                        type: taskData.type,
                                        details: {
                                            name: res.data().name,
                                            surname: res.data().surname,
                                            type: res.data().type,
                                            phone: res.data().phone
                                        },
                                        open: false
                                    })
                                })
                        }
                    })
                })
                .catch(error => {
                    // SEND TO ERROR PAGE TO-DO
                })
                .finally(() => {
                    firebase.database().goOffline()
                })
        }
    }
</script>

<style lang="stylus" scoped>
    .my-event {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        border-radius: 2px;
        background-color: #1867c0;
        color: #ffffff;
        border: 1px solid #1867c0;
        width: 100%;
        font-size: 12px;
        padding: 3px;
        cursor: pointer;
        margin-bottom: 1px;
    }
</style>