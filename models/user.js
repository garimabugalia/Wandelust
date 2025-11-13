
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userschema = new Schema({

     username: {
        type: String,
        required: false, // Optional display name
    },
    email:{
        type:String,
        required:true,
    },
   profileImage: {
    url: String,
    filename: String,
  },

});


// ✅ Virtual to automatically create thumbnail (Cloudinary transformation)
userschema.virtual("thumbnail").get(function () {
  if (this.profileImage && this.profileImage.url) {
    return this.profileImage.url.replace("/upload", "/upload/w_200"); // small size
  }
  return "/images/default-user.png"; // default image if none
});

// Include virtuals in JSON output (optional but helpful)
userschema.set("toJSON", { virtuals: true });


userschema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userschema);