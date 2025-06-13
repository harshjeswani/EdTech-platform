const RatingAndReview=require('../models/RatingAndReview');
const Course=require("../models/RatingAndReview");
//create Rating
exports.createRating=async(req,res)=>{
try{
  //get user id
  const userId=req.user.id;

  //fetch data form req body
  const {rating,review,courseId}=req.body;

  //check user enrolled in the coarse
  const coursedetails=await Course.findone(
   {
    _id:courseId,
    studentEnrolled:{$eleMatch:{$eq:userId}},
   }
    
  )
  if(!coursedetails){
    res.status(400).json({
      success:false,
      message:"student not enrolled int this coarse"
    })
  }

  //one time review || user not already reviewd the coarse;
  const alredyreviewed=await RatingAndReview.findOne({
    user:userId,
    course:courseId,
  })
  if(alreadyreviewed){
    return res.status(403).json({
      success:false,
      message:"already given a review"
    })
  }
  //create rating and review
  const ratingandrev=await RatingAndReview.create({
    rating,review,course:courseId,user:userId,
  });
  //update course with this rating/review
  await Course.findByIdAndUpdate({_id:courseId}
    {
      $push:{
        ratingAndReviews:ratingandrev._id,
      }
    },
    {new:true}
  )
  //return response
  return res.status(200).json({
    success:true,
    message:"rating and review successfully",
    ratingandrev
  })
}
catch(error){
  console.log(error);
  return res.status(400).json({
    success:false,
    message:"rating and review something went wrong"
  })
}
}
//get Average Rating 
exports.getAverageRating=async(req,res)=>{
  try{
    //get course id
    const courseId=req.body.courseId;
    //calculate avg rating
    const result=await RatingAndReview.aggregate([
      {
        $match:{
          course:new mongoose.Types.ObjectId(courseId)
        }
      },
      {
        $group:{
          _id:null,
          averageRating:{$avg:"$rating"} , 
        }
      }
    ])

    //return rating
    if(result.length>0){
      return res.status(200).json({
        success:true,
        averageRating:result[0].averageRating
      })
    }
    //if rating revieq exsist
    return res.status(400).json({
      success:true,
      message:"Average Rating is 0, no ratings given till now",
      averageRating:0,
    })
  }
  catch(error){
     console.log(error);
     return res.status(400).json({
      message:"something went wrong",
      success:false
     })
  }
}
//getallrating
exports.getallrating=async(req,res)=>{
  try{
    const allreviews=await RatingAndReview.find({})
    .sort({rating:"des"})
    .populate({
      path:"user",
      select:"firstName lastName email image",
    })
    return res.status(200).json({
      success:true,
      message:"All reviws fetched successfully",
      data:allreviews
    })
  }
  catch(error){
   console.log(error);
   return res.status(400).json({
    success:false,
    message:"error while getting all rating and reviews"
   })
  }
}