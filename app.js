const express = require('express');
const path = require('path');
const mysql = require('mysql');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config({
    path: './.env'
})

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

const publicDirectory = path.join(__dirname, './src/public');
console.log(publicDirectory);
app.use(express.static(publicDirectory));

// parse url-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));

// parse json bodies (as sent by API clients)
app.use(express.json());
app.use(cookieParser());

app.set('views', path.join(__dirname, './src/views'));
app.set('view engine', 'hbs');

db.connect((error) => {
    if(error) {
        console.log(error);
    } else {
        console.log('MySQL connected...');
    }
});

// define routes
app.use('/', require('./src/routes/pages'));
app.use('/auth', require('./src/routes/auth'));
app.use('/api', require('./src/routes/api'));

app.listen(5000, () => {
    console.log('Server started on port 5000');
});
