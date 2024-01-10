const express = require("express")
require("dotenv").config()
const mongoose = require("mongoose")
const cors = require("cors")
const userrouter = require("./Routes/Userrouter")

const app = express()
app.use(cors({origin: "*"}))

app.use(express.json({limit:"50mb"}))

app.use("/linkedin", userrouter)
app.use(express.urlencoded({extended:true, limit:"50mb"}))




const Uri = process.env.MONGODB

mongoose.connect(Uri).then((res)=>{

    console.log("database connected successfully");
}).catch((err)=>{
    console.log(err);
})






app.listen(5000,()=>{
console.log("app started")
})