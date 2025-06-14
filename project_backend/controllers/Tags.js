const Tag=require("../models/tags");

//create Tag ka handler function

exports.createTag=async(req,res)=>{
  try{
    //fetch data
    const {name,description}=req.body;
    //validation
    if(!name || !description){
      return res.status(400).json({
        success:false,
        message:"enter valid details"
      })
    }
    //create entry in Db
    const tagDetails=await Tag.create({
      name:name,
      description:description
    });
    console.log(tagDetails);
    return res.status(200).json({
      success:true,
      message:"entry created successfully"
    })

  }
  catch(error){
     return res.status(400).json({
        success:false,
        message:"something went wrong"
     })
  }
}
//get all tags handler function

exports.showAlltags=async(req,res)=>{
  try{
    const allTags=await Tag.find({},{name:true,description:true});
    return res.status(200).json({
      success:true,
      message:"find successfully"
    })
  }
  catch(error){
     return res.status(400).json({
      success:false,
      message:"not find successfully"
     })
  }
}