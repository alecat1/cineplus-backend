
const {isLoggedIn} = require('./auth');
const initDicc = require('../modelo/diccionario');
const initPolit = require('../modelo/politicas');
const initUser = require('../modelo/usuario');
const initCult = require('../modelo/cultural');
const initNoti = require('../modelo/noticias');
const initVide = require('../modelo/video');
const initMedia = require('../modelo/media');
const initMulti = require('../modelo/multi');
const usuarioHC = require('../modelo/usuarioHC')
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
router.post('/node/ttokback/api/signingccms', (req,res,next)=>{

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
        passport.authenticate('local.ccms', (err,user,info)=>{
            const keyid = user.id;
            if(info==undefined){          
                const payload = {
                    ident: keyid,
                    id: user.ccms,
                    role: user.role,
                    check: true
                };
                var aux;
                console.log(payload, 'ppview')
                usuarioHC.main().then( async(usuario)=>{
                    aux=await usuario.validarHC(user.ccms);
                    console.log(aux, 'auxiliar')
                    if (aux.length>0){
                    const token=jwt.sign(payload, key, {expiresIn: 10800}); 
                    console.log(token, 'token') 
                        res.status(200).send(token); 
                    }else{
                        res.sendStatus(201); 
                    }                       
                });  
                              
            }
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
                if(info==undefined){               
                    const payload = {
                        ident: user.id,
                        id: user.ccms,
                        role: user.role,
                        check: true
                    };                
                    const token =jwt.sign(payload, key, {expiresIn: 10800});                
                    res.status(200).send(token);                                  
                }else{
                    res.sendStatus(201);
                }
            }       
        })(req, res, next);     
    });
    
});
router.post('/node/ttokback/api/diccionario/', (req,res,next)=>{
    initDicc.maindiccion().then( async(words)=>{
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
            var aux = await words.selectAllsWords();
            var myjson = JSON.stringify(aux);
            res.status(200).send(myjson);  
        }); 
      
    });
});
router.post('/node/ttokback/api/politicas/', (req,res,next)=>{
    initPolit.mainpolitic().then( async(politics)=>{

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
            var aux = await politics.selectAll(req.body);
            var myjson = JSON.stringify(aux);
            res.status(200).send(myjson);       
        }); 
      
    });
});
router.post('/node/ttokback/api/politicasall/', (req,res,next)=>{
    initPolit.mainpolitic().then( async(politics)=>{

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
            var aux = await politics.selectAllAll();
            var myjson = JSON.stringify(aux);
            res.status(200).send(myjson);         
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
router.post('/node/ttokback/api/material', async (req,res)=>{
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
            const files = await media.selectAllMedia('material');
            res.status(200).send(files);       
        });
        
    })
});
router.get("/node/ttokback/api/get-ack", (req, res) => {
    initUser.main().then(async (ack) => {
      async function returnData() {
        return new Promise((resolve) => {
          setInterval(async () => {
            if (global.connected == 1) {
            } else {
              resolve();
            }
          }, 200);
        });
      }
      returnData().then(async () => {
        const file = await ack.getData();
        if (file.path != "No se pudo generar un archivo") {
          await res.status(200).sendFile(path.resolve(file.path));
        } else {
          await res.status(204);
        }
      });
    });
  });

router.post('/node/ttokback/api/tips', async (req,res)=>{
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
            const files = await media.selectAllMedia('tips');
            res.status(200).send(files);       
        });
        
    })
});
router.post('/node/ttokback/api/rs', async (req,res)=>{
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
            const files = await media.selectAllMedia('rs',req.body);            
            if(files[0]!='No se pudo obtener el archivo, intente de nuevo'){                
                res.status(200).send(files);   
            }else{
                res.status(204).send(files);   
            }
        });
        
    })
});
router.get('/node/ttokback/api/cultural', async (req,res)=>{
    initCult.maincult().then( async (cult)=>{
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
            const files = await cult.selectAllMedia();
            if(files.length==0){
                res.status(200).send('No hay archivos en la base de datos')
            }else if(files[0]!='No se pudo obtener el archivo, intente de nuevo'){
                var myjson = JSON.stringify(files)
                res.status(200).send(myjson)
            }else{
                res.sendStatus(204);
            }
        });        
    })    
});
router.get('/node/ttokback/api/noticias', async (req,res)=>{
    initNoti.mainoticias().then( async (noticias)=>{
        async function returnData(){
            return new Promise(resolve => {
            setInterval(async() => {                
                if(global.connected==1){
                }else{
                    resolve();                
                }         
            }, 200);
            });
        }

        returnData().then(async()=>{
            const files = await noticias.selectAllNoticias();
            if(files.length==0){
                res.status(200).send('No hay archivos en la base de datos')
            }else if(files[0] != 'No se pudo obtener el archivo, intente de nuevo'){
                var myjson = JSON.stringify(files)
                res.status(200).send(myjson)
            }else{
                res.sendStatus(204);
            }
        });        
    })    
});

router.get('/node/ttokback/api/get-image-noticias/:id', md_noticias, (req,res)=>{
    initNoti.mainoticias().then( async (noticias)=>{
        async function returnData(){
            return new Promise(resolve => {
            setInterval(async() => {                
                if(global.connected==1){
                }else{
                    resolve();                
                }         
            }, 200);
            });
        }
        returnData().then(async()=>{
            const file = await noticias.getImage(req,res);
            if(file.path!='No se ha encontrado archivo'){
                await res.status(200).sendFile(path.resolve(file.path));
            }else{
                await res.status(204)
            }                 
        });   
    });
});

router.post('/node/ttokback/api/upload-noticias/', md_noticias, (req,res)=>{
    initNoti.mainoticias().then( async (noticia)=>{
        async function returnData(){
            return new Promise(resolve => {
            setInterval(async() => {                
                if(global.connected==1){
                }else{
                    resolve();                
                }         
            }, 200);
            });
        }
        returnData().then(async()=>{
            const file = await noticia.InsertNoticias(req,res);
            if(file.status=='Noticia insertada'){
                res.status(200).send(file); 
            }else{
                res.status(204).send(file);
            }                
        });   
              
    });
});

router.post('/node/ttokback/api/delete-noticias/', (req,res)=>{
    initNoti.mainoticias().then( async (noticia)=>{
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
            const file = await noticia.DeleteNoticias(req);
            if(file.status=='Noticia eliminada'){
                res.sendStatus(200)
            }else{
                res.sendStatus(204)
            }                
        });   
              
    });
});

router.post('/node/ttokback/api/update-noticias/', md_noticias, (req,res)=>{
    initNoti.mainoticias().then( async (noticias)=>{
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
            const file = await noticias.updateNoticias(req);
            if(file.status=='Noticia actualizada'){
                res.status(200).send({
                    status: file.status
                })
            }else{
                res.status(204).send({
                    status: file.status
                })
            }                
        });   
                
    });
});


router.get('/node/ttokback/api/video', async (req,res)=>{
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
            const files = await vide.selectAllMedia();
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
router.get('/node/ttokback/api/cultural-carrousel', async (req,res)=>{
    initCult.maincult().then( async (cult)=>{
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
            const files = await cult.selectAllCarrousel();
            if(files.length==0){
                res.status(200).send('No hay archivos en la base de datos')
            }else if(files[0]!='No se pudo obtener el archivo, intente de nuevo'){
                var myjson = JSON.stringify(files)
                res.status(200).send(myjson)
            }else{
                res.sendStatus(404);
            }
        });        
    })    
});
router.post('/node/ttokback/api/acknowledge', async (req,res)=>{
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
            var ccms= await req.body.ccms;
            const ack = await users.insertACK(ccms);
            if(ack[0]=='ACK insertado'){
                res.status(200).send(ack[0])
            }else{
                res.sendStatus(400)
            }
        }); 
    });
})
//Administrador
    //Glosario
router.post('/node/ttokback/api/admindiccionario/', (req,res,next)=>{
    
    initDicc.maindiccion().then( async(words)=>{
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
            var auxmenu = req.body.estado;
            var aux;
            if (auxmenu == 1){ //Insertar
            aux = await words.InsertWord(req.body);   
            }
            if (auxmenu == 2){ //Modificar
            aux = await words.UpdateWord(req.body);   
            }
            if (auxmenu == 3){ //Eliminar
            aux = await words.DeleteWord(req.body);
            }
            var myjson = JSON.stringify(aux);
            res.status(200).send(myjson);   
        });
        
    });
});
router.post('/node/ttokback/api/exceltodic/:id', md_temp, (req,res)=>{

    initDicc.maindiccion().then( async(words)=>{
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
            const check = await words.exceltoJson(req,res);
            if(check.status=='Registros actualizados'){            
                res.status(200).send(check);
            }else{
                res.status(204).send(check);
            }  
        });
    
    });

})
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
router.post('/node/ttokback/api/upload-pdf-material/', md_material, (req,res)=>{
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
            const file = await media.uploadPDFMaterial(req,res);
            if(file.status=='Archivo cargado'){
                res.status(200).send(file); 
            }else{
                res.status(204).send(file);
            }                
        });   
              
    });
});
router.post('/node/ttokback/api/upload-pdf-tips/', md_material, (req,res)=>{
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
            const file = await media.uploadPDFTips(req,res);
            if(file.status=='Archivo cargado'){
                res.status(200).send(file); 
            }else{
                res.status(204).send(file);
            }                
        });   
              
    });
});
router.post('/node/ttokback/api/upload-pdf-rs/:id', md_material, (req,res)=>{
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
            const file = await media.uploadPDFRS(req,res);
            if(file.status=='Archivo cargado'){
                res.status(200).send(file); 
            }else{
                res.status(204).send(file);
            }             
        });   
            
    });
});
router.get('/node/ttokback/api/get-pdf/:id', md_material , (req,res)=>{
    
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
            const file = await media.getPDF(req,res);
            res.status(200).sendFile(path.resolve(file.file));           
        });  
        
    });
});
router.post('/node/ttokback/api/delete-pdf/:id', md_material, (req,res)=>{
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
            const resp = await media.deletePDF(req,res);
            if(resp.file!='No se pudo obtener el archivo'){
                res.status(200).send(resp);
            }else{
                res.status(204);
            }          
        });          
    });
});
    //Politicas
router.post('/node/ttokback/api/adminpoliticas/', (req,res,next)=>{

    initPolit.mainpolitic().then( async(politics)=>{
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
            var auxmenu = req.body.estado;        
            var aux;
            if (auxmenu == 1){ //Insertar
            aux = await politics.InsertPolicy(req.body);    
            }
            if (auxmenu == 2){ //Modificar
            aux = await politics.UpdatePolicy(req.body);    
            }
            if (auxmenu == 3){ //Eliminar
            aux = await politics.DeletePolicy(req.body);
            }
            var myjson = JSON.stringify(aux);
            res.status(200).send(myjson);                        
        });
    }); 
});
router.post('/node/ttokback/api/exceltopol/:id', md_temp, (req,res)=>{

    initPolit.mainpolitic().then( async(policy)=>{

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
            const check = await policy.exceltoJson(req);
            if(check.status=='Registros actualizados'){            
                res.status(200).send({
                    message: check
                });
            }else{
                res.status(204).send({
                    message: check
                });
            }
        });
    });
})
    //Cultural
router.get('/node/ttokback/api/get-image-cultural/:id', md_cultural, (req,res)=>{
    initCult.maincult().then( async (cult)=>{
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
            const file = await cult.getImage(req,res);
            if(file.path!='No se ha encontrado archivo'){
                await res.status(200).sendFile(path.resolve(file.path));
            }else{
                await res.status(204)
            }                 
        });   
    });
});
router.get('/node/ttokback/api/get-image-carrousel/:id', md_carrousel, (req,res)=>{
    initCult.maincult().then( async (cult)=>{
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
            const file = await cult.getImageCarrousel(req,res);
            if(file.path!='No se ha encontrado archivo'){
                await res.status(200).sendFile(path.resolve(file.path));
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
router.post('/node/ttokback/api/upload-videos/', md_video, (req,res)=>{
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
            const file = await vide.uploadVideo(req,res);
            if(file.status=='Archivo cargado'){
                res.status(200).send(file); 
            }else{
                res.status(204).send(file);
            }                
        });   
              
    });
});
router.post('/node/ttokback/api/delete-videos/', (req,res)=>{
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
            const file = await vide.deleteVideo(req);
            if(file.status=='Archivo eliminado'){
                res.sendStatus(200)
            }else{
                res.sendStatus(204)
            }                
        });   
              
    });
});
    //cultural
router.post('/node/ttokback/api/upload-cultural/', md_cultural, (req,res)=>{
    initCult.maincult().then( async (cult)=>{
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
            const file = await cult.uploadSection(req);
            if(file.status=='Seccion cargada'){
                res.status(200).send({
                    status: file.status
                })
            }else{
                res.status(204).send({
                    status: file.status
                })
            }                
        });   
                
    });
});
router.post('/node/ttokback/api/delete-cultural/', md_cultural, (req,res)=>{
    initCult.maincult().then( async (cult)=>{
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
            const file = await cult.deleteSection(req);
            if(file.status=='Seccion cargada'){
                res.status(200).send({
                    status: file.status
                })
            }else{
                res.status(204).send({
                    status: file.status
                })
            }                
        });   
                
    });
});
router.post('/node/ttokback/api/update-cultural/', md_cultural, (req,res)=>{
    initCult.maincult().then( async (cult)=>{
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
            const file = await cult.updateSection(req);
            if(file.status=='Seccion cargada'){
                res.status(200).send({
                    status: file.status
                })
            }else{
                res.status(204).send({
                    status: file.status
                })
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
router.post('/node/ttokback/api/new-state', (req,res)=>{
    initNoti.mainoticias().then( async (state)=>{
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
            const stateNews = await state.UpdateState();

            if(stateNews[0] == 200){
                res.status(200).send({
                    status: stateNews[0]
                })
            }else{
                res.status(204).send({
                    status: stateNews[0]
                })
            } 
        });
    });
});
router.post('/node/ttokback/api/delete-state', (req,res)=>{
    initNoti.mainoticias().then( async (state)=>{
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
            const stateNews = await state.UpdateState2(req.body.ccms);
            if(stateNews[0] == 200){
                res.sendStatus(200);
            }else{
                res.sendStatus(204);
            } 
        });
    });
});
router.post('/node/ttokback/api/actual-state', (req,res)=>{
    initNoti.mainoticias().then( async (state)=>{
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
            const stateNews = await state.SelectByCCMS(req.body.ccms);
            if(stateNews[0] == true){
                res.sendStatus(200);
            }else{
                res.sendStatus(204);
            } 
        });
    });
});


router.all('*',(req, res, next) => {
    res.sendStatus(404);
});


module.exports = router;