const mysql = require("mysql2");
require("dotenv").config();
const fs = require("fs");
const util = require("util");

//////////// ////////////////////////////////////////////// AWS (env)
console.log( process.env.DB_HOST,)

var db_config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  connectionLimit: 100, //important
};

var db;
db = mysql.createPool(db_config); // Recreate the connection, since

// db.on("acquire", function (connection) {
//   console.log("Connection %d acquired", connection.threadId);
// });

db.on("connection", function (connection) {
  console.log("Connected to MySql db");
});

db.on("enqueue", function () {
  console.log("Waiting for available connection slot");
});

db.getConnection(function (err, connection) {
  if (err) {
    console.log("ERRO AO INICIAR CONEXÃO");
    err.route = "start connection";
    err.date = new Date().toLocaleString();
    fs.appendFile("../db.log", JSON.stringify(err) + ",\n\n", function (err_) {
      if (err_) console.log("Erro ao salvar log!");
    });
  }
});

module.exports = db;
