const Profile=require("../models/Profile");
const User=require("../models/User");
exports.UpdateProfile=async(req,res)=>{
  try{
   //get data
    const {gender,dob="",about="",contactNumber}=req.body;
    
   //get user id
   const id=req.user.id; 
   //validation
   if(!contactNumber || !gender ||!dob || !about){
      return res.status(400).json({
        message:"something is missing";
      })
   }
   //find profile
   const userDetails=await User.findById(id);
   const profileId=userDetails.additionalDetails;
  const profiledata=await Profile.findById(profileId);
   //update profile
    profiledata.dob=dob;
    profiledata.gender=gender;
    profiledata.contactNumber=contactNumber;
    profiledata.about=about;
    //idhar profiledata naam ka object pada hai directly save karo isse "no need to create it only save it"
    await profiledata.save();
   //return response
   return res.status(200).json({
    success:true,
    message:"profile data updated successfully",
    profiledata
   })
   
  }
  catch(error){
    console.log(error);
    return res.status(400).json({
      success:false,
      message:"it is not poosible catch error it s",
     
    })
  }
}  

//deleteaccount
exports.delete=async(req ,res)=>{
  try{
   //get id
   const useridentify=req.user.id;
   const userdetails=await User.findById(id);
   //validation
   if(!userdetails){
    return res.status(400).json({
      success:false,
      message:"user not found"
    });
   }
   //delete profile
   await Profile.findByIdAndDelete({_id:userdetails.additionalDetails});

   //delete user
   await User.findByIdAndDelete({_id:id})
   //return response
   return res.status(200).json({
    success:true,
    message:"deleted successfully"
   })
  }
  catch(error){
    return res.status(400).json({
      success:false,
      message:"something went wrong"
    })
  }
}

//Explore => crown job

//get user whole details

exports.getAllUserDetails=async (req,res)=>{
 try{
  const id=req.user.id;
  const userdetails=await User.findById(id).populate("additionalDetails").exec();
  return res.status(200).json({
    success:false,
    message:"user data successfully fetched"
  })
 }
 catch(error){
   console.log(error);
   return res.status(400).json({
     success:false,
     message:"something went wrong"
   })
 }
}