const User = require("../models/User");
const bcrypt = require("bcryptjs");


exports.welcome = (req,res,next) =>{
    res.render('welcome');
}

// GET login page
exports.getLogin = (req, res) => {
  res.render("login.ejs");
};

// POST login user
exports.postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check empty fields
    if (!email || !password) {
      return res.render("login.ejs", {
        error: "Email and password are required",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("login.ejs", {
        error: "Invalid email or password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.render("login.ejs", {
        error: "Invalid email or password",
      });
    }

    // Store user in session
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    res.redirect("/feed");
  } catch (error) {
    console.log("Login error:", error);
    res.render("login.ejs", {
      error: "Something went wrong during login",
    });
  }
};

// GET register page
exports.getRegister = (req, res) => {
  res.render("registration.ejs");
};

// POST register user
exports.postRegister = async (req, res) => {
  try {
    const { name, email, password} = req.body;

    // Check empty fields
    if (!name || !email || !password) {
      return res.render("registration.ejs", {
        error: "Name, email and password are required",
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.render("registration.ejs", {
        error: "Password must be at least 6 characters long",
      });
    }

    // Check user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.render("registration.ejs", {
        error: "User already exists with this email",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      bio : '' ,
      profileImage: "",
      followers: [],
      following: [],
    });

    await user.save();

    res.redirect("/login");
  } catch (error) {
    console.log("Register error:", error);
    res.render("registration.ejs", {
      error: "Something went wrong during registration",
    });
  }
};

// Logout user
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Logout error:", err);
      return res.redirect("/feed");
    }

    res.redirect("/login");
  });
};

exports.logout = (req, res) => {

    req.session.destroy((err) => {
  
      if (err) {
        console.log(err);
        return res.redirect("/feed");
      }
  
      res.clearCookie("connect.sid");
  
      res.redirect("/login");
    });
  
  };