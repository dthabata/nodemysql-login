const axios = require('axios');

const newUser = {
    name: 'Eduardo',
    email: 'eduardo@email.com',
    password: '1234',
}

console.log("==== SENT:");
console.log(newUser);
console.log("==========");

axios.post("http://localhost:5000/api-user/register", newUser)
    .then((response) => {
        console.log("==== RESPONSE:");
        console.log(response.data);
        console.log("==========");
    })
    .catch((error) => {
        console.log(error, "DEEEEU ERRROOOO!!!!");
    })