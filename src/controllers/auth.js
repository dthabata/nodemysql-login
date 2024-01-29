const mysql = require('mysql');
// TODO: remove JWT logic
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).render('login', {
                message: 'Please provide a valid email and password'
            });
        }

        db.query('SELECT * FROM users where email = ?', [email], async (error, results) => {
            if (!results || !(await bcrypt.compare(password, results[0].password))) {
                res.status(401).render('login', {
                    message: 'Email or password is incorrect'
                });
            } else {
                const id = results[0].id;
                const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                // shows the token 
                console.log('The token is: ' + token);

                const cookieOptions = {
                    expires: new Date(
                      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect('/');

                }
            });

    } catch (error) {
        console.log(error);
    }
};

exports.register = (req, res) => {
    const { name, email, password, passwordConfirm } = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            return res.render('register', {
                message: 'That email is already in use'
            });
        } 

        else if (password !== passwordConfirm) {
            return res.render('register', {
                message: 'Passwords do not match'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);

        db.query('INSERT INTO users SET ?', {name: name, email: email, password: hashedPassword}, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                return res.render('register', {
                    message: 'User registered'
                });
            }
        })
    });
};

// TODO: remove JWT logic
exports.isLoggedIn = async (req, res, next) => {
    if(req.cookies.jwt) {
        try {
            // verify the token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt,
            process.env.JWT_SECRET
            );
    
            console.log(decoded);
    
            // check if the user still exists
            db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (error, result) => {
            console.log(result);
    
            if (!result || error) {
                return next();
            }
    
            req.user = result[0];
            console.log("user is")
            console.log(req.user);
            return next();
    
            });
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        next();
    }
};

// TODO: remove JWT logic
exports.logout = async (req, res) => {
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true,
    });

    res.status(200).redirect('/');
};