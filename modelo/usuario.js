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
      var statment = "select * from tiktok.dbo.users where role_id = 1 or role_id = 3 or role_id = 4 or role_id = 5;";
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

    helpers.selectUser = async (ccms) => {
      global.connected = 1;
      var data = [];
      var statment = "SELECT * FROM tiktok.dbo.users WHERE ccms='" + ccms + "';";
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
      var statment = "SELECT * FROM tiktok.dbo.roles WHERE id=" + id + ";";
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

    helpers.insertUser = async (newUser) => {
      global.connected = 1;
      const dBid = await helpers.selectUser(newUser.ccms);
      if (dBid[0] == "nodata") {
        var id;
        var statment = "INSERT INTO tiktok.dbo.users (name,lastname,ccms,password,role_id) VALUES ('" + newUser.name + "','" + newUser.lastname + "','" + newUser.ccms + "','" + newUser.password + "',1)";
        const request = new tedious.Request(statment, async function (err) {
          if (err) {
            console.log(err);
          } else {
            async function recall() {
              var statment2 = "SELECT TOP 1 * FROM tiktok.dbo.users ORDER BY id DESC;";
              const request2 = await new tedious.Request(statment2, function (err, rowCount, rows) {
                if (err) {
                  data[0] = "Cargando módulos, espere un momento y vuelva a intentar.";
                  return data;
                } else {
                  id = rows[0][0].value;
                }
              });

              await connection.execSql(request2);
            }
            recall();
          }
        });

        await connection.execSql(request);
      } else {
        id = -1;
      }

      async function returnId() {
        return new Promise((resolve) => {
          setInterval(() => {
            if (id == undefined) {
              //console.log('querying');
            } else {
              resolve();
            }
          }, 500);
        });
      }

      return await returnId().then(() => {
        global.connected = 0;
        return id;
      });
    };

    helpers.deleteUser = async (user) => {
      global.connected = 1;
      const dBid = await helpers.selectUser(user.ccms);
      var data = [];
      if (dBid[0] != "nodata") {
        var statment = "DELETE FROM tiktok.dbo.users WHERE ccms='" + user.ccms + "';";
        const request = new tedious.Request(statment, async function (err) {
          if (err) {
            data[0] = "No se pudo eliminar, intente de nuevo";
          } else {
            data[0] = "Usuario eliminado";
          }
        });

        await connection.execSql(request);
      } else {
        data[0] = "No existe usuario";
      }

      async function returnData() {
        return new Promise((resolve) => {
          setInterval(() => {
            if (data.length == 0) {
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

    helpers.updateUser = async (user) => {
      global.connected = 1;
      const dBid = await helpers.selectUser(user.ccms);
      if (user.newRole == "Standard User") {
        user.newRole = 1;
      }
      if (user.newRole == "Admin User") {
        user.newRole = 2;
      }
      if (user.newRole == "Trainer User") {
        user.newRole = 3;
      }
      if (user.newRole == "HHRR User") {
        user.newRole = 4;
      }
      if (user.newRole == "Staff User") {
        user.newRole = 5;
      }
      var data = [];
      if (dBid[0] != "nodata") {
        var statment = "UPDATE tiktok.dbo.users SET role_id=" + user.newRole + " WHERE ccms='" + user.ccms + "';";
        const request = new tedious.Request(statment, async function (err) {
          if (err) {
            data[0] = "No se pudo actualizar, intente de nuevo";
          } else {
            data[0] = "Usuario actualizado";
          }
        });

        await connection.execSql(request);
      } else {
        data[0] = "No existe usuario";
      }

      async function returnData() {
        return new Promise((resolve) => {
          setInterval(() => {
            if (data.length == 0) {
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

    helpers.insertACK = async (ccms) => {
      global.connected = 1;
      var data = [];
      var statment = (await "INSERT INTO tiktok.dbo.acknowledge (ccms) VALUES ('") + ccms + "');";
      const request = new tedious.Request(statment, async function (err) {
        if (err) {
          data[0] = "No se pudo insertar, intente de nuevo";
        } else {
          data[0] = "ACK insertado";
        }
      });

      await connection.execSql(request);

      async function returnDone() {
        return new Promise((resolve) => {
          setInterval(() => {
            if (data.length == 0) {
            } else {
              resolve();
            }
          }, 500);
        });
      }

      return await returnDone().then(() => {
        global.connected = 0;
        return data;
      });
    };

    helpers.selectStateUser = async (ccms) => {
      global.connected = 1;
      var data = [];
      var statment = "SELECT * FROM tiktok.dbo.state_new WHERE user_login='" + ccms + "';";
      const request = await new tedious.Request(statment, function (err, rowCount, rows) {
        if (err) {
          data[0] = "nodata";
        } else {
          if (rowCount == 0) {
            data[0] = "nodata";
          } else {
            data[0] = "data";
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

    helpers.insertStateUser = async (newUser) => {
      global.connected = 1;
      let data = [];
      var statment = "INSERT INTO tiktok.dbo.state_new (user_login,state) VALUES ('" + newUser.ccms + "',0);";
      const request = new tedious.Request(statment, async function (err) {
        if (err) {
          data[0] = "nodata";
        } else {
          data[0] = "data";
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
        return data;
      });
    };

    helpers.selectAllAck = async () => {
      global.connected = 1;
      var data = [];
      var newL;
      var statment = "SELECT * FROM tiktok.dbo.acknowledge ORDER BY id desc;";
      const request = await new tedious.Request(statment, function (err, rowCount, rows) {
        if (err) {
          data[0] = "No se pudo obtener el archivo, intente de nuevo";
        } else {
          newL = rows.length;
          rows.forEach((element, index1) => {
            var aux = {};
            rows[index1].forEach((element, index2) => {
              if (index2 == 0) {
                aux.id = element.value;
              }
              if (index2 == 1) {
                aux.ccms = element.value;
              }
              if (index2 == 2) {
                aux.ack_at = element.value;
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
  }

  helpers.signin = async (req, ccms, password, done) => {
    global.connected = 1;
    var consult = await helpers.selectUser(ccms);
    console.log( consult, 'consult')
    var user = {
      id: consult[0],
      name: consult[1],
      lastname: consult[2],
      ccms: consult[3],
      password: consult[4],
      role: consult[5],
    };
    if (consult[0] != "nodata") {
      const validPassword = await helpers.matchpassword(password, consult[4]);
      if (validPassword) {
        const existUserState = await helpers.selectStateUser(ccms);
        if (existUserState[0] == "nodata") {
            await helpers.insertStateUser(user);
        }
        global.connected = 0;
        done(null, user);
      } else {
        global.connected = 0;
        done(null, false, { message: "Contraseña incorrecta" });
      }
    } else {
      global.connected = 0;
      return done(null, false, { message: "Usuario no existe" });
    }
  };

  helpers.ccms = async (req, ccms, password, done) => {
    global.connected = 1;
    var consult = await helpers.selectUser(ccms);
    console.log(consult, ' ccms consult')
    var user = {
      id: consult[0],
      name: consult[1],
      lastname: consult[2],
      ccms: consult[3],
      password: consult[4],
      role: consult[5],
    };
    console.log(user)
    if (consult[0] != "nodata") {
      const existUserState = await helpers.selectStateUser(ccms);
      console.log(existUserState, 'existuserstate')
      if (existUserState[0] == "nodata") {
        await helpers.insertStateUser(user);
      }
      global.connected = 0;
      done(null, user);
    } else {
      const newUser = {
        ccms: ccms,
        password: null,
        name: null,
        lastname: null,
      };
      const existUserState = await helpers.selectStateUser(ccms);
      if (existUserState[0] == "nodata") {
        await helpers.insertStateUser(newUser);
      }
      await helpers.insertUser(newUser);
      const id = await helpers.selectUser(newUser.ccms);
      newUser.id = id[0];
      newUser.role = 1;
      global.connected = 0;
      done(null, newUser);
    }
  };

  helpers.signup = async (req, ccms, password, done) => {
    global.connected = 1;
    const { name } = req.body;
    const { lastname } = req.body;
    const newUser = {
      ccms,
      password,
      name,
      lastname,
    };
    newUser.password = await helpers.encryptPassword(password);
    var id = await helpers.insertUser(newUser);
    if (id != -1) {
      newUser.id = await id;
      global.connected = 0;
      return done(null, newUser);
    } else {
      global.connected = 0;
      return done(null, false, { message: "Usuario ya existe" });
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
    console.log(error);
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
helpers.getData = async () => {
  global.connected = 1;
  let message = {};
  var data = await helpers.selectAllAck();
  let data2Send = [];
  data.forEach((element) => {
    let unixTimes = element.ack_at;
    let auxUnixTime = Math.trunc(unixTimes / 1000)*1000;
    var theDate = new Date(auxUnixTime);
    let dateString = theDate.toGMTString();
    let auxData = [element.id, element.ccms, dateString];
    data2Send.push(auxData);
  });
  let myObj = {
    rows: data2Send,
  };
  let path2Send = path.join(__dirname, "..", "public", "temp", "data.csv");
  csv_convert(myObj.rows, (err, output) => {
    if (err) {
      message.path = "No se pudo generar un archivo";
    } else {
      fs.writeFile(path2Send, output, "utf8", function (err) {
        if (err) {
          message.path = "No se pudo generar un archivo";
        } else {
          message.path = path2Send;
        }
      });
    }
  });

  async function returnMessage() {
    return new Promise((resolve) => {
      setInterval(() => {
        if (message.path == undefined) {
        } else {
          resolve();
        }
      }, 500);
    });
  }

  return await returnMessage().then(() => {
    global.connected = 0;
    return message;
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
