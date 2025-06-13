const {instance}=require("../config/razorpay");
const Course=require('../models/Coarse');
const User=require('../models/User');

const mailsender=require('../util/mailSender');
const {courseEnrollementEmail}=require('../mail/template/courseEnrollmentEmail');


exports.capturePayment=async(req,res)=>{
  //get coarseId and userId
  const {course_id}=req.body;
  const userId=req.user.id;
  //validataion
    
  //valid coarseId
if(!course_id){
  return res.status(400).json({
    success:false,
    message:"please provide valid coarse Id"
  })
}
  //valid coursedetails
  let course;
  try{
    course=await Course.findById(course_id);
    if(!course){
      return res.status(400).json({
         success:false,
         message:"course not found"
      })
    }
     //user already pay for the same coarse
    //mere pass course ke model me user ki id pade hai
    const uid=new mongoose.Types.ObjectId(userId);
    if(course.studentEnrolled.include(uid)){
      return res.status(200).json({
        success:false,
        message:"student is already enrolled"
      })
    }
  }
  catch(error){
    console.log(error);
    return res.status(400).json({
      success:false,
      message:"something went wrong"
    })
  }
 
  //order create
   const amount=course.price;
   const currency="INR";

   const options={
    amount:amount*100,
    currency,
    receipt:Math.random(Date.now()).toString(),
    notes:{
      courseId:course_id,
      userId
    }
   };

   try{
   //initialize the payment useing razorpay

   const paymentresponse=await instance.orders.create(options);
   console.log(paymentresponse);
   //return response
   return res.status(200).json({
     success:true,
     courseName:course.courseName,
     courseDescription:course.courseDescription,
     thumbnail:course.thumbnail,
     orderId:paymentresponse.id,
     currency:paymentresponse.currency,
     amount:paymentresponse.amount
   })
   }
   catch(error){
      console.log(error)
      return res.status(400).json({
        success:false,  
        message:"something went wrong "
      })
   }
  
}

exports.verifysignature=async(req,res)=>{
  const webhooksecret="12345678";
  const signature=req.headers["x-razorpay-signature"];

  const shasum=crypto.createHmac("sha256",webhooksecret);
  shasum.update(JSON.stringify(req.body));
  const digest=shasum.digest("hex");

  if(signature==digest){
    console.log("payment authorized");
    //humne notes pass kiya tha body me
    const {courseId,userId}=req.body.payload.payment.entity.notes;
    try{
       //fulfill the action

       //find the course and enrool the struden in it
       const enrolledcourse=await Course.findOneAndUpdate(
        {_id:courseId},
        {$push:{studentEnrolled:userId}},
        {new:true}
      )
      if(!enrolledcourse){
        return res.status(400).json({
          success:false,
          message:"course not found"
        })
      }
      console.log(enrolledcourse);

      //find the student and add course to thier list enrolled coursed me
      const enrolledstudent=await User.findByIdAndUpdate(
        {_id:userId},
        {$push:{course:courseId}},
        {new:true},
      )
      console.log(enrolledstudent);

      //mail send karo conformation wala
      const emailResponse=await mailSender(
        enrolledstudent.email,
        "congratulations form codehelp",
        "you are enrolled to the couse in the code help"

      )
      console.log(emailResponse);
      return res.status(200).json({
        success:true,
        message:"signature verified and course added"
      });
    }
    catch(error){
       return res.status(400).json({
        success:false,
        message:"something went wrong"
       })
    }
  }
  else{
    return res.status(400).json({
      success:false,
      message:"INvalid input",
    })
  }
}