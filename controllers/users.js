const User = require('../models/user');
module.exports.renderSignUpForm = (req,res)=>{
    res.render('users/signup.ejs')
}
module.exports.signup = async(req,res)=>{
    try{
        let{email,username,password} = req.body;
        const user =  new User({email,username})
        const registeredUser = await User.register(user,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash('success',"Welcome to community")
            res.redirect('/listings')
        })
    }catch(err){
        req.flash('error',err.message)
        res.redirect('/signup')
    }
}
module.exports.renderLoginForm = (req,res)=>{
    res.render('users/login.ejs')
}
module.exports.login = async(req,res)=>{
    req.flash("success","Wlcm back to WanderLust");
    const redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl)
}
module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","LogOut Succefull")
        res.redirect('/listings')
    })
    }