const nodemailer=require("nodemailer");

const mailSender =async(req,res)=>{
     try{
         let transpoter=nodemailer.createTransport({
           host:process.env.MAIL_HOST,
           auth:{
            user:process.env.MAIL_USER,
            password:process.env.MAIL_PASS
           }
         })
         let info =await transpoter.sendMail({
          form:'studynotion',
          to:'${email}',
          subject:'${title}',
          html:'${body}',
         })
         console.log(info);
         return info;
     }
     catch(error){
       return res.status(300).json({
        success:false,
        message:"something went wrong"
       })
     }
}
module.exports=mailSender;