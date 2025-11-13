

if(process.env.NODE_ENV !="production"){
  require('dotenv').config();
}

//console.log(process.env);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const dburl= process.env.NODE_ENV === "production"
  ? process.env.ATLASDB_URL
  : "mongodb://127.0.0.1:27017/wanderlust";
const ExpressError = require("./utils/ExpresssError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");
const passport = require("passport");
const localstratergy = require("passport-local");




const user = require("./models/user.js");
const User = require("./routes/user.js");
const listing = require("./routes/listing.js");
const reviews = require("./routes/reviews.js");



  



main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dburl);
}



//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);



//^^^^^^^^^mongosession store (connect-mongo  )
const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600 // time period in seconds
});
store.on("error",()=>{
  console.log("Error in Mongo session store",err);
});


//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^session config^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//
const sessionoption ={
  store,
  secret :process.env.SECRET ,
  resave : false,
  saveUninitialized : true,
  cookie : {
    httpOnly : true,
    expires : Date.now() + 1000*60*60*24*7,
    maxAge : 1000*60*60*24*7,
  },
};


// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });




app.use(session(sessionoption));
app.use(flash());



app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstratergy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());




//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^session config^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//



app.use((req,res,next)=>{

  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
 res.locals.curruser = req.user||null;
 
  next();
})



app.use("/listings", listing);
app.use("/listings/:id/reviews", reviews);
app.use("/",User);


app.get("/testListing", async (req, res) => {
  let sampleListing = new Listing({
    title: "My New Villa",
    description: "By the beach",
    price: 1200,
    location: "Calangute, Goa",
    country: "India",
  });

  await sampleListing.save();
  console.log("sample was saved");
  res.send("successful testing");
});

app.use((req,res,next)=>{
  next(new ExpressError(404,"Page Not Found"));
});

//^^^^^^^^^^^^^^^^^^^^^^^^^^^server side error handling^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  //res.status(statusCode).send(message);
 res.status(statusCode). render("listings/error.ejs",{err});
});

//^^^^^^^^^^^^^^^^^^^^^^^^^^^server side error handling^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//




app.listen(8080, () => {
  console.log("server is listening to port 8080");
});