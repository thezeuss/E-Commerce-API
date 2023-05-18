const express = require("express");
const router = express.Router();

const { register, login, logout,  getLoggedInUserDetails, updateUserDetails,forgotPassword, passwordReset, changePassword, adminAlluser, admingetOneUser,  adminDeleteOneUser} = require("../controllers/userController");
const { isLoggedIn, customRole } = require("../middlewares/usermiddleware");

//user routes
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/userdashboard").get(isLoggedIn,getLoggedInUserDetails);
router.route("/userdashboard/update").put(isLoggedIn,updateUserDetails);
router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").post(passwordReset);
router.route("/password/update").post(isLoggedIn, changePassword);

// admin routes
router.route("/admin/users").get(isLoggedIn, customRole("admin") ,adminAlluser);
router.route("/admin/user/:id").get(isLoggedIn, customRole("admin"), admingetOneUser)
                               .delete(isLoggedIn, customRole("admin"), adminDeleteOneUser)


module.exports = router;