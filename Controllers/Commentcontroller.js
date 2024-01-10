const postmodel = require("../Model/Postmodel");
const usermodel = require("../Model/Usermodel");
const commentmodel = require("../Model/Comment");
const likemodel = require("../Model/Like");
const { verifyToken } = require("../Services/sessionservice");
const notificationmodel = require('../Model/Notification')

const postlike = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const email = verifyToken(token);
    const user = await usermodel.findOne({ email: email });
    const user_id = user.id;
    const { postliked } = req.body;
    const likeuser = await likemodel.findOne({
      userliked: user_id,
      postliked: postliked,
    });
    // console.log("line 111 : ", likeuser);
    if (likeuser) {
      console.log(likeuser._id);
      const unlike = await likemodel.findByIdAndDelete({ _id: likeuser._id });
    } else {
      const like = await likemodel.create({
        postliked: postliked,
        userliked: user_id,
        likes: true,
      });
      const post = await postmodel.findById({_id: postliked})
      let userEmail;
      if (post && post.user) {
        userEmail = post.user.email;
        console.log('User email:', userEmail);
      } else {
        console.log('Post or user not found');
      }
      const notification = await notificationmodel.create({
        receiveremail: userEmail,
        message:`${user.firstname} ${user.lastname} liked your post`
      })
    }
   
    return res
      .status(200)
      .send({ message: "you have successfully liked this post", status: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Internal server error", status: false });
  }
};

const postComment = async (req, res) => {
  console.log(req.body);
  try {
    const { postcomment, secondinp } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const email = verifyToken(token);

    const user = await usermodel.findOne({ email });
    const commenteduserprofile = user.profile_img
    const commenteduserfirstname = user.firstname
    const commenteduserlastname = user.lastname
    if (!user) {
      return res.status(400).send({ message: "user not found", status: false });
    }
    const commentpost = await commentmodel.create({
      comment: secondinp,
      postcomment: postcomment,
      commenteduserprofile:commenteduserprofile,
      commenteduserfirstname:commenteduserfirstname,
      commenteduserlastname:commenteduserlastname
    });
    if (!commentpost) {
      return res
        .status(407)
        .send({ message: "error occured while commenting", status: false });
    }
    const post = await postmodel.findById({_id: postcomment})
    let userEmail
    if (post && post.user) {
      userEmail = post.user.email;
      console.log('User email:', userEmail);
    }
    const notification = await notificationmodel.create({
      receiveremail: userEmail,
      message:`${user.firstname} ${user.lastname} comment your post`
    })
    return res
      .status(200)
      .send({ message: "comment successfully", status: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Internal server error", status: false });
  }
};

const getlike = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const email = verifyToken(token);

    const user = await usermodel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .send({ message: "you are not a signedup user", status: false });
    }
    const alllike = [];
    const allpost = await postmodel.find(); // fetching allpost i have in my post model
    
    for (const item of allpost) {
      // i loop through allpost to get the postid
      const id = item._id.toString();
      // console.log("singlepost id : ", id);

      const postlike = await likemodel.find({ postliked: id }); // i find in my likemodel if my postid is equal to my postliked
      const allLikedPosts = alllike.push({
        postid: id,
        like: postlike,
      });
      // console.log("All Liked posts : ", allLikedPosts);
    }

    if (!alllike) {
      return res
        .status(402)
        .send({ message: "there is no like for this post", status: false });
    }
    return res
      .status(200)
      .send({
        message: "like fetched successfully",
        status: true,
        alllike,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Internal server error", status: false });
  }
};

const getcomment = async(req, res) =>{
  try {
    const token = req.headers.authorization.split(" ")[1];
    const email = verifyToken(token);
    const user = await usermodel.findOne({ email });
 
 if (!user) {
   return res.status(400).send({message:"user not found", status: false})
 }
 const allcomment = []
    const allpost = await postmodel.find()
     console.log("allpost 567",allpost);
     for(let post of allpost) {
           const postid = post._id.toString()
          
           const commentedpost = await commentmodel.find({ postcomment: postid });
        
           const alc = allcomment.push({
            postid : postid,
            comment: commentedpost,
           })
     }

     return res.status(200).send({message:"comment fetched", status:true, allcomment})
  } catch (error) {
    console.log(error);
  }

}

const getnotification =async (req, res) =>{
  try {
    const token = req.headers.authorization.split(" ")[1]
     const email = verifyToken(token)  
     const user = await usermodel.findOne({email})
     if (!user) {
      return res.status(402).send({message:"user not found", status:false})
     }
     const notification = await notificationmodel.find({receiveremail: user.email})
     if (!notification) {
      return res.status(409).send({message:"error getting notification", status:false})
     }
     return res.status(200).send({message:"fetched successful", status:true, notification})
  } catch (error) {
    console.log(error);
  }
}

const setnotify = async(req , res) =>{
  try {
    const {isRead} = req.body
    const token = req.headers.authorization.split(" ")[1]
    const email = verifyToken(token)  
    const user = await usermodel.findOne({email})
    if (!user) {
     return res.status(402).send({message:"user not found", status:false})
    }
     const setread = await notificationmodel.updateMany(
      {receiveremail: email},
      {$set:{isRead: isRead}}
     ) 
     if (!setread) {
      return res.status(409).send({message:"error occured", status:false})
     }
     return res.status(200).send({message:"update successful", status:true})
  } catch (error) {
    console.log(error);
    
  }
}

module.exports = { postlike, postComment, getlike, getcomment, getnotification, setnotify };
