const express = require('express');
const router = express.Router();

const authRoutes = require("./auth/index");
const healthRoutes = require("./healthCheck/index");

router.use("/", healthRoutes);
router.use("/auth", authRoutes);


module.exports = router;