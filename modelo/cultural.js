
const helpers = {};
const tedious = require('tedious');
const connection = require('../controlador/conexion');
const fs = require('fs');
const path = require('path');
const { count } = require('console');
var connected=0
connection.on('connect', (err)=>{
    if(err) console.log('Error de conexión con la base de datos, intente nuevamente'); else {
        connected = 1;
        helpers.selectAllMedia = async () =>{
            global.connected=1;
            var data = [];
            var newL;        
            var statment = "SELECT id,name,type,from_,section,country,title FROM tiktok.dbo.cultural ORDER BY section asc;"
            const request = await new tedious.Request(statment, function(err, rowCount, rows){
                if(err){
                    data[0] = 'No se pudo obtener el archivo, intente de nuevo';
                }else{    
                    newL=rows.length;
                    rows.forEach((element,index1) => {
                        var aux = {};
                        rows[index1].forEach((element,index2) => {
                            if(index2==0){
                                aux.id=element.value;
                            }
                            if(index2==1){
                                aux.name=element.value;
                            }
                            if(index2==2){
                                aux.type=element.value;
                            }
                            if(index2==3){
                                aux.desde=element.value;
                            }
                            if(index2==4){
                                aux.section=element.value;
                            }
                            if(index2==5){
                                aux.country=element.value;
                            }
                            if(index2==6){
                                aux.title=element.value;
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
        helpers.selectAllCarrousel = async () =>{
            global.connected=1;
            var data = [];
            var newL;        
            var statment = "SELECT id,name,carrousel FROM tiktok.dbo.cultural_carrousel order by carrousel,id;"
            const request = await new tedious.Request(statment, function(err, rowCount, rows){
                if(err){
                    data[0] = 'No se pudo obtener el archivo, intente de nuevo';
                }else{    
                    newL=rows.length;
                    rows.forEach((element,index1) => {
                        var aux = {};
                        rows[index1].forEach((element,index2) => {
                            if(index2==0){
                                aux.id=element.value;
                            }
                            if(index2==1){
                                aux.name=element.value;
                            }
                            if(index2==2){
                                aux.carrousel=element.value;
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
        helpers.selectImage = async (imageId) =>{
            global.connected=1;
            var data = [];
            var statment = "SELECT name FROM tiktok.dbo.cultural WHERE id="+imageId+";";            
                const request = await new tedious.Request(statment, function(err, rowCount, rows){
                
                    if(err){
                        data[0] = 'No se pudo obtener el archivo, intente de nuevo';
                    }else{    
                        data[0] = rows[0][0].value;
                        
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
        helpers.selectImageCarrousel = async (imageId) =>{
            global.connected=1;
            var data = [];
            var statment = "SELECT name FROM tiktok.dbo.cultural_carrousel WHERE id="+imageId+";";  
            const request = await new tedious.Request(statment, function(err, rowCount, rows){            
                if(err){
                    data[0] = 'No se pudo obtener el archivo, intente de nuevo';
                }else{    
                    data[0] = rows[0][0].value;                        
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
        helpers.insertSection = async (query) =>{
            global.connected=1;
            var data = [];
            const request = await new tedious.Request(query, function(err, rowCount, rows){                
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
        helpers.selectLastId = async () =>{
            global.connected=1;
            var data = [];
            var statment = "SELECT * FROM tiktok.dbo.cultural ORDER BY id DESC;";            
            const request = await new tedious.Request(statment, function(err, rowCount, rows){
            
                if(err){
                    data[0] = 'No se pudo obtener el archivo, intente de nuevo';
                }else{    
                    data[0] = rows[0][0].value;                        
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
        helpers.selectData = async (query) =>{
            global.connected=1;
            var data = [];
            var newL; const request = await new tedious.Request(query, function(err, rowCount, rows){
                if(err){
                    data[0] = 'No se pudo obtener el archivo, intente de nuevo';
                }else{    
                    newL=rows.length;
                    rows.forEach((element,index1) => {
                        var aux = {};
                        rows[index1].forEach((element,index2) => {
                            if(index2==0){
                                aux.name=element.value;
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
    }    
});

helpers.getImage = async (req,res) =>{
    global.connected=1;
    let message = {}
    var imageId = await req.params.id;
    var image_path = await helpers.selectImage(imageId);
        fs.exists(path.join(__dirname, '..',image_path[0]), (exists)=>{     
        if(exists){
            message= {path: path.join(__dirname, '..',image_path[0])};
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
helpers.getImageCarrousel = async (req,res) =>{
    global.connected=1;
    let message = {}
    var imageId = await req.params.id;
    var image_path = await helpers.selectImageCarrousel(imageId);
        fs.exists(path.join(__dirname, '..',image_path[0]), (exists)=>{     
        if(exists){
            message= {path: path.join(__dirname, '..',image_path[0])};
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
helpers.uploadSection = async (req,res) =>{
    global.connected=1;
    let message = {};
    let country = await req.body.country;
    let title = await req.body.title;
    let section = await req.body.section;
    let type = await req.body.type;
    if (type=='none'){
        var statement = await "INSERT INTO tiktok.dbo.cultural (name,type,from_,section,country,title) VALUES ('"+title+"','titulo','contenido',"+section+",'"+country+"','"+title+"');";
        const singleSection = await helpers.insertSection(statement);
        if(singleSection[0]=='Media insertada'){
            message = {status: 'Seccion cargada'}
        }else{
            message = {status: 'No se pudo insertar, intente de nuevo'}
        }
    }else if(type=='principal'){
        if(req.files.file[0]==undefined){
            message = await {status: 'No existe archivo'}
        }else{
            if(req.files.file[0].size==0){
                message = await {status: 'Archivo vacio'}
            }else{
                var file_path = await req.files.file[0].path;
                var file_sName = await req.files.file[0].originalFilename;                
                var sName_split = await file_sName.split('.');
                var file_ext = await sName_split[1];
                let auxpath = file_path.split('\\');
                if(auxpath.length>3){
                    file_path = auxpath[1]+'\\'+auxpath[2]+'\\'+auxpath[3];
                }                   
                if(file_ext != 'png' && file_ext != 'PNG'){
                    await fs.unlink(file_path, async (err) =>{
                        message = await {status: 'Extensión incorrecta'}
                    });
                }else{
                    var statement = await "INSERT INTO tiktok.dbo.cultural (name,type,from_,section,country,title) VALUES ('"+file_path+"','img','principal',"+section+",'"+country+"','"+title+"');";
                    const singleSection = await helpers.insertSection(statement);
                    if(singleSection[0]=='Media insertada'){
                        message = {status: 'Seccion cargada'}
                    }else{
                        message = {status: 'No se pudo insertar, intente de nuevo'}
                    }                    
                }
            }
        }
    }else if(type=='img'){        
        if(req.files.file[0]==undefined){
            message = await {status: 'No existe archivo'}
        }else{
            if(req.files.file[0].size==0){
                message = await {status: 'Archivo vacio'}
            }else{
                var file_path = await req.files.file[0].path;
                var file_sName = await req.files.file[0].originalFilename;                
                var sName_split = await file_sName.split('.');
                var file_ext = await sName_split[1];
                let auxpath = file_path.split('\\');
                if(auxpath.length>3){
                    file_path = auxpath[1]+'\\'+auxpath[2]+'\\'+auxpath[3];
                }  
                if(file_ext != 'png' && file_ext != 'PNG'){
                    await fs.unlink(file_path, async (err) =>{
                        message = await {status: 'Extensión incorrecta'}
                    });
                }else{
                    var statement1 = await "INSERT INTO tiktok.dbo.cultural (name,type,from_,section,country,title) VALUES ('"+title+"','titulo','contenido',"+section+",'"+country+"','"+title+"');";
                    var statement2 = await "INSERT INTO tiktok.dbo.cultural (name,type,from_,section,country,title) VALUES ('"+file_path+"','img','contenido',"+section+",'"+country+"','"+title+"');";
                    const singleSection1 = await helpers.insertSection(statement1);
                    if(singleSection1[0]=='Media insertada'){
                        const singleSection2 = await helpers.insertSection(statement2);
                        if(singleSection2[0]=='Media insertada'){
                            message = {status: 'Seccion cargada'}
                        }else{
                            message = {status: 'No se pudo insertar, intente de nuevo'}
                        }                           
                    }else{
                        message = {status: 'No se pudo insertar, intente de nuevo'}
                    }               
                }
            }
        }
    }else if(type=='carousel'){
        if(req.files.file[0]==undefined){
            message = await {status: 'No existe archivo'}
        }else{
            var statement = await "INSERT INTO tiktok.dbo.cultural (name,type,from_,section,country,title) VALUES ('"+title+"','titulo','contenido',"+section+",'"+country+"','"+title+"');";
            const singleSection = await helpers.insertSection(statement);
            if(singleSection[0]=='Media insertada'){
                const lastId = await helpers.selectLastId();
                let carrouselName = "carrousel"+lastId+section;
                var statement2 = await "INSERT INTO tiktok.dbo.cultural (name,type,from_,section,country,title) VALUES ('"+carrouselName+"','carrousel','contenido',"+section+",'"+country+"','"+title+"');";
                const singleSection2 = await helpers.insertSection(statement2);
                if(singleSection2[0]=='Media insertada'){
                    let errors=false;
                    let indexTo = await req.files.file.length-1;
                    var statemenToCarrousel;
                    req.files.file.forEach(async(element,i) => { 
                        if(element.size==0){
                            errors=true;
                        }else{
                            var file_path = await element.path;
                            var file_sName = await element.originalFilename;                
                            var sName_split = await file_sName.split('.');
                            var file_ext = await sName_split[1];
                            let auxpath = file_path.split('\\');
                            if(auxpath.length>3){
                                file_path = auxpath[1]+'\\'+auxpath[2]+'\\'+auxpath[3];
                            }  
                            if(file_ext != 'png' && file_ext != 'PNG'){
                                await fs.unlink(file_path, async (err) =>{
                                    errors=true;
                                });
                            }else{
                                if(i==0){
                                    statemenToCarrousel = "INSERT INTO tiktok.dbo.cultural_carrousel (name,carrousel) VALUES ('"+file_path+"','"+carrouselName+"'); ";
                                }else{
                                    statemenToCarrousel = statemenToCarrousel + "INSERT INTO tiktok.dbo.cultural_carrousel (name,carrousel) VALUES ('"+file_path+"','"+carrouselName+"'); ";
                                }
                            }    
                        }                        
                        if(indexTo==i){
                            const carrouselConfirm = await helpers.insertSection(statemenToCarrousel);
                            if(carrouselConfirm[0]=='Media insertada'){
                                if(errors){
                                    message = await {status: 'No se pudo cargar el contenido'}
                                }else{
                                    message = await {status: 'Seccion cargada'}
                                }
                            }else{
                                message = await {status: 'No se pudo cargar el contenido'}
                            }  
                        }
                    });
                }else{
                    message = {status: 'No se pudo insertar, intente de nuevo'}
                }  
            }else{
                message = {status: 'No se pudo insertar, intente de nuevo'}
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
helpers.deleteSection = async (req,res) =>{
    global.connected=1;
    let message = {}
    let type = await req.body.type;
    let section = req.body.section;
    let country = req.body.country;
    let name = req.body.name;
    if (type=='titulo'){
        var statement = await "DELETE FROM tiktok.dbo.cultural where section="+section+" and country='"+country+"'";        
        const singleSection = await helpers.insertSection(statement);
        if(singleSection[0]=='Media insertada'){
            message = {status: 'Seccion cargada'}
        }else{
            message = {status: 'No se pudo eliminar, intente de nuevo'}
        }
    }else if(type=='img'){
        var statement = "";
        if(section==0){
            statement = await "DELETE FROM tiktok.dbo.cultural where section="+section+" and name='"+name+"'"; 
        }else{
            statement = await "DELETE FROM tiktok.dbo.cultural where section="+section+" and country='"+country+"'";
        }
        let error=false;                  
        const singleSection = await helpers.insertSection(statement);
        if(singleSection[0]=='Media insertada'){
            let toDelete = await path.join(__dirname, '..', name);
            console.log(toDelete)
            try {
                fs.unlinkSync(toDelete);
            } catch (error) {
                error = await true;
            }     
            if(error){
                message = {status: 'No se pudo eliminar, intente de nuevo'}
            }else{
                message = {status: 'Seccion cargada'}
            }
        }else{
            message = {status: 'No se pudo eliminar, intente de nuevo'}
        }        
    }else if(type=='carrousel'){
        let error = false;
        var statement0 = "SELECT name FROM tiktok.dbo.cultural_carrousel where carrousel='"+name+"'"
        const requiredNames = await helpers.selectData(statement0);
        
        var statement = await "DELETE FROM tiktok.dbo.cultural where section="+section+" and country='"+country+"'; DELETE FROM tiktok.dbo.cultural_carrousel where carrousel='"+name+"';";   
        const singleSection = await helpers.insertSection(statement);
        if(singleSection[0]=='Media insertada'){
            requiredNames.forEach(async(element) => {    
                let toDelete = await path.join(__dirname, '..', element.name);
                try {
                    fs.unlinkSync(toDelete);
                } catch (error) {
                    error= await true;
                } 
            });
            if(error){
                message = {status: 'No se pudo eliminar, intente de nuevo'}
            }else{
                message = {status: 'Seccion cargada'}
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
helpers.updateSection = async (req) =>{
    global.connected=1;
    let message = {}
    let type = await req.body.type;
    let section = req.body.section;
    let country = req.body.country;    
    let title = req.body.title;
    let name = req.body.name;  
    let idS = req.body.id;  
    let nameC = req.body.carName;
    if (type=='titulo'){
        var statement = await "UPDATE tiktok.dbo.cultural SET name='"+title+"', title='"+title+"' WHERE section="+section+" and country='"+country+"';";        
        const singleSection = await helpers.insertSection(statement);
        if(singleSection[0]=='Media insertada'){
            message = {status: 'Seccion cargada'}
        }else{
            message = {status: 'No se pudo eliminar, intente de nuevo'}
        }
    }else if(type=='img'){        
        if(req.files.file[0]==undefined){
            message = await {status: 'No existe archivo'}
        }else{
            if(req.files.file[0].size==0){
                message = await {status: 'Archivo vacio'}
            }else{
                var file_path = await req.files.file[0].path;
                var file_sName = await req.files.file[0].originalFilename;                
                var sName_split = await file_sName.split('.');
                var file_ext = await sName_split[1];
                let auxpath = file_path.split('\\');
                if(auxpath.length>3){
                    file_path = auxpath[1]+'\\'+auxpath[2]+'\\'+auxpath[3];
                }   
                if(file_ext != 'png' && file_ext != 'PNG'){
                    await fs.unlink(file_path, async (err) =>{
                        message = await {status: 'Extensión incorrecta'}
                    });
                }else{     
                    let error= false; 
                    var statement;
                    if(section==0){
                        statement = await "UPDATE tiktok.dbo.cultural set name='"+file_path+"',title='"+title+"' where id='"+idS+"'";           
                    }else{
                        statement = await "UPDATE tiktok.dbo.cultural set name='"+title+"',title='"+title+"' where country='"+country+"' and section="+section+" and type='titulo'; UPDATE tiktok.dbo.cultural set name='"+file_path+"',title='"+title+"' where country='"+country+"' and section="+section+" and type='img'";           
                    }
                    const singleSection = await helpers.insertSection(statement);
                    if(singleSection[0]=='Media insertada'){                        
                        let toDelete = await path.join(__dirname, '..', name);
                        try {
                            fs.unlinkSync(toDelete);
                        } catch (error) {
                            error = await true;
                        }      
                        if(error){
                            message = {status: 'No se pudo eliminar, intente de nuevo'}
                        }else{
                            message = {status: 'Seccion cargada'}
                        }                        
                    }else{
                        message = {status: 'No se pudo insertar, intente de nuevo'}
                    }                                    
                }
            }
        } 
    }else if(type=='carrousel'){
        if(req.files.file[0]==undefined){
            message = await {status: 'No existe archivo'}
        }else{
            if(req.files.file[0].size==0){
                message = await {status: 'Archivo vacio'}
            }else{
                var file_path = await req.files.file[0].path;
                var file_sName = await req.files.file[0].originalFilename;                
                var sName_split = await file_sName.split('.');
                var file_ext = await sName_split[1];
                let auxpath = file_path.split('\\');
                if(auxpath.length>3){
                    file_path = auxpath[1]+'\\'+auxpath[2]+'\\'+auxpath[3];
                }   
                if(file_ext != 'png'){
                    await fs.unlink(file_path, async (err) =>{
                        message = await {status: 'Extensión incorrecta'}
                    });
                }else{     
                    let error= false; 
                    var statement = await "UPDATE tiktok.dbo.cultural_carrousel set name='"+file_path+"' where id='"+idS+"'";           
                    const singleSection = await helpers.insertSection(statement);
                    if(singleSection[0]=='Media insertada'){                        
                        let toDelete = await path.join(__dirname, '..', nameC);
                        try {
                            fs.unlinkSync(toDelete);
                        } catch (error) {
                            error = await true;
                        }      
                        if(error){
                            message = {status: 'No se pudo eliminar, intente de nuevo'}
                        }else{
                            message = {status: 'Seccion cargada'}
                        }                        
                    }else{
                        message = {status: 'No se pudo insertar, intente de nuevo'}
                    }                                    
                }
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
    maincult: async () => {
        await resolveAfter();
        return helpers;
    }
} 