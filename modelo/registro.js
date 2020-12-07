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
    helpers.selectAllUsers = async () => {
      global.connected = 1;
      var data = [];
      var newL;
      var statment = "SELECT * FROM cinema.dbo.usuarios;";
      const request = await new tedious.Request(statment, function (err, rowCount, rows) {
        if (err) {
          data[0] = "No se pudo obtener el usuario";
        } else {
          newL = rows.length;
          rows.forEach((element, index1) => {
            var aux = {};
            rows[index1].forEach((element, index2) => {
              if (index2 == 0) {
                aux.id_user = element.value;
              }
              if (index2 == 1) {
                aux.cedula = element.value;
              }
              if (index2 == 2) {
                aux.num_celular = element.value;
              }
              if (index2 == 3) {
                aux.correo = element.value;
              }
              if (index2 == 4) {
                aux.password = element.value;
              }
            });
            data.push(aux);
          });
        }
      });

      await connection.execSql(request);

      async function returnData() {
        return new Promise((resolve) => {
          setInterval(() => {
            if (data.length != newL) {
            } else {
              resolve();
            }
          }, 500);
        });
      }

      return await returnData().then(() => {
        global.connected = 0;
        return data;
      });
    };

    helpers.insertUser = async (usuario) => {
      global.connected = 1;
      var data = [];
      var statment = "INSERT INTO cinema.dbo.Usuarios (cedula, num_celular, correo, password, role_id) VALUES ('" + usuario.cedula + "','" + usuario.num_celular + "','" + usuario.correo + "','" + usuario.password +"','"+ usuario.role_id+"');";

      const request = await new tedious.Request(statment, function (err, rowCount, rows) {
        console.log("data"+data[0])
        if (err) {
          data[0] = "No se pudo obtener el usuario";
          console.log("data"+data[0])
        } else {
          data[0] = "Usuario insertado";
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
  mainregistro: async () => {
    await resolveAfter();
    return helpers;
  },
};
