const Listing = require("../models/listing.js");
const axios = require("axios");


module.exports.index =  async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index.ejs", { listings });
};

//new route
module.exports.newformroute = (req, res) => {
  console.log(req.user);
 
  res.render("listings/new.ejs");
};

//show route
module.exports.showlisting = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({path:"review",populate:{path:"author",},}).populate("owner");
  if(!listing){
       req.flash("error"," listing you requested doesn't exist....");
      return res.redirect("/listings");
  }
  
  
  // 🧭 Use MapTiler Geocoding API to get exact lat/lng for entered location
  let lat = 20.5937; // default India center
  let lng = 78.9629;
  const MAPTILER_KEY = "aYLMduyIFseC4haIoSTI";

  try {
    const geoUrl = `https://api.maptiler.com/geocoding/${encodeURIComponent(
      listing.location
    )}.json?key=${MAPTILER_KEY}`;
    const response = await axios.get(geoUrl);

    if (response.data.features && response.data.features.length > 0) {
      const [lon, latVal] = response.data.features[0].geometry.coordinates;
      lat = latVal;
      lng = lon;
    }
  } catch (err) {
    console.error("Error fetching location from MapTiler:", err.message);
  }

 // console.log("📍 Final Coordinates:", lat, lng);

 
  res.render("listings/show.ejs", { listing , lat, lng ,MAPTILER_KEY });
};


//create route
module.exports.createlisting =async (req, res, next) => {
  const { location } = req.body.listing;
  const apiKey = process.env.MAPTILER_API_KEY;

  const geoRes = await axios.get(
    `https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${apiKey}`
  );
   const feature = geoRes.data.features[0];
 
  const [lng, lat] = feature.geometry.coordinates;
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  
  //map setting
  newListing.geometry = { type: "Point", coordinates: [lng, lat] };
  newListing.latitude = lat;
  newListing.longitude = lng;
  newListing.owner =req.user._id;
  newListing.image ={url,filename};
  await newListing.save();
  req.flash("success","New listing created...");
  res.redirect("/listings");
};


//edit route
module.exports.editform =async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
       req.flash("error"," listing you requested doesn't exist....");
      return res.redirect("/listings");
  };
  let originalimage = listing.image.url;
  originalimage=originalimage.replace("/upload","/upload/w_250");
  res.render("listings/edit.ejs", { listing,originalimage });
};


//update route 
module.exports.updatelisting =async (req, res) => {
  let { id } = req.params;
 let listing= await Listing.findByIdAndUpdate(id, { ...req.body.listing });


  if(typeof req.file !== "undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image ={url,filename};
  await listing.save();
  }
   req.flash("success"," listing updated...");
  res.redirect(`/listings/${id}`);
};

//delete listing 
module.exports.destorylisting = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
   req.flash("success"," listing deleted...");
  res.redirect("/listings");
};

