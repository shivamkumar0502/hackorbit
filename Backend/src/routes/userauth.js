const express = require('express');
// const multer = require("multer");
const authRouter = express.Router();
const {register, login ,logout,adminRegister,deleteProfile} =require('../controllers/userAuthent');
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require('../middleware/adminMiddleware');


authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',userMiddleware,logout);
authRouter.post('/admin/register',adminMiddleware ,adminRegister);
authRouter.delete('/deleteProfile',userMiddleware,deleteProfile);


authRouter.get('/check',userMiddleware,(req,res)=>{

    // const reply = {
    //     firstName: req.result.firstName,
    //     emailId: req.result.emailId,
    //     _id:req.res._id
        
    // }
    const reply = {
    _id: req.result._id,
    firstName: req.result.firstName,
    emailId: req.result.emailId,
    role: req.result.role   // 🔥 VERY IMPORTANT
  };
    
    res.status(200).json({
        user:reply,
        message:"Valid User"
    })
})



module.exports = authRouter;
//login
//logout
//Getprofile