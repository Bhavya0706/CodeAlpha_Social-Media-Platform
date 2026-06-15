const express = require("express");
const userrouter = express.Router();
const upload = require("../middlewares/multer");

const userController = require("../controllers/usercontroller");

userrouter.get("/profile", userController.getProfile);
userrouter.post("/user/:id/follow", userController.followUser);


userrouter.get("/edit_profile", userController.getEditProfile);

userrouter.post(
  "/edit_profile",
  upload.single("profileImage"),
  userController.postEditProfile
);
module.exports = userrouter;