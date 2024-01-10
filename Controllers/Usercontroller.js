
const usermodel = require("../Model/Usermodel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const postmodel = require("../Model/Postmodel")
const {cloudinary} = require("../utils/cloudinary")
const {verifyToken} = require("../Services/sessionservice")
const notificationmodel = require("../Model/Notification")


const signup = async(req, res) =>{
    try {
        const {firstname, lastname, phonenumber, email, password} = req.body
        if (firstname == "" || lastname == "" || phonenumber == "" || email == "" || password == "") {
           return res.status(400).send({message:"input field cannot be empty", status:false}) 
        }
        const existinguser = await usermodel.findOne({email: email})
        if (existinguser) {
            return res.status(402).send({message:"user already exist", status:false})
        }
      const result = await usermodel.create({firstname, lastname, email, phonenumber, password})
      console.log(result);
      if (!result) {
        return res.status(500).send({message:"error occured while creating account, try again.", status: false})
      }
      return res.status(200).send({message:"successfully create an account", status:true})
    } catch (error) {
        
    }
}

const login = async (req, res) =>{
  try {
    const {email, password} = req.body
    console.log(req.body);
    if (email == "" || password == "") {
      return res.status(400).send({message:"input field cannot be empty", status: false})
    }
    const checkuser = await usermodel.findOne({email: email
    })
    if (!checkuser) {
      return res.status(402).send({message: "User not found , plsease signup", status: false})
    }
    const compare = await bcrypt.compare(password, checkuser.password)
    if (!compare) {
      return res.status(409).send({message: "Invalid password", status: false})
    }
    let token = jwt.sign({email}, "yeeshasecret", {expiresIn: "1day"})
    return res.status(200).send({message:"login successful", status: true, token})
  } catch (error) {
    console.log(error);
  }
}

const getdashboard = async( req, res) => {
  const token = req.headers.authorization.split(" ")[1]
  jwt.verify(token, "yeeshasecret",(err, result)=>{

    if (err) {
      console.log(err);
      return res.status(402).send({message:"error occured", status: false})
    }else{
      console.log(result);
      let email = result.email
      return res.status(200).send({message:"token verified", status:true})
    }
  })
  
  try {
    
    
  } catch (error) {
    
  }
}
const getOneuser = async (req, res)  =>{
  try {
    const token = req.headers.authorization.split(" ")[1]
    const email = verifyToken(token)
    if (!token) {
      return res.status(402).send({message:"invalid token", status: false })
    }
    const user = await usermodel.findOne({email: email})
    console.log(user);
    if (!user) {
      return res.status(400).send({message:"user not found", status: true})
    }
    return res.status(200).send({message:"user verified successfully", status: true, user})
  } catch (error) {
    console.log(error);
  }
}

const sendpost = async(req, res) =>{
  try {
    const token = req.headers.authorization.split(" ")[1]
    const email = verifyToken(token)
    const {content, image} = req.body
    console.log(req.body);
    if (content == "" || image == "") {
      return res.status(400).send({message:"input field cannot be empty", status: false})
    }
    const newimage = await cloudinary.uploader.upload(image);

    const newuser = await usermodel.findOne({email: email})
    if (!newuser) {
      return res.status(402).send({message:"user not found", status:false})
    }
    const post = await postmodel.create({
       content,
       image:newimage.secure_url, 
       user:newuser
      })
    
    if (!post) {
      return res.status(409).send({message:"error occured while making a post", status: false})
    }
    const notification = await notificationmodel.create({
      receiveremail: newuser.email,
      message:`${newuser.firstname} make a post on their timeline`
    })
    return res.status(200).send({message:"Post successfully", status: true})

  } catch (error) {
    console.log(error);
  }
}

const getpost = async(req, res) =>{
   try {
    const token = req.headers.authorization.split(" ")[1]
    const email = verifyToken(token)

    const user = await usermodel.findOne({email:email})
    if (!user) {
      return res.status(402).send({message:"User not found", status:false})
    }
     const post = await postmodel.find()
    
     if (!post) {
      return res.status(409).send({message:"error occured while fetching", status: false})
     }
     return res.status(200).send({message:"post fetched successfully", status:true, post})
   } catch (error) {
    console.log(error);
   }
}

const uploadprofile = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const email = verifyToken(token);
    const { image } = req.body;

    const newimage = await cloudinary.uploader.upload(image);
    if (!newimage) {
      return res.status(401).send({ message: "error occurred while uploading", status: false });
    }

    const upload = await usermodel.findOneAndUpdate(
      { email: email },
      { $set: { profile_img: newimage.secure_url } },
      { new: true } // Return the updated document
    );

    if (!upload) {
      return res.status(402).send({ message: "error occurred while updating profile", status: false });
    }

    // Find all posts by the user and update each one
    const updatePosts = await postmodel.updateMany( 
      { 'user._id': upload._id },
      { $set: { user: upload.toObject() } }
    );


    if (!updatePosts) {
      return res.status(409).send({ message: "error occurred while updating posts", status: false });
    }

    return res.status(200).send({ message: "you have successfully uploaded the profile" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "internal server error", status: false });
  }
};



module.exports= {signup, login, getdashboard, sendpost, getpost, getOneuser, uploadprofile}