const mongoose = require("mongoose")
const Listing = require("../models/listing")
const initData = require("./data")
main().then(() => console.log("MongoDB connected")).catch(err => console.log(err));
async function main(){
    await mongoose.connect("mongodb://localhost:27017/wanderLust")
}
const initDB = async()=>{
    await Listing.deleteMany({}); //deletes all the data in the collection
    initData.data = initData.data.map((v)=>({...v,owner:'67c5a19169f8c8e5579d699d'}));
    await Listing.insertMany(initData.data); //inserts the data in the collection
    console.log("Database initialized");
}
initDB(); //initializes the database with the data in the data.js file