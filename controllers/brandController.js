const Product = require("../models/product");
const BigPromise = require("../middlewares/bigPromises");
const CustomError = require("../utils/customError");
const cloudinary = require("cloudinary");
const WhereClause = require("../utils/whereClause");
const user = require("../models/user");
const userToken = require("../middlewares/usermiddleware");
const jwt = require("jsonwebtoken");
const Brand = require("../models/brand");
const product = require("../models/product");

exports.addBrand = BigPromise(async (req, res, next) => {
    
    const { name }  = req.body;

    const brand = await Brand.create(req.body);
  
    res.status(200).json({
      success: true,
      brand,
    });
  });

exports.editBrand = BigPromise(async (req, res, next) => {
    
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
        return next(new CustomError("No Brand found with this id", 401));}

    updatedBrand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      })
  
    res.status(200).json({
      success: true,
      updatedBrand,
    });
  });

exports.getAllBrands =  BigPromise(async (req, res, next) => {
    
    const brands = await Brand.find();
  
    res.status(200).json({
      success: true,
      brands,
    });
  });

exports.getOneBrand = BigPromise(async (req, res, next) => {
    const brand = await Brand.findById(req.params.id);
  
    if (!brand) {
      return next(new CustomError("No product found with this id", 401));
    }
    res.status(200).json({
      success: true,
      brand,
    });
  });

exports.deleteBrand = BigPromise(async (req, res, next) => {

    const brand = await Brand.findById(req.params.id);
     
    if(!brand) {
        return next(new CustomError("No such Brand Found", 401));
    }
    else {
    await Brand.findByIdAndDelete(req.params.id);

    
    res.status(200).json({
        success: true,
        message: " Your brand was deleted !",
        brand
      });
    

    }


  });

exports.getByBrandProducts = BigPromise(async (req, res, next) => {
    const product = await Brand.aggregate([

        {$lookup:{ from: 'products', localField:'_id', 
          foreignField:'brand',as:'products'}},{ $sort : { name : 1 }}
    
  ]); 
  
    res.status(200).json({
        product
    })
  });

  