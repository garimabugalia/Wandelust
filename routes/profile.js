const express = require("express");
const router = express.Router();
const {isloogedin } = require("../middleware");
const profileController = require("../controllers/profile");
const multer = require("multer");
const { userStorage } = require("../cloudconfig"); 
const upload = multer({ storage: userStorage }); 


// ------------------------------------------------------------------
// 1. Profile Main
router.get("/", isloogedin, profileController.renderProfile);

// ------------------------------------------------------------------
// 2. Edit Profile
router.get("/edit", isloogedin, profileController.renderEditForm);

// POST route for file upload and profile update
router.post(
    "/edit", 
    isloogedin, 
    upload.single("profileImage"), // Multer handles file
    profileController.updateProfile
);

// ------------------------------------------------------------------
// 3. Settings
router.get("/settings", isloogedin, profileController.renderSettings);

// ------------------------------------------------------------------
// 4. My Properties
router.get("/my-properties", isloogedin, profileController.myProperties);
// ------------------------------------------------------------------
// 5. Booked Properties
router.get("/booked-properties", isloogedin, profileController.renderBookedProperties);

// ------------------------------------------------------------------
// 6. Booking Actions

// A. Book a listing (FIX for 404)
router.post("/bookings/:id", isloogedin, profileController.bookListing);

// B. Delete/Cancel a booking (Uses the cancelBooking controller)
router.delete("/bookings/:id", isloogedin, profileController.cancelBooking);

module.exports = router;