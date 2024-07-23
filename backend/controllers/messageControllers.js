import asyncHandler from "express-async-handler";
import Message from "../models/messageModel";
import User from "../models/userModel";
import Chat from "../models/chatModels";

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.log("Invalid Data Passed into Request");
    res.sendStatus(400);
  }
  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };
  try {
    const message = await Message.create(newMessage);
    await message.populate("sender", "name pic");
    await message.populate("chat");
    await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages };
