const Listing = require('../models/listing')
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({})
    res.render('listings/index.ejs', { allListings })
}
module.exports.renderNewForm = (req, res) => {
    res.render('listings/new.ejs')
}
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate:{ path:"author" }}).populate("owner");
    if (!listing) {
        req.flash('error', 'No listing found')
        res.redirect('/listings')
    }
    console.log(listing)
    res.render('listings/show.ejs', { listing })
}
module.exports.createListing = async (req, res, next) => {
    let url = req.file.path
    let filename= req.file.filename
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id
    newListing.image = {url,filename}
    req.flash("success", "Listing added succefully")
    await newListing.save();
    res.redirect('/listings')
}
module.exports.renderEditForm= async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate('owner');
    if (!listing) {
        req.flash('error', 'No listing found')
        res.redirect('/listings')
    }
    let originalImageUrl = listing.image.url;
    console.log("Ye ha originalUrl",originalImageUrl)
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_250/")
    res.render('listings/edit.ejs', { listing,originalImageUrl })
}
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
   let listing =  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   if(typeof req.file != 'undefined'){
    let url = req.file.path
    let filename= req.file.filename
    listing.image = {url,filename}
    await listing.save();
   }
    req.flash("success", "Listing update succefully")
    res.redirect(`/listings/${id}`)
}
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted succefully")
    res.redirect('/listings')
}