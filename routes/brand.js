const express = require("express");
const { getByBrandProducts,addBrand, editBrand, deleteBrand, getAllBrands, getOneBrand } = require("../controllers/brandController");
 const { isLoggedIn } = require('../middlewares/usermiddleware')

const router = express.Router();

router.route("/brands").get(isLoggedIn, getAllBrands)
                       .post(isLoggedIn,addBrand);

router.route("/brand/:id").get(isLoggedIn, getOneBrand)
                          .put(isLoggedIn, editBrand)
                          .delete(isLoggedIn, deleteBrand);
router.route("/brand").get(isLoggedIn, getByBrandProducts);



module.exports = router;









