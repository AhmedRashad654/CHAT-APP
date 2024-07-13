async function logout(req, res) {
  try {
    res.cookie("token", "");
    return res.status(200).json({
      message: "success logout",
      logout: true,
    });
  } catch (error) {
     return res.status(500).json({
       message: error.message || error,
       error: true,
     });
  }
}
module.exports = logout;