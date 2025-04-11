const express= require("express")
const app = express();

app.listen(3000,(req,res)=>{
   console.log("app is listening")
})

app.get("/getcookie",(req,res)=>{
   res.cookie("greet","hello")
      
   res.send("this is inside the cookie route")
})

app.get("/",(req,res)=>{
   res.send("this is the root page")
})
// 