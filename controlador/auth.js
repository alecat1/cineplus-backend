const jwt = require('jsonwebtoken');
module.exports ={
    async isLoggedIn(token, key){
        var ret=null;
        if (token) {
        jwt.verify(token, key, (err, decoded) => {  
            if (err) {
                ret =  "I";   
            } else {
                ret =  "V";
        }});
        } else {
            ret =  "N";
        }

        async function returnData(){
            return new Promise(resolve => {
            setInterval(() => {
                if(ret==null){
                }else{
                    resolve();
                }
            }, 500);
            });
        }
        return await returnData().then(()=>{
            return ret;
        });    
    }
}
