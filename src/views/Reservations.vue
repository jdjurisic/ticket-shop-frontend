<template>
    <div>
    <label>JWT Token: {{jwt}} </label><br>
    <label>Username: {{usrname}}</label><br>
    <label>Role: {{usrrl}}</label> <br><br>
    <label v-if="rserve" v-bind:noReser="noReser" >Bookings: {{noReser}}</label><br>   
    <router-link  to="/">Back to home page</router-link> 
    <br>
    <router-link @click.native="logoutf" to="/login">Logout</router-link> 
    <hr>

    <table id="reservationd-tbl" class="center">
    <thead>
        <tr>
            <th>Origin</th>
            <th>Destination</th>
            <th>Company</th>
            <th>Count</th>
            <th>Oneway</th>
            <th>Departure Date</th>
            <th>Return Date</th>
        </tr>
    </thead>
    <tbody>
        <tr v-bind:key="booking.id" v-for="booking in bookings">
        <td>{{ booking.ticket.depCity }}</td>
          <td>{{ booking.ticket.destCity }}</td>
          <router-link :to="/company/+booking.ticket.company"> <td>{{ booking.ticket.company }}</td> </router-link>
          <td>{{ booking.ticket.count }}</td>
          <td>{{ booking.ticket.oneway }}</td>
          <td>{{ booking.ticket.departureDate | dateFormat('DD MMM YYYY h:mm:ss a')}}</td>
          <td>{{ booking.ticket.returnDate | dateFormat('DD MMM YYYY h:mm:ss a')}}</td>
          <td>{{ booking.available}}</td>
          <button v-if="booking.available" @click="cancelReservation(booking.bookingId)">Cancel</button>
        </tr>
    </tbody>
    </table>



    </div>
</template>

<script>

import moment from 'moment'
import axios from 'axios'
import { eventBus } from '../main.js'

export default{
    name:'reservations',
    computed: {
    jwt(){
      return window.localStorage.getItem("jwt");
    },
    usrname(){
      return window.localStorage.getItem("usrnme");
    },
    usrrl(){
      return window.localStorage.getItem("usrrl");
    },
    rserve(){
      return window.localStorage.getItem("rserve");
    },
  },
  data(){
    return{
      noReser:0,
      bookings: []
    }
  },
  methods:{
      cancelReservation(bookingId){
        console.log(bookingId);
          let reservationHolder = window.localStorage.getItem("usrnme");
          axios.delete("http://localhost:8080/airline-ticket-shop-backend/api/users/reservations/"+reservationHolder+"/"+bookingId).then((response) => {
            console.log(response);
            // izbaci rezervaciju iz niza i osvezi broj rezervacija
            this.noReser--;
            window.localStorage.setItem("rserve",this.noReser);
            this.bookings = this.bookings.filter(booking => booking.bookingId != bookingId);
            
          },(error) => {
            console.log(error);
          });
      },
      logoutf(){
            window.localStorage.clear();
    }
  },
  mounted(){

    axios.defaults.headers.common['Authorization'] = "Bearer "+window.localStorage.getItem('jwt');
    this.noReser = parseInt(window.localStorage.getItem("rserve"));
  
    eventBus.$on('ticketBooked',()=>{
    this.noReser++;
    window.localStorage.setItem("rserve",this.noReser);
    });

    let reservationHolder = window.localStorage.getItem("usrnme");
    axios.get("http://localhost:8080/airline-ticket-shop-backend/api/users/reservations/"+reservationHolder).then((response) =>{
        this.bookings = JSON.parse(JSON.stringify(response.data));
    }, (error) => {
        console.log("An error occured:");
        console.log(error);
    });

    },
  filters: {
    dateFormat: function (value, format) {
    var dt = new Date(parseInt(value));
	var parsed = moment(dt);
	return parsed.format(format);
	}
    }
  

}
</script>
<style scoped>
table {
  border-collapse: collapse;
}
table,
th,
td {
  border: 1px solid black;
}
td {
  padding: 0 15px;
}
.center {
  margin-left: auto;
  margin-right: auto;
}
</style>