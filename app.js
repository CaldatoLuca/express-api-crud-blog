//CREAZIONE APP
const express = require("express");
const app = express();

//Importo il router
const postRouter = require("./routers/postRouter");
const morgan = require("morgan");

//Importo middlaware
const notFound = require("./middlewares/notFound");
const checkErrors = require("./middlewares/checkErrors");

//MIDDLEWARES
//visualizzazione file statici - img
app.use(express.static("public"));

app.use(morgan("dev"));

//body parsers
app.use(express.json()); //json
app.use(express.urlencoded({ extended: true })); //x-www-urlencoded - lascia true(analizza anche aray e oggetti)

//Rotta HOME
app.get("/", (req, res) => {
  res.send("<h1>Benvenuti nel mio blog</h1> <a href='/posts'>Lista Posts</a>");
});

//Rotte POSTS
app.use("/posts", postRouter);

//essendo alla fine delle rotte intervine
app.use(notFound);
//controllo errori finali
app.use(checkErrors);

//listen
app.listen(3000, () => {
  console.log(`Server pronto a http://localhost:3000`);
});
