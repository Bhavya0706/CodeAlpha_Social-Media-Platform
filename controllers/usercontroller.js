const User = require("../models/User");
const Post = require("../models/Post");

exports.getProfile = async (req, res) => {
    try {
      const userId = req.session.user.id;
  
      const user = await User.findById(userId)
        .populate("followers", "name email profileImage")
        .populate("following", "name email profileImage");
  
      const posts = await Post.find({ user: userId })
        .sort({ createdAt: -1 });
  
      res.render("profile", {
        user,
        posts
      });
  
    } catch (error) {
      console.log("Profile error:", error);
      res.redirect("/feed");
    }
  };

exports.followUser = async (req, res) => {
    try {
      const currentUserId = req.session.user.id;
      const targetUserId = req.params.id;
  
      if (currentUserId === targetUserId) {
        return res.status(400).json({
          success: false,
          message: "You cannot follow yourself",
        });
      }
  
      const currentUser = await User.findById(currentUserId);
      const targetUser = await User.findById(targetUserId);
  
      if (!currentUser || !targetUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
  
      const alreadyFollowing = currentUser.following.some(
        (id) => id.toString() === targetUserId
      );
  
      if (alreadyFollowing) {
        currentUser.following.pull(targetUserId);
        targetUser.followers.pull(currentUserId);
      } else {
        currentUser.following.push(targetUserId);
        targetUser.followers.push(currentUserId);
      }
  
      await currentUser.save();
      await targetUser.save();
  
      return res.json({
        success: true,
        following: !alreadyFollowing,
      });
  
    } catch (error) {
      console.log("Follow error:", error);
  
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  };

  exports.getEditProfile = async (req, res) => {
    try {
      const user = await User.findById(req.session.user.id);
  
      res.render("edit_profile", {
        user,
        error: null
      });
  
    } catch (error) {
      console.log(error);
      res.redirect("/profile");
    }
  };
  
  exports.postEditProfile = async (req, res) => {
    try {
      const { name, bio } = req.body;
  
      const user = await User.findById(req.session.user.id);
  
      if (!name) {
        return res.render("edit_profile", {
          user,
          error: "Name is required"
        });
      }
  
      user.name = name;
      user.bio = bio || "";
  
      if (req.file) {
        user.profileImage = "/uploads/" + req.file.filename;
      }
  
      await user.save();
  
      req.session.user.name = user.name;
  
      res.redirect("/profile");
  
    } catch (error) {
      console.log(error);
      res.redirect("/edit_profile");
    }
  };