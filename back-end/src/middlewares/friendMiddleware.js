import Conversation from "../models/Convesation.js"
import Friend from "../models/Friend.js"

const pair = (a,b) =>(a < b ? [a, b] :[b,a]);
export const checkFriendship = async(req,res, next) =>{
try {
    const me = req.user._id.toString();
    const recipientId = req.body?.recipientId ?? null;
    const memberIds = req.body?.memberIds ?? [];
    if(!recipientId && memberIds.length === 0){
        return res.status(400).json({message:" RecipientId or memberIds not found "})
    }
   if(recipientId){
    const [userA, userB] = pair(me, recipientId)
    const isFriend = await Friend.findOne({userA,userB})
    if(!isFriend){
        return res.status(403).json({message:"You are not friend of this person"})
    }
    return next();
   }


   const friendCheck = memberIds.map(async (memberId) => {
    const[userA, userB] = pair(me, memberId)
    const friend = await Friend.findOne({userA, userB})
    return friend ? null : memberId
   })

   const result = await Promise.all(friendCheck);
   const notFriend = result.filter(Boolean)
   if(notFriend.length > 0){
    return res.status(403).json({message:"Cannot add to group because not in list friend", notFriend})
   }

   next();
} catch (error) {
    console.error("Error check friendship:", error)
    return res.status(500).json({message:"Error Interval"})
    
}
}
export const checkGroupMembership = async(req,res, next) =>{
    try {
        const { conversationId} = req.body;
        const userId = req.user._id

        const conversation = await Conversation.findById(conversationId)

        if(!conversation){
            return res.status(400).json({message:"Conversation doesn't exist"})
        }

        const isMember = conversation.participants.some((p)=>
        p.userId.toString() === userId.toString()
        )

        if(!isMember){
            return res.status(403).json({message:"You are not member of this group"})
        }

        req.conversation = conversation;
        next()
    } catch (error) {
    console.error("Error check group member ship:", error)
    return res.status(500).json({message:"Error Interval"})
    
    }
}
