const helpers = {};
const tedious = require("tedious");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const fs = require("fs");
const path = require("path");
var csv_convert = require("csv-stringify");
const connection = require("../controlador/conexion");
var connected = 0;
var newL = 0;

connection.on("connect", (err) => {
  if (err) console.log("err: " + err);
  else {
    connected = 1;

    helpers.selectAllUsers = async () => {
      global.connected = 1;
      var data = [];
      var statment = "select * from dbo.cinema.Usuarios;";
      const request = await new tedious.Request(statment, function (err, rowCount, rows) {
        if (err) {
          data[0] = "Cargando módulos, espere un momento y vuelva a";
          return data;
        } else {
          newL = rows.length;
          rows.forEach((element, index1) => {
            var aux = [];
            rows[index1].forEach((element, index2) => {
              aux[index2] = element.value;
            });
            data[index1] = aux;
          });
        }
      });

      await connection.execSql(request);

      async function returnData() {
        return new Promise((resolve) => {
          setInterval(() => {
            if (data.length != newL) {
              //console.log(data.length);
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

    helpers.selectUser = async (cedula) => {
      global.connected = 1;
      var data = [];
      var statment = "SELECT * FROM cinema.dbo.Usuarios WHERE cedula=" + cedula + ";";
      const request = await new tedious.Request(statment, function (err, rowCount, rows) {
        if (err) {
          console.log(err);
        } else {
          if (rowCount == 0) {
            data[0] = "nodata";
          } else {
            rows[0].forEach((element, index) => {
              data[index] = element.value;
            });
          }
        }
      });

      await connection.execSql(request);

      async function returnId() {
        return new Promise((resolve) => {
          setInterval(() => {
            if (data.length == 0) {
              //console.log('querying');
            } else {
              resolve();
            }
          }, 500);
        });
      }

      return await returnId().then(() => {
        global.connected = 0;
        return data;
      });
    };

    helpers.getrole = async (id) => {
      global.connected = 1;
      var data = [];
      var statment = "SELECT * FROM cinema.dbo.roles WHERE id=" + id_role + ";";
      const request = await new tedious.Request(statment, function (err, rowCount, rows) {
        if (err) {
          console.log(err);
        } else {
          if (rowCount == 0) {
            data[0] = "nodata";
          } else {
            rows[0].forEach((element, index) => {
              data[index] = element.value;
            });
          }
        }
      });

      await connection.execSql(request);

      async function returnId() {
        return new Promise((resolve) => {
          setInterval(() => {
            if (data.length == 0) {
              //console.log('querying');
            } else {
              resolve();
            }
          }, 500);
        });
      }

      return await returnId().then(() => {
        global.connected = 0;
        return data;
      });
    };

  }

  //INICIAR SESIÓN
  helpers.signin = async (req, cedula, password, done) => {
    console.log("entra iniciar sesion")
    global.connected = 1;
    var consult = await helpers.selectUser(cedula);
    console.log( consult, 'consult')
    var user = {
      id: consult[0],
      cedula: consult[1],
      num_celular: consult[2],
      correo: consult[3],
      password: consult[4],
      role_id: consult[5],
    };
    if (consult[0] != "nodata") {
      console.log(password)
      console.log(consult[4])
      if (password == consult[4]) {
        console.log("Contraseña correcta")
        global.connected = 0;
        done(null, user);
      } else {
        console.log("contra incoo")
        global.connected = 0;
        done(null, false, { message: "Contraseña incorrecta" });
      }
    } else {
      global.connected = 0;
      return done(null, false, { message: "Usuario no existe" });
    }
  };

});

helpers.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

helpers.matchpassword = async (password, savedPassword) => {
  try {
    return await bcrypt.compare(password, savedPassword);
  } catch (error) {
    console.log(savedPassword);
    console.log(password);
    console.log("error pass:" +error);
  }
};
helpers.serial = async () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    var id = helpers.selectUser(id);
    done(null, id);
  });
};
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
  main: async () => {
    await resolveAfter();
    return helpers;
  },
};
