const Listing= require("./models/listing.js")
const Review = require("./models/review.js")
module.exports.islogged = (req, res, next) => {
    if (!req.isAuthenticated()) {
      // store the URL 
      req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a listing");
        //  console.log(req.flash("error")); // Debugging
        return res.redirect("/login");
    }
     return next();
};

// to save the page link after going to signup page
module.exports.saveredirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
  res.locals.redirectUrl=req.session.redirectUrl
  }
  next();
}
// to check the Owner of the listing 
module.exports.isOwner =async(req,res,next)=>{
    const { id  } = req.params;
      let listing = await Listing.findById(id);
      if(!listing.owner.equals(res.locals.currUser._id)){
         req.flash("error","You don't permission to edit")
         return res.redirect(`/listing/${id}`)
      }
      next()
}
// to check the who is creating the review author
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params; 
    let review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found.");
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author.equals(res.locals.currUser._id)) { 
        req.flash("error", "You don't have permission to delete this review.");
        return res.redirect(`/listings/${id}`);
    }

    return next();  // ✅ Allow only the correct user to proceed
};


