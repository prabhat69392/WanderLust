const Listing = require("../models/listing.js")
const {listingSchema,reviewSchema}= require("../schema.js")

//index
module.exports.index=async (req,res)=>{
      const allListing= await Listing.find({})
      res.render("./listings/index.ejs", { allListing }); 
 }
// show
module.exports.showListing= async (req,res,next)=>{
        let {id} = req.params;
        let listing = await Listing.findById(id)
        .populate({
          path : "reviews",
          populate : {
          path : "author"
          }
        })
        .populate("owner");
        if(!listing){
          req.flash("error" ,"listing does not exist ")
          res.redirect("/listings ")
        }
          res.render("./listings/show.ejs",{listing})
  }
  //create
  module.exports.createListing=(async(req,res,next)=>{
          let url = req.file.path;
          let filename= req.file.filename;

          // listingSchema.validate(req.body)  
          const newlisting= new Listing(req.body.listings);
          newlisting.image={url,filename} 
          newlisting.owner= req.user._id; 
          await newlisting.save()
          req.flash("success" ,"new listing created")
          res.redirect("/listing")   
        
      })
//edit
module.exports.editListing = async(req,res)=>{
      let {id} = req.params;
        let listing = await Listing.findById(id);
        if(!listing){  
           req.flash("error","Listing that you requested does not exist ")
           res.redirect("/listing")
        }
         let orginalImageUrl=listing.image.url;
         orginalImageUrl=orginalImageUrl.replace("/upload", "/upload/h_300,w_250")

        res.render("./listings/edit.ejs",{listing,orginalImageUrl})
  }
//update
module.exports.updateListing=async (req, res) => {
      const { id } = req.params;
      let listing = await Listing.findById(id);
      if(!listing.owner.equals(res.locals.currUser._id)){
         req.flash("error","You don't permission to edit")
         res.redirect(`/listing/${id}`)
      }
      let listings=await Listing.findByIdAndUpdate(id, { ...req.body.listing });

      if(typeof req.file !== "undefined"){
      let url = req.file.path;
      let filename= req.file.filename;
      listings.image={url, filename};
      await listings.save() 
      }
      req.flash("success","listing updated!")
      res.redirect(`/listings/${id}`); // Redirect to the updated listing's show page
  }
  //delete
  module.exports.deleteListing= async (req, res) =>{
      const { id } = req.params;
        let deleted= await Listing.findByIdAndDelete(id);
        req.flash("success" ,"Post listing deleted")
        res.redirect("/listing");
    } 

// add a post
module.exports.addPost =(req,res)=>{

        res.render("./listings/new.ejs")
    }