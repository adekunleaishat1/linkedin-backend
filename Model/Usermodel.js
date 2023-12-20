const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    firstname:{type: String, required:true, trim:true, unique:true},
    lastname:{type: String, required:true, trim:true, unique:true},
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true },
    phonenumber: { type:Number, required: true, trim: true },
    profile_img:{type:String, trim:true}
},{timestamps:true})



let saltRound = 10
userSchema.pre("save", function(next){
  console.log(this.password);
  bcrypt.hash(this.password,saltRound,(err, hashedpassword)=>{
    if (!err) {
       this.password = hashedpassword
       next() 
    }
  })
})


const usermodel = mongoose.model("user_collection", userSchema)
module.exports = usermodel