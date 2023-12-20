const mongoose = require("mongoose")


const likeschema = new mongoose.Schema({
       postliked:{type:String,trim:true},
       likes:{type:Boolean, trim:true},
       userliked:{type:String, trim:true}
},{timestamps:true})

const likemodel = mongoose.model("like_collection", likeschema)
module.exports = likemodel