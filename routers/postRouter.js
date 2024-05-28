//Importo express e creo il router
const express = require("express");
const router = express.Router();

//Importo il controller per richiamare i metodi
const postController = require("../controllers/postController");

//Middlewares
const checkDestroy = require("../middlewares/checkDestroy");

//Pagina lista con metodo index
router.get("/", postController.index);

//Store - creazione di un nuovo post
router.post("/", postController.store);

//Dettaglio post con metodo show
router.get("/:slug", postController.show);

//Dettaglio post con metodo show
router.delete("/:slug", checkDestroy, postController.destroy);

//Download con metodo download
router.get("/:slug/download", postController.download);

module.exports = router;
