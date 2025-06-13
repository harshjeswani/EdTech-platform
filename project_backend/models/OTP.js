const mongoose=require("mongoose");
const mailSender=require("../utils/mailSender");
const OTPSchema=new mongoose.Schema({
  email:{
    type:String,
    reqired:true,
  },
  otp:{
    type:String,
    required:true,
  },
  createdAt:{
    type:Date,
    default:Date.now(),
    expires:5*60,
  }
});

async function sendVerificationEmail(email,otp){
  try{
    const mailResponse=await mailSender(email,"verification Email form study Nodtion ",otp);
    console.log("Email Sent Successfully",mailResponse);
    throw error;
  }
  catch(error){
    console.log("error occcured while sending mail");
    console.log(error);
  }
}
//middleware pre it send mail before storing in database
OTPSchema.pre("save",async function(next){
  await sendVerificationEmail(this.email,this.otp);
  next();
})
module.exports=mongoose.model("OTP",OTPSchema);  