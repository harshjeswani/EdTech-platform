const SubSection=require("../models/subSection");
const Section=require("../models/Section");
const { uploadImageToCloudinary } = require("../util/imageuploader");
const subSection = require("../models/subSection");

//create subsection

exports.subsections=async (req,res)=>{
  try{
      //fetch data form req body
      const {sectionId,title,description,timeDuration}=req.body;
         
      //extract file video
      const video=req.files.videoFile;
      //validation
      if(!sectionId || !title || !timeDuration || !description || !video){
        return res.status(400).json({
          success:false,
          message:"all fields are required"
        })
      }  
      //upload video to cloudinary
      const uploaddetails=await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
      //create a sub section
      const subSectiondetails= await subSection.create({
        title:title,
        timeDuration:timeDuration,
        description:description,
        videoUrl:uploaddetails.secure_url
      })
      //update section with this subsectin objectId
      const updatedSection=await Section.findByIdAndUpdate({_id:sectionId},
        {$push:{
          subSection:subSectiondetails._id,
        }},
        {new:true}
    );

    //log updated with this sub section objectId
    const updatedsection=await Section.findByIdAndUpdate({_id:sectionId},
      {
        $push:{
          subSection:subSectiondetails._id,

        }
      },
      {new:true}
    )
    //log updated section here after adding populae query
    //return response
    return res.status(200).json({
      success:true,
      message:"sub section created Successfully",
      updatedsection
    })
  }
  catch(error){
    return res.status(400).json({
      success:false,
      message:"something went wrong",
      error:error.message
    })
  }
}

//update subsection

//delete subsection