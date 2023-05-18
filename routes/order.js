const express = require("express");
const { createOrder, getOneOrder, getMyOrder, getOrders, adminUpdateOrder, admindeleteOrder } = require("../controllers/orderController");
const { isLoggedIn, customRole } = require("../middlewares/usermiddleware");
const router = express.Router();


router.route("/order/create").post(isLoggedIn, createOrder);
router.route("/order/:id").get(isLoggedIn, getOneOrder);
router.route("/myorders").get(isLoggedIn, getMyOrder);

//admin
router.route("/admin/orders").get(isLoggedIn,customRole('admin'), getOrders);
router.route("/admin/order/:id").put(isLoggedIn,customRole('admin'), adminUpdateOrder)
                                .delete(isLoggedIn,customRole('admin'), admindeleteOrder);


module.exports = router;

