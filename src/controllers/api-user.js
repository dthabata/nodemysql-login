const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

// TODO: return to async/await in the whole code where is needed as an improvement

exports.loginApi = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.end(JSON.stringify({ "message": "Falta de email ou senha", "status": false, "token": "" }));
        } else {
            db.query('SELECT * FROM users where email = ?', [email], (error, results) => {
                if (!results || results.length == 0) {
                    res.status(401).send(JSON.stringify({ "message": "Não encontrou resultados", "status": false, "token": "" }));
                } else {
                    bcrypt.compare(password, results[0].password, (err, result) => {
                        if (err || !result) {
                            res.status(401).send(JSON.stringify({ "message": "Não encontrou resultados", "status": false, "token": "" }));
                        } else {
                            const id = results[0].id;
                            const name = results[0].name;
                            const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                                expiresIn: process.env.JWT_EXPIRES_IN
                            });
                            res.end(JSON.stringify({ "message": "Ok", "status": true, "token": token, "name": name  }));
                        }    
                    }); 
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
};

exports.loginApiSync = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.end(JSON.stringify({ "message": "Falta de email ou senha", "status": false, "token": "" }));
        } else {
        db.query('SELECT * FROM users where email = ?', [email], async (error, results) => {
            if (!results || results.length == 0 || !(await bcrypt.compare(password, results[0].password))) {               
                res.status(401).send(JSON.stringify({ "message": "Não encontrou resultados", "status": false, "token": "" }));
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

exports.registerApi = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const { name, email, password } = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], (error, results) => {    
        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            return res.end(JSON.stringify({ "message": "E-mail já em uso", "status": false }));
        }

        bcrypt.hash(password, 8, (err, hashedPassword) => {
            db.query('INSERT INTO users SET ?', {name: name, email: email, password: hashedPassword}, (error, results) => {
                if (error) {
                    console.log(error);
                } else {
                    return res.end(JSON.stringify({ "message": "Usuário cadastrado", "status": true }));
                }
            }) 
        });
    });
};

exports.registerApiSync = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const { name, email, password } = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        
        if (error) {
            console.log(error);
        }

        if (results.length > 0) {
            return res.end(JSON.stringify({ "message": "E-mail já em uso", "status": false }));
        } 
    
        const hashedPassword = await bcrypt.hash(password, 8);

        db.query('INSERT INTO users SET ?', {name: name, email: email, password: hashedPassword}, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                return res.end(JSON.stringify({ "message": "Usuário cadastrado", "status": false }));
            }
        })
    });
};

exports.updateApi = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const { id } = req.params;
    const { name, email, password } = req.body;

    bcrypt.hash(password, 8, (err, hashedPassword) => {
        db.query('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?', [name, email, hashedPassword, id], (error, results) => {
            if (error) {
                return res.end(JSON.stringify({ "message": error, "status": false }));
            } else {
                return res.end(JSON.stringify({ "message": "Usuário atualizado", "status": true }));
            }
        })
    });
};

exports.deleteApi = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const { id } = req.params;

    db.query('DELETE FROM users WHERE id = ?', [id], (error, results) => {
        if (error) {
            return res.end(JSON.stringify({ "message": error, "status": false }));
        } else {
            return res.end(JSON.stringify({ "message": "Usuário deletado", "status": true }));
        }
    })
};

exports.deleteApiSync = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    try {
        const { id } = req.params;

        const results = await db.query('DELETE FROM users WHERE id = ?', [id]);

        res.end(JSON.stringify({ "message": "Usuário deletado", "status": true }));
    } catch (error) {
        res.end(JSON.stringify({ "message": error, "status": false }));
    }
};
