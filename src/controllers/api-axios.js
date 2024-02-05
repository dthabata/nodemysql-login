const axios = require('axios');

exports.getAxiosApi = async (req, res) => {
    axios.get("http://localhost:5000/api-user/register")
    .then((response) => {
        console.log(response.data);
    })
    .catch((error) => {
        console.log(error);
    })
}