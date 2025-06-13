const Coarse = require("../models/Coarse");
const Course=require("../models/Coarse")
const Tag=require("../models/tags");
const User=require("../models/User");
const {uploadImageToCloudinary}=require("../util/imageuploader")

exports.createCoarse=async(req,res)=>{
  try{
  //fetch data
  const {courseName,courseDescription,whatYouWillLearn,price,tag}=req.body;
   
  //get thumbanail
  const thumbnail=req.files.thumbnailImage;
  if(!courseName || !courseDescription || !whatYouWillLearn ||!price || !tag || !thumbnail){
    return res.status(400).json({
      success:false,
      message:"All fields are required"
    })
  }
  //check for instructor
  const userId=req.User.id;
  const instructorDetails=await User.findById(userId);
  console.log("Instructor Details");

  if(!instructorDetails){
    return res.status(400).json({
      success:false,
      message:"Instructor Details not found"
    })
  }
  //check given tag is valid or not
  const tagDetails=await Tag.findById(tag);
  if(!tagDetails){
    return res.status.json({
      success:false,
      message:"Tag Details not found"
    })
  }
  //upload image top cloudinary
  const thumbnailimage=await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);
   //CREATE AN ENTRY FOR NEW COARSE
   const newcourse=new Coarse.create({
    courseName,
    courseDescription,
    instructor:instructorDetails._id,
    whatYouWillLearn:whatYouWillLearn,
    price,
    tag:tagDetails._id,
    thumbnail:thumbnailimage.secure_url
   })
   //add the new coarse to user schema of Instructor
   await User.findByIdAndUpdate(
    {_id:instructorDetails._id},
    {
      $push:{
        courses:newcourse._id,
      },
      
    },
    {new:true},
   );
   return res.status(200).json({
    success:true,
    message:"course created successfully"
   });
  }
  catch(error){
    return res.status(400).json({
      success:false,
      message:"something went wrong"
    })
  }
}

//getAllcourses handler func

exports.showAllCourses=async(req ,res)=>{
  try{
   const allcourses=await Course.find({},{courseName:true,
                                          price:true,
                                          thumbnail:true,  
                                          instructor:true,            
                                       ratingAndReviews:true,
                                        studentEnrolled:true

   })  .populate("instructor").exec();
   return res.json({
    success:true,
    message:"data found of all courses successfullu",
    data:allcourses,
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

//getcourseDetails

exports.getcourseDetails = async (req, res) => {
  try {
    // Get course ID from request body
    const { courseId } = req.body;

    // Find course details
    const courseDetails = await Course.findOne({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // Validation
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find the course with ID ${courseId}`,
      });
    }

    // Return response
    return res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      data: courseDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
