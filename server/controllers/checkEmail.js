const { User } = require("../Models/userSchema");

async function checkEmail(req, res) {
  try {
    const { email } = req.body;
    const findEmail = await User.findOne({ email }).select("-password");
    if (!findEmail) {
     return res.status(404).json({
        message: "Email NOT Found",
      });
      }
      res.status( 200 ).json( {
          message: 'verify Email',
          success: true,
          data:findEmail
      })
  } catch (error) {
    res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}
module.exports=checkEmail