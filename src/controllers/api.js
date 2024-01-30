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
        db.query('SELECT * FROM users where email = ?', [email], async (error, results) => {
            if (!results || results.length == 0 || !(await bcrypt.compare(password, results[0].password))) {               
                res.end(JSON.stringify({ "message": "Não encontrou resultados", "status": false, "token": "" }));
            } else {
                const id = results[0].id;
                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                res.end(JSON.stringify({ "message": "Ok", "status": false, "token": token }));
            }
        });
}
    } catch (error) {
        console.log(error);
    }
};

// exports.registerApi = async (req, res) => {
//     res.setHeader('Content-Type', 'application/json');
// };
