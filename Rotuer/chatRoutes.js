const express = require("express");
const cors = require("cors");
const { verifyToken } = require("../middleware/validate.js");
const {
  getdata,
  conversationAdd,
  message,
  getallconvo,
  getallusersinconvo,
  deleteAccount,
} = require("../Components/chatComponents.js");
const { validate } = require("../Models/conversationModel.js");

const chatroute = express.Router();

const corsoption = {
  credentials: true,
  origin: ["http://localhost:3000", "https://shin-text.vercel.app"],
  optionStatus: 200,
};

chatroute.use(cors(corsoption));

chatroute.post("/message/:id", verifyToken, message);
chatroute.post("/coversation/:id", verifyToken, conversationAdd);
chatroute.get("/getconvo/:id", verifyToken, getallconvo);
chatroute.get("/getdata", verifyToken, getdata);
chatroute.get("/getusers", verifyToken, getallusersinconvo);
chatroute.delete("/deleteacc", verifyToken, deleteAccount);

module.exports = chatroute;
