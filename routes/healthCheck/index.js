const express = require('express');
const router = express.Router();

const { healthCheck } = require("../../controllers/index");

router.get("/", healthCheck.healthCheck);

module.exports = router;