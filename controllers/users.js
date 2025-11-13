const User = require("../models/user");
const { cloudinary } = require('../cloudconfig.js'); // ADD this line




// Render signup form
module.exports.rendersignupform = (req, res) => {
  res.render("users/signup.ejs");
};

// ✅ Signup controller (with profile image upload)
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });

    // ✅ Upload image to Cloudinary (if file exists)
   if (req.file) {
  console.log("File uploaded:", req.file);
  const result = await cloudinary.uploader.upload(req.file.path);
  console.log("Cloudinary upload result:", result);

  newUser.profileImage = {
    url: result.secure_url,
    filename: result.public_id
  };
} else {
  console.log("No file uploaded!");
}

    // register the user with passport-local-mongoose
    const registeredUser = await User.register(newUser, password);

    // automatically login after signup
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

// Render login form
module.exports.renderloginform = (req, res) => {
  res.render("users/login.ejs");
};

// Login controller
module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

// Logout controller
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You have logged out successfully!");
    res.redirect("/listings");
  });
};
