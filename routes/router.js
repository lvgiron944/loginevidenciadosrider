const express = require('express')
const router = express.Router()


//const conexion = require('../database/dtabase.js')

const authController = require('../controllers/authController')

//routas para las vistas

router.get('/', authController.isAuthenticated,(req,res) => {
    res.render('index', {user:req.user})
})

router.get('/login',(req,res) => {
    res.render('login', {alert:false})
})

router.get('/register',(req, res) => {
    res.render('register')
})




//rutas para los metodos del controller
router.post ('/register', authController.register)
router.post ('/login', authController.login)
router.get ('/logout', authController.logout)

module.exports = router