<template>
    <div>
<label>JWT Token: {{jwt}} </label><br>
    <label>Username: {{usrname}}</label><br>
    <label>Role: {{usrrl}}</label> <br>
<br>
    <router-link @click.native="logoutf" to="/login">Logout</router-link> 
    <br>
    <router-link  to="/">Back to home page</router-link> 
    <br><br>
    
    {{ticket}}

  <form id="ticket-form" v-on:submit="editTicket">
  <hr>
  <label for="compSelect">Change company: </label>
  <select v-model="selectedCompany" required>
    <option v-bind:name="compCombo.name" v-for="item in compCombo" v-bind:key="item.name">{{item.name}}</option>
  </select>
  <br><br>
  <div id="checkID">
  <input v-model="selectedOneway" type="checkbox" id="onewayid" name="oneWay" >
  <label for="onewayid"> One way ticket</label><br><br>
  </div>
  <label> Current departure date - {{ticket.departureDate | dateFormat('DD MMM YYYY h:mm:ss a')}}</label>
  <br>
  <label for="departureDate">Edit departure date:</label><br>
  <input v-model="selectedDepDate" type="datetime-local" id="departureDate" name="departureDate" >
  <br><br>
  <label> Current return date - {{ticket.returnDate | dateFormat('DD MMM YYYY h:mm:ss a')}}</label>
  <br>
  <label for="returnDate">Edit return date:</label><br>
  <input v-model="selectedRetDate" type="datetime-local" id="returnDate" name="returnDate" value="ticket.returnDate" ><br><br>
  <label>Edit Number of tickets </label>
  <input v-model="selectedCount" required>
  <br><br>
    <input type="submit" value="Edit ticket">
    <hr>
  </form>

    </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
    name:"edit",
    data(){
        return {
            fid:this.$route.params.fid,
            tid:this.$route.params.tid,
            noReser:0,
            ticket:{},

            compCombo:[],
            selectedCompany:"",
            selectedCount:0,
            selectedOneway:false,
            selectedRetDate:"",
            selectedDepDate:"",
        }
    },
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
  },
    methods:{
     logoutf(){
       window.localStorage.clear();
    },
    editTicket(e){
{
      e.preventDefault();
      let depTime;
      let retTime;
      if(this.selectedDepDate !=""){
        console.log("Usao u depDateif");
      var dt = new Date(this.selectedDepDate);
      var parsed = moment(dt);
      depTime = parsed.format('x');
      }else {
        depTime = this.ticket.departureDate;
      }

      if(this.selectedRetDate !=""){
                console.log("Usao u retDateif");
      var rt = new Date(this.selectedRetDate);
      var parsed1 = moment(rt);
      retTime = parsed1.format('x');
      }else{
        retTime = this.ticket.returnDate;
      }

      const newTicket = {
        "company": this.selectedCompany,
        "count": this.selectedCount,
        "departureDate": depTime,
        "flightId": this.ticket.flightId,
        "oneway": this.selectedOneway,
        "returnDate": retTime,
        "ticketId":this.ticket.ticketId
    }
    console.log(newTicket);
      axios.defaults.headers.common['Authorization'] = "Bearer "+window.localStorage.getItem('jwt');
      axios.put('http://localhost:8080/airline-ticket-shop-backend/api/flights/tickets',newTicket).then((response) => {
            // Podaci sa servera
            console.log(JSON.parse(JSON.stringify(response.data)));
            // Status code
            console.log(JSON.parse(JSON.stringify(response.status)));
        
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
      return false;
    }
    }
    },
    mounted(){
      axios.get("http://localhost:8080/airline-ticket-shop-backend/api/flights/tickets/"+this.fid+"/"+this.tid)
      .then((response) =>{
        this.ticket = JSON.parse(JSON.stringify(response.data));
        this.selectedCompany = this.ticket.company;
        this.selectedOneway = this.ticket.oneway;
        this.selectedCount = this.ticket.count;

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