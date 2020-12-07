
const {isLoggedIn} = require('./auth');
const initUser = require('../modelo/usuario');
const initRegister = require('../modelo/registro');
const initSala = require('../modelo/agregarsala');
const initDeleteSala = require('../modelo/eliminarsala');
const initMulti = require('../modelo/multi');
const initPeli = require('../modelo/pelicula');
const bodyParser = require('body-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const app = express(); 
const multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: '../public/upload'});
var md_material = multipart({ uploadDir: '../public/content'});
var md_temp = multipart({ uploadDir: '../public/temp'});
var md_cultural = multipart({ uploadDir: '../public/cultural'});
var md_noticias = multipart({ uploadDir: '../public/noticias'});
var md_carrousel = multipart({ uploadDir: '../public/carrousel'});
var md_video = multipart({ uploadDir: '../public/videos'});

//JWT Configuration
const key = 'codekey:!m@!K3CjDz*NdInr7Q773u3hj*G%5Kl$zZ^%Uz%Z5v#jf2humR';
app.set('llave',key);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.get('/node/ttokback/api/logout/',(req,res)=>{
    req.logOut();
});
router.get('/node/ttokback/api/test', (req,res)=>{
    res.status(200).send({
        message: "Server On"
    });
});
router.post('/node/ttokback/api/signup', (req,res,next)=>{
    async function returnData(){
        return new Promise(resolve => {
        setInterval(async() => {                
            if(global.connected==1){
            }else{
                resolve();                
            }         
        }, 150);
        });
    }
    returnData().then(async()=>{
        passport.authenticate('local.signup',(err,user,info)=>{
            if(!user) res.sendStatus(205); else res.sendStatus(202);
        })(req,res,next);       
    });
    
});
router.post('/node/ttokback/api/signin', (req,res,next)=>{

    async function returnData(){
        return new Promise(resolve => {
        setInterval(async() => {                
            if(global.connected==1){
            }else{
                resolve();                
            }         
        }, 150);
        });
    }
    returnData().then(async()=>{
        passport.authenticate('local.signin', (err,user,info)=>{
            if(err) res.sendStatus(400); else {
                console.log("esto es inf:" + info)
                if(info==undefined){               
                    const payload = {
                        cedula: user.cedula,
                        password: user.password,
                        role_id: user.role_id,
                        check: true
                    };
                    console.log("rutas: " +user.cedula);
                    console.log(user.password);                
                    const token =jwt.sign(payload, key, {expiresIn: 10800});                
                    res.status(200).send(token);                                  
                }else{
                    console.log("rutaserr: " +user.cedula + user.password);
                    res.sendStatus(201);
                }
            }       
        })(req, res, next);     
    });
    
});
//REGISTRO NUEVO USUARIO//
router.post('/node/ttokback/api/registro', (req,res)=>{
    initRegister.mainregistro().then( async (usuario)=>{
        async function returnId(){
            return new Promise(resolve => {
            setInterval(async() => {                
                if(global.connected==1){
                }else{
                    resolve();                
                }         
            }, 200);
            });
        }
        returnId().then(async()=>{
            const registro = await usuario.insertUser(req.body);
            console.log("status"+registro)
            if(registro=='pass incorrecta'){
                res.status(206).send(registro); 
            }
            if(registro=='Usuario insertado'){
                res.status(200).send(registro); 
            }else{
                res.status(204).send(registro);
            }                
        });   
              
    });
});
//CREAR NUEVA SALA ADMIN//
router.post('/node/ttokback/api/agregarsala', (req,res)=>{
    initSala.mainsala().then( async (sala)=>{
        async function returnId(){
            return new Promise(resolve => {
            setInterval(async() => {                
                if(global.connected==1){
                }else{
                    resolve();                
                }         
            }, 200);
            });
        }
        returnId().then(async()=>{
            const registro = await sala.insertSala(req.body);
            console.log("status"+registro)
            if(registro=='pass incorrecta'){
                res.status(206).send(registro); 
            }
            if(registro=='Sala insertada'){
                res.status(200).send(registro); 
            }else{
                res.status(204).send(registro);
            }                
        });   
              
    });
});
//ELIMINAR SALA ADMIN//
router.post('/node/ttokback/api/eliminarsala', (req,res)=>{
    initDeleteSala.mainsala().then( async (sala)=>{
        async function returnId(){
            return new Promise(resolve => {
            setInterval(async() => {                
                if(global.connected==1){
                }else{
                    resolve();                
                }         
            }, 200);
            });
        }
        returnId().then(async()=>{
            const registro = await sala.deleteSala(req.body);
            console.log("status"+registro)
            if(registro=='pass incorrecta'){
                res.status(206).send(registro); 
            }
            if(registro=='Sala eliminada'){
                res.status(200).send(registro); 
            }else{
                res.status(204).send(registro);
            }                
        });   
              
    });
});



router.post('/node/ttokback/api/home', async (req,res) =>{
    const incomingToken =  req.body.headers['access-token'];
    const incomingKey =  req.body.headers['key-token']; 
    const validate =  await isLoggedIn(incomingToken, incomingKey);
    console.log(validate)
    if(validate=='V'){
        res.status(200).send({
            //Token valida
            message: "0x4fe"
        });
    }else{
        res.status(400).send({
            //Token invalida
            message: "0x4fa"
        });
    }
});


router.get('/node/ttokback/api/pelicula', async (req,res)=>{
    initPeli.mainvide().then( async (vide)=>{
        async function returnData(){
            return new Promise(resolve => {
            setInterval(async() => {                
                if(global.connected==1){
                }else{
                    resolve();                
                }         
            }, 150);
            });
        }
        returnData().then(async()=>{
            const files = await vide.selectAllMedia();
            console.log("files:")
            console.log(files[0])
            if(files.length==0){
                res.status(200).send('No hay archivos en la base de datos')
            }else if(files[0]!='No se pudo obtener el archivo, intente de nuevo'){
                var myjson = JSON.stringify(files);
                res.status(200).send(myjson)
            }else{
                res.sendStatus(204);
            }
        });        
    })    
});




    //Usuarios
router.get('/node/ttokback/api/users', (req,res)=>{
    initUser.main().then( async(users)=>{

        async function returnData(){
            return new Promise(resolve => {
            setInterval(async() => {                
                if(global.connected==1){
                }else{
                    resolve();                
                }         
            }, 150);
            });
        }

        returnData().then(async()=>{
            var aux = await users.selectAllUsers();
            res.status(200).send(aux);
        });
        
    });
});
router.post('/node/ttokback/api/users', (req,res) =>{
    initUser.main().then( async(users)=>{
        async function returnData(){
            return new Promise(resolve => {
            setInterval(async() => {                
                if(global.connected==1){
                }else{
                    resolve();                
                }         
            }, 150);
            });
        }

        returnData().then(async()=>{
            var aux = await users.deleteUser(req.body);
            res.status(200).send(aux);   
        });
             
    });
});
router.put('/node/ttokback/api/users', (req,res)=>{
    initUser.main().then( async(users)=>{
        async function returnData(){
            return new Promise(resolve => {
            setInterval(async() => {                
                if(global.connected==1){
                }else{
                    resolve();                
                }         
            }, 150);
            });
        }

        returnData().then(async()=>{
            var aux = await users.updateUser(req.body);
            res.status(200).send({message: aux});  
        });
        
    });
})
    //media
router.post('/node/ttokback/api/upload-image/:id', md_upload, (req,res)=>{
    initMedia.mainmedia().then( async (media)=>{
        const file = await media.uploadImage(req,res);
        if(file.status == 'Media actualizada'){
            res.status(200).send(file); 
        }else{
            res.status(204);
        }
        
    });
});
router.get('/node/ttokback/api/get-image/:id', md_upload, (req,res)=>{
  
    initMedia.mainmedia().then( async (media)=>{
        async function returnData(){
            return new Promise(resolve => {
            setInterval(async() => {                
                if(global.connected==1){
                }else{
                    resolve();                
                }         
            }, 150);
            });
        }
        returnData().then(async()=>{
            const file = await media.getImage(req,res);
            if(file.path!='No se ha encontrado archivo'){
                await res.sendFile(path.resolve(file.path));
            }else{
                await res.status(204)
            }                 
        });   
    });
});
    //videos
router.get('/node/ttokback/api/get-video/:id', md_video, (req,res)=>{
    initVide.mainvide().then( async (vide)=>{
        async function returnData(){
            return new Promise(resolve => {
            setInterval(async() => {                
                if(global.connected==1){
                }else{
                    resolve();                
                }         
            }, 150);
            });
        }
        returnData().then(async()=>{
            const file = await vide.getVideo(req,res);
            if(file.path!='No se ha encontrado archivo'){
                await res.status(200).sendFile(path.resolve(file.path));
            }else{
                await res.status(204)
            }                 
        });   
    });
});




//MULTI
router.get('/node/ttokback/api/multi-language', (req,res)=>{
    initMulti.mainmulti().then( async (multi)=>{
        async function returnData(){
            return new Promise(resolve => {
            setInterval(async() => {                
                if(global.connected==1){
                }else{
                    resolve();                
                }         
            }, 150);
            });
        }
        returnData().then(async()=>{
            const dataLanguages = await multi.selectAllLanguages();
            await res.status(200).send(dataLanguages);                          
        });   
    });
});



router.all('*',(req, res, next) => {
    res.sendStatus(404);
});


module.exports = router;