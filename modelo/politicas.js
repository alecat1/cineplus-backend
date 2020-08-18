const helpers = {};
const tedious = require('tedious');
const connection = require('../controlador/conexion');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const { query } = require('express-validator');
var connected=0
var newL=0;
connection.on('connect', (err)=>{
    if(err) console.log('Error de conexión con la base de datos, intente nuevamente'); else {
        connected = 1;
        
        helpers.selectAll = async (option)=>{
            global.connected=1;
            var data = [];
            var querydic = "SELECT id,title,playbook,policy,subpolicy,decision,tag,keyword,language,lob,updated_att FROM tiktok.dbo.policy WHERE language='"+option.language+"' and lob='"+option.lob+"';";
            
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
        helpers.selectAllAll = async ()=>{
            global.connected=1;
            var data = [];
            var querydic = "SELECT id,title,playbook,policy,subpolicy,decision,tag,keyword,language,lob FROM tiktok.dbo.policy;";

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
        helpers.InsertPolicy = async (statement)=>{
            global.connected=1;
            var data = [];

            if(statement.title.includes('\'')){
                statement.title = statement.title.replace(/'/g,'\'\'');
            }
            if(statement.playbook.includes('\'')){
                statement.playbook = statement.playbook.replace(/'/g,'\'\'');
            }    
            if(statement.policy.includes('\'')){
                statement.policy = statement.policy.replace(/'/g,'\'\'');
            }
            if(statement.subpolicy.includes('\'')){
                statement.subpolicy = statement.subpolicy.replace(/'/g,'\'\'');
            }
            if(statement.decision.includes('\'')){
                statement.decision = statement.decision.replace(/'/g,'\'\'');
            }
            if(statement.tag.includes('\'')){
                statement.tag = statement.tag.replace(/'/g,'\'\'');
            }
            if(statement.keyword.includes('\'')){
                statement.keyword = statement.keyword.replace(/'/g,'\'\'');
            }
            
            if (statement.title != "" && statement.playbook != "" && statement.users_id != "" && statement.policy != "" && statement.subpolicy != "" && statement.decision != "" && statement.tag != "" && statement.language != "" && statement.keyword != ""){
                var querydic = "INSERT INTO tiktok.dbo.policy (title,playbook,users_id,policy,subpolicy,decision,tag,language,keyword,lob) VALUES ('"+statement.title+"','"+statement.playbook+"',"+statement.users_id+",'"+statement.policy+"','"+statement.subpolicy+"','"+statement.decision+"','"+statement.tag+"','"+statement.language+"','"+statement.keyword+"','"+statement.lob+"');";
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
        helpers.UpdatePolicy = async (statement)=>{
            global.connected=1;
            var data = [];
            if(statement.title.includes('\'')){
                statement.title = await statement.title.replace(/'/g,'\'\'');
            }
            if(statement.playbook.includes('\'')){
                statement.playbook = await statement.playbook.replace(/'/g,'\'\'');
            }    
            if(statement.policy.includes('\'')){
                statement.policy = await statement.policy.replace(/'/g,'\'\'');
            }
            if(statement.subpolicy.includes('\'')){
                statement.subpolicy = await statement.subpolicy.replace(/'/g,'\'\'');
            }
            if(statement.decision.includes('\'')){
                statement.decision = await statement.decision.replace(/'/g,'\'\'');
            }
            if(statement.tag.includes('\'')){
                statement.tag = await statement.tag.replace(/'/g,'\'\'');
            }
            if(statement.keyword.includes('\'')){
                statement.keyword = await statement.keyword.replace(/'/g,'\'\'');
            }
            if(statement.lob.includes('\'')){
                statement.lob = await statement.keyword.replace(/'/g,'\'\'');
            }
            if (statement.title != "" && statement.playbook != "" && statement.users_id != "" && statement.policy != "" && statement.subpolicy != "" && statement.language != ""){
                querydic = await "UPDATE tiktok.dbo.policy SET title='"+statement.title+"',playbook='"+statement.playbook+"',users_id="+statement.users_id+",policy='"+statement.policy+"',subpolicy='"+statement.subpolicy+"',decision='"+statement.decision+"',tag='"+statement.tag+"',language='"+statement.language+"',keyword='"+statement.keyword+"', lob='"+statement.lob+"', updated_att=GETDATE() WHERE id="+statement.id+"; insert into tiktok.dbo.newsfeed (title,description,img,language) values ('"+statement.title+"','"+statement.playbook+"','public\\noticias\\pordefecto.PNG', 'en'); insert into tiktok.dbo.newsfeed (title,description,img,language) values ('"+statement.title+"','"+statement.playbook+"','public\\noticias\\pordefecto.PNG', 'es'); insert into tiktok.dbo.newsfeed (title,description,img,language) values ('"+statement.title+"','"+statement.playbook+"','public\\noticias\\pordefecto.PNG', 'por') ; update tiktok.dbo.state_new set state=0;";
            }
            if(querydic!=undefined){
                const request = await new tedious.Request(querydic, function(err, rowCount, rows){
                    if(err){
                        data[0] = "Registro no modificado";
                       
                    }else{  
                        data[0] = "Registro modificado";
                        
                    }
                });
                await connection.execSql(request); 
            }else{
                data[0] = "Registro no modificado";
            }
            
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
        helpers.DeletePolicy = async (statement)=>{
            global.connected=1;
            var data = [];
    
            if (statement.id!= ""){
                var querydic = "DELETE FROM tiktok.dbo.policy WHERE id="+statement.id+";";
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
        if(req.files.file.size==0){
            message = await {status: 'Archivo vacio'}
        }else{
            try {
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
                    let query= "";
                    
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
                            if(element[4].includes('\'')){
                                element[4] = element[4].replace(/'/g,'\'\'');
                            }
                            if(element[5].includes('\'')){
                                element[5] = element[5].replace(/'/g,'\'\'');
                            }
                            if(element[6].includes('\'')){
                                element[6] = element[6].replace(/'/g,'\'\'');
                            }
                            if(element[7].includes('\'')){
                                element[7] = element[7].replace(/'/g,'\'\'');
                            }
                            if(element[8].includes('\'')){
                                element[8] = element[8].replace(/'/g,'\'\'');
                            }                            
                            if(query==""){
                                query = "INSERT INTO tiktok.dbo.policy (title,playbook,users_id,policy,subpolicy,decision,tag,language,keyword,lob) VALUES ('"+element[0]+"','"+element[1]+"',"+req.params.id+",'"+element[2]+"','"+element[3]+"','"+element[4]+"','"+element[5]+"','"+element[6]+"','"+element[7]+"','"+element[8]+"'); "
                            }else{
                                query = query + "INSERT INTO tiktok.dbo.policy (title,playbook,users_id,policy,subpolicy,decision,tag,language,keyword,lob) VALUES ('"+element[0]+"','"+element[1]+"',"+req.params.id+",'"+element[2]+"','"+element[3]+"','"+element[4]+"','"+element[5]+"','"+element[6]+"','"+element[7]+"','"+element[8]+"');"
                            }
                        }                        
                    });
                    const excelInsert = await helpers.updateExcel(query);
                    console.log(excelInsert)
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
            } catch (error) {
                message = await {status: error};
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
    mainpolitic: async () => {
        await resolveAfter();
        return helpers;
    }
} 