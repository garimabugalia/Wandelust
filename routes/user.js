 const express = require("express");
 const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const multer = require("multer");
const{saveredirecturl} = require("../middleware.js");
const usercontroller = require("../controllers/users.js");
const {userStorage } = require('../cloudConfig.js');
const upload = multer({ storage: userStorage });



//router route
router.route("/signup")
.get( usercontroller.rendersignupform)
.post(saveredirecturl, upload.single("profileImage"),wrapAsync(usercontroller.signup));



//^^^^^^^^^^^^^^^^^^^router route for login
router.route("/login")
.get(usercontroller.renderloginform)
.post(saveredirecturl, passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }),usercontroller.login);



 //logout route
 router.get("/logout",usercontroller.logout);

 module.exports = router;