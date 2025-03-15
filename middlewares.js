const Listing = require('./models/listing')
const ExpressError = require("./utils/ExpressError")
const {listingSchema,reviewSchema} = require('./schema')
const Review = require('./models/reviews')
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        console.log(req.originalUrl)
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged In")
        return res.redirect('/login')
    }
    next()
}
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}
module.exports.isOwner = async(req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing")
        return res.redirect(`/listings/${id}`)
    }
    next()
}
module.exports.validateListing = (req,res,next)=>{
    let result = listingSchema.validate(req.body)
    if(result.error){
        const message = result.error.details.map((el)=>el.message).join(',')
        throw new ExpressError(400,message)
    }else{
        next()
    }
}
module.exports.validateReview = (req,res,next)=>{
    let result = reviewSchema.validate(req.body)
    if(result.error){
        const message = res.error.details.map((el)=>el.message).join(',')
        throw new ExpressError(400,message)
    }else{
        next()
    }
}
module.exports.isreviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId).populate('author');
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author");
        return res.redirect(`/listings/${id}`)
    }
    next()
}