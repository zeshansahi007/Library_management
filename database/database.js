const mySql = require('mysql')
const db = mySql.createConnection({
    host : 'localhost',
    user : "root",
    password : "",
    database : 'library'
})

module.exports = db