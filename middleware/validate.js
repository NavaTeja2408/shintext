const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

const verifyToken = async (req, res, next) => {
  try {
    let data = await req.cookies.token;
    if (!data) {
      return res.json("there is no cookies");
    }
    const decoded = jwt.verify(data, "My_key");
    if (!decoded) {
      return res.json("there is something wrong");
    }
    let username = decoded.name;
    const userdata = await User.findOne({ username });
    console.log(decoded.name);
    if (!userdata) {
      return res.json("Internal Isuuse");
    }
    req.user = userdata;
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = { verifyToken };
