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
    helpers.selectAllNoticias = async () => {
      global.connected = 1;
      var data = [];
      var newL;
      var statment = "SELECT * FROM tiktok.dbo.newsfeed ORDER BY id desc;";
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
                aux.title = element.value;
              }
              if (index2 == 2) {
                aux.description = element.value;
              }
              if (index2 == 3) {
                aux.img = element.value;
              }
              if (index2 == 4) {
                aux.update_at = element.value;
              }
              if (index2 == 5) {
                aux.language = element.value;
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

    helpers.selectImage = async (imageId) => {
      global.connected = 1;
      var data = [];
      var statment = "SELECT img FROM tiktok.dbo.newsfeed WHERE id=" + imageId + ";";
      const request = await new tedious.Request(statment, function (err, rowCount, rows) {
        if (err) {
          data[0] = "No se pudo obtener el archivo, intente de nuevo";
        } else {
          data[0] = rows[0][0].value;
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

    helpers.insertNoticia = async (noticias) => {
      global.connected = 1;
      var data = [];
      var statment = "INSERT INTO tiktok.dbo.newsfeed (title, description, img, language) VALUES ('" + noticias.title + "','" + noticias.description + "','" + noticias.path + "','" + noticias.language + "'); update tiktok.dbo.state_new set state=0;";

      const request = await new tedious.Request(statment, function (err, rowCount, rows) {
        if (err) {
          data[0] = "No se pudo obtener el archivo, intente de nuevo";
        } else {
          data[0] = "Noticia insertada";
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

    helpers.updateNews = async (noticias) => {
      global.connected = 1;
      var data = [];
      var statment;

      if (noticias.statusupda == 0) {
        statment = "update tiktok.dbo.newsfeed set title='" + noticias.title + "', description='" + noticias.description + "', img='" + noticias.path + "', language='" + noticias.language + "', update_at=GETDATE() where id=" + noticias.id + "; update tiktok.dbo.state_new set state=0;";
      } else {
        statment = "update tiktok.dbo.newsfeed set title='" + noticias.title + "', description='" + noticias.description + "', language='" + noticias.language + "', update_at=GETDATE() where id=" + noticias.id + "; update tiktok.dbo.state_new set state=0;";
      }
      const request = await new tedious.Request(statment, function (err, rowCount, rows) {
        if (err) {
          data[0] = "No se pudo obtener el archivo, intente de nuevo";
        } else {
          data[0] = "Noticia actualizada";
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

    helpers.SelectByID = async (noticias) => {
      global.connected = 1;
      var data = [];
      var iddelete = [];
      var statment = "select img from tiktok.dbo.newsfeed where id=" + noticias.idnoticia + "";
      const request = await new tedious.Request(statment, async function (err, rowCount, rows) {
        iddelete = await rows[0];
        if (err) {
          data[0] = "No se pudo obtener el archivo, intente de nuevo";
        } else {
          if (iddelete == []) {
            data[0] = "No se pudo obtener el archivo, intente de nuevo";
          } else {
            data[0] = iddelete[0].value;
          }
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

    helpers.DeleteNoticia = async (noticias) => {
      global.connected = 1;
      var data = [];
      var statment = "delete from tiktok.dbo.newsfeed where id=" + noticias.idnoticia + "";
      const request = await new tedious.Request(statment, async function (err, rowCount, rows) {
        let iddelete = await rows[0];
        if (err) {
          data[0] = "No se pudo obtener el archivo, intente de nuevo";
        } else {
          data[0] = "Noticia eliminada";
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

    helpers.UpdateState = async () => {
      global.connected = 1;
      var data = [];

      var statment = "update tiktok.dbo.state_new set state=0;";
      const request = await new tedious.Request(statment, async function (err, rowCount, rows) {
        if (err) {
          data[0] = "No se pudo obtener el archivo, intente de nuevo";
        } else {
          data[0] = 200;
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

    helpers.UpdateState2 = async (ccms) => {
      global.connected = 1;
      var data = [];
      var statment = "update tiktok.dbo.state_new set state=1, update_date=GETDATE() where user_login='" + ccms + "'";
      const request = await new tedious.Request(statment, async function (err, rowCount, rows) {
        if (err) {
          data[0] = "No se pudo obtener el archivo, intente de nuevo";
        } else {
          data[0] = 200;
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

    helpers.SelectByCCMS = async (ccms) => {
      global.connected = 1;
      var data = [];
      var statment = "select state from tiktok.dbo.state_new where user_login='" +ccms+ "'";
      const request = await new tedious.Request(statment, async function (err, rowCount, rows) {
        if (err) {
          data[0] = "No se pudo obtener el archivo, intente de nuevo";
        } else {
          if (rowCount > 0) {
            console.log(rows)
            data[0] = rows[0][0].value;
          } else {
            data[0] = "No se pudo obtener el archivo, intente de nuevo";
          }
          console.log(data)
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
  }
});

helpers.getImage = async (req, res) => {
  global.connected = 1;
  let message = {};
  var imageId = await req.params.id;
  var image_path = await helpers.selectImage(imageId);
  fs.exists(path.join(__dirname, "..", image_path[0]), (exists) => {
    if (exists) {
      message = { path: path.join(__dirname, "..", image_path[0]) };
    } else {
      message = { path: "No se ha encontrado archivo" };
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

helpers.InsertNoticias = async (req, res) => {
  global.connected = 1;

  let message = {};
  if (req.body.statusimg == 0) {
    if (req.files == {}) {
      message = await { status: "No se pudo cargar el archivo" };
    } else {
      try {
        var file_path = await req.files.file.path;
        var file_split = await file_path.split("\\");
        var file_sName = await file_split[2];
        var sName_split = await file_sName.split(".");
        var file_ext = await sName_split[1];
        let auxpath = file_path.split("\\");
        if (auxpath.length > 3) {
          file_path = auxpath[1] + "\\" + auxpath[2] + "\\" + auxpath[3];
          let auxXXX = auxpath[3].split('.')
          file_ext = auxXXX[1];
        }
        console.log(path.join(__dirname,"..",file_path));
        if (file_ext != "gif" && file_ext != "GIF" && file_ext != "png" && file_ext != "PNG") {
          await fs.unlink(path.join(__dirname,"..",file_path), async (err) => {
            console.log(err)
            message = await { status: "La extensión no es soportada" };
          });
        } else {
          console.log('hola')
          const noticias = {
            title: req.body.title,
            description: req.body.description,
            language: req.body.language,
            path: file_path,
          };
          console.log(noticias)
          const update = await helpers.insertNoticia(noticias);
          console.log(update)
          if (update == "Noticia insertada") {
            message = await { status: "Noticia insertada" };
          } else {
            message = await { status: "Intentelo de nuevo" };
          }
        }
      } catch (error) {
        console.log(error)
        message = await { status: "Intentelo de nuevo" };
      }
    }
  } else {
    try {
      const noticias = {
        title: req.body.title,
        description: req.body.description,
        language: req.body.language,
        path: "public\\noticias\\pordefecto.PNG",
      };
      const update = await helpers.insertNoticia(noticias);
      if (update == "Noticia insertada") {
        message = await { status: "Noticia insertada" };
      } else {
        message = await { status: "Intentelo de nuevo" };
      }
    } catch (error) {
      message = await { status: "Intentelo de nuevo" };
    }
  }

  async function returnMessage() {
    return new Promise((resolve) => {
      setInterval(() => {
        if (message.status == undefined) {
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

helpers.updateNoticias = async (req, res) => {
  global.connected = 1;
  if (req.body.language == "Spanish") {
    req.body.language = "es";
  }
  if (req.body.language == "English") {
    req.body.language = "en";
  }
  if (req.body.language == "Portugues") {
    req.body.language = "por";
  }

  let message = {};
  if (req.body.statusupda == 0) {
    if (req.files == {}) {
      message = await { status: "No se pudo cargar el archivo" };
    } else {
      try {
        var file_path = await req.files.file.path;
        var file_split = await file_path.split("\\");
        var file_sName = await file_split[2];
        var sName_split = await file_sName.split(".");
        var file_ext = await sName_split[1];
        let auxpath = file_path.split("\\");
        if (auxpath.length > 3) {
          file_path = auxpath[1] + "\\" + auxpath[2] + "\\" + auxpath[3];
        }
        if (file_ext != "gif" && file_ext != "GIF" && file_ext != "png" && file_ext != "PNG") {
          await fs.unlink(file_path, async (err) => {
            message = await { status: "La extensión no es soportada" };
          });
        } else {
          const noticias = {
            title: req.body.title,
            description: req.body.description,
            language: req.body.language,
            id: req.body.id,
            path: file_path,
            statusupda: req.body.statusupda,
          };
          const update = await helpers.updateNews(noticias);
          if (update == "Noticia actualizada") {
            if (req.body.img == "public\\noticias\\pordefecto.PNG") {
              message = await { status: "Noticia actualizada" };
            } else {
              let toDelete = await path.join(__dirname, "..", req.body.img);
              try {
                fs.unlinkSync(toDelete);
                message = await { status: "Noticia actualizada" };
              } catch (error) {
                error = await true;
                message = await { status: "Intentelo de nuevo" };
              }
            }
          } else {
            message = await { status: "Intentelo de nuevo" };
          }
        }
      } catch (error) {
        message = await { status: "Intentelo de nuevo" };
      }
    }
  } else {
    try {
      const noticias = {
        title: req.body.title,
        description: req.body.description,
        language: req.body.language,
        id: req.body.id,
        statusupda: req.body.statusupda,
      };

      const update = await helpers.updateNews(noticias);
      if (update == "Noticia actualizada") {
        message = await { status: "Noticia actualizada" };
      } else {
        message = await { status: "Intentelo de nuevo" };
      }
    } catch (error) {
      message = await { status: "Intentelo de nuevo" };
    }
  }

  async function returnMessage() {
    return new Promise((resolve) => {
      setInterval(() => {
        if (message.status == undefined) {
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

helpers.DeleteNoticias = async (req, res) => {
  global.connected = 1;
  let message = {};
  try {
    const noticias = {
      idnoticia: req.body.id,
    };
    const SelectID = await helpers.SelectByID(noticias);
    if (SelectID[0] == "public\\noticias\\pordefecto.PNG") {
      message = await { status: "Noticia eliminada" };
      const DelectID = await helpers.DeleteNoticia(noticias);
      if (DelectID == "Noticia eliminada") {
        message = await { status: "Noticia eliminada" };
      } else {
        message = await { status: "Intentelo de nuevo" };
      }
    } else {
      await helpers.DeleteNoticia(noticias);
      let toDelete = await path.join(__dirname, "..", SelectID[0]);
      try {
        fs.unlinkSync(toDelete);
        message = await { status: "Noticia eliminada" };
      } catch (error) {
        error = await true;
        message = await { status: "Intentelo de nuevo" };
      }
    }
  } catch (error) {
    message = await { status: "Intentelo de nuevo" };
  }

  async function returnMessage() {
    return new Promise((resolve) => {
      setInterval(() => {
        if (message.status == undefined) {
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
  mainoticias: async () => {
    await resolveAfter();
    return helpers;
  },
};
