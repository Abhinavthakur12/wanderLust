const Listing = require('../models/listing')
const Review = require('../models/reviews')
const flash = require('connect-flash')
module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id)
    console.log(req.body.review)
    let newreview = new Review(req.body.review)
    newreview.author = req.user._id
    listing.reviews.push(newreview);
    await newreview.save()
    await listing.save()
    req.flash("success","Review added succefully")
    res.redirect(`/listings/${listing._id}`)
}
module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","Review deleted succefully")
    res.redirect(`/listings/${id}`)
}