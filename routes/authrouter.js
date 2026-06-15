const express = require('express');
const authrouter =express.Router();
const authController = require('../controllers/authcontroller');


authrouter.get("/",authController.welcome);
authrouter.get("/login", authController.getLogin);
authrouter.post("/login", authController.postLogin);

authrouter.get("/register", authController.getRegister);
authrouter.post("/register", authController.postRegister);
authrouter.get("/logout", authController.logout);

module.exports = authrouter;