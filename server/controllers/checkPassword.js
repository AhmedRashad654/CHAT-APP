const { User } = require("../Models/userSchema");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
async function checkPassword(req, res) {
  try {
    const { password, userId } = req.body;
    const find = await User.findById(userId);
    const verifyPassword = await bcryptjs.compare(password, find.password);
    if (!verifyPassword) {
      return res.status(400).json({
        message: "please check password",
      });
    }
    const createToken = {
      id: find._id,
      email: find.email,
    };
    const token = await jwt.sign(
      createToken,
      process.env.SECRET_TOKEN || "ahmed"
    );

    res.cookie("token", token);
    return res.status(200).json({
      message: "success login",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}
module.exports = checkPassword;
