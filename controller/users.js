 const User= require("../models/user.js");
  
 module.exports.signup=(req,res)=>{
    res.render("users/signup.ejs")
  }
  //add the account to the database
  module.exports.addAccount=(async (req,res)=>{
    try{
       let {username, email, password} = req.body;
       let newUser = new User({username, email})
       let registerUser =  await User.register(newUser, password);
       req.login(registerUser,(err)=>{
          if(err){
            return next(err);
          }
       req.flash("success","succesful add ")
       res.redirect("/listing")
       })
    }
    //Not create a  new account
    catch (e){
         req.flash("error",e.message)
         res.redirect("/signup.ejs");
    }
    })
  
// login into Account
module.exports.login=(req,res)=>{
     res.render("users/login.ejs")
  }

//after login validation
module.exports.loginValidation=async(req,res)=>{
       req.flash("success","Welcome ! You are logged in ")
       const redirectUrl = res.locals.redirectUrl || "/listing";
       res.redirect(redirectUrl);

   }
// logout the session
module.exports.logout=(req,res,next )=>{
         req.logout((err)=>{
         if(err){
            return n
            ext(err)
         }
         req.flash("success","You are logged out ")
         res.redirect("/listing")
         })  
   }

   