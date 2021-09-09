const mysql = require('mysql');

const connectionPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_heroes',
});

module.exports = connectionPool;