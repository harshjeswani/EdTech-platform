const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
  firstName:{
    type:String,
    required:true,
    trim:true,
  },
  lastName:{
    type:String,
    required:true,
    trim:true,
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true,
    min:8,

  },
  confirmPassword:{
    type:String,
    required:true,
    min:8,
    
  },
  mobileNumber:{
    type:Number
  },
  additionalDetails:{
    type:String,
    ref:"profile"
  },
  AccountType:{
    type:String,
    enum:["Admin","User","Instructor"]

  },
  coarses:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"coarse"
  },
  image:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"image"
 
  },
  coarseProgress:{
     type:mongoose.Schema.Types.ObjectId,
     ref:"coarseProgress"
  },
  token:{
    type:String,
  },
  resetPassword:{
    type:Date,
  }
  
}); 

module.exports=mongoose.model("User",userSchema);