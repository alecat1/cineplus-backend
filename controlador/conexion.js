const tedious = require('tedious');
const Connection = tedious.connect;

const config = {
    server: 'TPCCD-DB01.teleperformance.co',
    instanceName: 'RPADEV',
    authentication: {
      type: "default",
      options: {
        userName: 'tuser',
        password: 'Colombia2020@@'      
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

var connection = new Connection(config);

module.exports = connection;