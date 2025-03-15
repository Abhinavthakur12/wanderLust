const mongoose = require("mongoose")
const Review = require('./reviews')
const ListingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
    },
    image:{
       url:String,
       filename:String
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})

ListingSchema.post('findOneAndDelete',async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
})
const Listing = mongoose.model("Listing", ListingSchema)
module.exports = Listing;