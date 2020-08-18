const tedious = require('tedious');
const ConnectionHC = tedious.connect;

const config = {
    server: '10.151.230.20',
    instanceName: 'SCREBEL',
    authentication: {
      type: "default",
      options: {
        userName: 'RPAUser',
        password: 'RPARebel2019*'      
      }
    },
    options: {
      encrypt: true,
      port: 5081,
      trustServerCertificate: true,
      rowCollectionOnRequestCompletion: true,
      rowCollectionOnDone: true
    }
}

var connectionHC = new ConnectionHC(config);
module.exports = connectionHC;