const db = require("../db/db");
const jwt = require("jsonwebtoken");
const Axios = require("axios");
const path = require("path");
const fs = require("fs");
const http = require("http");
require("dotenv").config();
global.atob = require("atob");
global.btoa = require("btoa");

//////////////////////////

var DecompressZip = require("decompress-zip");
const { Console } = require("console");

const timeout_ms = 10000;

const make_log = (rota, err) => {
  if (err) {
    err.route = rota;
    err.date = new Date().toLocaleString();
    fs.appendFile("../db.log", JSON.stringify(err) + ",\n\n", function (err_) {
      if (err_) console.log("Erro ao salvar log!");
    });
  }
};

/////////

module.exports = {
  getInfoAdministrativo: (req, res) => {
    querySelect = `SELECT * FROM Administrativo`;
    db.query({ sql: querySelect, timeout: timeout_ms }, (err, result) => {
      if (!err) {
        res.status(200).json(result);
      } else {
        make_log(req.url, err);
        res.status(200).json(err);
      }
    });
  },

  deleteUser: (req, res) => {
    let { id } = req.body;
    let queryDelete = `DELETE FROM Administrativo WHERE id = ${id}`;
    db.query({ sql: queryDelete, timeout: timeout_ms }, (err, result) => {
      if (!err) {
        res.status(200).json({ result, status: "success" });
      } else {
        make_log(req.url, err);
        res.status(200).json(err);
      }
    });
  },

  addUser: (req, res) => {
    try {
      let { username } = req.body;
      let { password } = req.body;
      let { role } = req.body;

      const queryIsHaveUser = `SELECT COUNT(username) from Administrativo where username = '${username}'`
      let isHaveUser = false
      db.query(queryIsHaveUser, [], (err, result) => {

        if (err) {
          console.log(err)
        } else {         
          isHaveUser = result[0]['COUNT(username)'] > 0 ? true : false     
          if (isHaveUser) {
            res.status(200).json({ fail: true })
          } else {
            let queryInsert = `INSERT INTO Administrativo (username, password, role) VALUES ('${username}', '${password}', '${role}')`;
            db.query({ sql: queryInsert, timeout: timeout_ms }, (err, result) => {
              if (!err) {
                res.status(200).json({ status: "success", result });
              } else {
                make_log(req.url, err);
                res.status(200).json(err);
              }
            })
          }
        }
      })
    }
    catch (e) {
      console.log(e)
    }
  },

  updateUserInfo: (req, res) => {

    try {
      var { id } = req.body;
      var { new_username } = req.body;
      var { new_password } = req.body;
      var { new_role } = req.body;
      const queryIsHaveUser = `SELECT COUNT(username) from Administrativo where username = '${new_username}' AND id != '${id}'`
      let isHaveUser = false
      db.query(queryIsHaveUser, [], (err, result) => {
        if (err) {
          console.log(err)
        } else {        
          isHaveUser = result[0]['COUNT(username)'] > 0 ? true : false         
          if (isHaveUser) {
            res.status(200).json({ fail: true })
          } else {
            let queryUpdate = `UPDATE Administrativo SET username = '${new_username}', password = '${new_password}', role = '${new_role}' WHERE id = '${id}'`;
            db.query({ sql: queryUpdate, timeout: timeout_ms }, (err, result) => {
              if (!err) {
                return res.status(200).json(result);
              } else {
                make_log(req.url, err);
                return res.status(200).json(err);
              }
            })
          }
        }
      })
    }
    catch (e) {
      console.log(e)
    }
  },

  admroutes: (req, res) => {
    // console.log(req.body);
    let body_user = req.body.user;
    let body_password = req.body.password;
    let mode = req.body.mode;

    const query_users = `SELECT role from Administrativo where username = '${body_user}' and password = '${body_password}'`;

    const getData = async () => {
      return new Promise((resolve, reject) => {
        db.query(query_users, [], (err, result) => {
          if (err) {
            make_log("admroutes", err);
            console.log(err);
            res.status(500).json({
              msg: "Erro ao consultar banco de dados tabela Administrativo",
            });
          } else {
            // console.log("RESULTADO: ", result);
            resolve(result);
          }
        });
      });
    };

    getData().then((result) => {
      let incorrectPassword = {
        status: "error",
        message: "Usuário ou senha incorretos",
        redirect: "Unauthorized",
        permission: "Unauthorized",
      };

      if (result.length === 0) return res.send(incorrectPassword);

      let role = result[0].role;
      // console.log("ROLE: ", role);
      if (role === "admin" || role === "master") {
        handleRequestsAdmins(role);
      } else if (role === "viewer") {
        handleRequestsUsers(role);
      }

      // let admins = [
      //   "@moveedu01",
      //   "@moveedu02",
      //   "@moveedu03",
      //   "@moveedu04",
      //   "@moveedu05",
      // ];
      // let users = [
      //   "@visitante01",
      //   "@visitante02",
      //   "@visitante03",
      //   "@visitante04",
      //   "@visitante05",
      // ];
      // let admin_passwords = [
      //   "3Q6WJr2B",
      //   "lr#K1Z91",
      //   "k2i#919T",
      //   "0h61Qz!V",
      //   "zB33@5Af",
      // ];
      // let users_passwords = [
      //   "c6BWNL#8",
      //   "3udb3A@P",
      //   "A@ULFchz",
      //   "57&@TLm3",
      //   "Tw14c8&@",
      // ];

      // try {
      //   var { user, mode, password } = req.body;
      //   if (user && mode && password) {
      //     if (admins.includes(user)) {
      //       let position = admins.indexOf(user);
      //       if (admin_passwords[position].includes(password)) {
      //         handleRequestsAdmins();
      //       } else {
      //         res.send(incorrectPassword);
      //       }
      //     } else if (users.includes(user)) {
      //       let position = users.indexOf(user);
      //       if (users_passwords[position].includes(password)) {
      //         handleRequestsUsers();
      //       } else {
      //         res.send(incorrectPassword);
      //       }
      //     } else {
      //       res
      //         .status(401)
      //         .cookie(`auth`, `${btoa("false")}`)
      //         .json({
      //           mode: "",
      //           redirect: "Unauthorized",
      //           permission: "Unauthorized",
      //           message: "Usuário ou senha incorretos",
      //         });
      //     }
      //   } else {
      //     throw new Error("Prencha todos os campos");
      //   }
      // } catch (e) {
      //   res.status(200).json({ msg: e.message });
      // }

      function handleRequestsAdmins(l_role) {
        switch (mode) {
          case "add_course":
            return res.status(200).json({
              mode: mode,
              redirect: "/api/adicionar",
              permission: l_role,
              cookieMode: `mode=${btoa(mode)}`,
              cookiePermission: `permission=${btoa(l_role)}`,
            });
          case "edit_course":
            jwt.sign({ logged: "logged" }, "pR889Q6+6CI9VuF", (err, token) => {
              return res.status(200).json({
                mode: mode,
                redirect:
                  (process.env.EDITOR_URL || "https://editor.moveedu.com.br") +
                  `/${token}`,
                permission: l_role,
                cookieMode: `mode=${btoa(mode)}`,
                cookiePermission: `permission=${btoa(l_role)}`,
              });
            });
            break;
          case "view_course":
            return res.status(200).json({
              mode: mode,
              redirect: "/api/acessar",
              permission: l_role,
              cookieMode: `mode=${btoa(mode)}`,
              cookiePermission: `permission=${btoa(l_role)}`,
            });
          case "register_user":
            if (role === "master") {
              return res.status(200).json({
                mode: mode,
                redirect: "/api/administrativo",
                permission: l_role,
                cookieMode: `mode=${btoa(mode)}`,
                cookiePermission: `permission=${btoa(l_role)}`
              });
            } else {
              return res.status(401).json({
                mode: "",
                redirect: "Unauthorized",
                permission: l_role,
                message: "Você não tem autorização para acessar esta página",
              })
            }

          default:
            return res.redirect("/api/admlogin");
        }
      }
      function handleRequestsUsers(l_role) {
        switch (mode) {
          case "add_course":
            return res.status(401).json({
              mode: mode,
              redirect: "Unauthorized",
              permission: l_role,
              message: "Você não tem autorização para acessar esta página",
            });
          case "edit_course":
            return res.status(401).json({
              mode: mode,
              redirect: "Unauthorized",
              permission: l_role,
              message: "Você não tem autorização para acessar esta página",
            });
          case "view_course":
            return res.status(200).json({
              mode: mode,
              redirect: "/api/acessar",
              permission: l_role,
              cookieMode: `mode=${btoa(mode)}`,
              cookiePermission: `permission=${btoa(l_role)}`,
            });
          case "register_user":
            return res.status(200).json({
              mode: mode,
              redirect: "Unauthorized",
              permission: l_role,
              cookieMode: `mode=${btoa(mode)}`,
              cookiePermission: `permission=${btoa(l_role)}`
            })

          default:
            return res.redirect("/api/admlogin");
        }
      }
    });
  },

  admadministrativo: (req, res) => {
    res.sendFile(__dirname + "/_administrativo/administrativo.html");
  },
  getLoginScreen: (req, res) => {
    res.sendFile(__dirname + "/_login/login.html");
  },
  admadicionar: (req, res) => {
    res.sendFile(__dirname + "/_addCourse/addcourse.html");
  },
  admacessar: (req, res) => {
    res.sendFile(__dirname + "/_courseAccess/courseaccess.html");
  },
  getInfoCourses: (req, res) => {
    let { escola } = req.params;

    let querySelect = ``;

    if (escola == "99") {
      querySelect = `SELECT courseName, idCourses FROM Courses ORDER BY courseName`;
    } else {
      querySelect = `SELECT courseName, idCourses FROM Courses WHERE escola = ${escola} ORDER BY courseName`;
    }

    db.query({ sql: querySelect, timeout: timeout_ms }, (err, result) => {
      if (!err) {
        res.status(200).json(result);
      } else {
        make_log(req.url, err);
        res.status(200).json(err);
      }
    });
  },

  getTemScorm: (req, res) => {
    const { idCourses } = req.params;
    const { numAula } = req.params;
    const { idRegiao } = req.params;

    console.log(idCourses, numAula, idRegiao);
    db.query(
      {
        sql: `SELECT scorm1, scorm2, scorm3 FROM Lessons WHERE numAula = ? and courseID = ?`,
        timeout: timeout_ms,
      },
      [numAula, idCourses],
      (err, result) => {
        if (err) {
          console.log(err);
          make_log(req.url, err);
          res.status(200).json(err);
        } else {
          res.status(200).json(result[0]);
        }
        //console.log(result);
      }
    );
  },

  getRespostasGabarito: (req, res) => {
    const { lessonID } = req.params;
    const sqlSelect = `SELECT JSON_ARRAYAGG(correctAlternative) as respostas from Questions where lessonID = ? and category = 1`;
    db.query(
      { sql: sqlSelect, timeout: timeout_ms },
      [lessonID],
      (err, result) => {
        if (err) {
          console.log(err);
          make_log(req.url, err);
          res.status(200).json(err);
        } else {
          res.status(200).json(result);
        }
      }
    );
  },

  postAnotacao: (req, res) => {
    const { url, bodyAnotacao, tipo } = req.body;
    function listarAnotacao() {
      Axios.post(url, bodyAnotacao, {
        auth: {
          username: "TeleSapiens",
          password: "T&leS@p13n$",
        },
      })
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((err) => {
          console.log(err);
          make_log(req.url, err);
          res.status(200).json(err);
        });
    }
    listarAnotacao();
  },

  ///////////////////////////////////////////////////////////////

  status: async (req, res) => {
    let log = {};

    try {
      let result_app = await Axios.get("http://" + process.env.DOMAIN);

      if (result_app.status == 200) {
        log.status_appaula = "OK";
      }
    } catch (err) {
      if (process.env.DOMAIN !== undefined) {
        log.status_appaula = "Conexão com o appaula falhou";
      } else {
        log.status_appaula = "Variável de ambiente DOMAIN não definida";
      }
    }

    let query_test = `SELECT 1 + 1 AS solution`;
    db.query({ sql: query_test, timeout: timeout_ms }, (err, result) => {
      if (err) {
        make_log(req.url, err);
      }
      if (result?.[0].solution == 2) {
        log.status_db = "OK";
      } else {
        log.status_db = "Conexão com o banco de dados falhou";
      }

      log.status_api = "OK";
      res.status(200).json(log);
    });
  },

  uploadCourse: async (req, res) => {
    const courseID = req.params.course;
    const lessonID = req.params.lesson;
    const regionID = req.params.region;

    ////////// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    if (
      (req.files[0] != undefined &&
        req.files[0] != null &&
        req.files[0].mimetype == "application/zip") ||
      req.files[0].mimetype == "application/x-zip-compressed"
    ) {
      // extract(req.files[0].path, { dir: '/Users/nectar/GitHub/telesapiens-workspace/aluno/public/teorico/' + "curso" + courseID + "_aula" + lessonID + "_regiao" + regionID }, function (err) {
      let sourcefile = req.files[0].path;
      let targetfolder =
        //  path.join(
        // __dirname,
        // "../../AppAluno/public/teorico/" +
        "/mnt/efs/public/teorico/" +
        "curso" +
        courseID +
        "_aula" +
        lessonID +
        "_regiao" +
        regionID;
      // );
      try {
        var unzipper = new DecompressZip(sourcefile);

        unzipper.on("error", function (err) {
          console.log("Erro ao extrair o arquivo: ", err);
        });

        unzipper.on("progress", function (fileIndex, fileCount) {
          // console.log("Extracted file " + (fileIndex + 1) + " of " + fileCount);
        });

        unzipper.extract({
          path: targetfolder,
          filter: function (file) {
            return file.type !== "SymbolicLink";
          },
        });

        unzipper.on("extract", function (log) {
          // console.log("Extracted files: " + req.files.length);
          // console.log("Finished extracting");

          //delete sourcefile
          // console.log("sourceFile: ", sourcefile);
          fs.unlinkSync(sourcefile, (err) => {
            if (err) {
              console.log(err);
              make_log(req.url, err);
              res.status(200).json(err);
            }
          });

          db.query(
            {
              sql: `UPDATE Lessons SET scorm${regionID} = 1 WHERE numAula = ? and courseID = ?`,
              timeout: timeout_ms,
            },
            [lessonID, courseID],
            (err, result) => {
              // db.query(string_query, [lessonID, courseID], (err, result) => {
              if (err) {
                console.log(err);
                make_log(req.url, err);
                res.status(200).json(err);
              } else {
                console.log("passou pela atualização do scorm com sucesso");
                res.send({
                  upload: true,
                  files: req.files,
                });
              }
            }
          );
        });
      } catch (err) {
        // handle any errors
        console.log(err);
        res.status(500).json({
          upload: false,
          files: req.files,
          message: "Erro ao descompactar arquivo",
        });
      }
    } else {
      make_log(req.url, { error: "Arquivo com formato inválido" });
      res.status(500).json({
        upload: false,
        files: req.files,
        message: "Arquivo com formato inválido",
      });
    }
  },

  ////////////////////////////////////////////////////////

  getToken: (req, res) => {
    res.sendFile(__dirname + "/token.html");
  },

  getCreateToken: (req, res) => {
    const { url, curso, aula, atividade, regiao } = req.body;
    //console.log(aula, atividade, regiao);
    jwt.sign(
      {
        IdMateria: parseInt(curso),
        IdAula: parseInt(aula),
        IdAluno: 11711856,
        IdAtividade: parseInt(atividade),
        IdRegiao: parseInt(regiao),
        Tela: "",
        Tentativa: 1,
        // UrlArquivosAtividadePratica: "https://sistemas.moveedu.com.br/hub/ArquivoBusiness/Salvar?AplicacaoId=6&token=P%2b9YggQadFfqrQI%2b%2fSD014Nx6CXfSAt%2fV6lwQBDkpR889Q6%2b6CI9VuFRRXXn5mSa3pC15rHOgeiMaKpgYyTCHw%3d%3d&CodigoContratoCursoMateria=11711856&pasta=Aula1/Virtuais",
        UrlArquivosAtividadePratica:
          "https://sistemas.moveedu.com.br/hub/api/academico/SalvarArquivo/6/UCs5WWdnUWFkRmZxclFJKy9TRDAxNE54NkNYZlNBdC9WNmx3UUJEa3BSODg5UTYrNkNJOVZ1RlJSWFhuNW1TYTNwQzE1ckhPZ2VpTWFLcGdZeVRDSHc9PQ==/17887941/Aula3_Virtuais",
        // UrlArquivosAtividadePratica: "https://sistemas.moveedu.com.br/hub/api/academico/SalvarArquivo/6/UCs5WWdnUWFkRmZxclFJKy9TRDAxNE54NkNYZlNBdC9WNmx3UUJEa3BSODg5UTYrNkNJOVZ1RlJSWFhuNW1TYTNwQzE1ckhPZ2VpTWFLcGdZeVRDSHc9PQ==/25270406/Aula11_Virtuais",
        // UrlArquivosAtividadePratica: "https://714e-191-13-62-20.ngrok.io/api/academico/SalvarArquivo/6/UCs5WWdnUWFkRmZxclFJKy9TRDAxNE54NkNYZlNBdC9WNmx3UUJEa3BSODg5UTYrNkNJOVZ1RlJSWFhuNW1TYTNwQzE1ckhPZ2VpTWFLcGdZeVRDSHc9PQ==/25270406/Aula11_Virtuais",
        UrlApontamentos:
          "https://sistemas.moveedu.com.br/hub/api/academico/ApontamentoAula/6/UCs5WWdnUWFkRmZxclFJKy9TRDAxNE54NkNYZlNBdC9WNmx3UUJEa3BSODg5UTYrNkNJOVZ1RlJSWFhuNW1TYTNwQzE1ckhPZ2VpTWFLcGdZeVRDSHc9PQ==/11711856/123456/13/2/2/637661780909749946/0/##Tela/1/null",
        UrlEncerramentoAula:
          "https://sistemas.moveedu.com.br/hub/EncerramentoAula",
        UrlAnotacaoInserir:
          "https://services.moveedu.com.br/api/portaldoaluno/inserirAnotacao",
        JsonBodyAnotacaoInserir:
          '{"CodigoContrato":1618790,"CodigoMateria":3559,"Tipo":"Aula","Parceiro":"TeleSapiens","Titulo":"Empreendedorismo","Descricao":"##Anotacao"}',
        UrlAnotacaoAlterar:
          "https://services.moveedu.com.br/api/portaldoaluno/alterarAnotacao",
        JsonBodyAnotacaoAlterar:
          '{"idBlocoNota":"##idBlocoNota","Parceiro":"TeleSapiens","Titulo":"Empreendedorismo","Descricao":"##Anotacao"}',
        UrlAnotacaoListar:
          "https://services.moveedu.com.br/api/portaldoaluno/listarAnotacao",
        JsonBodyAnotacaoListar:
          '{"CodigoContrato":1618790, "Tipo":"Aula", "Parceiro":"TeleSapiens"}',
      },
      "pR889Q6+6CI9VuF",
      (err, token) => {
        console.log(token);
        jwt.verify(token, "pR889Q6+6CI9VuF", (err, tokenverify) => {
          console.log(tokenverify);
        });

        // res.redirect(`https://appaula.prepara.com.br/${token}`)
        res.redirect(`${url}/${token}`);
        // res.redirect(`${window.location.origin}/${token}`)
      }
    );
  },

  getCreateTokenEditor: (req, res) => {
    const { url, curso, aula, atividade, regiao } = req.body;
    console.log(`vindo do editor:`, url, curso, aula, atividade, regiao);
    jwt.sign(
      {
        IdMateria: parseInt(curso),
        IdAula: parseInt(aula),
        IdAluno: 11711856,
        IdAtividade: parseInt(atividade),
        IdRegiao: parseInt(regiao),
        Tela: "",
        Tentativa: 1,
        // UrlArquivosAtividadePratica: "https://sistemas.moveedu.com.br/hub/ArquivoBusiness/Salvar?AplicacaoId=6&token=P%2b9YggQadFfqrQI%2b%2fSD014Nx6CXfSAt%2fV6lwQBDkpR889Q6%2b6CI9VuFRRXXn5mSa3pC15rHOgeiMaKpgYyTCHw%3d%3d&CodigoContratoCursoMateria=11711856&pasta=Aula1/Virtuais",
        UrlArquivosAtividadePratica:
          "https://sistemas.moveedu.com.br/hub/api/academico/SalvarArquivo/6/UCs5WWdnUWFkRmZxclFJKy9TRDAxNE54NkNYZlNBdC9WNmx3UUJEa3BSODg5UTYrNkNJOVZ1RlJSWFhuNW1TYTNwQzE1ckhPZ2VpTWFLcGdZeVRDSHc9PQ==/17887941/Aula3_Virtuais",
        // UrlArquivosAtividadePratica: "https://sistemas.moveedu.com.br/hub/api/academico/SalvarArquivo/6/UCs5WWdnUWFkRmZxclFJKy9TRDAxNE54NkNYZlNBdC9WNmx3UUJEa3BSODg5UTYrNkNJOVZ1RlJSWFhuNW1TYTNwQzE1ckhPZ2VpTWFLcGdZeVRDSHc9PQ==/25270406/Aula11_Virtuais",
        // UrlArquivosAtividadePratica: "https://714e-191-13-62-20.ngrok.io/api/academico/SalvarArquivo/6/UCs5WWdnUWFkRmZxclFJKy9TRDAxNE54NkNYZlNBdC9WNmx3UUJEa3BSODg5UTYrNkNJOVZ1RlJSWFhuNW1TYTNwQzE1ckhPZ2VpTWFLcGdZeVRDSHc9PQ==/25270406/Aula11_Virtuais",
        UrlApontamentos:
          "https://sistemas.moveedu.com.br/hub/api/academico/ApontamentoAula/6/UCs5WWdnUWFkRmZxclFJKy9TRDAxNE54NkNYZlNBdC9WNmx3UUJEa3BSODg5UTYrNkNJOVZ1RlJSWFhuNW1TYTNwQzE1ckhPZ2VpTWFLcGdZeVRDSHc9PQ==/11711856/123456/13/2/2/637661780909749946/0/##Tela/1/null",
        UrlEncerramentoAula:
          "https://sistemas.moveedu.com.br/hub/EncerramentoAula",
        UrlAnotacaoInserir:
          "https://services.moveedu.com.br/api/portaldoaluno/inserirAnotacao",
        JsonBodyAnotacaoInserir:
          '{"CodigoContrato":1618790,"CodigoMateria":3559,"Tipo":"Aula","Parceiro":"TeleSapiens","Titulo":"Empreendedorismo","Descricao":"##Anotacao"}',
        UrlAnotacaoAlterar:
          "https://services.moveedu.com.br/api/portaldoaluno/alterarAnotacao",
        JsonBodyAnotacaoAlterar:
          '{"idBlocoNota":"##idBlocoNota","Parceiro":"TeleSapiens","Titulo":"Empreendedorismo","Descricao":"##Anotacao"}',
        UrlAnotacaoListar:
          "https://services.moveedu.com.br/api/portaldoaluno/listarAnotacao",
        JsonBodyAnotacaoListar:
          '{"CodigoContrato":1618790, "Tipo":"Aula", "Parceiro":"TeleSapiens"}',
      },
      "pR889Q6+6CI9VuF",
      (err, token) => {
        console.log(token);
        jwt.verify(token, "pR889Q6+6CI9VuF", (err, tokenverify) => {
          console.log(tokenverify);
        });
        res.status(200).json({ token });
        // res.redirect(`https://appaula.prepara.com.br/${token}`)
        // res.redirect(`${window.location.origin}/${token}`)
      }
    );
  },

  auth: (req, res) => {
    const { token } = req.body;
    // let token = jwt.sign({userID:'1', lessonID:'1'}, "keysecret", {expiresIn:"5m"})
    // console.log("token vindo do react na rota auth", token);

    if (token !== undefined && token !== null) {
      jwt.verify(token, `pR889Q6+6CI9VuF`, (err, dataJWT) => {
        if (err) {
          // console.log("Erro ao obter dados do token,", err.message);
          res.status(500).json({ token: `unlogged` });
        } else {
          // console.log("Dados do token: ", dataJWT);
          let exp = dataJWT.exp * 1000;
          let date = new Date(exp);
          // console.log(
          //   "Hora atual:      ",
          //   new Date().toLocaleTimeString("pt-BR")
          // );
          // console.log("Token expira em: ", date.toLocaleTimeString("pt-BR"));
          res.json({ token: dataJWT });
        }
      });
    } else {
      res.send("token não chegou na rota auth");
    }
  },

  //////////////////////////////////////////////////////////////////////////////////////// GET
  /////////////////////////////////////////////////////////////////////// GET
  /////////////////////////////////////////////////////// GET

  getCourse: (req, res) => {
    const sqlSelect = `SELECT 
         JSON_OBJECT(
         'IdMateria', idCourses,
         'Nome do Curso', courseName)
      as Cursos FROM Courses`;

    db.query({ sql: sqlSelect, timeout: timeout_ms }, (err, result) => {
      //console.log(result)

      if (err) {
        console.log(err);
        make_log(req.url, err);
        res.status(200).json(err);
      } else {
        res.send(result);
      }
    });
  },

  deleteGabarito: (req, res) => {
    const { userID } = req.body;
    //console.log("VEIO ESTE USER ID", userID);
    db.query(
      {
        sql: `DELETE FROM Grades WHERE userID = ${userID}`,
        timeout: timeout_ms,
      },
      (err, result) => {
        if (err) {
          console.log(err);
          make_log(req.url, err);
          res.status(200).json(err);
        } else {
          //console.log(result);
          res.status(200).send(result);
          // res.send(result)
        }
      }
    );
  },

  getGabarito: (req, res) => {
    const userID = req.params.userID;
    const courseID = req.params.courseID;
    const numAula = req.params.numAula;
    db.query(
      {
        sql: `SELECT DISTINCT
        courseName as curso,
        lessonName as aula,
        nomeUser as aluno,

        (SELECT DISTINCT JSON_ARRAYAGG(
                                JSON_OBJECT(
                                'categoria', Questions.category,
    							'idQuestao', idQuestions, 
                                'nomeQuestao', questionName,
                                'alternativaCorreta', correctAlternative,
                    			'resposta', grade+1
                                ))FROM Questions LEFT JOIN Grades ON Lessons.idLessons = Questions.lessonID AND Grades.questionID = Questions.idQuestions AND Grades.userID = Users.idUsers WHERE Questions.category=1 and Lessons.idLessons = Questions.lessonID) 
        as questoes,  



        (SELECT COUNT(*) FROM Grades INNER JOIN  Questions  on Grades.questionID = Questions.idQuestions
            WHERE Grades.userID = Users.idUsers  AND Grades.grade+1 = Questions.correctAlternative AND Questions.category = 1 AND Lessons.idLessons = Questions.lessonID) 
		
                as acertos,



        (SELECT COUNT(*) FROM Questions WHERE Questions.lessonID = Lessons.idLessons AND Questions.category = 1)
                as numPerguntas,


        (SELECT COUNT(*) FROM Grades INNER JOIN  Questions  on Grades.questionID = Questions.idQuestions
            WHERE Grades.userID = Users.idUsers AND Lessons.idLessons = Questions.lessonID AND Questions.category = 1) / (SELECT COUNT(*) FROM Questions WHERE Questions.category = 1 AND Questions.lessonID = Lessons.idLessons) *100
                as progresso


        FROM Lessons
         join Questions on Lessons.idLessons = Questions.lessonID
            join Grades on Questions.idQuestions = Grades.questionID
            join Users on Grades.userID = Users.idUsers
            join Courses on Courses.idCourses = Lessons.courseID
    	   where idUsers = ? AND idCourses = ? AND idLessons = ?
                
                `,
        timeout: timeout_ms,
      },
      [userID, courseID, numAula],
      (err, result) => {
        if (err) {
          console.log(err);
          make_log(req.url, err);
          res.status(200).json(err);
        } else {
          res.json({ result });
        }
      }
    );
  },

  getTest: (req, res) => {
    const curso = req.query.curso;
    const aula = req.query.aula;
    const categoria = req.query.categoria;
    const sqlSelect = `SELECT	    courseName as courseName,
        courseDescription as courseDescription,
        idCourses as idCourse,
        bg1,
        bg2,
        bg3,
        bg4,
        cor1,
        cor2,
        cor3,
        cor4,
        filtro1,
        filtro2,
        filtro3,
        filtro4,
        (SELECT JSON_OBJECT(
                            'lessonDescription', lessonDescription,
                            'scorm1', scorm1,
                            'scorm2', scorm2,
                            'scorm3', scorm3,
                            'embed1', embed1,
                            'embed2', embed2,
                            'embed3', embed3,
                            'embed4', embed4,
                            'timer', timer,
                            'theme', theme,
                            'lessonName', lessonName,
                            'active', active,
                            'idLesson', idLessons,
                            'acesse', acesse,
                            'background', background,
                            'mm_avaliativo', mm_avaliativo,
                            'numAula', numAula,
                            'Questoes', (SELECT JSON_ARRAYAGG(
                                                    JSON_OBJECT(
                                                    'dica', dica,
                                                    'definicao', definicao,
                                                    'acesse', acesse,
                                                    'file', file,
                                                    'link', link,
                                                    'idQuestion', idQuestions,
                                                    'questionNameIntroContent', questionNameIntroContent,
                                                    'questionNameIntro', questionNameIntro,
                                                    'questionName', questionName,
                                                    'questionType', questionType,
                                                    'category', category,
                                                    'correctOrder', correctOrder,
                                                    'correctAlternative', correctAlternative,
                                                    'importante', importante,
                                                    'audio', audio,
                                                    'audioIntro', audioIntro,
                                                    'timerIntro', timerIntro,
                                                    'Questionimage', (SELECT JSON_ARRAYAGG(
                                                                            JSON_OBJECT(
                                                                            'questionImageName', imageName,    
                                                                            'File', TO_BASE64(file))) FROM Questionimages WHERE Questionimages.imagequestionID = Questions.idQuestions),
                                                    'Alternativas', (SELECT JSON_ARRAYAGG(
                                                                    JSON_OBJECT(
                                                                    'idAlternative', idAlternatives,
                                                                    'alternativeName', alternativeName,
                                                                    'audio', audio,
                                                                    'Images', (SELECT JSON_ARRAYAGG(
                                                                            JSON_OBJECT(
                                                                            'imageName', imageName,    
                                                                            'File', TO_BASE64(file) )
                                                                                                ) FROM Images WHERE Images.alternativeID = Alternatives.idAlternatives ))
                                                                    ) FROM Alternatives WHERE Alternatives.questionID = Questions.idQuestions ))
                                                    )FROM Questions WHERE Questions.lessonID = Lessons.idLessons AND category = (?)))
                            FROM Lessons WHERE Lessons.courseID = Courses.idCourses AND (numAula) = (?) )
     as Lessons FROM Courses WHERE (idCourses) =  (?)`;
    //  as Lessons FROM Courses WHERE (idCourses) =  (SELECT courseID FROM Lessons WHERE idLessons = (?) )`
    db.query(
      { sql: sqlSelect, timeout: timeout_ms },
      [categoria, aula, curso],
      (err, result) => {
        if (err) {
          console.log(err);
          make_log(req.url, err);
          res.status(200).json(err);
        } else {
          res.send(result);
        }
      }
    );
  },

  getProvao: (req, res) => {
    const curso = req.query.curso;
    const aula = req.query.aula;
    const categoria = req.query.categoria;
    const sqlSelect = `SELECT JSON_ARRAYAGG(JSON_OBJECT(
      'questionName', Questions.questionName,
      'questionType', Questions.questionType,
      'category', Questions.category,
      'correctOrder', Questions.correctOrder,
      'correctAlternative', Questions.correctAlternative,
      'importante', Questions.importante,
      'audio', Questions.audio,
      'audioIntro', Questions.audioIntro,
      'timerIntro', Questions.timerIntro,
      'idLesson', Questions.lessonID,
      'Alternativas', (SELECT JSON_ARRAYAGG(
                                    JSON_OBJECT(
                                    'idAlternative', idAlternatives,
                                    'alternativeName', alternativeName,
                                    'audio', audio
                                    )) FROM Alternatives WHERE Alternatives.questionID = Questions.idQuestions)
      )) AS Questions FROM Questions
JOIN Lessons ON Lessons.idLessons = Questions.lessonID
WHERE Questions.category = 1
AND Lessons.courseID = ?;`;
    //  as Lessons FROM Courses WHERE (idCourses) =  (SELECT courseID FROM Lessons WHERE idLessons = (?) )`
    db.query(
      { sql: sqlSelect, timeout: timeout_ms },
      [curso],
      (err, result) => {
        if (err) {
          console.log(err);
          make_log(req.url, err);
          res.status(200).json(err);
        } else {
          res.send(result);
        }
      }
    );
  },

  getPenseResponda: (req, res) => {
    const curso = req.query.curso;
    const aula = req.query.aula;
    const sqlSelect = `SELECT courseName as courseName,
        courseDescription as courseDescription,
        idCourses as idCourse,
        (SELECT JSON_OBJECT(
                            'lessonDescription', lessonDescription,
                            'embed1', embed1,
                            'embed2', embed2,
                            'embed3', embed3,
                            'embed4', embed4,
                            'timer', timer,
                            'theme', theme,
                            'lessonName', lessonName,
                            'active', active,
                            'idLesson', idLessons,
                            'background', background)
                           FROM Lessons WHERE Lessons.courseID = Courses.idCourses AND (numAula) = (?) )
     as Lessons FROM Courses WHERE (idCourses) = (?)`;
    //  as Lessons FROM Courses WHERE (idCourses) =  (SELECT courseID FROM Lessons WHERE idLessons = (?) )`
    db.query(
      { sql: sqlSelect, timeout: timeout_ms },
      [aula, curso],
      (err, result) => {
        if (err) {
          console.log(err);
          make_log(req.url, err);
          res.status(200).json(err);
        } else {
          res.send(result);
        }
      }
    );
  },

  //////////////////////////////////////////////////////////////////////////////////////// POST
  /////////////////////////////////////////////////////////////////////// POST
  /////////////////////////////////////////////////////// POST

  postFile: (req, res) => {
    const CodigoContratoCursoMateria = req.body.CodigoContratoCursoMateria;
    const Nome = req.body.Nome;
    const CaminhoFTP = req.body.CaminhoFTP;
    const Extensao = req.body.Extensao;
    const ArquivoBase64 = req.body.ArquivoBase64;

    if (ArquivoBase64) {
      const sqlInsert =
        "INSERT INTO Files (fileName, file, lessonID, alunoID) VALUES (?,?,?,?);";
      db.query(
        { sql: sqlInsert, timeout: timeout_ms },
        [Nome, ArquivoBase64, "1", CodigoContratoCursoMateria],
        (err, result) => {
          if (err) {
            console.log(err);
            make_log(req.url, err);
            res.status(200).json(err);
          } else {
            res.send("Arquivo Recebido");
          }
        }
      );
    }
  },

  postResposta: (req, res) => {
    const lessonIDatual = req.body.lessonIDatual;
    const userID = req.body.userID;
    const localStorage = req.body.localStorage;
    const categoria = req.body.categoria;

    let questionID;
    let resposta;

    const sqlCheckUser =
      "Select COUNT(*) as temAluno FROM Users Where Users.idUsers = ?";
    db.query(
      { sql: sqlCheckUser, timeout: timeout_ms },
      userID,
      (err, result) => {
        if (err) {
          console.log(err);
          make_log(req.url, err);
          res.send("Erro ao enviar resposta");
        } else {
          //console.log("aqui: ", JSON.stringify(result[0].temAluno));
          let temAluno = JSON.stringify(result[0].temAluno);
          if (temAluno === "0") {
            // console.log("Inserindo novo Auluno")
            const sqlInsertUser = "INSERT INTO Users (idUsers) VALUES (?)";
            db.query(
              { sql: sqlInsertUser, timeout: timeout_ms },
              [userID],
              (err, result) => {
                if (err) {
                  console.log(err);
                  make_log(req.url, err);
                  res.status(200).json(err);
                }
              }
            );
          }
        }
      }
    );

    localStorage.forEach((element, index) => {
      if (
        JSON.parse(element).resposta !== undefined &&
        lessonIDatual === JSON.parse(element).lessonID &&
        JSON.parse(element).userID === userID &&
        JSON.parse(element).category === categoria
      ) {
        values = JSON.parse(element);
        questionID = values.questionID;
        resposta = values.resposta;

        const sqlInsert =
          "INSERT INTO Grades (userID, questionID, grade, category) VALUES (?,?,?,?);";
        db.query(
          { sql: sqlInsert, timeout: timeout_ms },
          [userID, questionID, "" + resposta, categoria],
          (err, result) => {
            // console.log(result)
            if (err) {
              console.log(err);
              make_log(req.url, err);
              res.status(200).json(err);
            } else {
              if (localStorage.length == index + 1) {
                // console.log("RespostaENVIADA:", result);
                res.json({
                  msg: "respostas salvas com sucesso",
                  result: result,
                });
              }
            }
          }
        );
      }
    });
  },

  /////////////////////////////////////////////////////// VALIDADE

  validateQuestion: (req, res) => {
    const questionID = req.query.questionID;
    const userID = req.query.userID;
    const sqlSelect = `Select COUNT(*) as jaRespondido FROM Grades where questionID = (?) and userID = (?)`;
    db.query(
      { sql: sqlSelect, timeout: timeout_ms },
      [questionID, userID],
      (err, result) => {
        if (err) {
          console.log(err);
          make_log(req.url, err);
          res.status(200).json(err);
        } else {
          res.json(result);
        }
      }
    );
  },

  respondidas: (req, res) => {
    const questionID = req.query.questionID;
    const userID = req.query.userID;
    const sqlSelect = `Select COUNT(*) as jaRespondido FROM Grades where questionID = (?) and userID = (?)`;
    db.query(
      { sql: sqlSelect, timeout: timeout_ms },
      [questionID, userID],
      (err, result) => {
        if (err) {
          console.log(err);
          make_log(req.url, err);
          res.status(200).json(err);
        } else {
          res.json(result);
        }
      }
    );
  },
};
