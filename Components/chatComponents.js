const Conversation = require("../Models/conversationModel.js");
const Message = require("../Models/messageModel.js");
const AllConversations = require("../Models/allConversationModel.js");
const User = require("../Models/userModel");

const mongoose = require("mongoose");
const { getReciverSocketId, getReciverId } = require("../socket/socket.js");
const { ObjectId } = mongoose.Types;
const { io } = require("../socket/socket.js");

const message = async (req, res) => {
  const sender_id = req.user._id;
  const { textmessage } = req.body;
  const { id: reciver_id } = req.params;

  try {
    if (!sender_id) {
      return res.json({
        error: "error in server message function",
      });
    }
    if (!reciver_id) {
      return res.json({
        error: "error in server message function",
      });
    }
    if (!textmessage) {
      return res.json({
        error: "error in sfunction",
      });
    }
    console.log(sender_id);
    if (!ObjectId.isValid(reciver_id)) {
      console.log("its not valid");
    }
    let coversation = await Conversation.findOne({
      participants: { $all: [sender_id, reciver_id] },
    });

    if (!coversation) {
      return res.json({
        error: "error in sage function",
      });
    }

    const newmessage = new Message({
      sender_id,
      reciver_id,
      message: textmessage,
    });
    await newmessage.save();
    if (newmessage) {
      coversation.messages.push(newmessage._id);
    }
    await coversation.save();

    const receiverSocketId = getReciverSocketId(reciver_id);
    const senderDetails = await User.findById(sender_id);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", {
        sender_id: newmessage.sender_id,
        reciver_id: newmessage.reciver_id,
        message: newmessage.message,
        createdAt: newmessage.createdAt,
        senderId: senderDetails._id,
        senderUsername: senderDetails.username,
        senderAvatar: senderDetails.avatar,
      });
    }

    return res.json("successful");
  } catch (error) {
    console.log(error);
  }
};

const conversationAdd = async (req, res) => {
  const sender_id = req.user._id;
  const { id: reciver_id } = req.params;
  try {
    if (!sender_id) {
      return res.json({
        error: "error in server message function",
      });
    }
    if (!reciver_id) {
      return res.json({
        error: "error in server message function",
      });
    }
    const convorsaSender = await AllConversations.findOne({
      sender_id: sender_id,
    });
    const convorsaReciver = await AllConversations.findOne({
      sender_id: reciver_id,
    });
    console.log(sender_id);
    let coversation = await Conversation.findOne({
      participants: { $all: [sender_id, reciver_id] },
    });

    if (coversation) {
      return res.json({
        error: "There is already a conversation",
      });
    }

    if (!sender_id) {
      return res.json({
        error: "no sender id",
      });
    }
    if (!convorsaSender) {
      return res.json({
        error: "error in theonversation",
      });
    }
    if (!convorsaReciver) {
      return res.json({
        error: "error in the addconversation",
      });
    }

    if (!ObjectId.isValid(reciver_id)) {
      console.log("its not valid");
    }

    const newconvo = new Conversation({
      participants: [sender_id, reciver_id],
      messages: [],
    });
    await newconvo.save();
    if (newconvo) {
      if (convorsaSender.convo.includes(reciver_id)) {
        return res.json("reciver is already in list");
      }
      convorsaSender.convo.push(reciver_id);
    }
    if (newconvo) {
      if (convorsaReciver.convo.includes(sender_id)) {
        return res.json("reciver is already in list");
      }

      convorsaReciver.convo.push(sender_id);
    }

    await convorsaSender
      .save()
      .then((doc) => console.log("Conversation saved:", doc))
      .catch((err) => console.error("Error saving conversation:", err));
    await convorsaReciver
      .save()
      .then((doc) => console.log("Conversation saved:", doc))
      .catch((err) => console.error("Error saving conversation:", err));

    const receiverSocketId = getReciverSocketId(reciver_id);
    const senderDetails = await User.findById(sender_id);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newConvo", senderDetails);
    }

    return res.json("Sucesfull");
  } catch (error) {
    console.log(error);
  }
};

const getdata = async (req, res) => {
  try {
    const allUserdata = await User.find({});
    return res.json(allUserdata);
  } catch (error) {
    console.log(error);
  }
};

const getallconvo = async (req, res) => {
  const sender_id = req.user._id;
  const { id: reciver_id } = req.params;

  try {
    if (!sender_id) {
      return res.json({
        error: "error in server message function",
      });
    }
    if (!reciver_id) {
      return res.json({
        error: "error in server message function",
      });
    }
    if (!ObjectId.isValid(reciver_id)) {
      console.log("its not valid");
    }
    if (!ObjectId.isValid(sender_id)) {
      console.log("its not valid");
    }

    const coversation = await Conversation.findOne({
      participants: { $all: [sender_id, reciver_id] },
    }).populate("messages");
    if (!sender_id) {
      return res.json("error");
    }
    if (!reciver_id) {
      return res.json("error");
    }

    if (!coversation) {
      return res.json({
        error: "error in sage function",
      });
    }

    return res.json(coversation.messages);
  } catch (error) {
    console.log(error);
  }
};

const getallusersinconvo = async (req, res) => {
  const sender_id = req.user._id;
  try {
    if (!sender_id) {
      return res.json({
        error: "you are not logged in",
      });
    }
    const recivers = await AllConversations.findOne({
      sender_id: sender_id,
    }).populate("convo");
    if (!recivers) {
      return res.json({
        error: "internal Error",
      });
    }

    return res.json(recivers.convo);
  } catch (error) {
    console.log(error);
  }
};

const usersfilter = async (req, res) => {
  const sender_id = req.user._id;
  try {
    if (!sender_id) {
      return res.json({
        error: "you are not logged in",
      });
    }
    const recivers = await AllConversations.findOne({
      sender_id: sender_id,
    });
    if (!recivers) {
      return res.json({
        error: "internal Error",
      });
    }

    return res.json(recivers.convo);
  } catch (error) {
    console.log(error);
  }
};

const deleteAccount = async (req, res) => {
  const account = await User.findByIdAndDelete(req.user._id);
  if (!account) {
    return res.json({
      error: "error in internal server",
    });
  }
  res.cookie("token", "", { maxAge: 0 });
  return res.json("Account deleted succesfully");
};

module.exports = {
  message,
  conversationAdd,
  getdata,
  getallconvo,
  getallusersinconvo,
  usersfilter,
  deleteAccount,
};
