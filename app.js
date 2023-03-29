const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

const app = express()

//setear el motor de plantillas
app.set('view engine', 'ejs')

//setear la carpeta public para archivos estaticos
app.use(express.static('public'))

//para procesar datos enviados desde form
app.use(express.urlencoded({ extended:true}))
app.use(express.json())

//setear las variables de entorno
dotenv.config({path: './env/.env'})

//para poder trabajar con las cookies
app.use(cookieParser())

//llamar al router
app.use('/',require ('./routes/router.js'))

//para eliminar el cache y q no se pueda volver con el boton de back luego de que hacemos un logout
app.use(function(req, res,next){
    if (!req.user)
       res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();

});

//esto se quita porque se la paso a router.js
/*app.get('/',(req,res)=>{
    res.render('index')
})*/

app.listen(3000, ()=>{
    console.log('SERVER UP runing in http://localhost:3000')
})