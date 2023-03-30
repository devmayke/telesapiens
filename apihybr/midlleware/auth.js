const express = require("express");
const app = express();
const cors = require("cors");
module.exports = (req, res, next) => {
  if (
    req.headers.authorization === "Bearer pR889Q6+6CI9VuF" ||
    req.url === "/status" ||
    req.url === "/token" ||
    req.url === "/teste" ||
    req.url === "/addcurso" ||
    req.url === "/admlogin" ||
    req.url === "/uploadCourse" ||
    req.url === "/createtoken" ||
    req.url === "/createtokeneditor" ||
    req.url === "/createtokenGeral" ||
    req.url === "/getInfoAdministrativo"
  ) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
    );
    app.use(cors());
    next();
  } else {
    res.status(401).json({ msg: "Não autorizado" });
  }
};
