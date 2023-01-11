const User = require('../models/user.js')

const loginGet = (req, res) => {
    return res.render('login')
}

const loginPost = (req, res) => {
    User.login(req, res)
}

const signupGet = (req, res) => {
    return res.render('signup')
}

const signupPost = (req, res) => {
    User.signup(req, res)
}

const logout = (req,res) => {
    return res.redirect('/login')
}


module.exports = {
    loginGet, 
    loginPost,
    signupGet,
    signupPost,
    logout
}