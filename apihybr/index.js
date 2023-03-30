const express = require("express");
const app = express();
const upload = require("express-fileupload");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes/routes");
const https = require("https");
const fs = require("fs");
const path = require("path");
const tls = require("tls");
require("dotenv").config();

app.use(
  session({
    secret: "ahdkshsnq133",
    cookie: {
      maxAge: 120000 * 24,
    },
    resave: {},
    saveUninitialized: {},
  })
);

// app.use(express.json({
//   limit: '300mb'
// }));

app.use("/api", express.static(path.join(__dirname, "public")));
app.use(bodyParser.json({ limit: "1000mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "1000mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.use(
  bodyParser.raw({
    type: "application/octet-stream",
    limit: "1000mb",
  })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  next();
});
app.use(cors());
app.use("/api", routes);

app.post("/upload", (req, res) => {
  console.log(req.body);
  res.json(req.body);
});

app.get("/teste", (req, res) => {
  res.sendFile(
    __dirname +
      "/Users/nectar/GitHub/telesapiens-workspace/apihybr/teorico/genially.html"
  );
});

app.post("/users/login", async (req, res) => {
  const user = users.find((user) => (user.name = req.body.name));

  if (user == null) {
    return res.status(400).send("Cannot find user");
  }

  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send("Success");
    } else {
      res.send("Not allowed");
    }
  } catch {
    res.status(500).send();
  }
});

app.use(upload({}));

// if (process.env.NODE_ENV !== "production") {
//   const ssl = tls.createSecureContext({
//     key: fs.readFileSync(
//       `${process.env.SSL_KEY}`
//       //process.env.KEY
//     ),
//     cert: fs.readFileSync(
//       `${process.env.SSL_CERT}`
//       //process.env.KEY
//     ),
//   });

//   const options = {
//     SNICallback: function (domain, cb) {
//       if (domain === process.env.DOMAIN) {
//         cb(null, ssl);
//       } else {
//         cb();
//       }
//     },
//   };

//   https
//     .createServer(options, app, (req, res) => {
//       res.writeHead(200);
//       res.end("hello world\n");
//     })
//     .listen(5000);
// } else if (true) {
//   app.listen(process.env.PORT || 5000, () => {
//     console.log("> running server");
//   });
// }

app.listen(process.env.PORT || 5000, () => {
  console.log("> running server");
});
