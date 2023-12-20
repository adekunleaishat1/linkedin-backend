const mongoose = require("mongoose")


    const commentSchema = new mongoose.Schema({
        comment:{type:String, required:true, trim:true},
        postcomment:{type:String, required:true, trim:true},
        commenteduserprofile:{type:String, required:true, trim:true},
        commenteduserfirstname:{type:String, required:true, trim:true},
        commenteduserlastname:{type:String, required:true, trim:true}
   },{timestamps:true})

const commentmodel = mongoose.model("comment_collection", commentSchema)

module.exports = commentmodel