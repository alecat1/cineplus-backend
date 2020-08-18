const helpers = {};
const tedious = require('tedious');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const connectionHC = require('../controlador/conexionHC');
var connected=0
var newL=0;

connectionHC.on('connect', (err)=>{
    if(err) console.log('err: '+err); else {
        connected = 1;
       
        helpers.validarHC = async (ccms) => {          
            global.connected=1;
            var data = [];        
            //ccms='chiquitoe.5'
            var statment = "select top 1 * from tiktok.dbo.tbTikTok_Raw_Weekly_HC where Windows_User = '"+ccms+"' order by Week desc";
            const request = await new tedious.Request(statment, function(err, rowCount, rows){
                if(err){
                    data[0] = "Cargando módulos, espere un momento y vuelva a";
                }else{    
                    console.log(rows)
                    newL=rows.length;
                    rows.forEach((element,index1) => {
                        var aux = [];
                        rows[index1].forEach((element,index2) => {
                            aux[index2]=element.value;
                        });
                        data[index1]=aux;                                           
                    });                             
                }
            });

            connectionHC.execSql(request); 

            async function returnData(){
                return new Promise(resolve => {
                setInterval(() => {
                    if(data.length!=newL){
                        //console.log(data.length);
                    }else{
                        resolve();
                    }
                }, 500);
                });
            }
            return returnData().then(()=>{
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
    main: async () => {
        await resolveAfter();
        return helpers;
    }
}