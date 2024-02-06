const axios = require('axios');

const newUser = {
    name: 'Olivia',
    email: 'olivia@email.com',
    password: '1234',
}

axios.post("http://localhost:5000/api-user/register", newUser)
    .then((response) => {
        console.log(response);
    })
    .catch((error) => {
        console.log(error);
    })
    .finally((response) => {
        console.log(response.data);
    })