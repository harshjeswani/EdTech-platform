const bcrypt=require('bcrypt');
const User=require('..models/users');
const OTP=require("../models/OTP");
const otpGenerator=require("otp-generator");
const jwt=require("jsonwebtoken");
require("dotenv").config();
//send otp
exports.sendOTP=async (req,res)=>{
  try{
    //fetch email form req body
  const {email}=req.body;

  //check if user already exsist
  const checkuserpresent=await User.findone({email});

  //if user already exist ,then return a response
  if(checkuserpresent){
    return res.status(400).json({
      success:false,
      message:"user already registered"
    })
  }
  //generate otp
  var otp=otpGenerator.generate(6,{
    upperCaseAlphabets:false,
    lowerCaseAlphabets:false,
    specialChars:false
  });
  console.log("OTP generated:",otp);
  //check uniqure otp or not

  const result=await OTP.findone({otp:otp});
  while(result){
    otp=otpGenerator(6,{
      upperCaseAlphabets:false,
      lowerCaseAlphabets:false,
      specialChars:false
    })
    result=await OTP.findone({otp:otp});
  }
   const otpPayload= {email,otp};
   //create an entry for OTP
   const otpBody=await OTP.create(otpPayload);
   console.log(otpBody);

   res.status(200).json({
    success:true,
    message:"OTP sent successfully",
    otp,
   })
 }
  catch(error){
    console.log("something went wrong ")
    console.log(error);
    return res.status(400).json({
      success:false,
      message:"something went wrong";

    })
  }
}
//signup

exports.signup=async(req,res)=>{
  try{
    const {firstName,lastName,password,confirmpassword,email,mobileNumber,otp,accountType}=req.body;
    if(!firstName || !lastName || !password || !email || !contactno || !otp){
      return res.status(400).json({
        success:false,
        message:"filled all required filled"
      })
    }
    if(password!=confirmpassword){
      return res.status(400).json({
        success:false,
        message:"password does not match"
      })
    }
  const exsistinguser=await User.findone({email});
  if(exsistinguser){
    return res.status(300).json({
      success:false,
      message:"user already exsist"
    })
  }
  const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1);
  console.log(recentOtp);
  if(recentOtp.length==0){
    return res.status(400).json({
      success:false,
      message:"otp not founded"
    })
  }
  else if(otp!=recentOtp){
    return res.status({
      success:false,
      message:"invalid otp "
    })
  }

  let hashpassword;
  try{
    hashpassword=await bcrypt.hash(password,10);

  }
  catch(error){
    return res.status(300).json({
      success:false,
      message:"error in hassing password"
    })
  }
  const profileDetails=await Profile.create({
    gender:null,
    dateOfBirth:null,
    about:null,
    mobileNumber:null,
  })
  const user=await User.create({
    firstName,lastName,email,password:hashpassword,mobileNumber,
    accountType,
    additionalDetails:profileDetails._id,
    image:'https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}',
  })
 return res.status({
     success:true,
     message:"entry created successfully //signup successfull"

  })
  }
  catch(error){
    return res.status(400).json({
      success:false,
      message:"something went wrong"
    })
  }
}
//login

exports.login=async (req,res)=>{
  try{
    const {email,password}=req.body;
    if(!email || !password){
      return res.status(400).json({
        success:false,
        message:"enter the email or password"
      })
    }
    const user=await User.findone({email});
    if(!user){
      return res.status(400).json({
       success:false,
       message:"email does not exsist....please login into the system"
      })
    }
    const payload={
     email:user.email,
     id:user._id,
     role:user.role
    }
    let pass=user.password;
    if(await bcrypt.compare(password,user.password)){
      let token=jwt.sign(payload,
        process.env.JWT_SECRET,
        {
          expiresIn:"2h",
        }
      )
      user.token=token;
      user.password=undefined;

    
    const options={
      expires: new Date(Date.now()+3*24*60*60*1000),
      httpOnly:true,
    }
    res.cookie("token",token,options).status(200).json({
      success:true,
      token,
      user,
      message:"user logged in successfully"
    })
  }
  else{
    console.log(error);
    return res.status(400).json({
      success:true,
      message:"login failure please try again",
    })
  }

}
catch(error){
  console.log(error);
  return res.status(300).json({
    success:false,
    message:"something went wrong"
  })
}
}
//change password
exports.changePassword=async(req,res)=>{
  //get data form req body
  const {email,oldpassword,newpassword,confirmpassword}=req.body;
    
  const exsistuser=await User.findone({email});
  if(!exsistuser){
    return res.status(400).json({
      status:false,
      message:"user not found",

    })
  }
  if(bcrypt.compare(oldpassword,exsistuser.password)){
    if(newpassword!=confirmpassword){
      return res.status(400).json({
        success:false,
        message:"pass and confirm pass not matches"
      })
    }
      exsistuser.password=newpassword;
      return res.status(200).json({
        success:true,
        message:"password change successfully"
      })
  }
  //get oldpassword ,newpassword ,confirmpassword
  //validation
  
  //update pass in db 
  //send mail password updated
  //return response
}