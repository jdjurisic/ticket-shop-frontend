import axios from 'axios'

const baseUrl = "http://localhost:8080/airline-ticket-shop-backend/api/users";

let UserClient = {
    loadUsers(comp) {  
      axios.get("http://localhost:8080/airline-ticket-shop-backend/api/flights/tickets", {
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.jwt
            },
        }).then((response) => {
          // Pregazimo korisnike u Home komponenti
          comp.users = JSON.parse(JSON.stringify(response.data));          
        }, (error) => {
          console.log("An error occured:");
          console.log(error);
        });
    },

    login(username, password, comp) {  
      axios.post(baseUrl + '/login', {
        username: username,
        password: password
      }).then((response) => {
            // Podaci sa servera
            //console.log(JSON.parse(JSON.stringify(response.data)));
            // Status code
            let uloga = JSON.parse(JSON.stringify(response.data)).role;
            let usrname = JSON.parse(JSON.stringify(response.data)).username;

            window.localStorage.setItem('rserve', "");  
            window.localStorage.setItem('usrnme', usrname);
            window.localStorage.setItem('usrrl', uloga);
            
            if(uloga !="ADMIN"){
              let reservations = JSON.parse(JSON.stringify(response.data)).bookings;
              let count = Array.from(reservations);
              window.localStorage.setItem('rserve', count.length);  
            }
                            
            console.log(JSON.parse(JSON.stringify(response.status)));
            let token = JSON.parse(JSON.stringify(response.headers));
            console.log(token.authorization.substr(7));
            window.localStorage.setItem('jwt', token.authorization.substr(7))
            axios.defaults.headers.common['Authorization'] = token.authorization;
            comp.$router.push({name: 'home'});
          }, (error) => {
            console.log("An error occured:");
            console.log(error);
            alert("Login Error -  Wrong Username/Password")
          });
      },
      loadCompanyTicket(comp,companyName){
        axios.get("http://localhost:8080/airline-ticket-shop-backend/api/companies/"+companyName, {
          headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.jwt
            },
        }).then((response) => {
          // Pregazimo korisnike u Home komponenti
          comp.users = JSON.parse(JSON.stringify(response.data));          
        }, (error) => {
          console.log("An error occured:");
          console.log(error);
        });
      },
      
      loadPage(comp,page){  
        axios.get("http://localhost:8080/airline-ticket-shop-backend/api/flights/ticketpage",{
          params:{"page":page}
          }).then((response) => {
            comp.users = JSON.parse(JSON.stringify(response.data.data));        
          }, (error) => {
            console.log("An error occured:");
            console.log(error);
          });
      }
}


export default UserClient
