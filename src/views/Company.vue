<template>
    <div>
    <label>JWT Token: {{jwt}} </label><br>
    <label>Username: {{usrname}}</label><br>
    <label>Role: {{usrrl}}</label> <br><br>
    <router-link to="/reservations"><label v-if="rserve" v-bind:noReser="noReser" >Bookings: {{noReser}}</label></router-link><br>
    <router-link @click.native="logoutf" to="/login">Logout</router-link> 
    <br>
    <router-link to="/">Home</router-link> 
    <hr>
    <h2>{{companyName}}</h2>

    <UsersTable v-if="this.users" v-bind:users="this.users"/>
    <hr>
    <div v-if="usrrl == 'ADMIN'">
    <button @click="deleteCmpny">Delete company</button>
    <hr>
    <label>Create new company</label>
    <form v-on:submit="addCompany">
    <div class="form-group">
    <input type="text" v-model="newCmpName" required>  
    <input type="submit" value="Create">
    </div>    
    </form>
    <hr>
    <label>Rename selected company</label>
    <form v-on:submit="editCompany" >
      <input type="text" v-model="editCmpName" required>
      <input type="submit" value="Rename">
      </form>
    </div>



    </div>
</template>

<script>

import axios from 'axios'
import UsersTable from '../components/UsersTable.vue'
import UserClient from '../clients/user-client.js'
import { eventBus } from '../main'

export default {
    name:'company',
    components:{
      UsersTable
    },
    data(){
        return{
          users: [],
          companyName: this.$route.params.name,
          noReser:0,
          newCmpName:"",
          editCmpName:""

        }
    },
    methods:{
    deleteCmpny(e){
        e.preventDefault();
        console.log(this.companyName);
        axios.delete("http://localhost:8080/airline-ticket-shop-backend/api/companies/"+this.companyName, {
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.jwt
            },
        }).then(() => {
          this.$router.push({name: 'home'});
        }, (error) => {
          console.log("An error occured:");
          console.log(error);
        }); 
      },
    logoutf(){
    window.localStorage.clear();
    },
    addCompany(e){
      e.preventDefault();
      const newCmp ={newCompany:this.newCmpName};
      if(this.newCmpName.length > 0){
            axios.post("http://localhost:8080/airline-ticket-shop-backend/api/companies",newCmp).then(() => {
          this.$router.push({name: 'home'});
        }, (error) => {
          console.log("An error occured:");
          console.log(error);
        }); 
      }else alert("Enter company name!");
        

      },
    editCompany(e){
      e.preventDefault();
      if(this.editCmpName.length >0){
        const edited ={newCompany:this.editCmpName};
        axios.put("http://localhost:8080/airline-ticket-shop-backend/api/companies/"+this.companyName,edited).then(() =>{
          this.$router.push({name: 'home'});
        },(error) => {
          console.log("An error occured:");
          console.log(error);
        });
      }else alert("Enter company name!");

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
    rserve(){
      return window.localStorage.getItem("rserve");
    },
  },
  mounted(){
    UserClient.loadCompanyTicket(this,this.companyName);
    this.noReser = parseInt(window.localStorage.getItem("rserve"));

    eventBus.$on('ticketBooked',()=>{
    this.noReser++;
    window.localStorage.setItem("rserve",this.noReser);
    });   
  }
}
</script>