const mySql = require('mysql')
const db = mySql.createConnection({
    host : 'localhost',
    port: 3306,
    user : 'root',
    password :"",
    database : 'library'
})

module.exports = db