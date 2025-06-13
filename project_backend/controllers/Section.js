const Section=require("../models/Section");
const Course=require("../models/Coarse");

exports.createSection=async(req ,res)=>{
  try{
   const {sectionName ,courseId}=req.body;
   //data validation
   if(!sectionName || !courseId){
    return res.status(400).json({
      success:false,
      message:"missing properties"
    })
   }
   const newSection=await Section.create({sectionName});
   //update course with section object Id
   const updatedCourseDetails=await Course.findByIdAndUpdate(
    courseId,
    {
      $push:{
        courseContent:newSection._id,
      }
    },
    {new:true},
   );
   //use populate to replace sections /sub-sections both in the updatedcoureseDetails
   //return response
   return res.status(200).json({
    success:true,
    message:"successfully updated it",
    updatedCourseDetails,
   })
  }
  catch(error){
    return res.status(400).json({
      success:false,
      message:"unable to create section please try again"
    })
  }
}


exports.updateSection=async(req,res)=>{
try{
//data input
const {sectionName,sectionId}=req.body
//data validataion
if(!sectionName || !sectionId){
  return res.status(400).json({
    success:false,
    message:"missing Properties"
  })
}
//update data in the section 
const section=await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});
//section id will be same in the course ...so no need to update
return res.status(200).json({
  success:true,
  message:"section updated successfully"
})
}
catch(error){
 return res.status(400).json({
  success:false,
  message:"section updated successfully"
 })
}
}

exports.deleteSection=async (req,res)=>{
  try{
     //get section id
     const {sectionId}=req.parms

     //use findbyidandelete
     await Section.findByIdAndDelete(sectionId);
     //do we need to delete id from coarse schema
     //return response
     return res.status(200).json({
      success:true,
      message:"successfully deleted the section"
     })
  }
  catch(error){
    return res.status({
      success:false,
      message:"something went wrong"
    })
  }
}
