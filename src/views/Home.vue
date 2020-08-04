<template>
  <div class="home">
    <label>JWT Token: {{jwt}} </label><br>
    <label>Username: {{usrname}}</label><br>
    <label>Role: {{usrrl}}</label> <br>
    <label v-if="rserve" v-bind:noReser="noReser" >Bookings: {{noReser}}</label><br>   
      <router-link @click.native="logoutf" to="/login">Logout</router-link> 
      
<br><br>
<button id="all"> All tickets</button>
<button id="round"> Roundtrip tickets</button>
<button id="one"> Oneway tickets</button>
      <UsersTable v-if="this.users" v-bind:users="this.users"/>
      <br>
        <h3 v-if="usrrl =='ADMIN'">Add new user</h3>
      <form v-on:submit="addUser" v-if="usrrl =='ADMIN'">
        <div class="form-group">
        <label>Username:</label>
        <input type="text" v-model="regUsername" required>        
        <label>Password:</label>
        <input type="text" v-model="regPassword" required>   
        <label>Role:</label>
        <input type="text" v-model="regRole" required>           
      </div>     
      <br>     
      <input type="submit" value="Create">
      </form>

  <h3 v-if="usrrl =='ADMIN'">Add new ticket</h3>
  <form id="ticket-form" v-on:submit="addTicket" v-if="usrrl =='ADMIN'">
  <label for="compSelect">Choose a company: </label>
  <select v-model="selectedCompany" required>
      <option v-bind:name="compCombo.name" v-for="item in compCombo" v-bind:key="item.name">{{item.name}}</option>
  </select>
  <br><br>
  <label for="compSelect">Choose a flight: </label>
  <select v-model="selectedFlightId" required>
      <option v-for="item in fligCombo" v-bind:key="item.id" v-bind:value="{ id: item.id }">{{item.origin + "-"+item.destination}}</option>
  </select>
  <br><br>
  <div id="checkID">
  <input v-model="selectedOneway" type="checkbox" id="onewayid" name="oneWay" value="true">
  <label for="onewayid"> One way ticket</label><br><br>
  </div>
  <label for="departureDate">Departure date:</label><br>
  <input v-model="selectedDepDate" type="datetime-local" id="departureDate" name="departureDate" required>
  <br><br>
  <label for="returnDate">Return date:</label><br>
  <input v-model="selectedRetDate" type="datetime-local" id="returnDate" name="returnDate" ><br><br>
  <label>Number of tickets </label>
  <input v-model="selectedCount">
  <br><br>
    <input type="submit" value="Submit">
  </form>
  

  </div>
</template>
<script>
import UsersTable from '../components/UsersTable.vue'
import axios from 'axios'
import $ from 'jquery'
import moment from 'moment'
import UserClient from '../clients/user-client.js'
import { eventBus } from '../main'

export default {
  name: 'home',
  components: {
    UsersTable
  },
  // Sluzi za vrednosti koje se mogu menjati u toku rada aplikacije
  // Ukoliko se token promeni, computed metoda jwt ce odmah vratiti novu vrednost
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
  /* data: Mora biti funkcija koja vraca objekat. 
  Taj objekat ce sadrzati podatke koje ce ova komponenta koristiti. 
  Svi podaci zaregistrovani u data sekciji mogu se pristupiti sa this npr. this.users */
  data() {
    return {
      users: [],
      regUsername:" ",
      regPassword:" ",
      regRole:" ",
      compCombo:[],
      fligCombo:[],

      selectedCompany:"",
      selectedFlightId:"",
      selectedCount:0,
      selectedOneway:false,
      selectedRetDate:"",
      selectedDepDate:"",

      noReser:0

    }
  },
  methods:{
    addUser(e){
      e.preventDefault();
      
      const newUser = {
        username: this.regUsername,
        password: this.regPassword,
        role: this.regRole
      }
      axios.defaults.headers.common['Authorization'] = "Bearer "+window.localStorage.getItem('jwt');
      axios.post('http://localhost:8080/airline-ticket-shop-backend/api/users/register',newUser).then((response) => {
            // Podaci sa servera
            console.log(JSON.parse(JSON.stringify(response.data)));
            // Status code
            console.log(JSON.parse(JSON.stringify(response.status)));
          }, (error) => {
            console.log("An error occured:");
            console.log(error);
          });

          this.regRole="";
          this.regUsername="";
          this.regPassword="";
    return false;
    },
    addTicket(e){
      e.preventDefault();

      var dt = new Date(this.selectedDepDate);
      var parsed = moment(dt);
      let depTime = parsed.format('x');

      var rt = new Date(this.selectedRetDate);
      var parsed1 = moment(rt);
      let retTime = parsed1.format('x');

      if(this.selectedOneway)retTime=depTime;

      console.log(depTime);
      const newTicket = {
        "company": this.selectedCompany,
        "count": this.selectedCount,
        "departureDate": depTime,
        "flightId": this.selectedFlightId.id,
        "oneway": this.selectedOneway,
        "returnDate": retTime
    }
    console.log(newTicket);
      axios.defaults.headers.common['Authorization'] = "Bearer "+window.localStorage.getItem('jwt');
      axios.post('http://localhost:8080/airline-ticket-shop-backend/api/flights/tickets',newTicket).then((response) => {
            // Podaci sa servera
            console.log(JSON.parse(JSON.stringify(response.data)));
            // Status code
            console.log(JSON.parse(JSON.stringify(response.status)));
            // novo
            UserClient.loadUsers(this);
            // novo
        
          }, (error) => {
            console.log("An error occured:");
            console.log(error);
          });

      this.selectedCompany="";
      this.selectedFlightId="";
      this.selectedCount=0;
      this.selectedOneway=false;
      this.selectedRetDate="";
      this.selectedDepDate="";
      this.UsersTable.$forceUpdate();
      return false;
    },
     logoutf(){
       window.localStorage.clear();



    }
  },
  mounted(){
      $('#round').click(function() {
    $('td').parent().show();
    $('td:contains("true")').parent().hide();
  });

$('#one').click(function() {
    $('td').parent().show();
    $('td:contains("false")').parent().hide();
  });

$('#all').click(function() {
    $('td').parent().show();
  });

axios.get("http://localhost:8080/airline-ticket-shop-backend/api/companies", {
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.jwt
            },
        }).then((response) => {
          this.compCombo = JSON.parse(JSON.stringify(response.data));   
          console.log(this.compCombo);       
        }, (error) => {
          console.log("An error occured:");
          console.log(error);
        });  

  axios.get("http://localhost:8080/airline-ticket-shop-backend/api/flights", {
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.jwt
            },
        }).then((response) => {
          this.fligCombo = JSON.parse(JSON.stringify(response.data));   
          console.log(this.fligCombo);       
        }, (error) => {
          console.log("An error occured:");
          console.log(error);
        });

  this.noReser = parseInt(window.localStorage.getItem("rserve"));
  
  eventBus.$on('ticketBooked',()=>{
      this.noReser++;
    });   
  }
  
}

</script>