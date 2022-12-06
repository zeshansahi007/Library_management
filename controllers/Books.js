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

const addbooks = (req,res) => {
    res.render('addbooks')

}



const deletebooks = (req,res) => {
    res.render('deletebooks')

}


module.exports = {
    bookGet,
    books,
    bookAvailable,
    addbooks,
    deletebooks,
    
}