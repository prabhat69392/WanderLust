const Review = require("../models/review.js")
const User = require("../models/user")
const Listing = require("../models/listing.js")

// create the Review
module.exports.createReview=async (req,res)=>{
      let listing= await Listing.findById(req.params.id);
      let newReview = new Review(req.body.review)
       newReview.author= req.user._id;
      
      listing.reviews.push(newReview)
      await listing.save()
      await newReview.save()
       req.flash("success" ,"new review created ")
      res.redirect(`/listings/${listing._id}`)
   }
   // delete the review
   module.exports.destroyReview= (async (req, res) => {
       const { id, reviewId } = req.params;
   
       // Ensure the review exists before deleting
       let review = await Review.findById(reviewId);
       if (!review) {
           req.flash("error", "Review not found or already deleted.");
           return res.redirect(`/listings/${id}`);
       }
   
       // Remove reference from listing
       await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
   
       // Delete review from Review collection
       await Review.findByIdAndDelete(reviewId);
   
       req.flash("success", "Review deleted successfully.");
       res.redirect(`/listings/${id}`);
   })
   