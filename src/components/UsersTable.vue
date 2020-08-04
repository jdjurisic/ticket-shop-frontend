<template>
<div>
<h3>Tickets</h3>

<!-- <button id="load-users-btn" v-on:click="loadUsers()">Ucitaj korisnike</button> -->

<table id="users-tbl" class="center">
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
        <!-- v-for sluzi da kreira HTML element <tr> za svaki element u nizu users-->
        <tr v-bind:key="user.id" v-for="user in users">
          <td>{{ user.depCity }}</td>
          <td>{{ user.destCity }}</td>
          <td>{{ user.company }}</td>
          <td>{{ user.count }}</td>
          <td>{{ user.oneway }}</td>
          <td>{{ user.departureDate | dateFormat('DD MMM YYYY h:mm:ss a')}}</td>
          <td>{{ user.returnDate | dateFormat('DD MMM YYYY h:mm:ss a')}}</td>
          <button v-if="usrrl =='ADMIN'"  @click="deleteTicket(user.flightId, user.ticketId)">Delete</button>
          <button v-if="usrrl !='ADMIN'"  @click="reserveTicket(user)">Reserve</button>
        </tr>
    </tbody>
</table>
</div>
</template>
<script>
import UserClient from '../clients/user-client.js'
import moment from 'moment'
import axios from 'axios'
import { eventBus } from '../main.js'
export default {
    name: "UsersTable",
    computed:{
      usrrl(){
      return window.localStorage.getItem("usrrl");
    }
    },
    methods: {
        // Za rucno ucitavanje korisnika
        loadUsers() {
            /* U props primamo korisnike od parent (Home) komponente, 
               Home bi trebao biti vlasnik korisnika, da bi UsersTable
               komponenta sluzila samo za prikaz podataka.
               Zbog toga prosledjujemo parent-a, da bismo direktno u 
               parent-u menjali listu korisnika. 
               Izmena liste users u parent-u poslace nove podatke
               svim child komponentama. */
            UserClient.loadUsers(this.$parent);
        },
      deleteTicket(flgId,tickId){
      const tick = {
        "flightId": flgId,
        "ticketId": tickId
      }
      console.log(tick);
        
      axios.defaults.headers.common['Authorization'] = "Bearer "+window.localStorage.getItem('jwt');
      axios.delete('http://localhost:8080/airline-ticket-shop-backend/api/flights/tickets',{ data: tick }).then((response) => {
            // Podaci sa servera
            console.log(JSON.parse(JSON.stringify(response.data)));
            // Status code
            console.log(JSON.parse(JSON.stringify(response.status)));
          }, (error) => {
            console.log("An error occured:");
            console.log(error);
          });

    return false;
        },
    reserveTicket(user){
      console.log(user);
      let booking;
      if(user.oneway){
       booking ={"ticketId":user.ticketId,
      "company":user.company,
      "oneway":user.oneway,
      "departureDate":user.departureDate,
      "flightId":user.flightId,
      "count":user.count,
      "destCity":user.destCity,
      "depCity":user.depCity
      }
      
      }else{
      booking = {"ticketId":user.ticketId,
      "company":user.company,
      "oneway":user.oneway,
      "departureDate":user.departureDate,
      "flightId":user.flightId,
      "count":user.count,
      "destCity":user.destCity,
      "depCity":user.depCity,
      "returnDate":user.returnDate
      }
       
      }
      
      console.log(booking);

      axios.post('http://localhost:8080/airline-ticket-shop-backend/api/users/reservations/'+window.localStorage.getItem("usrnme"),booking)
          .then((response) => {
            // Podaci sa servera
            console.log(JSON.parse(JSON.stringify(response.data)));
            // Status code
            console.log(JSON.parse(JSON.stringify(response.status)));
            if(JSON.parse(JSON.stringify(response.status)) == 200){
              eventBus.$emit('ticketBooked');
              this.loadUsers();
            }
          }, (error) => {
            console.log("An error occured:");
            console.log(error);
          });
      

    }
    },  
    // Za automatsko ucitavanje korisnika
    created() {
    if(window.localStorage.getItem('jwt') != undefined){
        this.loadUsers()
      }
  },
/* props: To su promenljive koje ova komponenta moze da primi od strane drugih komponenti.
  Ovoj komponenti je prosledjena lista korisnika koristeci v-bind:users od strane Home.vue komponente. 
  Ove promenljive mozemo koristiti u template sekciji*/
  props: ['users'],
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