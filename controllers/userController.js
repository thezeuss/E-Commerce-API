const User = require("../models/user");
const Product = require("../models/product")
const BigPromise = require("../middlewares/bigPromises");
const CustomError = require("../utils/customError");
const cookieToken = require("../utils/cookieToken");
const fileUpload = require("express-fileupload");
// const cloudinary = require("cloudinary");
const bigPromises = require("../middlewares/bigPromises");
const crypto = require("crypto");
const mailHelper = require("../utils/mailHelper");

exports.register = BigPromise(async(req, res, next) => {

    const {name, phoneno, password,email} = req.body;

    if(!phoneno || !name || !email){
        return next(new CustomError('Please enter all required fields!', 400));

    };

    const user = await User.create({
        name,
        phoneno,
        password,
        email
    });

    cookieToken(user, res);
});

exports.login = BigPromise(async (req, res, next) => {
        const { email, password} = req.body;
    
        // check mandatory credentials are present or not
        if(!email|| !password) {
            return next(new CustomError('Please provide phone no and password!',400))
        }
        
        // if everything is present, try finding user based on credentials.
        const user = await User.findOne({email}).select("+password");
    
        // user is not in DB
        if(!user) {
            return next(new CustomError('Email or Password does not match or exist.',400))
        }
    
        // user is present, so check for validations, match the password
        const isPassword = await user.isValidatedpassword(password);
         
        // if password is not right
        if(!isPassword) {
            return next(new CustomError('Email or Password does not match or exist.',400))
        }
        
        // everything is fine, send token 😁😁
        cookieToken(user, res)
    
        //log cookie data
        // console.log(req.cookieToken);
    
    
});

exports.logout = BigPromise(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logout success",
    });
});

exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    res.status(200).json({
        
        success: true,
        user
    })

});

exports.updateUserDetails = BigPromise(async (req, res, next) => {

    const {phoneno, password, email, name} = req.body;

    // check mandatory credentials are present or not
    if(!name || !email) {
        return next(new CustomError('Please provide name and phoneno for update process!',400))
    }
    const newData = {
        name: req.body.name,
        phoneno:req.body.phoneno,
        email: req.body.email
        
    };

    const user = await  User.findByIdAndUpdate(req.user.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        user,
    });
});



exports.forgotPassword = BigPromise(async (req, res, next) => {
    // collect email
    const { email } = req.body;
  
    // find user in database
    const user = await User.findOne({ email });
  
    // if user not found in database
    if (!user) {
      return next(new CustomError("Email not found as registered", 400));
    }
  
    //get token from user model methods
    const forgotToken = user.getForgotPasswordToken();
  
    // save user fields in DB
    await user.save({ validateBeforeSave: false });
  
    // create a URL
    const myUrl = `${req.protocol}://${req.get("host"
    )}/api/v1/password/reset/${forgotToken}`;
  
    // craft a message
    const message = `Copy paste this link in your URL and hit enter \n\n ${myUrl}`;
  
    // attempt to send email
    try {
      await mailHelper({
        email: user.email,
        subject: "SOIDO - Password reset email",
        message,
      });
  
      // json reponse if email is success
      res.status(200).json({
        succes: true,
        message: "Email sent successfully",
      });
    } catch (error) {
      // reset user fields if things goes wrong
      user.forgotPasswordToken = undefined;
      user.forgotPasswordExpiry = undefined;
      await user.save({ validateBeforeSave: false });
  
      // send error response
      return next(new CustomError(error.message, 500));
    }
});

exports.passwordReset = BigPromise(async (req, res, next) => {
    //get token from params
    const token = req.params.token;
  
    // hash the token as db also stores the hashed version
    const encryToken = crypto
                       .createHash("sha256")
                       .update(token)
                       .digest("hex");
  
    // find user based on hased on token and time in future
    const user = await User.findOne({
      encryToken,
      forgotPasswordExpiry: { $gt: Date.now() },
    });

    console.log(user);;
  
    if (!user) {
      return next(new CustomError("Token is invalid or expired", 400));
    }
  
    // check if password and conf password matched
    if (req.body.password !== req.body.confirmPassword) {
      return next(
        new CustomError("password and confirm password do not match", 400)
      );
    }
  
    // update password field in DB
    user.password = req.body.password;
  
    // reset token fields
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
  
    // save the user
    await user.save();
  
    // send a JSON response OR send token
  
    cookieToken(user, res);


  }); //problem

exports.changePassword = BigPromise( async (req, res, next) => {

    const userId = req.user.id

    const user = await User.findById(userId).select("+password")

    const isCorrectOldPassword = await user.isValidatedpassword(req.body.oldPassword);

    if(!isCorrectOldPassword) {
        return next(new CustomError("Old password is incorrect!",400))

    }
    user.password = req.body.password;

    await user.save();

    cookieToken(user, res);
});



exports.adminAlluser = BigPromise( async (req,res, next)=>{
    const users = await User.find();

    res.status(200).json({
        success: "true",
        users,
    })
});

exports.admingetOneUser = BigPromise( async (req,res, next)=>{
    
    const user = await User.findById(req.params.id);
       
    if(!user) {
        next (new CustomError("No Users found", 400));
    }
    res.status(200).json({
        success: true,
        user
    })

});

exports.adminDeleteOneUser = BigPromise(async (req,res,next)=> {
const user = await User.findById(req.params.id);

if(!user) {
    return next(new CustomError("No such User Found", 401));
}

// const product = await Product.find({user : req.header});

  
//   //destroy the existing image
//   for (let index = 0; index < product.photos.length; index++) {
//     const res = await cloudinary.v2.uploader.destroy(product.photos[index].id);
//   }

//   await product.remove();

await user.remove();

res.status(200).json({
    success: "true",
    message: "User Deleted! Cattles uploaded by the user also deleted!"
});


});









