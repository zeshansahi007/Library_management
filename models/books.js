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

const addbooks = (req,res) => {

        res.json({'success':true,'message':'Book is available'})
    
}

const deletebooks = (req,res) => {

    res.json({'success':true,'message':'Book is available'})

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



module.exports = {
    books,
    bookAvailable,
    addbooks,
    deletebooks,
}