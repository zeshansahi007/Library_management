const express = require('express')
// Initializing express app
const app = express()
const port = 3000
const db = require('./database/database.js')
const router = require('./routes/routes.js')
const path = require('path')
const bodyParser = require('body-parser')

db.connect(err => {
    if(err)
        throw err
    console.log('mySql connected!..')
})

// Setting our view engine to pug
app.set("view engine", "pug")

// Setting our default views
app.set("views", __dirname + "/views")

// Serving public assets
app.use(express.static(path.join(__dirname + "/public")))




app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/',router)

app.listen(port,() => console.log(`App is litning on port ${port}`))