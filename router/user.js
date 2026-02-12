const mongoose = require("mongoose");
const express=require("express");
const router = express.Router();
const User= require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const {saveredirectUrl}=require("../middleware.js")
const userController=require("../controller/users.js")

router.route("/signup")

 // for the signup the account
  .get(userController.signup)
// 
  .post( WrapAsync(userController.addAccount));

//----Login to the account 
router.route("/login")
  // for login the account 
  .get(userController.login) 

// add the authentication
.post(saveredirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
  userController.loginValidation)

   // for logout the user
   router.get("/logout",userController.logout)
   
   module.exports= router; 