const postmodel = require("../Model/Postmodel");
const usermodel = require("../Model/Usermodel");
const commentmodel = require("../Model/Comment");
const likemodel = require("../Model/Like");
const { verifyToken } = require("../Services/sessionservice");

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
      console.log(unlike);
    } else {
      const like = await likemodel.create({
        postliked: postliked,
        userliked: user_id,
        likes: true,
      });
      console.log(like);
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
  console.log('working :',user);
 if (!user) {
   return res.status(400).send({message:"user not found", status: false})
 }
 const allcomment = []
    const allpost = await postmodel.find()
     console.log("allpost 567",allpost);
     for(let post of allpost) {
           const postid = post._id.toString()
           console.log("id of all post:", postid);

           const commentedpost = await commentmodel.find({ postcomment: postid });
           console.log("all comment",commentedpost)

           const alc = allcomment.push({
            postid : postid,
            comment: commentedpost,
           })
     }
     console.log(allcomment);
     return res.status(200).send({message:"comment fetched", status:true, allcomment})
  } catch (error) {
    console.log(error);
  }

}

module.exports = { postlike, postComment, getlike, getcomment };
