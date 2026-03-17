import { emitNewMessage, updateConversationAfterMessage } from "../utils/messageHelper.js";
import Conversation from "../models/Convesation.js";
import Message from "../models/Message.js";
import { io } from "../socket/index.js";

export const sendDirectMessage = async (req, res) => {
  try {
    const { recipientId, conversationId, content, images } = req.body;
    const senderId = req.user._id;

    let conversation;

    if (!content && (!images || images.length === 0)) {
      return res.status(400).json({
        message: "Message must have content or image",
      });
    }
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    }
    if (!conversation) {
      conversation = await Conversation.findOne({
        type: "direct",
        "participants.userId": { $all: [senderId, recipientId] },
      });
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
      content: content || null,
      images: images || [],
    });

    updateConversationAfterMessage(conversation, message, senderId);
    await conversation.save();

    emitNewMessage(io, conversation, message);

    return res.status(201).json({ message });
  } catch (error) {
    console.error("Send Direct Message error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
export const sendGroupMessage = async (req, res) => {
  try {
    const { conversationId, content, images } = req.body;
    const senderId = req.user._id;
    const conversation = req.conversation;

    if(!content && (!images || images.length === 0)){
      return res.status(400).json({message :"Message must have content or image"})
    }

    const message = await Message.create({
        conversationId,
        senderId,
        content: content || null,
        images: images || [],
    })

    updateConversationAfterMessage(conversation, message, senderId)

    await conversation.save();
    emitNewMessage(io, conversation, message);

    return res.status(200).json({message})
  } catch (error) {
    console.error("Send Group Message error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

