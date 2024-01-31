const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

exports.createAnimalApi = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const { name, breed, age, color } = req.body;

    db.query('INSERT INTO animal SET name = ?, breed = ?, age = ?, color = ?', [name, breed, age, color], (error, results) => {
        if (error) {
            console.log(error);
        } else {
            return res.end(JSON.stringify({ "message": "Animal cadastrado", "status": false }));
        }
    });
};

exports.getAnimalByIdApi = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const { id } = req.params;

    db.query('SELECT * FROM animal WHERE id = ?', [id], (error, results) => {

        if (error) {
            console.log(error);
        } 
        
        let resp = {};
        if (results.length > 0) {
            resp = results[0];
        }
        
        return res.end(JSON.stringify(resp));
    });
};
