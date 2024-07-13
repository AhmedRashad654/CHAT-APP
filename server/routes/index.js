const express = require("express");
const register = require( "../controllers/register" );
const checkEmail = require( "../controllers/checkEmail" );
const checkPassword = require( "../controllers/checkPassword" );
const userDetails = require( "../controllers/userDetails" );
const logout = require( "../controllers/logout" );
const updateUser = require( "../controllers/updateUser" );
const search = require( "../controllers/searchUserDB" );
const router = express.Router();


router.post( "/register", register );
router.post( "/email", checkEmail );
router.post("/updateUser", updateUser);
router.post( "/password", checkPassword );
router.get( "/detailsUser", userDetails );
router.get( "/logout", logout );
router.post("/search_user",search);







module.exports = router;
