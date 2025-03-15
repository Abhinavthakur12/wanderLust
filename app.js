if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError")
const listingRouter = require('./router/listing.js')
const reviewRouter = require('./router/review.js')
const userRouter = require('./router/user.js')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const dbURL = process.env.ATLASDB_URL
app.engine('ejs', ejsMate);
app.use(methodOverride('_method'))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(flash());
main().then(() => console.log("MongoDB connected")).catch(err => console.log(err));
async function main(){
    await mongoose.connect(dbURL)
}
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter: 24*60*60
})
store.on("error",()=>{
    console.log(" Error in mongo Session store error",err)
})
const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true
    }
};

app.use(session(sessionOptions))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use((req,res,next)=>{
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    res.locals.currUser = req.user
    next();
})
app.use('/listings',listingRouter);
app.use('/listings/:id/reviews',reviewRouter);
app.use('/',userRouter)
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"))
})
app.use((err,req,res,next)=>{
    // let {status=500,message="not able to get"} = err;
    // res.status(status).send(message);
    res.render("listings/error.ejs",{err})
})
