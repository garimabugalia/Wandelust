const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
    
  },
  description: String,
  image: {
       url:String,
       filename:String,
  },
  price: Number,
  location: String,
  country: String,

  review:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Review"
    },
  ],
  owner:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
  },
   geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

listingSchema.post("findOneAndDelete", async function(listing){
  if(listing){
      await Review.deleteMany({ _id: { $in: listing.review } });
  }
  }); 