const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

exports.loginApi = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.end(JSON.stringify({ "message": "Falta de email ou senha", "status": false, "token": "" }));
        } else {

        console.log(email);
        console.log(password);

        res.end(JSON.stringify({ b: 2 }));
}
    } catch (error) {
        console.log(error);
    }
};
