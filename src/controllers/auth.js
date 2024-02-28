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

// exports.login = (req, res) => {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) {
//             return res.status(400).render('login', {
//                 message: 'Please provide a valid email and password'
//             });
//         }
//         db.query('SELECT * FROM users where email = ?', [email], (error, results) => {
//             if (!results || results.length == 0) {
//                 res.status(401).render('login', {
//                     message: 'Email or password is incorrect'
//                 });
//             } else {
//                 bcrypt.compare(password, results[0].password, (err, result) => {
//                     if (err || !result) {
//                         res.status(401).send(JSON.stringify({ "message": "Couldn't find results", "status": false, "token": "" }));
//                     } else {
//                         const id = results[0].id;
//                         const token = jwt.sign({ id }, process.env.JWT_SECRET, {
//                             expiresIn: process.env.JWT_EXPIRES_IN
//                         });
        
//                         const cookieOptions = {
//                             expires: new Date(
//                               Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
//                             ),
//                             httpOnly: true
//                         }
        
//                         res.cookie('jwt', token, cookieOptions);
//                         res.status(200).redirect('/');
//                     }    
//                 });
//                 }
//             });
//     } catch (error) {
//         console.log(error);
//     }
// };

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).render('login', {
                message: 'Please provide a valid email and password'
            });
        }

        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        if (!rows || rows.length === 0) {
            return res.status(401).render('login', {
                message: 'Email or password is incorrect'
            });
        }

        const result = await bcrypt.compare(password, rows[0].password);

        if (!result) {
            return res.status(401).send(JSON.stringify({ "message": "Couldn't find results", "status": false, "token": "" }));
        }

        const id = rows[0].id;
        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        const cookieOptions = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        res.cookie('jwt', token, cookieOptions);
        res.status(200).redirect('/');
    } catch (error) {
        console.log(error);
        res.status(500).send(JSON.stringify({ "message": "Internal Server Error" }));
    }
};

// exports.register = (req, res) => {
//     const { name, email, password, passwordConfirm } = req.body;

//     db.query('SELECT email FROM users WHERE email = ?', [email], (error, results) => {
//         if (error) {
//             console.log(error);
//         }

//         if (results.length > 0) {
//             return res.render('register', {
//                 message: 'That email is already in use'
//             });
//         } 

//         else if (password !== passwordConfirm) {
//             return res.render('register', {
//                 message: 'Passwords do not match'
//             });
//         }

//         bcrypt.hash(password, 8, (err, hashedPassword) => {
//             db.query('INSERT INTO users SET ?', {name: name, email: email, password: hashedPassword}, (error, results) => {
//                 if (error) {
//                     console.log(error);
//                 } else {
//                     return res.render('register', {
//                         message: 'User registered'
//                     });
//                 }
//             });
//         });
//     });
// };

exports.register = async (req, res) => {
    try {
        const { name, email, password, passwordConfirm } = req.body;

        const [emailResults] = await db.query('SELECT email FROM users WHERE email = ?', [email]);

        if (emailResults.length > 0) {
            return res.render('register', {
                message: 'That email is already in use'
            });
        } else if (password !== passwordConfirm) {
            return res.render('register', {
                message: 'Passwords do not match'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 8);

        await db.query('INSERT INTO users SET ?', { name, email, password: hashedPassword });

        return res.render('register', {
            message: 'User registered'
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(JSON.stringify({ "message": "Internal Server Error" }));
    }
};

// exports.isLoggedIn = (req, res, next) => {
//     if (req.cookies.jwt) {
//         promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET)
//             .then(decoded => {
//                 return new Promise((resolve, reject) => {
//                     db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (error, result) => {
//                         if (error) {
//                             reject(error);
//                         } else {
//                             resolve(result);
//                         }
//                     });
//                 });
//             })
//             .then(result => {
//                 console.log(result);

//                 if (!result) {
//                     return next();
//                 }

//                 req.user = result[0];
//                 return next();
//             })
//             .catch(error => {
//                 console.log(error);
//                 return next();
//             });
//     } else {
//         next();
//     }
// };

exports.isLoggedIn = async (req, res, next) => {
    try {
        if (req.cookies.jwt) {
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            const result = await new Promise((resolve, reject) => {
                db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            });

            console.log(result);

            if (!result) {
                return next();
            }

            req.user = result[0];
            return next();
        } else {
            return next();
        }
    } catch (error) {
        console.log(error);
        return next();
    }
};

exports.logout = (req, res) => {
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 2 * 1000),
        httpOnly: true,
    });

    res.status(200).redirect('/');
};
