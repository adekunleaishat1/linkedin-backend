const mongoose = require("mongoose") 

const postSchema = new mongoose.Schema({
  content:{type:String, required:true, trim:true},
  image:{type:String,required:true, trim:true},
  user:{type:Object, required:true, unique:true},
},{timestamps:true})

const postmodel = mongoose.model("post_collection", postSchema)

module.exports=postmodel