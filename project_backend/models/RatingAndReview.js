const mongoose=require("mongoose");

const reviewSchema=new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
  },
  rating:{
    type:Number,
    required:true,
  },
  review:{
    type:String,
    require:true,
  }
});
mongoose.exports=mongoose.model("RatingAndReview",reviewSchema)