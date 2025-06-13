const mongoose=require('mongoose');
require('dotenv').config();

//connect to mongodb
exports.connect=()=>{
mongoose.connect(process.env.MONGODB_URI,
   { useNewUrlParser: true, 
    useUnifiedTopology: true })
    .then(()=>{
      console.log("connected to mongodb successfully");

    })
    .catch((error)=>{
      console.log("error connecting in db");
      console.log(error);
      process.exit(1);
    })
}