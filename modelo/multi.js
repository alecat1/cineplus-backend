
const helpers = {};
const tedious = require('tedious');
const connection = require('../controlador/conexion');
var connected=0
connection.on('connect', (err)=>{
    if(err) console.log('Error de conexión con la base de datos, intente nuevamente'); else {
        connected = 1;
        helpers.selectAllLanguages= async () =>{
            global.connected=1;
            var data = {
                en: {},
                es: {},
                por: {}
            };
            var statment = "SELECT name,text,language FROM tiktok.dbo.multi;"
            const request = await new tedious.Request(statment, function(err, rowCount, rows){
                if(err){
                    data.status = 'No se pudo obtener el archivo, intente de nuevo';
                }else{  
                    rows.forEach(async (parentElement,indexP) => {     
                        let name = await "";
                        let text = await "";
                        let language = await "";                   
                        await parentElement.forEach(async(childElement,indexC) => {
                            switch (indexC) {
                                case 0:  
                                    name = await childElement.value;                          
                                    break;   
                                case 1:
                                    text = await childElement.value;                              
                                    break; 
                                case 2:    
                                    language = await childElement.value; 
                                    if(language=='en'){
                                        data.en[name] = text
                                    }else if(language=='es'){
                                        data.es[name] = text
                                    }else if(language=='por'){
                                        data.por[name] = text
                                    }        
                                    break;                          
                                default:
                                    break;
                            }
                        });   
                        if(rowCount-1==indexP){
                            data.status = 'false'
                        }                    
                    });
                    
                }
            });

            await connection.execSql(request);             

            async function returnData(){
                return new Promise(resolve => {
                setInterval(() => {
                    if(data.status==undefined){
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
    mainmulti: async () => {
        await resolveAfter();
        return helpers;
    }
} 