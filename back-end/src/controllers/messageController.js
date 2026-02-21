import { updateConversationAfterMessage } from "../utils/messageHelper.js";
import Conversation from "../models/Convesation.js";
import Message from "../models/Message.js";

export const sendDirectMessage = async (req, res) => {
  try {
    const { recipientId, conversationId, content } = req.body;
    const senderId = req.user._id;

    let conversation;

    if (!content) {
      return res.status(400).json({
        message: "Message content cannot be empty",
      });
    }
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    }
    if (!conversation) {
      conversation = await Conversation.create({
        type: "direct",
        participants: [
          { userId: senderId, joinedAt: new Date() },
          { userId: recipientId, joinedAt: new Date() },
        ],
        lastMessageAt: new Date(),
        unreadCounts: new Map(),
      });
    }

    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      content,
    });

    updateConversationAfterMessage(conversation, message, senderId);
    await conversation.save();

    return res.status(201).json({
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    console.error("Send Direct Message error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
export const sendGroupMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    const senderId = req.user._id;
    const conversation = req.conversation;

    if(!content){
      return res.status(400).json({message :"Content is missing"})
    }

    const message = await Message.create({
        conversationId,
        senderId,
        content 
    })

    updateConversationAfterMessage(conversation, message, senderId)

    await conversation.save();

    return res.status(200).json({message})
  } catch (error) {
    console.error("Send Group Message error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
