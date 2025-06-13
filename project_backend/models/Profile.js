const mongoose=require('mongoose');

const profileSchema=new mongoose.Schema({
   contactNumber:{
    type:Number,
    required:true
   },
   dob:{
    type:String,
    required:true,
   },
   gender:{
    type:String,
    enum:["male","female","other"],
   },
   about:{
    type:String,
    required:true
   }
})

module.exports("Profile",profileSchema);