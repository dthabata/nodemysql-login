const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

exports.createAnimalApi = (req, res) => {
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

exports.createAnimalApiSync = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    
    try {
        const { name, breed, age, color } = req.body;
        await db.query('INSERT INTO animal SET name = ?, breed = ?, age = ?, color = ?', [name, breed, age, color], (error, results) => {
            console.log(results);
    
            if (error) {
                console.log(error);
            } else {
                return res.end(JSON.stringify({ "message": "Animal cadastrado", "status": false }));
            }
        });
    } catch (error) {
        console.log(error);
    }
};

exports.getAnimalListApi = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    db.query('SELECT * FROM animal', (error, results) => {

        if (error) {
            console.log(error);
        } 

        let resp = [];
        if (results.length > 0) {
            resp = results;
        }
        
        return res.end(JSON.stringify(resp));
    });
};

exports.getAnimalListApiSync = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    await db.query('SELECT * FROM animal', (error, results) => {

        if (error) {
            console.log(error);
        } 

        let resp = [];
        if (results.length > 0) {
            resp = results;
        }
        
        return res.end(JSON.stringify(resp));
    });
};

exports.getAnimalPaginatedListApi = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const page = parseInt(req.query.page) || 0;
    const max = parseInt(req.query.max) || 1;
    const skip = page * max;

    db.query('SELECT * FROM animal ORDER BY id DESC limit ?, ?', [skip, max], (error, results) => {

        if (error) {
            console.log(error);
            return res.end(JSON.stringify([]));
        } 
        return res.end(JSON.stringify(results));
    });
};

exports.getAnimalPaginatedListApiSync = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const page = parseInt(req.query.page) || 0;
    const max = parseInt(req.query.max) || 1;
    const skip = page * max;

    await db.query('SELECT * FROM animal ORDER BY id DESC limit ?, ?', [skip, max], (error, results) => {

        if (error) {
            console.log(error);
            return res.end(JSON.stringify([]));
        } 
        return res.end(JSON.stringify(results));
    });
};

exports.getAnimalByIdApi = (req, res) => {
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

exports.updateAnimalApi = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const { id } = req.params;
    const { name, breed, age, color } = req.body;

    db.query('UPDATE animal SET name = ?, breed = ?, age = ?, color = ? WHERE id = ?', [name, breed, age, color, id], (error, results) => {
        console.log(results);

        if (error) {
            console.log(error); 
            return res.end(JSON.stringify({ "message": error, "status": false }));
        } else {
            return res.end(JSON.stringify({ "message": "Animal atualizado", "status": true }));
        }
    })
};

exports.deleteAnimalByIdApi = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const { id } = req.params;

    db.query('DELETE FROM animal WHERE id = ?', [id], (error, results) => {
        console.log(results);

        if (error) {
            console.log(error); 
            return res.end(JSON.stringify({ "message": error, "status": false }));
        } else {
            return res.end(JSON.stringify({ "message": "Animal deletado", "status": true }));
        }
    })
};
