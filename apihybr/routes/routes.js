const express = require("express");
const router = express.Router();
const course = require("./course.js");
const api = require("./controllers");
const path = require("path");
const { get } = require("http");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload2 = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    callback(null, true);
  },
});
router.get("/getInfoAdministrativo", api.getInfoAdministrativo);
router.post("/updateUserInfo", api.updateUserInfo);

router.post("/addUser", api.addUser);
router.post("/deleteUser", api.deleteUser);

router.get("/", course.getCourse);
router.get("/respostas/:lessonID", api.getRespostasGabarito);
router.get("/admlogin", api.getLoginScreen);
router.get("/getinfocourses/:escola", api.getInfoCourses);
router.get("/administrativo", api.admadministrativo);
router.get("/adicionar", api.admadicionar);
router.get("/acessar", api.admacessar);
router.get("/token", api.getToken);
router.get("/courses", api.getCourse);
router.get("/test", api.getTest);
router.get("/provao", api.getProvao);
router.get("/validate", api.validateQuestion);
router.get("/penseresponda", api.getPenseResponda);
router.get("/gabarito/:userID/:courseID/:numAula", api.getGabarito);
router.get("/temScorm/:idCourses/:numAula/:idRegiao", api.getTemScorm);
router.get("/status", api.status);
router.post("/deleteGabarito", api.deleteGabarito);
router.post(
  "/uploadCourse/:course/:lesson/:region",
  upload2.array("file"),
  api.uploadCourse
);
router.post("/file/:userid/:lessonid", api.postFile);
router.post("/postFile", api.postFile);
router.post("/anotacao", api.postAnotacao);
router.post("/resposta", api.postResposta);
router.post("/admroutes", api.admroutes);
router.post("/createtoken", api.getCreateToken);
router.post("/createtokeneditor", api.getCreateTokenEditor);
router.post("/auth", api.auth);

module.exports = router;
