const express = require("express")
const {signup, login, getdashboard, sendpost, getpost, getOneuser,uploadprofile} = require("../Controllers/Usercontroller")
const {postlike, postComment,getlike, getcomment} = require("../Controllers/Commentcontroller")
const userrouter = express.Router()


userrouter.post("/signup", signup)
userrouter.post("/login", login)
userrouter.get("/dashboard", getdashboard)
userrouter.post("/makepost", sendpost)
userrouter.get("/getpost", getpost)
userrouter.get("/getuser", getOneuser)
userrouter.post("/upload", uploadprofile)
userrouter.post("/like", postlike)
userrouter.post("/comment", postComment)
userrouter.get("/getlike", getlike)
userrouter.get("/getcomment", getcomment)


module.exports = userrouter