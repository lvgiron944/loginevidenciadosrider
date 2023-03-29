const jwt = require ('jsonwebtoken')
const bcryptjs = require ('bcryptjs')
const conexion = require ('../database/dtabase.js')
const {promisify} = require('util')
const { Console } = require('console')


//metodo para registrarse
exports.register = async (req,res) => {
    try {
        const name = req.body.name
        const user = req.body.user
        const pass = req.body.pass
   // console.log(name+" "+user+" "+pass) nos muestra en cosnsola los datos registrados
        let passHash = await bcryptjs.hash(pass, 8)
   // console.log(passHash)
       conexion.query('INSERT INTO users SET ?',{user:user, name:name, pass:passHash}, (error,results) =>{
        if (error) {console.log(error)}
        res.redirect('/')
       })
    } catch (error) {
        console.log(error)
        
    }
    
}

exports.login = async (req, res) => {
    try {
       const user = req.body.user
       const pass = req.body.pass
       //console.log(user+" - "+pass)
       if (!user || !pass){
          res.render('login',{
             alert: true,
             alertTitle: "Advertencia",
             alertMessage: "Ingrese un usuario y password",
             alertIcon: 'info',
             showConfirmButton: true,
             timer: false,
             ruta: 'login'
          })
        
       } else{
        conexion.query('SELECT * FROM users WHERE user = ?' , [user], async (error,results) =>{
            if(results.length == 0 || ! (await bcryptjs.compare(pass, results[0].pass))){
                res.render('login',{
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Usuario y/o Password incorrectas",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'  
                })
            } else{
                //en caso de que ingrese datos bien el inicio de sesion esta validado
                const id = results[0].id
               /* const token = jwt.sign({id:id}, process.env.JWT_SECRETO, {
                    expiresIn: process.env.JWT_TIEMPO_EXPIRA
                })*/
                //generamos el token sin efcha de expiracion SI SE QUIERE SINO SE DEJA EL DE ARRIBA
                const token = jwt.sign({id:id}, process.env.JWT_SECRETO)
                console.log("TOKEN: "+token+"para el USUARIO : "+user)

                //configuracion de las cookies
                const cookiesOptions = {
                    expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                    httpOnly: true
                }
                res.cookie('jwt', token, cookiesOptions) 
                res.render('login',{
                    alert: true,
                    alertTitle: "conexion exitosa",
                    alertMessage: "¡LOGIN CORRECTO!",
                    alertIcon:'succes',
                    showConfirmButton: false,
                    timer: 800,
                    ruta: ''
                })
            }

        })
       }
    } catch (error) {
        console.log(error)
    }
}

exports.isAuthenticated = async (req, res, next) =>{
    if (req.cookies.jwt){
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            conexion.query('SELECT * FROM users WHERE id = ?',[decodificada.id], (error, results) =>{
                if(!results){return next()}
                req.user = results[0]
                return next()
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    }else{
        res.redirect('/login')
        
    }
}

exports.logout = (req,res) => {  //el proceso de logout lo que hace es eliminar la cookie y nos redirige a la ruta raiz
    res.clearCookie('jwt')
    return res.redirect('/')
}