const { uploadFilesToCloudninery } = require("../helpers/cloud");
const User = require("../Models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AllConversations = require("../Models/allConversationModel.js");

const signUp = async (req, res) => {
  const { username, email, password, cpassword } = req.body;
  const file = req.file;

  try {
    if (!email) {
      return res.json({
        error: "Crediantial not enterd",
      });
    }
    if (!password) {
      return res.json({
        error: "Crediantial not enterd",
      });
    }
    const userexist = await User.findOne({ username });
    if (userexist) {
      return res.json({
        error: "user already exist",
      });
    }
    const exist = await User.findOne({ email });
    if (exist) {
      return res.json({
        error: "user already exist",
      });
    }

    if (cpassword !== password) {
      return res.json({
        error: "Password didn't match",
      });
    }
    if (!file) {
      return res.json({
        error: "upload profile",
      });
    }
    const result = await uploadFilesToCloudninery([file]);
    const avatar = {
      public_id: result[0].public_id,
      url: result[0].url,
    };

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      avatar,
    });
    await user.save();

    const acesstoken = jwt.sign(
      {
        name: user.username,
        id: user._id,
      },
      "My_key",
      { expiresIn: "24h" }
    );

    const coversa = new AllConversations({
      sender_id: user._id,
      convo: [],
    });

    await coversa.save();

    return res.json(user);
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email) {
      return res.json({
        error: "email not entered",
      });
    }
    if (!password) {
      return res.json({
        error: "password not entered",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "Username dont exist",
      });
    }

    const pass = await bcrypt.compare(password, user.password);
    if (!pass) {
      return res.json({
        error: "Password didnt match",
      });
    }

    const acesstoken = await jwt.sign(
      {
        name: user.username,
        id: user._id,
      },
      "My_key",
      { expiresIn: "15d" }
    );

    res.cookie("token", acesstoken, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
    });

    temp = {
      username: user.username,
      id: user.id,
      avatar: user.avatar,
      email: user.email,
    };
    return res.json(temp);
  } catch (error) {
    console.log(error);
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    return res.json("cookie is deleted");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  signUp,
  login,
  logout,
};
