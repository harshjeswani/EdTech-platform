//mail send karna hai 
// reset karna hai pass database mai
//reset password token which create link to reset the password
const User=require("../models/User");
const mailSender=require("../util/mailSender");
const bcrypt=require("bcrypt");
//reset password token;
exports.resetPasswordToken=async(req,res)=>{
  try{
    //get email frm the body
   const email=req.body.email;
   const users=await User.findOne({email});
  //check user for this email,email validation
   if(!users){
    return res.status(400).json({
      success:false,
      message:"user not found ,check email address"
    })
   }
  //generate token 
  const token=crypto.randomUUID
  //update user by adding token and expiration time
  const updatedDetails=await User.findOneAndUpdate(
     {email:email},
     {
      token:token,
      resetPasswordExpires:Date.now()+5*60*1000
     },
     {new:true}
  );
  //create url
  const url=`https://localhost:3000/update-password/${token}`
  //send mail containing the url
  await mailSender(email,"password reset Link",`password reseet Link:${url}`)
  //return response
  return res.json({
    success:true,
    message:"Email sent successfully ,please check email and change password",
  })
  }
  catch(error){
    return res.status(400).json({
      success:false,
      message:"something went wrong"
    })
  }
}

//reset password

exports.resetPassword=async (req,res)=>{
 try{
   //data fetch
   const {password,confirmpassword,token}=req.body;
  
   //validation
   if(password!==confirmpassword){
     return res.status(400).json({
       success:false,
       message:"Password is not matching"
     })
   }
   
   //get userdetails from db using token
   const userdetails=await User.find({token:token});
   //if no entry -invalid token
   if(!userdetails){
     return res.json({
       success:fasle,
       message:"Token is invalid",
     })
   }
   //token time expire then it is invalid
    if(userdetails.resetPasswordExpires<Date.now()){
      return res.json({
        success:false,
        message:"token is expired ,please regenerate it",
      });
    }
 
   //hash pass
   const haspass=await bcrypt.hash(password,10);
   //password update
   await User.findOneAndUpdate(
     {token:token},
     {password:haspass},
     {new:true},
   );
   //return response
   return res.status(200).json({
     success:true,
     message:"password reset successfull"
   })
 
 }
 catch(error){
  console.log(error)
  return res.status(400).json({
    success:false,
    message:"something is wented wrong"
  })
 }
}