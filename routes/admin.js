const { Router } = require('express')
const route = Router()
const Admin = require('../controllers/Admin.js')
const Books = require('../controllers/Books.js')

/* Books */
route.get('/books', (req, res) => {
    Admin.bookGet(req,res)
})

/* Books */
route.get('/allBooks', (req, res) => {
    Books.books(req,res)
})

/* Add Books */
route.post('/addBooks', (req, res) => {
    Admin.addBooks(req,res)
})

/* Update Books */
route.post('/updateBooks', (req, res) => {
    Admin.updateBooks(req,res)
})

/* Delete Book */
route.get('/deleteBook/:id', (req, res) => {
    Admin.deleteBook(req,res)
})

/* Users */
route.get('/users', (req, res) => {
    Admin.users(req,res)
})

/* All Users */
route.get('/allUsers', (req, res) => {
    Admin.allUsers(req,res)
})

/* Update Users */
route.post('/updateUser', (req, res) => {
    Admin.updateUsers(req,res)
})

/* Delete User */
route.get('/deleteUser/:id', (req, res) => {
    Admin.deleteUser(req,res)
})

module.exports = route