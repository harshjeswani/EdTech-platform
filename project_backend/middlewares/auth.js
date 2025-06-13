const jwt=require("jsonwebtoken");
require("dotenv").config();
const User=require("../models/User");
//auth 
//isme jsonwebtoken check karte hai correct hain ya nhi
//there are three way in which you can extract token 
//from body;
//from cookie;
//from bearer token;
exports.auth=async(req,res,next)=>{
  try{
    const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer","");
    if(!token){
      return res.status(401).json({
        success:false,
        message:"token is missing"
      })
    }
    //verify the token
    try{
      const decode=await jwt.verify(token,process.env.JWT_SECRET);
      console.log(decode);
      req.user=decode; 

    }
    catch(error){
      console.log(error);
      return res.status(401).json({
        success:false,
        message:"something went wrong during verification"
      })
    }
    next();
  }
  catch(error){
     return res.status(400).json({
      success:false,
      message:"erorro while executing the code"
     })
  }
}

//is student
exports.isStudent=async(req,res)=>{
  try{
   if(req.user.accountType!== "Student"){
    return res.status(400).json({
      success:false,
      message:"This is protected route for is instructor only"
    })
   }
  }
  catch(error){
    return res.status(400).json({
      success:false,
      message:"something went wrong"
    })
  }
}
//is instructor
exports.isInstructor=async(req,res)=>{
  try{
    if(req.user.accounType!=="Instructor"){
      return res.status(401).json({
        success:false,
        message:"this is protected route for Instructor only",
      })
    }
  }
  catch(error){
    return res.status(400).json({
      success:false,
      message:"something went wrong"
    })
  }
}
//is admin
exports.isAdmin=async(req,res,next)=>{
  try{
    if(req.user.accountType!=="Admin"){
      return res.status(401).json({
        success:false,
        message:"this is protected route for admin"
      })
    }
  }
  catch(error){
    return res.status(400).json({
      success:false,
      message:"something went wrong"
    })
  }
}