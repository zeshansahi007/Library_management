const db = require('../database/database.js')

const books = (req,res) => {
    try {
        db.query(`select * from books`,(err,rows,fields) => {
            if(err) res.json({'error':true,'message':'Their is error in database query!'})
            else{
                if(rows.length > 0){
                    res.json({'success':true,rows: rows})
                }
                else res.json({'success':true,'message':'No record found!'})
            }
        })
    }catch (err) {
        res.json({'message': err,'error': true})
    }
}

/* Add Book */
const addBook = (req, res) => {
    try {
        var title = req.body.title
        var stock = req.body.stock
        var author = req.body.author
        var publish = req.body.publish
        var rent = req.body.rent
        
        db.query(`insert into books(book_name,stock,author_name,publish_date,day_rent) 
        values('${title}',${stock},'${author}','${publish}','${rent}')`,(err,rows,fields) => {
            if(err) res.json({'error':true,'message':`Their is error in database query!`})
            else{
                res.json({'success':true,'message':`Published Successfully!`})   
            }  
        })
    }catch (err) {
        res.json({'message': err,'error': true})
    }
}

/* Update Book */
const updateBook = (req, res) => {
    try {
        var id = req.body.id
        var title = req.body.title
        var stock = req.body.stock
        var author = req.body.author
        var rent = req.body.rent
        
        db.query(`update books set book_name='${title}',stock='${stock}',author_name='${author}',day_rent='${rent}'
        where book_id=${id}`,(err,rows,fields) => {
            if(err) res.json({'error':true,'message':`Their is error in database query!`})
            else{
                res.json({'success':true,'message':`Updated Successfully!`})   
            }  
        })
    }catch (err) {
        res.json({'message': err,'error': true})
    }
}

const deleteBook = (req, res) => {
    try {
        var id = req.params.id
        db.query(`delete from books where book_id='${id}'`,(err,rows,fields) => {
            if(err) res.json({'error':true,'message':`Their is error in database query!`})
            else{
                res.json({'success':true,'message':`Deleted Successfully!`})   
            }  
        })
    }catch (err) {
        res.json({'message': err,'error': true})
    }
}

const bookAvailable = (req, res) => {
    try {
        var bookId = req.params.bookId
        var userId = req.params.userId
        db.query(`select * from books where book_id='${bookId}'`,(err,rows,fields) => {
            if(err) res.json({'error':true,'message':`Their is error in database query!`})
            else{
                db.query(`select * from borrow_details where book_id='${bookId}' and status=0`,(err,rowss,fields) => {
                    if(err) res.json({'error':true,'message':`Their is error in database query!`})
                    else{
                        if(rowss.length < rows[0]['stock']){
                            db.query(`select * from borrow_details where book_id='${bookId}' and status=0 and user_id='${userId}'`,(err,rowsss,fields) => {
                                if(err) res.json({'error':true,'message':`Their is error in database query!`})
                                else{
                                    if(rowsss.length > 0){
                                        res.json({'success':true,'already':true,'message':'Book already borrowed',row: rowsss})   
                                    }
                                    else res.json({'success':true,'available':true,'message':'Book is available'})   
                                }  
                            }) 
                        }
                        else res.json({'success':true,'available':false,'message':'Book is not available'})   
                    }  
                })  
            }  
        })
    }catch (err) {
        res.json({'message': err,'error': true})
    }
}

const borrow = (req, res) => {
    try {
        var book_id = req.body.book_id
        var user_id = req.body.user_id
        var borrow_date = req.body.borrow_date
        var return_date = req.body.return_date
        var total_bill = req.body.total_bill
        db.query(`insert into borrow_details (borrow_date,return_date,total_bill,user_id,book_id) 
        values('${borrow_date}','${return_date}','${total_bill}','${user_id}','${book_id}')`,(err,rows,fields) => {
            if(err) res.json({'error':true,'message':`Their is error in database query!`})
            else{
                res.json({'success':true,'message':`Borrowed Successfully!`})   
            }  
        })
    }
    catch (err) {
        res.json({'message': err,'error': true})
    }
}

const returnBook = (req, res) => {
    try {
        var id = req.body.id
        var userId = req.body.userId
        var totalFine = req.body.totalFine
        db.query(`update borrow_details set fine='${totalFine}', status='1' where detials_id=${id}`,(err,rows,fields) => {
            if(err) res.json({'error':true,'message':`Their is error in database query!`})
            else  res.json({'success':true,'message':`Returned Successfully!`})  
        })
    }catch (err) {
        res.json({'message': err,'error': true})
    }
}


module.exports = {
    books,
    addBook,
    updateBook,
    deleteBook,
    bookAvailable,
    borrow,
    returnBook
}