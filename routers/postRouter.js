//Importo express e creo il router
const express = require("express");
const router = express.Router();

//Importo il controller per richiamare i metodi
const postController = require("../controllers/postController");

//Pagina lista con metodo index
router.get("/", postController.index);

//Pagina creazione, prima di slug altrimenti da slug non trovato. toglie dagli if con metodo create
router.get("/create", postController.create);

//Dettaglio post con metodo show
router.get("/:slug", postController.show);

//Download con metodo download
router.get("/:slug/download", postController.download);

module.exports = router;
