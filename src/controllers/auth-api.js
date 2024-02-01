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

exports.isLoggedIn = async (req, res, next) => {
    
    authorizationParam = req.header("Authorization")

    if (authorizationParam == undefined || authorizationParam.length == 0){
        return res.end(JSON.stringify({ "message": "Authorization inválido 1", "status": false }));
    }
    const authorization = authorizationParam.replaceAll('Bearer ', '');
    try {
        // verify the token
        const decoded = await promisify(jwt.verify)(authorization,
            process.env.JWT_SECRET
        );

        // check if the user still exists
        db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (error, result) => {

        if (!result || error) {
            return next();
        }

        req.user = result[0];
        return next();
        });
    } catch (error) {
        console.log(error);
        return res.end(JSON.stringify({ "message": "Authorization inválido 2", "status": false }));
    }
    
};
