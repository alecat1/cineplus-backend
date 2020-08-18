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

    helpers.updateMedia = async (media) => {
      global.connected = 1;
      var data = [];

      var statment = "UPDATE tiktok.dbo.media SET name='" + media.name + "', path='" + media.path + "', type='" + media.type + "' WHERE id=" + media.id + ";";
      const request = new tedious.Request(statment, async function (err, rowCount, rows) {
        if (err) {
          data[0] = "No se pudo actualizar, intente de nuevo";
        } else {
          data[0] = "Media actualizada";
        }
      });

      await connection.execSql(request);

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

    helpers.selectAllMedia = async (destination, statement) => {
      global.connected = 1;
      var data = [];
      var newL;

      if (destination == "home") {
        var statment = "SELECT name FROM tiktok.dbo.media WHERE destination='" + destination + "';";
        const request = await new tedious.Request(statment, function (err, rowCount, rows) {
          if (err) {
            data[0] = "No se pudo obtener el archivo, intente de nuevo";
          } else {
            newL = rowCount;
            rows.forEach((element) => {
              data.push(element[0].value);
            });
          }
        });

        await connection.execSql(request);
      } else if (destination == "material") {
        var statment = "SELECT id,name,path FROM tiktok.dbo.media WHERE destination='" + destination + "';";
        const request = await new tedious.Request(statment, function (err, rowCount, rows) {
          if (err) {
            data[0] = "No se pudo obtener el archivo, intente de nuevo";
          } else {
            newL = rows.length;
            rows.forEach((element, index1) => {
              var aux = [];
              rows[index1].forEach((element, index2) => {
                aux[index2] = element.value;
              });
              data.push(aux);
            });
          }
        });

        await connection.execSql(request);
      } else if (destination == "rs") {
        var statment;
        if (statement.role == 1) {
          statment = "SELECT id,name,path FROM tiktok.dbo.media WHERE destination='rsA';";
        } else {
          statment = "SELECT id,name,path FROM tiktok.dbo.media WHERE destination='rsA' or destination='rsS';";
        }
        const request = await new tedious.Request(statment, function (err, rowCount, rows) {
          if (err) {
            data[0] = "No se pudo obtener el archivo, intente de nuevo";
          } else {
            newL = rows.length;
            rows.forEach((element, index1) => {
              var aux = [];
              rows[index1].forEach((element, index2) => {
                aux[index2] = element.value;
              });
              data.push(aux);
            });
          }
        });
        await connection.execSql(request);
      }else if (destination == "tips") {
        var statment = "SELECT id,name,path FROM tiktok.dbo.media WHERE destination='" + destination + "';";
        
        const request = await new tedious.Request(statment, function (err, rowCount, rows) {
          if (err) {
            data[0] = "No se pudo obtener el archivo, intente de nuevo";
          } else {
            newL = rows.length;
            rows.forEach((element, index1) => {
              var aux = [];
              rows[index1].forEach((element, index2) => {
                aux[index2] = element.value;
              });
              data.push(aux);
            });
          }
        });
        await connection.execSql(request);
      }

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
      var statment = "SELECT path FROM tiktok.dbo.media WHERE id=" + imageId + ";";

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

    helpers.insertMedia = async (media) => {
      global.connected = 1;
      var data = [];
      var statment = "INSERT INTO tiktok.dbo.media (name, path, type, destination) VALUES ('" + media.name + "','" + media.path + "','" + media.type + "','" + media.destination + "');";

      const request = await new tedious.Request(statment, function (err, rowCount, rows) {
        if (err) {
          data[0] = "No se pudo obtener el archivo, intente de nuevo";
        } else {
          data[0] = "Media insertada";
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

    helpers.selectByPath = async (path) => {
      global.connected = 1;
      var data = [];
      var statment = "SELECT id FROM tiktok.dbo.media WHERE path='" + path + "';";
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

    helpers.selectPDF = async (id) => {
      global.connected = 1;
      var data = [];
      var statment = "SELECT path FROM tiktok.dbo.media WHERE id='" + id + "';";
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

    helpers.deleteById = async (id) => {
      global.connected = 1;
      var data = [];
      var statment = "DELETE FROM tiktok.dbo.media WHERE id='" + id + "';";
      const request = await new tedious.Request(statment, function (err, rowCount, rows) {
        if (err) {
          data[0] = "No se pudo obtener el archivo, intente de nuevo";
        } else {
          data[0] = "Archivo eliminado";
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

helpers.uploadImage = async (req, res) => {
  global.connected = 1;
  let message = {};
  if (req.files == {}) {
    message = await { status: "No se pudo cargar el archivo" };
  } else {
    try {
      var file_path = await req.files.file.path;
      var file_split = await file_path.split("\\");
      var file_sName = await file_split[2];
      var sName_split = await file_sName.split(".");
      var file_ext = await sName_split[1];
      var destination = await "home";
      let auxpath = file_path.split("\\");
      let auxext = auxpath[3].split(".");
      let auxreadir = "./public/upload";
      if (auxpath.length > 3) {
        file_path = auxpath[1] + "\\" + auxpath[2] + "\\" + auxpath[3];
        file_ext = auxext[1];
        file_sName = auxpath[3];
        auxreadir = "../public/upload";
      }
      
      if (file_ext != "gif" && file_ext != "GIF") {
        await fs.unlink(file_path, async (err) => {
          message = await { status: "La extensión no es soportada" };
        });
      } else {
        const media = {
          id: req.params.id,
          path: file_path,
          type: file_ext,
          name: file_sName,
        };
        const update = await helpers.updateMedia(media);
        if (update != "Media actualizada") {
          message = await { status: update };
        } else {
          const refreshMedia = await helpers.selectAllMedia(destination);
          let error = false;
          await fs.readdir(auxreadir, async (err, files) => {
            await files.forEach(async (element) => {
              if (refreshMedia.indexOf(element) == -1) {
                let toDelete = path.join(__dirname, "..", "public", "upload", element);
                try {
                  fs.unlinkSync(toDelete);
                } catch (error) {
                  error = await true;
                  message = await { status: "Intentelo de nuevo" };
                }
              }
            });
            if (error == false) {
              message = await { status: "Media actualizada" };
            }
          });
        }
      }
    } catch (error) {
      global.connected = 0;
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

helpers.uploadPDFMaterial = async (req, res) => {
  global.connected = 1;
  let message = {};
  if (req.files.file == undefined) {
    message = await { status: "No existe archivo" };
  } else {
    if (req.files.file.size == 0) {
      message = await { status: "Archivo vacio" };
    } else {
      try {
        var file_path = await req.files.file.path;
        var file_split = await file_path.split("\\");
        var file_sName = await req.files.file.originalFilename;
        var sName_split = await file_sName.split(".");
        var file_ext = await sName_split[1];
        var destination = await "material";
        let auxpath = file_path.split("\\");
        let auxext = auxpath[3].split(".");
        if (auxpath.length > 3) {
          file_path = auxpath[1] + "\\" + auxpath[2] + "\\" + auxpath[3];
          file_ext = auxext[1];
        }
        if (file_ext != "pdf" && file_ext != "PDF") {
          await fs.unlink(file_path, async (err) => {
            message = await { status: "Extensión incorrecta" };
          });
        } else {
          const media = {
            path: file_path,
            type: file_ext,
            name: file_sName,
            destination: destination,
          };
          message = { status: media };

          const update = await helpers.insertMedia(media);
          if (update[0] == "Media insertada") {
            const id = await helpers.selectByPath(media.path);
            media.id = id[0];
            message = { status: "Archivo cargado" };
          } else {
            message = { status: "No se pudo cargar el archivo" };
          }
        }
      } catch (error) {
        global.connected = 0;
        message = { status: error };
      }
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
helpers.uploadPDFTips = async (req, res) => {
  global.connected = 1;
  let message = {};
  if (req.files.file == undefined) {
    message = await { status: "No existe archivo" };
  } else {
    if (req.files.file.size == 0) {
      message = await { status: "Archivo vacio" };
    } else {
      try {
        var file_path = await req.files.file.path;
        var file_split = await file_path.split("\\");
        var file_sName = await req.files.file.originalFilename;
        var sName_split = await file_sName.split(".");
        var file_ext = await sName_split[1];
        var destination = await "tips";
        let auxpath = file_path.split("\\");        
        if (auxpath.length > 3) {
          let auxext = auxpath[3].split(".");
          file_path = auxpath[1] + "\\" + auxpath[2] + "\\" + auxpath[3];
          file_ext = auxext[1];
        }
        if (file_ext != "pdf" && file_ext != "PDF") {
          await fs.unlink(file_path, async (err) => {
            message = await { status: "Extensión incorrecta" };
          });
        } else {
          const media = {
            path: file_path,
            type: file_ext,
            name: file_sName,
            destination: destination,
          };
          message = { status: media };

          const update = await helpers.insertMedia(media);
          if (update[0] == "Media insertada") {
            const id = await helpers.selectByPath(media.path);
            media.id = id[0];
            message = { status: "Archivo cargado" };
          } else {
            message = { status: "No se pudo cargar el archivo" };
          }
        }
      } catch (error) {
        global.connected = 0;
        message = { status: error };
      }
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
helpers.uploadPDFRS = async (req, res) => {
  global.connected = 1;
  var UserId = await req.params.id;
  let message = {};
  if (req.files.file == undefined) {
    message = await { status: "No se pudo cargar el archivo" };
  } else {
    if (req.files.file.size == 0) {
      message = await { status: "Archivo vacio" };
    } else {
      try {
        var file_path = await req.files.file.path;
        var file_split = await file_path.split("\\");
        var file_sName = await req.files.file.originalFilename;
        var sName_split = await file_sName.split(".");
        var file_ext = await sName_split[1];
        var destination;
        let auxpath = file_path.split("\\");
        let auxext = auxpath[3].split(".");
        if (auxpath.length > 3) {
          file_path = auxpath[1] + "\\" + auxpath[2] + "\\" + auxpath[3];
          file_ext = auxext[1];
        }
        if (UserId == 1) {
          destination = await "rsA";
        }
        if (UserId == 2) {
          destination = await "rsS";
        }
        if (file_ext != "pdf" && file_ext != "PDF") {
          await fs.unlink(file_path, async (err) => {
            message = await { status: "Extensión incorrecta" };
          });
        } else {
          const media = {
            path: file_path,
            type: file_ext,
            name: file_sName,
            destination: destination,
          };
          message = { status: media };

          const update = await helpers.insertMedia(media);
          if (update[0] == "Media insertada") {
            const id = await helpers.selectByPath(media.path);
            media.id = id[0];
            message = { status: "Archivo cargado" };
          } else {
            message = { status: "No se pudo cargar el archivo" };
          }
        }
      } catch (error) {
        global.connected = 0;
        message = { status: error };
      }
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
helpers.getPDF = async (req, res) => {
  global.connected = 1;
  let message = {};
  let id = req.params.id;
  const file = await helpers.selectPDF(id);
  if (file != "No se pudo obtener el archivo, intente de nuevo") {
    let pathFile = path.join(__dirname, "..", file[0]);
    message = { file: pathFile };
  } else {
    message = { file: "No se pudo obtener el archivo" };
  }
  async function returnMessage() {
    return new Promise((resolve) => {
      setInterval(() => {
        if (message.file == undefined) {
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
helpers.deletePDF = async (req, res) => {
  global.connected = 1;
  let message = {};
  let id = req.params.id;
  const pathxxx = await helpers.selectPDF(id);
  const file = await helpers.deleteById(id);
  if (file != "No se pudo obtener el archivo, intente de nuevo") {
    let error = false;
    let toDelete = await path.join(__dirname, "..", pathxxx[0]);
    try {
      fs.unlinkSync(toDelete);
    } catch (error) {
      error = await true;
    }
    if (error) {
      message = { status: "No se pudo eliminar, intente de nuevo" };
    } else {
      message = { file: "Archivo eliminado" };
    }
  } else {
    message = { file: "No se pudo obtener el archivo" };
  }
  async function returnMessage() {
    return new Promise((resolve) => {
      setInterval(() => {
        if (message.file == undefined) {
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
  mainmedia: async () => {
    await resolveAfter();
    return helpers;
  },
};
