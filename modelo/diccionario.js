
const helpers = {};
const tedious = require('tedious');
const connection = require('../controlador/conexion');
const XLSX = require('xlsx')
const fs = require('fs');
const path = require('path');
var connected=0
var newL=0;
connection.on('connect', (err)=>{
    if(err) console.log('Error de conexión con la base de datos, intente nuevamente'); else {
        connected = 1;
        helpers.selectAllsWords = async ()=>{
            global.connected=1;
            var data = [];
            var querydic = "SELECT id,name,description,category,country FROM tiktok.dbo.words";    

            const request = new tedious.Request(querydic, function(err, rowCount, rows){
                if(err){
                    data[0] = "No existen resultados";
                }else{  
                    newL=rows.length;
                    rows.forEach((element,index1) => {
                        var aux = [];
                        rows[index1].forEach((element,index2) => {
                            aux[index2]=element.value;
                        });
                        //data[index1]=aux;
                        data.push(aux)                                           
                    });
                     if (data.length==0){
                        data[0] = "No existen resultados";
                    } 
                }
            });
            await connection.execSql(request); 

            async function returnData(){
                return new Promise(resolve => {
                setInterval(() => {
                    if(data.length==0){
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

        helpers.InsertWord = async (statement)=>{
            global.connected=1;
            var data = [];

            if(statement.name.includes('\'')){
                statement.name = statement.name.replace(/'/g,'\'\'');
            }
            if(statement.country.includes('\'')){
                statement.country = statement.country.replace(/'/g,'\'\'');
            }    
            if(statement.description.includes('\'')){
                statement.description = statement.description.replace(/'/g,'\'\'');
            }
            if(statement.category.includes('\'')){
                statement.category = statement.category.replace(/'/g,'\'\'');
            }
    
            if (statement.name != "" && statement.country != "" && statement.category != "" && statement.description != ""){
                var querydic = "INSERT INTO tiktok.dbo.words (name,description,category,users_id,country) VALUES ('"+statement.name+"','"+statement.description+"','"+statement.category+"',"+statement.users_id+",'"+statement.country+"')"
            }

            const request = new tedious.Request(querydic, function(err, rowCount, rows){
                if(err){
                    data[0] = "Registro no insertado";
                }else{  
                    data[0] = "Registro insertado con exito";
                    
                }
            });
            await connection.execSql(request); 

            async function returnData(){
                return new Promise(resolve => {
                setInterval(() => {
                    if(data.length==0){
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

        helpers.UpdateWord = async (statement)=>{
            global.connected=1;
            var data = [];
            
            if(statement.name.includes('\'')){
                statement.name = statement.name.replace(/'/g,'\'\'');
            }
            if(statement.country.includes('\'')){
                statement.country = statement.country.replace(/'/g,'\'\'');
            }    
            if(statement.description.includes('\'')){
                statement.description = statement.description.replace(/'/g,'\'\'');
            }
            if(statement.category.includes('\'')){
                statement.category = statement.category.replace(/'/g,'\'\'');
            }
                
            if (statement.name != "" && statement.country != "" && statement.category != "" && statement.description != "" && statement.id != "" && statement.users_id != ""){
                var querydic = "UPDATE tiktok.dbo.words SET name='"+statement.name+"',description='"+statement.description+"',category='"+statement.category+"',country='"+statement.country+"',users_id="+statement.users_id+", updated_at=GETDATE() WHERE id="+statement.id+";";
            }

            const request = new tedious.Request(querydic, function(err, rowCount, rows){
                if(err){
                    data[0] = "Registro no modificado";
                   
                }else{  
                    data[0] = "Registro modificado";
                    
                }
            });
            await connection.execSql(request); 

            async function returnData(){
                return new Promise(resolve => {
                setInterval(() => {
                    if(data.length==0){
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
        
        helpers.DeleteWord = async (statement)=>{
            global.connected=1;
            var data = [];
    
            if (statement.id!= ""){
                var querydic = "DELETE FROM tiktok.dbo.words WHERE id="+statement.id+";";
            }

            const request = new tedious.Request(querydic, function(err, rowCount, rows){
                if(err){
                    data[0] = "Registro no eliminado";
                }else{  
                    data[0] = "Registro eliminado";
                    
                }
            });
            await connection.execSql(request); 

            async function returnData(){
                return new Promise(resolve => {
                setInterval(() => {
                    if(data.length==0){
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

        helpers.updateExcel = async (statement)=>{
            global.connected=1;
            let data = []
            const request = new tedious.Request(statement, function(err, rowCount, rows){
                if(err){
                    data[0] = 'No se pudo cargar el archivo'
                   
                }else{  
                    data[0] = "Registro modificado";
                    
                }
            });
            await connection.execSql(request); 

            async function returnData(){
                return new Promise(resolve => {
                setInterval(() => {
                    if(data.length==0){
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

helpers.exceltoJson = async (req,res) =>{
    global.connected=1;
    let message = {};
    if(req.files.file==undefined){
        message = await {status: 'No existe archivo'}   
    }else{
        try {
            if(req.files.file.size==0){
                message = await {status: 'Archivo vacio'}
            }else{
                var file_path = await req.files.file.path;
                var file_split = await file_path.split('\\');
                var file_sName = await file_split[2];
                var sName_split = await file_sName.split('.');
                var file_ext = await sName_split[1];
                let auxpath2 = file_path.split("\\");
                let auxext = auxpath2[3].split(".");
                let auxreadir = "./public/temp";
                if (auxpath2.length > 3) {
                  file_path = auxpath2[1] + "\\" + auxpath2[2] + "\\" + auxpath2[3];
                  file_ext = auxext[1];
                  file_sName = auxpath2[3];
                  auxreadir = "../public/temp";
                }
                if(file_ext != 'xlsx' && file_ext != 'XLSX'){
                    await fs.unlink(file_path, async (err) =>{
                        message = await {status: 'No se pudo cargar el archivo'}
                    });
                }else{
                    var auxpath = path.join(__dirname, '..', file_path);
                    var workbook = XLSX.readFile(auxpath);
                    var sheet_name_list = workbook.SheetNames;
                    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list], {
                        raw: false,
                        dateNF: "DD-MMM-YYYY",
                        header:1,
                        defval: ""
                    });
                    let query = "";
                    await xlData.forEach((element, index) => {
                        if(index!=0){
                            if(element[0].includes('\'')){
                                element[0] = element[0].replace(/'/g,'\'\'');
                            }
                            if(element[1].includes('\'')){
                                element[1] = element[1].replace(/'/g,'\'\'');
                            }
                            if(element[2].includes('\'')){
                                element[2] = element[2].replace(/'/g,'\'\'');
                            }
                            if(element[3].includes('\'')){
                                element[3] = element[3].replace(/'/g,'\'\'');
                            }
                            if(query==""){
                                query = "INSERT INTO tiktok.dbo.words (name,description,category,users_id,country) VALUES ('"+element[0]+"','"+element[1]+"','"+element[2]+"',"+req.params.id+",'"+element[3]+"');";
                            }else{
                                query = query + " " + "INSERT INTO tiktok.dbo.words (name,description,category,users_id,country) VALUES ('"+element[0]+"','"+element[1]+"','"+element[2]+"',"+req.params.id+",'"+element[3]+"');";
                            }
                        }
                        
                    });
                    const excelInsert = await helpers.updateExcel(query);
                    await fs.readdir(auxreadir, async (err, files)=>{
                        files.forEach(element => {
                            
                            let toDelete = path.join(__dirname, '..', 'public', 'temp', element);
                            fs.unlinkSync(toDelete);
                        });
                    })
                    if(excelInsert[0]=='Registro modificado'){
                        message = await {status: 'Registros actualizados'};
                    }else{
                        message = await {status: 'No se pudo cargar el archivo'};
                    }
                }
            }            
        } catch (error) {
            global.connected=0;
            message = await {status: error};
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
    maindiccion: async () => {
        await resolveAfter();
        return helpers;
    }
} 