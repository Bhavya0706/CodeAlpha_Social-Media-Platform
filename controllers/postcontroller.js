const Post = require("../models/Post");
const User = require("../models/User");

exports.getFeed = async (req, res) => {
    try {
      const type = req.query.type || "all";
      const currentUser = await User.findById(req.session.user.id);
  
      let posts;
  
      if (type === "following") {
        posts = await Post.find({
          user: { $in: currentUser.following },
        })
          .populate("user", "name profileImage") .populate("comments.user", "name profileImage")
          .sort({ createdAt: -1 });
      } else {
        posts = await Post.find()
          .populate("user", "name profileImage") .populate("comments.user", "name profileImage")
          .sort({ createdAt: -1 });
      }
  
      res.render("feed", {
        user: currentUser,
        posts,
        type
      });
  
    } catch (error) {
      console.log(error);
      res.redirect("/");
    }
  };


exports.postCreatePost = async (req, res) => {

    try {

        const { caption } = req.body;

        const imagePath =
            "/uploads/" + req.file.filename;

        const post = new Post({

            user: req.session.user.id,

            image: imagePath,

            caption
        });

        await post.save();

        res.redirect("/feed");

    } catch (error) {

        console.log(error);

        res.redirect("/create_post");
    }
};
exports.getCreatePost = (req, res) => {

    res.render("create_post");
};

exports.deletePost = async (req,res) => {

    try{

        await Post.findByIdAndDelete(
            req.params.postId
        );

        res.redirect("/profile");

    }catch(err){

        console.log(err);
        res.redirect("/profile");
    }
}

exports.likePost = async (req, res) => {
    try {
      const userId = req.session.user.id;
      const postId = req.params.id;
  
      const post = await Post.findById(postId);
  
      const alreadyLiked = post.likes.some(
        id => id.toString() === userId
      );
  
      if (alreadyLiked) {
        post.likes.pull(userId);
      } else {
        post.likes.push(userId);
      }
  
      await post.save();
  
      res.json({
        success: true,
        liked: !alreadyLiked,
        likesCount: post.likes.length
      });
  
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false });
    }
  };

  exports.addComment = async (req, res) => {
    try {
      const postId = req.params.id;
      const userId = req.session.user.id;
      const { text } = req.body;
  
      const post = await Post.findById(postId);
  
      post.comments.push({
        user: userId,
        text
      });
  
      await post.save();
  
      const updatedPost = await Post.findById(postId)
        .populate("comments.user", "name profileImage");
  
      const newComment = updatedPost.comments[updatedPost.comments.length - 1];
  
      res.json({
        success: true,
        comment: newComment,
        commentsCount: updatedPost.comments.length
      });
  
    } catch (error) {
      console.log("Comment error:", error);
      res.status(500).json({ success: false });
    }
  };