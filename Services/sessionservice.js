const jwt = require("jsonwebtoken")


const verifyToken = (token) =>{
    try {
        if (!token) {
            throw new Error({name:"Authentication error", message:"Invalid token"}) 
        }
      const verified = jwt.verify(token, "yeeshasecret")
      const email =  verified.email
      return email
    } catch (error) {
        console.log(error);
        throw new Error("Error verifying token")
    }
}

module.exports = {verifyToken}