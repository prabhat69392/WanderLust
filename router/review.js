const mongoose = require("mongoose");
const express=require("express");
const router = express.Router();
const User= require("../models/user.js");
const Listing = require("../models/listing.js");
const WrapAsync = require("../utils/WrapAsync");
const passport = require("passport");
const {saveredirectUrl}=require("../middleware.js")
const userController=require("../controller/users.js")
const {islogged , isOwner , isReviewAuthor}= require("../middleware.js")
const reviewController= require("../controller/reviews.js")

router.post("/listings/:id/reviews",islogged, reviewController.createReview)

//delete review route
router.delete("/listings/:id/reviews/:reviewId", islogged, isReviewAuthor, WrapAsync(reviewController.destroyReview));



module.exports= router;