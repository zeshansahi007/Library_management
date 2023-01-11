const db = require('../database/database.js')

const login = (req, res) => {
    try {
        var email = req.body.email
        var pass = req.body.password
        db.query(`select * from users where email='${email}' and password= '${pass}'`,(err,rows,fields) => {
            if(err) res.json({'error':true,'message':'Their is error in database query!'})
            else{
                if(rows.length > 0){
                    res.json({'success':true,'message':'Login Success!',type: rows[0]['user_type'],id: rows[0]['user_id']})
                }
                else res.json({'error':true,'message':'Incorrect Email or Password!'})
            }
        })
    }catch (err) {
        res.json({'message': err,'error': true})
    }
}

const signup = (req, res) => {
    try {
        var email = req.body.email
        var username = req.body.username
        var pass = req.body.password
        db.query(`select * from users where email='${email}' or user_name='${username}'`,(err,rows,fields) => {
            if(err) res.json({'error':true,'message':`Their is error in database query!`})
            else{
                if(rows.length > 0) res.json({'error':true,'message':`The Email ${email} or username ${username} already exists!`})
                else{
                    db.query(`insert into users(email,user_type,user_name,password) values('${email}',${1},'${username}','${pass}')`,(err,rows,fields) => {
                        if(err) res.json({'error':true,'message':`Their is error in database query!`})
                        else{
                            res.json({'success':true,'message':`Register Successfully!`})   
                        }  
                    })
                }
            }
        })
    }catch (err) {
        res.json({'message': err,'error': true})
    } 
}

const users = (req,res) => {
    try {
        db.query(`select * from users where user_type!='0'`,(err,rows,fields) => {
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

/* Update User */
const updateUser = (req, res) => {
    try {
        var id = req.body.id
        var username = req.body.username
        var password = req.body.password
        
        db.query(`update users set user_name='${username}',password='${password}' where user_id=${id}`,(err,rows,fields) => {
            if(err) res.json({'error':true,'message':`Their is error in database query!`})
            else{
                res.json({'success':true,'message':`Updated Successfully!`})   
            }  
        })
    }catch (err) {
        res.json({'message': err,'error': true})
    }
}

const deleteUser = (req, res) => {
    try {
        var id = req.params.id
        db.query(`delete from users where user_id='${id}'`,(err,rows,fields) => {
            if(err) res.json({'error':true,'message':`Their is error in database query!`})
            else{
                res.json({'success':true,'message':`Deleted Successfully!`})   
            }  
        })
    }catch (err) {
        res.json({'message': err,'error': true})
    }
}

module.exports = {
    login,
    signup,
    users,
    updateUser,
    deleteUser
}
