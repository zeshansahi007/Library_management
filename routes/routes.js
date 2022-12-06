const { Router } = require('express')
const route = Router()
const Books = require('../controllers/Books.js')

route.get('/', (req, res) => {
    Books.bookGet(req,res)
})

/* Books */
route.get('/books', (req, res) => {
    Books.bookGet(req,res)
})

/* Books */
route.get('/allBooks', (req, res) => {
    Books.books(req,res)
})

/* add books */
route.get('/addbooks', (req, res) => {
    Books.addbooks(req,res)
})


/* deletebooks */
route.get('/deletebooks', (req, res) => {
    Books.deletebooks(req,res)
})

route.get('/booksAvailable/:bookId/:userId', (req, res) => {
    Books.bookAvailable(req,res)
})

module.exports = route