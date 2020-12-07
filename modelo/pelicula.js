
const helpers = {};
const tedious = require('tedious');
const connection = require('../controlador/conexion');
const fs = require('fs');
const path = require('path');
var connected=0
connection.on('connect', (err)=>{
    if(err) console.log('Error de conexión con la base de datos, intente nuevamente'); else {
        connected = 1;
        helpers.selectAllMedia = async () =>{
            global.connected=1;
            var data = [];
            var newL;        
            var statment = "SELECT id_pelicula,image_name,descripcion,duracion,genero,hora,titulo FROM cinema.dbo.peliculas ORDER BY id_pelicula asc;"
            const request = await new tedious.Request(statment, function(err, rowCount, rows){
                if(err){
                    data[0] = 'No se pudo obtener el archivo, intente de nuevo';
                }else{    
                    newL=rows.length;
                    rows.forEach((element,index1) => {
                        var aux = {};
                        var cast_image;
                        rows[index1].forEach((element,index2) => {
                            if(index2==0){
                                aux.id_pelicula=element.value;
                            }
                            if(index2==1){
                                cast_image
                                aux.image_name=element.value;                                
                            }
                            if(index2==2){
                                aux.descripcion=element.value;
                            }
                            if(index2==3){
                                aux.duracion=element.value;
                            }
                            if(index2==4){
                                aux.genero=element.value;
                            }
                            if(index2==5){
                                aux.hora=element.value;
                            }
                            if(index2==6){
                                aux.titulo=element.value;
                            }
                            
                        });
                        data.push(aux)                                           
                    });
                }
            });

            await connection.execSql(request); 
            

            async function returnData(){
                return new Promise(resolve => {
                setInterval(() => {
                    if(data.length!=newL){
                    }else{
                        resolve();
                    }
                }, 500);
                });
            }

            return await returnData().then(()=>{
                global.connected=0;
                return data;
            });   
        }
        
        helpers.selectVideo = async (videoId) =>{
            global.connected=1;
            var data = [];
            var statment = "SELECT image_name FROM cinema.dbo.peliculas WHERE id_pelicula="+videoId+";";            
                const request = await new tedious.Request(statment, function(err, rowCount, rows){
                
                    if(err){
                        data[0] = 'No se pudo obtener el archivo, intente de nuevo';
                    }else{    
                        try {
                            data[0] = rows[0][0].value;  
                        } catch (error) {
                            data[0] = 'No se pudo obtener el archivo, intente de nuevo';
                        }                                              
                    }
                });

            await connection.execSql(request); 
            async function returnId(){
                return new Promise(resolve => {
                setInterval(() => {
                    if(data.length==0){
                    }else{                        
                        resolve();
                    }
                }, 500);
                });
            }

            return await returnId().then(()=>{
                global.connected=0;
                return data;
            });   

        }

        helpers.insertVideo = async (media) =>{
            global.connected=1;
            var data = [];
            var statment = "INSERT INTO tiktok.dbo.videos (name, title, language, lob) VALUES ('"+media.name+"','"+media.title+"','"+media.language+"','"+media.lob+"');";
            const request = await new tedious.Request(statment, function(err, rowCount, rows){
                
                    if(err){
                        data[0] = 'No se pudo obtener el archivo, intente de nuevo';
                    }else{    
                        data[0] = 'Media insertada'                        
                    }
                });

            await connection.execSql(request); 
            async function returnId(){
                return new Promise(resolve => {
                setInterval(() => {
                    if(data.length==0){
                    }else{                        
                        resolve();
                    }
                }, 500);
                });
            }

            return await returnId().then(()=>{
                global.connected=0;
                return data;
            });   

        }

        helpers.deleteById = async (ids)=>{
            global.connected=1;
            var data = [];
            var statment = "DELETE FROM tiktok.dbo.videos WHERE "+ids+";";
            console.log(statment)
           const request = await new tedious.Request(statment, function(err, rowCount, rows){                
                if(err){
                    data[0] = 'No se pudo obtener el archivo, intente de nuevo';
                }else{    
                    data[0] = 'Archivo eliminado'                      
                }
            });

            await connection.execSql(request);
            async function returnId(){
                return new Promise(resolve => {
                setInterval(() => {
                    if(data.length==0){
                    }else{                        
                        resolve();
                    }
                }, 500);
                });
            }
            return await returnId().then(()=>{     
                global.connected=0;           
                return data;
            });   

        }
    }    
});

helpers.getVideo = async (req,res) =>{
    global.connected=1;
    let message = {}
    var videoId = await req.params.id;
    var video_path = await helpers.selectVideo(videoId);
        fs.exists(path.join(__dirname, '..',video_path[0]), (exists)=>{     
        if(exists){
            message= {path: path.join(__dirname, '..',video_path[0])};
        }else{
            message= {path: 'No se ha encontrado archivo'}
        }
    });

    async function returnMessage(){
        return new Promise(resolve => {
        setInterval(() => {
            if(message.path==undefined){
            }else{                
                resolve();
            }
        }, 500);
        });
    }

    return await returnMessage().then(()=>{
        global.connected=0;
        return message;
    });
}
helpers.uploadVideo = async (req,res) =>{
    global.connected=1;
    let message = {};
    if(req.files.file==undefined){
        message = await {status: 'No existe archivo'}
    }else{
        if(req.files.file.size==0){
            message = await {status: 'Archivo vacio'}
        }else{
            try {  
                var file_path = await req.files.file.path;
                var file_sName = await req.files.file.originalFilename;
                var sName_split = await file_sName.split('.');
                var file_ext = await sName_split[1];
                let auxpath = file_path.split("\\");
      if (auxpath.length > 3) {
        file_path = auxpath[1] + "\\" + auxpath[2] + "\\" + auxpath[3];
      }
                if(file_ext != 'mp4' && file_ext != 'MP4'){
                    await fs.unlink(file_path, async (err) =>{
                        message = await {status: 'Extensión incorrecta'}
                    });
                }else{
                    const media = {
                        name: file_path,
                        title: req.body.title,
                        language: req.body.language,
                        lob: req.body.lob,
                    }                    
                    const update = await helpers.insertVideo(media);
                    if(update[0]=='Media insertada'){
                        message = {status: 'Archivo cargado'}
                    }else{
                        message = {status: 'No se pudo cargar el archivo'}
                    }
                }               
            } catch (error) {     
                global.connected=0;       
                message = {status: error}
            }
        }
        
    }
    async function returnMessage(){
        return new Promise(resolve => {
        setInterval(() => {
            if(message.status==undefined){
            }else{
                resolve();
            }
        }, 500);
        });
    }
    return await returnMessage().then(()=>{
        global.connected=0;
        return message;
    });
}
helpers.deleteVideo = async (req,res) =>{
    global.connected=1;
    let message = {};
    let id = req.body.id;
    let names = req.body.name; 
    let name = [];
    names.forEach(element => {
        let rp = element.replace('public\\videos\\','');
        name.push(rp);
    });
    let statement;
    if(id.length==1){
        statement='id='+id[0];
    }else{
        id.forEach((element,i) => {
            if(i==0){
                statement='id='+element;
            }else{
                statement=statement + ' or ' + 'id=' + element; 
            }
        });
    }
    name.forEach(async (element) => {
        let toDelete = await path.join(__dirname, '..', 'public', 'upload', element);
         try {
            fs.unlinkSync(toDelete);
        } catch (error) {
            error= await true;
            message = await {status: 'Intentelo de nuevo'};
        }         
    }); 
        
    const file = await helpers.deleteById(statement);
     if(file[0]=='No se pudo obtener el archivo, intente de nuevo'){
        message = await {status: 'Intentelo de nuevo'};
    }else{
        let error = false;
        name.forEach(async (element) => {
            let toDelete = await path.join(__dirname, '..', 'public', 'videos', element);
             try {
                fs.unlinkSync(toDelete);
            } catch (error) {
                error = await true;                
                message = await {status: 'Intentelo de nuevo'};
            }         
        }); 
        if(error==false){
            message = await {status: 'Archivo eliminado'};
        }        
    } 

    
    async function returnMessage(){
        return new Promise(resolve => {
        setInterval(() => {
            if(message.status==undefined){
            }else{
                resolve();
            }
        }, 500);
        });
    }
    return await returnMessage().then(()=>{
        global.connected=0;
        return message;
    });
}
function resolveAfter() { 
    return new Promise(resolve => {
      setInterval(() => {
          if(connected == 0){
          }else{
            resolve();
          }
      }, 500);
    });
}

module.exports = {
    mainvide: async () => {
        await resolveAfter();
        return helpers;
    }
} 