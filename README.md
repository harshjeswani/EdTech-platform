# Backend for StudyNotion – An EdTech Platform
This repository contains the complete backend implementation of StudyNotion, an educational technology platform that enables users to register, enroll in courses, track progress, and make secure payments.

# Core Features
User Authentication & Authorization
Secure login and registration using JWT-based auth and role-based access control for admins, instructors, and students.

Course Management
Instructors can create, update, and publish courses with support for sections, sub-sections, videos, and descriptions.

Student Enrollment & Progress Tracking
Learners can enroll in courses, track their completion, and revisit content at any time.

Ratings & Reviews
Students can provide feedback for courses, and ratings are aggregated for public display.

Secure Payments with Razorpay
Integration with Razorpay to handle checkout, order creation, and payment verification for paid courses.

Cloud Storage for Videos
Course videos and assets are uploaded to cloud storage (e.g., Cloudinary) for efficient delivery.

Email Notifications
Automated email communication for key events like signup, enrollment, and payment confirmation.

# Tech Stack

Node.js & Express – Server and routing
MongoDB & Mongoose – NoSQL database and ORM
JWT & Bcrypt – Authentication and password hashing
Razorpay API – Payment gateway integration
Cloudinary – Media hosting
Nodemailer – Email delivery service
Dotenv – Environment configuration

