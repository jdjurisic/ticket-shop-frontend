<template>
    <div>
<label>JWT Token: {{jwt}} </label><br>
    <label>Username: {{usrname}}</label><br>
    <label>Role: {{usrrl}}</label> <br>

    <router-link @click.native="logoutf" to="/login">Logout</router-link> 
    <br>
    <router-link  to="/">Back to home page</router-link> 
    <br>

        <p>{{id}}</p>

    </div>
</template>

<script>
export default {
    name:"edit",
    data(){
        return {
            id:this.$route.params.id,
            noReser:0
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
    }
    }
}
</script>