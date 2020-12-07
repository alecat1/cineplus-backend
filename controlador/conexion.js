const tedious = require('tedious')
const Connection = tedious.connect

const config = {
  server: 'ALEJANDRA',
  instanceName: 'SQLEXPRESS',
  authentication: {
    type: 'default',
    options: {
      userName: 'tuser',
      password: '1234',
    },
  },
  options: {
    encrypt: true,
    port: 1433,
    trustServerCertificate: true,
    rowCollectionOnRequestCompletion: true,
    rowCollectionOnDone: true,
  },
}

var connection = new Connection(config)

module.exports = connection
