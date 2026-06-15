const express = require("express");
const postrouter = express.Router();

const postController = require("../controllers/postcontroller");
const upload = require("../middlewares/multer");

postrouter.get("/feed", postController.getFeed);
postrouter.get("/create_post",postController.getCreatePost);
postrouter.post("/create_post",upload.single("postImage"),postController.postCreatePost);
postrouter.post("/post/:id/comment", postController.addComment);

postrouter.post("/post/delete/:postId",postController.deletePost);
postrouter.post("/post/:id/like", postController.likePost);

module.exports = postrouter;