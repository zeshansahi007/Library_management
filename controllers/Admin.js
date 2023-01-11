const Books = require('../models/books.js')
const User = require('../models/user.js')

const bookGet = (req, res) => {
    res.render('admin/books')
}

const addBooks = (req, res) => {
    Books.addBook(req,res)
}

const updateBooks = (req, res) => {
    Books.updateBook(req,res)
}

const deleteBook = (req, res) => {
    Books.deleteBook(req,res)
}

const users = (req, res) => {
    res.render('admin/users')
}

const allUsers = (req, res) => {
    User.users(req,res)
}

const updateUsers = (req, res) => {
    User.updateUser(req,res)
}

const deleteUser = (req, res) => {
    User.deleteUser(req,res)
}

module.exports = {
    bookGet,
    updateBooks,
    addBooks,
    users,
    deleteBook,
    allUsers,
    updateUsers,
    deleteUser
}