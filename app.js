const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const express=require("express"); 
const app= express();
const path= require("path")
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const methodOverride= require("method-override")
const ejsmate= require("ejs-mate");
const WrapAsync= require("./utils/WrapAsync.js")
//  const ExpressError= require("./utils/ExpressError.js")
app.engine("ejs",ejsmate)
app.set("view engine","ejs") 
app.set("views",path.join(__dirname,"views"))  
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static (path.join(__dirname,"/public")))
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err) ;
  });
 let port=3000;
 app.listen(port, (req,res) => {
   console.log("port is listing") 
 })

async function main() {
  await mongoose.connect(MONGO_URL);
}
  
// const initDB = async () => {
//   await Listing.deleteMany({});
//   await Listing.insertMany(initData.data);
//   console.log("data was initialized");
// };
// initDB();  // only write the function not to write save to db
app.get("/testing", async (req,res)=>{
   let sampleListing= new Listing({
      title :"My first ride",
      description: "This is my last ride",
      price: 10000,
      location: "Pattaya", 
      image: "https://www.google.com",
      country :"Thailand"
    });
   await sampleListing.save()
   console.log("successful saved ")
   res.send("success ")
})
app.get("/",(req,res)=>{
   
  res.send("this is the first page")
}) 
// Index route 
app.get("/listing",async (req,res)=>{
    const allListing= await Listing.find({})
     res.render("./listings/index.ejs", { allListing }); 
     }) 
// add a new Post using Button in Index.ejs
app.get("/listing/new", (req,res)=>{
       res.render("./listings/new.ejs")
  })
  //create a route
  app.post("/listings", WrapAsync(async(req,res,next)=>{
     
      const newlisting= new Listing(req.body.listings);
       await newlisting.save()
      res.redirect("/listing")
    
  }));
  // show a post
app.get("/listings/:id", async(req,res)=>{
       let {id} = req.params;
       let listing = await Listing.findById(id);
        res.render("./listings/show.ejs",{listing})
})
//Edit the post
app.get("/listings/:id/edit", async(req,res)=>{
     let {id} = req.params;
      let listing = await Listing.findById(id);
      res.render("./listings/edit.ejs",{listing})
})
 //update 
 app.put("/listings/:id", async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`); // Redirect to the updated listing's show page
});
//delete the post 
app.delete("/listings/:id", async (req, res) =>{
   const { id } = req.params;
    let deleted= await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
} 
) 
//Handling the error raised by Post Method
app.use((err, req, res, next) => {
    //  let (statusCode=500,message="Something went wrong")=err
     res.status(statusCode).send(message);
})
//route access to all 
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found"));
})
