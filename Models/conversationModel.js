const mongoose = require("mongoose");

const { Schema } = mongoose;

const ConversationSchema = new Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  ],
});

const ConversationModel = mongoose.model("Conversation", ConversationSchema);

module.exports = ConversationModel;
