const { User } = require("../Models/userSchema");
const bcryptjs = require("bcryptjs");

async function register(req, res) {
  try {
    const { name, email, password, profile_pic = "" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, Email, and Password are required",
      });
    }

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(400).json({
        message: "Email Already Exists",
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const payload = {
      name,
      email,
      password: hashPassword,
      profile_pic,
    };
    const user = new User(payload);

    const userSave = await user.save();
    return res.status(201).json({
      message: "Created Successfully",
      data: userSave,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = register;
