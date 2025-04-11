const mongoose = require("mongoose");
const express=require("express");
const router = express.Router();
const User= require("../models/user.js");
const Listing = require("../models/listing.js");
const WrapAsync = require("../utils/WrapAsync");
const {listingSchema,reviewSchema}= require("../schema.js")
const ExpressError= require("../utils/ExpressError.js")
const passport = require("passport");
const {islogged , isOwner , isReviewAuthor}= require("../middleware.js")
const {saveredirectUrl}=require("../middleware.js")
const listingController=require("../controller/listings.js")
const multer=require("multer") 
const {storage}= require("../cloudConfig.js")
const upload=multer({storage: storage})
 
router.route("/listing")
 // Index route 
  .get(WrapAsync(listingController.index))
    //create a route
  .post(islogged, upload.single("image"), (listingController.createListing)
  );


router.get("/listing/new",islogged, (listingController.addPost)) 

router.route("/listings/:id")
// show a post 
.get( WrapAsync(listingController.showListing))
//update 
.put(islogged,isOwner,upload.single("image"), WrapAsync(listingController.updateListing) )
//delete the post 
.delete(islogged ,isOwner,WrapAsync(listingController.deleteListing) 
);
  
//Edit the post
router.get("/listings/:id/edit",islogged,isOwner, WrapAsync(listingController.editListing));


  // add a new Post using Button in Index.ejs
module.exports= router;