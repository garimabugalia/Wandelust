 const express = require("express");
 const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
 const ExpressError = require("../utils/ExpresssError.js");
const{listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const{isloogedin, isowner} =require("../middleware.js");
const listingcontroller = require("../controllers/listing");
const multer  = require('multer');
const cloudConfig = require("../cloudconfig.js"); 
const upload = multer({ storage: cloudConfig.storage });





//^^^^^^^^^^^^^^^^^^^^^^validations^^^^^^^^^^^^^^^^^^^^^^^^^//

const validateschema = (req,res,next)=>{
      let {error}= listingSchema.validate(req.body);
 
  if(error){
    let errmsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errmsg);
  }else{
    next();
  }

}


//router index and create 
router.route("/")
.get(wrapAsync(listingcontroller.index))
 .post( isloogedin,upload.single('listing[image]'),validateschema, wrapAsync(listingcontroller.createlisting));


//New Route
router.get("/new",isloogedin, listingcontroller.newformroute);

//router route show,delete,update
router.route("/:id")
.get(wrapAsync(listingcontroller.showlisting))
.put(isloogedin,isowner,upload.single("listing[image]"),validateschema, wrapAsync(listingcontroller.updatelisting))
.delete(isloogedin,isowner,wrapAsync(listingcontroller.destorylisting));


//Edit Route
router.get("/:id/edit",validateschema,isloogedin,isowner, wrapAsync(listingcontroller.editform));


module.exports = router;