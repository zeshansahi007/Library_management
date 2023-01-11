const Books = require('../models/books.js')

const bookGet = (req, res) => {
    res.render('books')
}

const books = (req, res) => {
    Books.books(req,res)
}

const bookAvailable = (req,res) => {
    Books.bookAvailable(req,res)
}

const borrow = (req,res) => {
    Books.borrow(req,res)
}

const returnBook = (req,res) => {
    Books.returnBook(req,res)
}

const borrowedGet = (req,res) => {
    res.render('borrowed')
}

module.exports = {
    bookGet,
    books,
    bookAvailable,
    borrow,
    returnBook,
    borrowedGet
}