const express = require("express");
const { addProduct, getAllProduct, deleteMyProduct, adminGetAllProduct, getOneProduct, getMyUploads, updateMyProduct, adminGetOneProduct,adminDeleteProduct, getByBrand} = require("../controllers/productController");

const { isLoggedIn, customRole, currentUserID} = require("../middlewares/usermiddleware");
const jwt = require("jsonwebtoken")
// const router = express.Router();

const router = express.Router();

//User Routes
router.route("/product/add").post(isLoggedIn, addProduct);
router.route("/products").get(isLoggedIn, getAllProduct);
router.route("/product/:id").get(isLoggedIn, getOneProduct);
router.route("/product/:id").put(isLoggedIn, currentUserID, updateMyProduct);
router.route("/prodcuct/:id").delete(isLoggedIn, currentUserID, deleteMyProduct);
router.route("/myuploads").get(isLoggedIn, currentUserID, getMyUploads);
router.route("/product/brand/:brandid").get(isLoggedIn,getByBrand);

//admin
router.route("/admin/products").get(isLoggedIn, customRole("admin"), adminGetAllProduct);
router.route("/admin/products/:id").get(isLoggedIn, customRole("admin"), adminGetOneProduct);
router.route("/admin/products/:id").delete(isLoggedIn, customRole("admin"), adminDeleteProduct);




module.exports = router;