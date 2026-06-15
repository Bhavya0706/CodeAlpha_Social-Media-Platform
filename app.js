const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
require("dotenv").config();

const app = express();


// routers 
const authrouter = require('./routes/authrouter');
const postrouter = require('./routes/postrouter');
const userrouter = require('./routes/userrouter');


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
      secret: "social_media_secret",
      resave: false,
      saveUninitialized: false,
  
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: "sessions",
      }),
  
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 day
      
      },
    })
  );

app.use(express.static(path.join(__dirname, "public")));

app.get("/test", (req, res) => {
    res.send("Server route is working");
  });



app.use(authrouter);
app.use(postrouter);
app.use(userrouter);





const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  }).then(() =>{
    app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`);
      });
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });
