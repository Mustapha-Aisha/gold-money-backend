const express = require("express");
const router = express.Router();
const AuthController = require('../../controllers/users/auth.controller');
const validateToken = require("../../middlewares/validateToken");

router.post("/login", AuthController.userLogin);

router.post("/register", AuthController.createUser);

router.get("/user", validateToken, AuthController.currentUser);

router.patch("/forgot-password/:id", AuthController.forgotPassword);

module.exports = router;