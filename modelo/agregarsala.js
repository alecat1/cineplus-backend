const helpers = {};
const tedious = require("tedious");
const connection = require("../controlador/conexion");
const fs = require("fs");
const path = require("path");
var connected = 0;

connection.on("connect", (err) => {
  if (err) console.log("Error de conexión con la base de datos, intente nuevamente");
  else {
    connected = 1;
    helpers.insertSala = async (sala) => {
      global.connected = 1;
      var data = [];
      var statment = "INSERT INTO cinema.dbo.Salas (numero, tipo) VALUES ('" + sala.numero + "','" + sala.tipo +"');";

      const request = await new tedious.Request(statment, function (err, rowCount, rows) {
        console.log("data"+data[0])
        if (err) {
          data[0] = "No se pudo obtener la sala";
          console.log("data"+data[0])
        } else {
          data[0] = "Sala insertada";
          console.log("data"+data[0])
        }
      });

      await connection.execSql(request);
      async function returnId() {
        return new Promise((resolve) => {
          setInterval(() => {
            if (data.length == 0) {
            } else {
              resolve();
            }
          }, 500);
        });
      }

      return await returnId().then(() => {
        global.connected = 0;
        console.log("return: "+data)
        return data;
      });
    };



  }
});
function resolveAfter() {
  return new Promise((resolve) => {
    setInterval(() => {
      if (connected == 0) {
      } else {
        resolve();
      }
    }, 500);
  });
}

module.exports = {
  mainsala: async () => {
    await resolveAfter();
    return helpers;
  },
};
