  if(process.env.NODE_ENV!="production"){
    require("dotenv").config()
  }

  // console.log(process.env)
  // Import the important function that is used in this
  const mongoose = require("mongoose");
  const Listing = require("./models/listing.js");
  const express=require("express"); 
  const app= express();
  const path= require("path")
  // const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
  const MONGO_URL = process.env.ATLASTDB_URL ;
  const methodOverride= require("method-override")
  const ejsmate= require("ejs-mate");
  const WrapAsync= require("./utils/WrapAsync.js")
  const ExpressError= require("./utils/ExpressError.js")
  const  session= require("express-session")
  const MongoStore = require('connect-mongo');
  const flash = require("connect-flash")
  const user= require("./models/user.js");
  const userRouter= require("./router/user.js");
  const listingRouter = require("./router/listing.js")
  const reviewRouter=require("./router/review.js")
 
  const multer=require("multer")
  const {storage}= require("./cloudConfig.js")
  const upload=multer({storage: storage})
  
  const passport = require("passport");
  const LocalStrategy = require("passport-local")

// Use the file access from the directory
  app.engine("ejs",ejsmate)
  app.set("view engine","ejs") 
  app.set("views",path.join(__dirname,"views"))  
  app.use(express.urlencoded({ extended: true }));
  app.use(methodOverride("_method"));
  app.use(express.static (path.join(__dirname,"/public")))
  
  const store=MongoStore.create({
     mongoUrl: MONGO_URL,
     crypto: {
        secret:process.env.SECRET
     },
     touchAfter : 24*3600,
  })
  store.on("error",function(e){console.log(e)})
// use for Express Session 
  const sessionOption= {
     store,
     secret: process.env.SECRET,
     resave: false,
     saveUninitialized : true,
     Cookie :{
       expires : Date.now(), 
       maxAge : 1*24*60*60*1000,
       httpOnly: true 
    }
}

  app.use(session(sessionOption))
  app.use(flash()) 
  app.use(passport.initialize())
  app.use(passport.session()) 
  passport.use(new LocalStrategy(user.authenticate()))

  passport.serializeUser(user.serializeUser())
  passport.deserializeUser(user.deserializeUser())
 // this is the middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success"); // ✅ Pass success messages
    res.locals.error = req.flash("error");     // ✅ Pass error messages
    res.locals.currUser = req.user;            // ✅ Pass current user info
    next();
});

//Creation of the Router 

//send the information to the router x
app.use("/", userRouter); 
app.use("/", listingRouter);
app.use("/", reviewRouter);

// Creation of a Demo Listing 
app.use("/demouser", async (req,res)=>{
   let fakeuser= new user({
     email: "ej@gmail.com",
     username: "dryebsk",
   })
   let registerUser = await user.register(fakeuser,"helloworld")
   res.send(registerUser)
})

  main()
    .then(() => {
      console.log("connected to DB");
    })
    .catch((err) => {
      console.log(err) ;
    });

  // Connection Start by the Port 
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
    res.render(index.ejs);
  })

  //Handling the error raised by Post Method
  // app.use((err, req, res, next) => {
  //     let errr= (statusCode=500, message="Something went wrong")
  //     // res.status(statusCode).send(message);
  //     res.render("error.ejs",{message})
  // })
  // //route access to all 
  // app.all("*",(req,res,next)=>{
  //   next(new ExpressError(404,"Page Not Found"));
  // })
   // Review section 
   //Post route
   
   // create the review 
