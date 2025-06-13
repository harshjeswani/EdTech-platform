const express=require('express');
const app=express();

const userRoute=require('./routes/User');
const profileRoute=require('./routes/Profile');
const courseRoute=require('./routes/course');
const paymentRoute=require('./routes/Payment');

const database=require('./config/database');
const cookieparser=require("cookie-parser");
const cors=require("cors");

const {razorpay}=require('./config/razorpay');
const fileupload=require('express-fileupload');

const dotenv=require('dotenv');
const fileUpload = require('express-fileupload');

const PORT=process.env.PORT ||4000;

//database connect;
database.connect();

//middleware
app.use(express.json());
app.use(CookieParser());
app.use(
  cors({
    origin:"http://localhost:3000",
    credentials:true
  }) 
)
app.use(
  fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp"
  })
)


//routes
app.use("/api/v1/auth",userRoute);
app.use("/api/v1/profile",profileRoute);
app.use("/api/v1/course",courseRoute);
app.use("/api/v1/payment",paymentRoute);

app.listen(PORT,()=>{
   console.log(`app is running at ${PORT}`);
})