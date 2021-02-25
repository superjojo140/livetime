//Code from https://codeburst.io/node-js-mysql-and-promises-4c3be599909b
const mysql = require('mysql');

const config = {
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB
};

let connection = mysql.createConnection(config);

module.exports.query = function (sql, args) {
    return new Promise((resolve, reject) => {
        connection.query(sql, args, (err, rows) => {
            if (err)
                return reject(err);
            resolve(rows);
        });
    });
}

module.exports.close = function () {
    return new Promise((resolve, reject) => {
        connection.end(err => {
            if (err)
                return reject(err);
            resolve();
        });
    });
}