const express = require('express');
const router = express.Router();

const healthCheck = require("../controllers/index");

router.get("/", healthCheck);


module.exports = router;