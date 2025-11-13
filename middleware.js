
const Listing = require("./models/listing");
const Review = require("./models/review.js");
const{reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpresssError.js");



module.exports .isloogedin = (req,res,next)=>{

     if(!req.isAuthenticated()){
      req.session.redirecturl = req.originalUrl;
    req.flash("error","you must be looged in first....");
     return res.redirect("/login");
  }
   next();
}


module.exports.saveredirecturl = (req,res,next)=>{

   if(req.session.redirecturl){
      res.locals.redirecturl = req.session.redirecturl;
   }
   next();
};

module.exports.isowner = async(req,res,next)=>{
     let { id } = req.params;
      let listing = await Listing.findById(id);
      if(!  listing.owner._id.equals(res.locals.curruser._id)){
        req.flash("error","you are not the owner of this listings.");
        return res.redirect(`/listings/${id}`)
      }
      next();
}

module.exports. validateReviewSchema = (req,res,next)=>{
      let {error}= reviewSchema.validate(req.body);
 
  if(error){
    let errmsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errmsg);
  }else{
    next();
  }

}


module.exports.isreviewauthor = async(req,res,next)=>{
     let {id, reviewId } = req.params;
      let review = await Review.findById(reviewId);
      if(!  review.author.equals(res.locals.curruser._id)){
        req.flash("error","you are not the owner of this listings.");
        return res.redirect(`/listings/${id}`)
      }
      next();
}

