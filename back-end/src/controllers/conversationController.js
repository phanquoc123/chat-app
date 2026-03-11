import Conversation from "../models/Convesation.js";
import Message from "../models/Message.js";
import { io } from "../socket/index.js";

export const createConversation = async (req, res) => {
  try {
    const {type, name, memberIds} = req.body
    const userId = req.user._id
    if(!type ||(type === 'group' && !name) || !memberIds || !Array.isArray(memberIds) ||memberIds.length === 0){
        return res.status(400).json({message:"Group name and list members is required"})
    }
    let conversation ;
    if(type === 'direct'){
        const participantId = memberIds[0];
        conversation = await Conversation.findOne({
            type: "direct",
            "participants.userId":{$all:[userId, participantId]}
        }) 

        if(!conversation){
            conversation = new Conversation({
                type:"direct",
                participants: [{userId}, {userId: participantId}],
                lastMessage:new Date()
            })

            await conversation.save();
        }
    }

    if(type === 'group'){
            conversation = new Conversation({
                type:'group',
                participants:[
                    {userId},
                    ...memberIds.map((id) => ({userId:id}))
                ],
                group:{
                    name,
                    createdBy:userId
                },
                lastMessage:new Date()
            })
            await conversation.save()
    }

    if(!conversation){
        return res.status(400).json({
            massage:"Conversation type is not valid"
        })
    }
    await conversation.populate([
        {path: 'participants.userId', select:"displayName avatarUrl"},
        {path: "seenBy", select:"displayName avatarUrl"},
        {path: "lastMessage.senderId", select:"displayName avatarUrl"}
    ])

    return res.status(201).json({
        message:"Conversation create successfully",
        conversation
    })
  } catch (error) {
    console.error("Error create conversation:", error)
    return res.status(500).json({
        message:"Error Interval"
    })
  }
};
export const getConversation = async (req, res) => {
    try {
        const userId = req.user._id;
        const conversations = await Conversation.find({
            'participants.userId' : userId
        })
        .sort({lastMessageAt: -1 , updatedAt: -1})
        .populate({
            path:'participants.userId',
            select:"displayName avatarUrl"
        })
        .populate({
            path:"lastMessage.senderId",
            select:"displayName avatarUrl"
        })
          .populate({
            path:"seenBy",
            select:"displayName avatarUrl"
        })

        const formatted = conversations.map((conversation) => {
          const participants = (conversation.participants || []).map((p) =>({
            _id:p.userId?._id,
            displayName:p.userId?.displayName,
            avatarUrl:p.userId?.avatarUrl,
            joinedAt:p.joinedAt,
          }))

          return {
            ...conversation.toObject(),
            unreadCounts:conversation.unreadCounts || {},
            participants
          }
        })

        return res.status(200).json({conversations: formatted})
    } catch (error) {
        console.log("Error when get conversation:", error)
        return res.status(500).json({message:"Error Interval"})
    }
};
export const getMessages = async (req, res) => {
  try {
    const { conversationId} = req.params;
    const { limit = 50 , cursor} = req.query;

    const query = {conversationId};
    if(cursor){
        query.createdAt = {$lt: new Date(cursor)}
    }

    let messages = await Message.find(query)
    .sort({createdAt: -1 })
    .limit(Number(limit) + 1);

    let nextCursor = null;

    if(messages.length > Number(limit)){
        const nextMessage = messages[messages.length - 1];
        nextCursor = nextMessage.createdAt.toISOString();
        messages.pop();
    }

    messages = messages.reverse();

    return res.status(200).json({
        messages,
        nextCursor,
    })

  } catch (error) {
    console.log("Error when get messages:", error)
    return res.status(500).json({message:"Error Interval"})
  }
};
export const getUserConversationsForSocket = async (userId) => {
  try {
    const conversations = await Conversation.find(
      { "participants.userId": userId },
      {_id:1}
    );

    return conversations.map(c => c._id.toString());
  } catch (error) {
    console.error("Get User Conversations for Socket error:", error);
    return [];
  }
}
export const markAsSeen = async (req, res) => {
   try {
    const { conversationId } = req.params;
    const userId = req.user._id.toString()
    const conversation = await Conversation.findById(conversationId).lean();
    if(!conversation){
        return res.status(404).json({message:"Conversation not found"})
    }
    const lastMessage = conversation.lastMessage;
    if(!lastMessage){
        return res.status(400).json({message:"No messages in this conversation to mark as seen"})
    }
    if(lastMessage.senderId.toString() === userId){
        return res.status(400).json({message:"You cannot mark your own message as seen"})
    }

    const updated = await Conversation.findByIdAndUpdate(
        conversationId,
        {
            $addToSet:{seenBy: userId},
            $set:{[`unreadCounts.${userId}`]: 0}
        },
        {
            new:true
        }
    )
    
    io.to(conversationId).emit("read-message",{
        conversation:updated,
        lastMessage:{
            _id:updated?.lastMessage._id,
            content:updated?.lastMessage.content,
            createdAt:updated?.lastMessage.createdAt,
            sender:{
                _id:updated?.lastMessage.senderId,
            }
        }

    })

    return res.status(200).json(
        {
         message:"Marked as seen successfully",
         seenBy:updated.seenBy || [],
         myUnreadCount:updated.unreadCounts[userId] || 0
        },
        
    )

   } catch (error) {
    console.error("Mark as seen error:", error);
    return res.status(500).json({message:"Internal Server Error"})
   }
}

