 const express = require("express");
 const router = express.Router({ mergeParams: true });
 const wrapAsync = require("../utils/wrapAsync.js");
 const ExpressError = require("../utils/ExpresssError.js");
//const{reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReviewSchema,isloogedin,isreviewauthor} = require("../middleware.js");
const reviewcontroller = require("../controllers/reviews.js");




 //^^^^^^^^^^^^^^^^^^^^^^^^^^^^Review Route^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//
router.post("/",isloogedin,validateReviewSchema, wrapAsync(reviewcontroller.createreview));


//^^^^^^^^^^^^^^^^^^^^^^^^^^^^Review  DELETERoute^^^^^^^^^^^^^^^^^^^^^^^^^^^^^//

router.delete("/:reviewId",isloogedin,isreviewauthor, wrapAsync(reviewcontroller.destroyreview));


module.exports = router;