const { User } = require("../Models/userSchema");

async function search(req, res) {
  try {
    const { search } = req.body;
    const query = new RegExp(search, "i", "g");
    const userFind = await User.find({
      $or: [
        {
          name: query,
        },
        {
          email: query,
        },
      ],
    });
    res.status(200).json({
      message: "success search",
      data: userFind,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}
module.exports = search;
