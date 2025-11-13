const express = require("express");
const router = express.Router();
const importController = require("../controller/import.controller");


// Define routes

router.post('/',  importController.importController);
router.get('/get_import_data',  importController.get_import_data);
module.exports = router;